// End-to-end concurrency check for the radio lobby and game session flow.
// It creates independent users, logs each one in, opens real WebSocket
// connections, then drives the same API paths that the browser uses.

function requiredEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is required for concurrent user tests`);
  }
  return value;
}

// The local WAF uses a self-signed certificate in development/test.
process.env.NODE_TLS_REJECT_UNAUTHORIZED = requiredEnv(
  "TEST_TLS_REJECT_UNAUTHORIZED"
);

const { io } = require("socket.io-client");

const BASE_URL = requiredEnv("TEST_BASE_URL");
const RADIO_ID = requiredEnv("TEST_RADIO_ID");
const USER_COUNT = Number(requiredEnv("TEST_USER_COUNT"));
const PASSWORD = requiredEnv("TEST_PASSWORD");

if (!Number.isInteger(USER_COUNT) || USER_COUNT < 2) {
  throw new Error("TEST_USER_COUNT must be an integer greater than 1");
}

// Tiny fetch client with its own cookie jar, so every test user has an
// independent NextAuth session.
class HttpClient {
  constructor(name) {
    this.name = name;
    this.cookies = new Map();
  }

  cookieHeader() {
    return [...this.cookies.entries()]
      .map(([key, value]) => `${key}=${value}`)
      .join("; ");
  }

  storeCookies(response) {
    const setCookie = response.headers.getSetCookie?.() || [];
    for (const header of setCookie) {
      const [pair] = header.split(";");
      const index = pair.indexOf("=");
      if (index > 0) {
        this.cookies.set(pair.slice(0, index), pair.slice(index + 1));
      }
    }
  }

  async request(path, options = {}) {
    const headers = {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(this.cookies.size ? { Cookie: this.cookieHeader() } : {}),
      ...(options.headers || {}),
    };

    const response = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers,
      redirect: "manual",
    });

    this.storeCookies(response);

    const text = await response.text();
    let body = null;
    if (text) {
      try {
        body = JSON.parse(text);
      } catch {
        body = text;
      }
    }

    return { response, body };
  }
}

async function expectOk(label, promise, acceptedStatuses = [200, 201]) {
  const result = await promise;
  if (!acceptedStatuses.includes(result.response.status)) {
    throw new Error(
      `${label} failed with HTTP ${result.response.status}: ${JSON.stringify(
        result.body
      )}`
    );
  }
  return result;
}

async function registerUser(client, user) {
  const result = await client.request("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({
      username: user.username,
      email: user.email,
      password: PASSWORD,
      confirmPassword: PASSWORD,
    }),
  });

  if (![201, 409].includes(result.response.status)) {
    throw new Error(
      `register ${user.username} failed with HTTP ${
        result.response.status
      }: ${JSON.stringify(result.body)}`
    );
  }
}

async function login(client, user) {
  const csrf = await expectOk(
    `csrf ${user.username}`,
    client.request("/api/auth/csrf")
  );

  const params = new URLSearchParams({
    csrfToken: csrf.body.csrfToken,
    email: user.email,
    password: PASSWORD,
    callbackUrl: `${BASE_URL}/competition`,
    json: "true",
  });

  const result = await client.request("/api/auth/callback/credentials", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });

  if (![200, 302].includes(result.response.status)) {
    throw new Error(
      `login ${user.username} failed with HTTP ${
        result.response.status
      }: ${JSON.stringify(result.body)}`
    );
  }

  await expectOk(`session ${user.username}`, client.request("/api/auth/session"));
}

async function connectSocket(client) {
  const tokenResponse = await expectOk(
    `socket token ${client.name}`,
    client.request("/api/socket/token")
  );

  const socket = io(BASE_URL, {
    path: "/socket.io/",
    // Force WebSocket so this test does not pass through Socket.IO polling.
    transports: ["websocket"],
    auth: { token: tokenResponse.body.token },
    rejectUnauthorized: false,
    reconnection: false,
  });

  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error(`socket connect timeout for ${client.name}`));
    }, 5000);

    socket.once("connect", () => {
      clearTimeout(timeout);
      resolve();
    });

    socket.once("connect_error", (error) => {
      clearTimeout(timeout);
      reject(error);
    });
  });

  return socket;
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function emitAck(socket, event, payload) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error(`${event} ack timeout`));
    }, 10000);

    socket.emit(event, payload, (ack) => {
      clearTimeout(timeout);
      if (ack?.ok) {
        resolve(ack);
      } else {
        reject(new Error(`${event} failed: ${JSON.stringify(ack)}`));
      }
    });
  });
}

async function main() {
  const stamp = Date.now();
  const users = Array.from({ length: USER_COUNT }, (_, index) => ({
    username: `conc_${stamp}_${index + 1}`,
    email: `conc_${stamp}_${index + 1}@test.local`,
  }));

  const clients = users.map((user) => new HttpClient(user.username));

  console.log(`Base URL: ${BASE_URL}`);
  console.log(`Radio: ${RADIO_ID}`);
  console.log(`Users: ${USER_COUNT}`);

  await Promise.all(users.map((user, index) => registerUser(clients[index], user)));
  await Promise.all(users.map((user, index) => login(clients[index], user)));
  console.log("PASS register/login for all users");

  const sockets = await Promise.all(clients.map((client) => connectSocket(client)));
  await wait(500);
  const socketEvents = {
    radioUsers: 0,
    radioReady: 0,
    radioGameCreated: 0,
    gameSessionUpdated: 0,
  };

  // Count socket notifications. The data itself is still fetched through
  // authenticated HTTP snapshots, just like the frontend does.
  for (const socket of sockets) {
    socket.on("radio:user-list-updated", () => {
      socketEvents.radioUsers += 1;
    });
    socket.on("radio:ready-list-updated", () => {
      socketEvents.radioReady += 1;
    });
    socket.on("radio:game-created", () => {
      socketEvents.radioGameCreated += 1;
    });
    socket.on("game:session-updated", () => {
      socketEvents.gameSessionUpdated += 1;
    });
  }
  await Promise.all(
    sockets.map((socket) => emitAck(socket, "radio:join", { radioId: RADIO_ID }))
  );
  console.log("PASS websocket connected for all users");

  await Promise.all(
    clients.map((client) =>
      expectOk(`${client.name} leave before test`, client.request(`/api/competition/radio/${RADIO_ID}`, {
        method: "DELETE",
      }), [200, 404, 409])
    )
  );

  // The following API calls are intentionally concurrent: this is where race
  // conditions in lobby capacity, ready queue, or session completion would show.
  const joined = await Promise.all(
    clients.map((client) =>
      expectOk(
        `${client.name} join`,
        client.request(`/api/competition/radio/${RADIO_ID}`, { method: "POST" })
      )
    )
  );
  await wait(300);
  console.log(`PASS concurrent join: ${joined.length}/${USER_COUNT}`);

  const ready = await Promise.all(
    clients.map((client) =>
      expectOk(
        `${client.name} ready`,
        client.request(`/api/competition/radio/${RADIO_ID}`, {
          method: "PATCH",
          body: JSON.stringify({ ready: true }),
        })
      )
    )
  );
  await wait(300);
  console.log(`PASS concurrent ready: ${ready.length}/${USER_COUNT}`);

  const lobby = await expectOk(
    "lobby after ready",
    clients[0].request(`/api/competition/radio/${RADIO_ID}`)
  );
  const readyCount = lobby.body.users.filter((user) => user.status === "ready").length;
  if (readyCount < USER_COUNT) {
    throw new Error(`expected at least ${USER_COUNT} ready users, got ${readyCount}`);
  }
  console.log(`PASS lobby has ${readyCount} ready users`);

  const createSession = await expectOk(
    "create game session",
    clients[0].request(`/api/competition/radio/${RADIO_ID}/session`, {
      method: "POST",
    })
  );
  const { sessionId } = createSession.body;
  if (!sessionId) {
    throw new Error(`session creation did not return sessionId: ${JSON.stringify(createSession.body)}`);
  }
  console.log(`PASS session created: ${sessionId}`);
  await wait(300);

  await Promise.all(
    sockets.map((socket) => emitAck(socket, "game:join", { sessionId }))
  );

  // Each response must include a user-specific "me" player. This guards
  // against broadcasting one user's snapshot to everyone.
  const snapshots = await Promise.all(
    clients.map((client) =>
      expectOk(
        `${client.name} get session`,
        client.request(`/api/competition/radio/${RADIO_ID}/session/${sessionId}`)
      )
    )
  );
  for (const snapshot of snapshots) {
    if (snapshot.body.players.length !== USER_COUNT) {
      throw new Error(`expected ${USER_COUNT} players, got ${snapshot.body.players.length}`);
    }
    if (!snapshot.body.players.some((player) => player.id === "me")) {
      throw new Error(`session snapshot is missing current user's "me" player`);
    }
  }
  console.log("PASS all users can read their own session snapshot");

  await Promise.all(
    clients.map((client, index) =>
      expectOk(
        `${client.name} playing update`,
        client.request(`/api/competition/radio/${RADIO_ID}/session/${sessionId}`, {
          method: "PATCH",
          body: JSON.stringify({
            score: (index + 1) * 10,
            correct: index + 1,
            total: USER_COUNT,
            timeMs: 1000 + index,
            playerStatus: "playing",
          }),
        })
      )
    )
  );
  await wait(300);
  console.log("PASS concurrent playing score updates");

  await Promise.all(
    clients.map((client, index) =>
      expectOk(
        `${client.name} complete`,
        client.request(`/api/competition/radio/${RADIO_ID}/session/${sessionId}`, {
          method: "PATCH",
          body: JSON.stringify({
            score: (index + 1) * 100,
            correct: USER_COUNT,
            total: USER_COUNT,
            timeMs: 5000 + index,
            playerStatus: "completed",
          }),
        })
      )
    )
  );
  await wait(300);
  console.log("PASS concurrent completion updates");

  const finalSnapshot = await expectOk(
    "final session",
    clients[0].request(`/api/competition/radio/${RADIO_ID}/session/${sessionId}`)
  );
  const completedCount = finalSnapshot.body.players.filter(
    (player) => player.completed
  ).length;
  if (finalSnapshot.body.status !== "finished" || completedCount !== USER_COUNT) {
    throw new Error(
      `expected finished session with ${USER_COUNT} completed players, got status=${
        finalSnapshot.body.status
      }, completed=${completedCount}`
    );
  }
  console.log("PASS final session finished with all players completed");

  // We do not require an exact event count because broadcasts can multiply by
  // room size, but every event family must be observed at least once per user.
  if (socketEvents.radioUsers < USER_COUNT) {
    throw new Error(`expected radio user socket events, got ${socketEvents.radioUsers}`);
  }
  if (socketEvents.radioReady < USER_COUNT) {
    throw new Error(`expected radio ready socket events, got ${socketEvents.radioReady}`);
  }
  if (socketEvents.radioGameCreated < USER_COUNT) {
    throw new Error(
      `expected game created socket events for all users, got ${socketEvents.radioGameCreated}`
    );
  }
  if (socketEvents.gameSessionUpdated < USER_COUNT) {
    throw new Error(
      `expected game session socket events, got ${socketEvents.gameSessionUpdated}`
    );
  }
  console.log(`PASS socket events observed: ${JSON.stringify(socketEvents)}`);

  for (const socket of sockets) {
    socket.disconnect();
  }
}

main().catch((error) => {
  console.error("FAIL concurrent users test");
  console.error(error);
  process.exit(1);
});
