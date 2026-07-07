const jwt = require("jsonwebtoken");

const { Server } = require("socket.io");
const express = require("express");
const http = require("http");

const app = express();
const httpServer = http.createServer(app);


// Passing httpServer here already attaches Socket.IO to it.
// Do not call io.attach(httpServer) again, or WebSocket upgrades crash.
const io = new Server(httpServer, {
  path: "/socket.io/",
  cors: { origin: "*" },
  transports: ["polling", "websocket"],
  pingInterval: 25000,
  pingTimeout: 20000,
});

io.engine.on("initial_headers", () => {
  console.log("ENGINE INITIAL HEADERS");
});

io.engine.on("headers", () => {
  console.log("ENGINE HEADERS");
});


io.engine.on("upgrade", () => {
  console.log("🔥 UPGRADE SUCCESS");
});

io.engine.on("connection_error", (err) => {
  console.log("🔥 ENGINE ERROR", err.code, err.message, err.context);
});

function ackSuccess(ack, deliveredTo = 0) {
  if (typeof ack === "function") {
    ack({
      ok: true,
      deliveredTo,
    });
  }
}

function ackError(ack, code, message) {
  if (typeof ack === "function") {
    ack({
      ok: false,
      code,
      message,
    });
  }
}

const onlineUsers = new Map();
const socketRadioRooms = new Map(); // socketId → Set<radioId>
const socketGameSessions = new Map(); // socketId → Set<sessionId>

async function updateUserPresence(userId, isOnline) {
  const res = await fetch("http://web:3000/api/users/status", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // Internal API auth: browsers cannot set this shared server-side secret.
      "x-ws-shared-secret": process.env.WS_SHARED_SECRET || "",
    },
    body: JSON.stringify({
      userId,
      isOnline,
    }),
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
}

function emitUserCount() {
  io.emit("users-count", onlineUsers.size);
  io.emit("online-users", [...onlineUsers.keys()]);
  console.log(
    "Users:",
    onlineUsers.size,
    "Sockets (tabs):",
    io.engine.clientsCount
  );

  console.log(
    [...onlineUsers.entries()].map(([user, sockets]) => ({
      user,
      count: sockets.size,
      sockets: [...sockets],
    }))
  );
}

io.use((socket, next) => {
  try {
    const token = socket.handshake.auth?.token;

    if (!token) return next(new Error("Missing token"));

    const payload = jwt.verify(token, process.env.WS_SHARED_SECRET);

    console.log("👉 JWT PAYLOAD:", payload);

    socket.data.userId = payload.userId || payload.sub;

    if (!socket.data.userId) {
      return next(new Error("Invalid token payload (no userId)"));
    }

    next();
  } catch (err) {
    console.error("JWT ERROR:", err);
    return next(new Error("Unauthorized"));
  }
});

io.on("connection", async (socket) => {
  const userId = socket.data.userId;

  if (!userId) {
    console.log("❌ NO USER ID");
    socket.disconnect();
    return;
  }

  console.log(
    "CONNECT",
    {
      socketId: socket.id,
      userId,
      auth: socket.data.userId,
    }
  );

  if (!onlineUsers.has(userId)) {
    onlineUsers.set(userId, new Set());
  }

  onlineUsers.get(userId).add(socket.id);

  try {
    await updateUserPresence(userId, true);
  } catch (err) {
    console.error("database update for connection failed", err);
  }

  const room = `user:${userId}`;
  socket.join(room);
  console.log(
    "JOIN ROOM",
    room,
    "members:",
    io.sockets.adapter.rooms.get(room)?.size || 0
  );

  console.log("✅ USER ONLINE:", userId);

  socket.emit("users-count", onlineUsers.size);
  socket.emit("online-users", [...onlineUsers.keys()]);
  socket.emit("sync:required");

  emitUserCount();

  socket.on("get-users-count", () => {
    socket.emit("users-count", onlineUsers.size);
  });

  socket.on("chat:message:send", (payload, ack) => {
    if (
      !payload ||
      typeof payload.toUserId !== "string" ||
      typeof payload.message?.id !== "string"
    ) {
      return ack?.({
        ok: false,
        code: "INVALID_PAYLOAD",
        message: "Invalid chat message payload",
      });
    }

    const room = `user:${payload.toUserId}`;
    const deliveredTo = io.sockets.adapter.rooms.get(room)?.size || 0;

    console.log("CHAT SEND", {
      from: userId,
      to: payload.toUserId,
      socketId: socket.id,
      messageId: payload.message.id,
      deliveredTo,
    });

    if (deliveredTo === 0) {
      console.log("❌ ROOM EMPTY", room);
    }

    try {
      io.to(room).emit("chat:message:new", {
        ...payload.message,
        senderId: userId, 
      });

      return ack?.({
        ok: true,
        deliveredTo,
        delivered: deliveredTo > 0,
      });

    } catch (err) {
      console.error(err);

      return ack?.({
        ok: false,
        code: "INTERNAL_ERROR",
        message: "Failed to emit message",
      });
    }
  });

  socket.on("game-invitation:send", (payload, ack) => {
    if (
      !payload ||
      typeof payload.toUserId !== "string" ||
      typeof payload.invitationId !== "string"
    ) {
      return ackError(
        ack,
        "INVALID_PAYLOAD",
        "Invalid invitation payload"
      );
    }

    console.log("INVITE SEND", {
      from: userId,
      to: payload.toUserId,
      invitationId: payload.invitationId,
    });

    const room = `user:${payload.toUserId}`;

    const deliveredTo = io.sockets.adapter.rooms.get(room)?.size || 0;

    if (deliveredTo === 0) {
      console.log("❌ ROOM EMPTY", room);
    }

    console.log(
      "INVITE TARGET",
      room,
      "members:",
      deliveredTo
    );

    try {
      io.to(room).emit("game-invitation:new", {
        invitationId: payload.invitationId,
        fromUserId: userId,
      });

      ackSuccess(ack, deliveredTo);
    } catch (err) {
      console.error(err);

      ackError(
        ack,
        "INTERNAL_ERROR",
        "Failed to emit invitation update"
      );
    }
  });


  socket.on("game-invitation:answered", (payload, ack) => {
    if (
      !payload ||
      typeof payload.toUserId !== "string" ||
      typeof payload.invitationId !== "string" ||
      (payload.status !== "accepted" &&
        payload.status !== "declined")
    ) {
      return ackError(
        ack,
        "INVALID_PAYLOAD",
        "Invalid invitation payload"
      );
    }

    const room = `user:${payload.toUserId}`;
    const deliveredTo = io.sockets.adapter.rooms.get(room)?.size || 0;

    console.log("INVITE ANSWER", {
      from: userId,
      to: payload.toUserId,
      invitationId: payload.invitationId,
      status: payload.status,
      deliveredTo,
    });

    try {
      io.to(room).emit("game-invitation:updated", {
        invitationId: payload.invitationId,
        status: payload.status,
        answeredByUserId: userId,
      });

      ackSuccess(ack, deliveredTo);
    } catch (err) {
      console.error(err);
      ackError(
        ack,
        "INTERNAL_ERROR",
        "Failed to emit invitation update"
      );
    }
  });

  socket.on("radio:join", (payload, ack) => {
    const radioId = payload?.radioId;

    if (!radioId || typeof radioId !== "string") {
      console.log("❌ RADIO JOIN INVALID PAYLOAD", {
        socketId: socket.id,
        userId,
        payload,
      });

      if (typeof ack === "function") {
        ack({ ok: false, code: "INVALID_PAYLOAD" });
      }
      return;
    }

    const room = `radio:${radioId}`;

    console.log("📻 RADIO JOIN REQUEST", {
      socketId: socket.id,
      userId,
      radioId,
      room,
    });

    const beforeJoin = io.sockets.adapter.rooms.get(room)?.size || 0;

    console.log("ROOM BEFORE JOIN", room, "members:", beforeJoin);
    socket.join(room);

    if (!socketRadioRooms.has(socket.id)) {
      socketRadioRooms.set(socket.id, new Set());
    }

    socketRadioRooms.get(socket.id).add(radioId);
    const afterJoin = io.sockets.adapter.rooms.get(room)?.size || 0;

    console.log("✅ RADIO JOINED", {
      socketId: socket.id,
      userId,
      radioId,
      room,
      members: afterJoin,
    });

    if (typeof ack === "function") {
      ack({ ok: true });
    }
  });

  socket.on("radio:leave", (payload, ack) => {
    const radioId = payload?.radioId;

    if (!radioId || typeof radioId !== "string") {
      console.log("❌ RADIO LEAVE INVALID PAYLOAD", {
        socketId: socket.id,
        userId,
        payload,
      });

      if (typeof ack === "function") {
        ack({ ok: false, code: "INVALID_PAYLOAD" });
      }
      return;
    }

    const room = `radio:${radioId}`;

    console.log("📻 RADIO LEAVE REQUEST", {
      socketId: socket.id,
      userId,
      radioId,
      room,
    });

    const beforeLeave = io.sockets.adapter.rooms.get(room)?.size || 0;

    console.log("ROOM BEFORE LEAVE", room, "members:", beforeLeave);
    socket.leave(room);
    socketRadioRooms.get(socket.id)?.delete(radioId);

    const afterLeave = io.sockets.adapter.rooms.get(room)?.size || 0;

    console.log("👋 RADIO LEFT", {
      socketId: socket.id,
      userId,
      radioId,
      room,
      members: afterLeave,
    });

    if (typeof ack === "function") {
      ack({ ok: true });
    }
  });

  socket.on("game:join", (payload, ack) => {
    const sessionId = payload?.sessionId;

    if (!sessionId || typeof sessionId !== "string") {
      console.log("❌ GAME JOIN INVALID PAYLOAD", {
        socketId: socket.id,
        userId,
        payload,
      });

      if (typeof ack === "function") {
        ack({ ok: false, code: "INVALID_PAYLOAD" });
      }
      return;
    }

    const room = `game:${sessionId}`;

    console.log("🎮 GAME JOIN REQUEST", {
      socketId: socket.id,
      userId,
      sessionId,
      room,
    });

    const beforeJoin = io.sockets.adapter.rooms.get(room)?.size || 0;

    console.log("ROOM BEFORE JOIN", room, "members:", beforeJoin);
    socket.join(room);
    if (!socketGameSessions.has(socket.id)) {
      socketGameSessions.set(socket.id, new Set());
    }
    socketGameSessions.get(socket.id).add(sessionId);

    const afterJoin = io.sockets.adapter.rooms.get(room)?.size || 0;

    console.log("✅ GAME JOINED", {
      socketId: socket.id,
      userId,
      sessionId,
      room,
      members: afterJoin,
    });

    if (typeof ack === "function") {
      ack({ ok: true });
    }
  });

  socket.on("game:leave", (payload, ack) => {
    const sessionId = payload?.sessionId;

    if (!sessionId || typeof sessionId !== "string") {
      console.log("❌ GAME LEAVE INVALID PAYLOAD", {
        socketId: socket.id,
        userId,
        payload,
      });

      if (typeof ack === "function") {
        ack({ ok: false, code: "INVALID_PAYLOAD" });
      }
      return;
    }

    const room = `game:${sessionId}`;

    console.log("🎮 GAME LEAVE REQUEST", {
      socketId: socket.id,
      userId,
      sessionId,
      room,
    });

    const beforeLeave = io.sockets.adapter.rooms.get(room)?.size || 0;

    console.log("ROOM BEFORE LEAVE", room, "members:", beforeLeave);
    socket.leave(room);
    socketGameSessions.get(socket.id)?.delete(sessionId);

    const afterLeave = io.sockets.adapter.rooms.get(room)?.size || 0;

    console.log("👋 GAME LEFT", {
      socketId: socket.id,
      userId,
      sessionId,
      room,
      members: afterLeave,
    });

    if (typeof ack === "function") {
      ack({ ok: true });
    }
  });

  socket.on("disconnect", async (reason) => {
    for (const radioId of socketRadioRooms.get(socket.id) ?? []) {
      socket.leave(`radio:${radioId}`);
    }
    socketRadioRooms.delete(socket.id);
    for (const sessionId of socketGameSessions.get(socket.id) ?? []) {
      socket.leave(`game:${sessionId}`);
    }
    socketGameSessions.delete(socket.id);

    const sockets = onlineUsers.get(userId);
    

    if (!sockets || !sockets.has(socket.id)) {
      console.log("Missing socket set for", userId);
      return;
    }

    console.log(
      "Before disconnect:",
      userId,
      [...(onlineUsers.get(userId) || [])]
    );

    sockets.delete(socket.id);

    console.log(
      "After disconnect:",
      userId,
      [...(onlineUsers.get(userId) || [])]
    );

    if (sockets.size === 0) {
      onlineUsers.delete(userId);
      console.log("❌ USER OFFLINE:", userId);

      try {
        await updateUserPresence(userId, false);
      } catch (err)
      {
        console.error("database update for disconnection failed", err);
      }
    }

    emitUserCount();

    console.log("❌ DISCONNECT", { userId, socketId: socket.id, "reason": reason });
  });
});


app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/internal/notify", (req, res) => {
  console.log("📨 NOTIFY", req.body);
  const { type, radioId, sessionId, toUserId, data } = req.body ?? {};
  if (!type) return res.status(400).json({ error: "type requis" });

  switch (type) {
    case "radio.users.updated":
      io.to(`radio:${radioId}`).emit("radio:user-list-updated", data); break;
    case "radio.ready.updated":
      io.to(`radio:${radioId}`).emit("radio:ready-list-updated", data); break;
    case "radio.game.created":
      io.to(`radio:${radioId}`).emit("radio:game-created", data); break;
    // for game session updates(completed, abandoned, etc.) -> GET real data.
    case "game.session.updated":
      io.to(`game:${sessionId}`).emit("game:session-updated", data); break;
    case "message.created":
      io.to(`user:${toUserId}`).emit("chat:message:new", data); break;
    case "game-invitation.created":
      io.to(`user:${toUserId}`).emit("game-invitation:new", data); break;
    case "game-invitation.updated":
      io.to(`user:${toUserId}`).emit("game-invitation:updated", data); break;

    case "friend.request.created":
      io.to(`user:${toUserId}`).emit("friend:request:new", data); break;
    case "friend.request.accepted":
      io.to(`user:${toUserId}`).emit("friend:request:accepted", data); break;
    case "friend.removed":
      io.to(`user:${toUserId}`).emit("friend:removed", data); break;
    case "friend.presence.updated":
      io.to(`user:${toUserId}`).emit("friend:presence-updated", data); break;

    default:
      return res.status(400).json({ error: "Type inconnu" });
  }
  return res.json({ ok: true });
});

httpServer.listen(3001, () => {
  console.log("WS SERVER RUNNING ON 3001");
});

function shutdown() {
  console.log("✅ Shutting down...");

  io.close(() => {
    console.log("Socket.IO closed");

    httpServer.close(() => {
      console.log("HTTP server closed");
      process.exit(0);
    });
  });

  // emergency timeout
  setTimeout(() => {
    console.error("Force shutdown");
    process.exit(1);
  }, 5000);
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

async function cleanupUsers() {
  try {
    await fetch("http://web:3000/api/users/cleanup", {
      method: "POST",
    });
  } catch (err) {
    console.error("cleanup error:", err.message);
  }
}

const interval = setInterval(cleanupUsers, 60000);

process.on("SIGTERM", () => clearInterval(interval));
process.on("SIGINT", () => clearInterval(interval));
