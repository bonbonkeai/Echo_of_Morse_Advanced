//* This is the Radio Lobby API route.
//* It corresponds to URLs such as /api/competition/radio/01, 02, or 03.
//* It supports the following operations:
//* GET: Get the current state of the radio lobby.
//* POST: Join the radio lobby.
//* PATCH: Update the user's ready status.
//* DELETE: Leave the radio lobby.

import { NextRequest, NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/session-user";
import { getRadioLobby } from "@/lib/services/competition";
import { getRadioUserState } from "@/lib/services/radio-user-state";
import { notifyWs } from "@/lib/notifyWs";
import { prisma } from "@/server/prisma";

type RouteContext = {
  params: {
    radioId: string;
  };
};

async function notifyRadioLobbyChanged(type: string, radioId: string) {
  // The full lobby response contains user-specific fields like isCurrentUser.
  // Broadcast only a signal; each browser reloads its own authorized snapshot.
  await notifyWs(type, {
    radioId,
    data: { radioId },
  });
}

async function notifyFriendsAboutRadioState(userId: string, radioId: string) {
  const friendships = await prisma.friendship.findMany({
    where: {
      status: "ACCEPTED",
      OR: [{ senderId: userId }, { receiverId: userId }],
    },
    select: {
      senderId: true,
      receiverId: true,
    },
  });

  await Promise.all(
    friendships.map((friendship) => {
      const toUserId =
        friendship.senderId === userId
          ? friendship.receiverId
          : friendship.senderId;

      return notifyWs("friend.presence.updated", {
        toUserId,
        data: {
          userId,
          radioId,
        },
      });
    })
  );
}

// GET: get the current lobby state
export async function GET(_request: NextRequest, { params }: RouteContext) {
  const userId = await getSessionUserId();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const lobby = await getRadioLobby(params.radioId, userId);

  if (!lobby) {
    return NextResponse.json({ error: "Radio room not found" }, { status: 404 });
  }

  return NextResponse.json(lobby);
}

// POST: join the radio lobby
export async function POST(_request: NextRequest, { params }: RouteContext) {
  const userId = await getSessionUserId();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const room = await prisma.radioRoom.findUnique({
    where: { radioId: params.radioId },
    include: {
      _count: {
        select: { lobbyPresences: true },
      },
    },
  });

  if (!room) {
    return NextResponse.json({ error: "Radio room not found" }, { status: 404 });
  }

  const currentState = await getRadioUserState(prisma, userId);

  if (currentState.isPlaying) {
    return NextResponse.json(
      { error: "A player in a game cannot join another radio room" },
      { status: 409 }
    );
  }

  if (currentState.presence && currentState.presence.roomId !== room.id) {
    return NextResponse.json(
      {
        error: "Leave your current radio room before joining another one",
        // 前端逻辑依赖稳定的 code，而不依赖英文 error 文本。
        code: "ALREADY_IN_OTHER_LOBBY",
        // 用户当前所在 lobby。
        currentRadioId: currentState.currentRadioId,
        // 用户现在想加入的 lobby。
        targetRadioId: params.radioId,
      },
      { status: 409 }
    );
  }

  const existingPresence = await prisma.radioLobbyPresence.findUnique({
    where: {
      userId_roomId: {
        userId,
        roomId: room.id,
      },
    },
  });

  if (!existingPresence && room._count.lobbyPresences >= room.maxUsers) {
    return NextResponse.json({ error: "Radio room is full" }, { status: 409 });
  }

  await prisma.radioLobbyPresence.createMany({
    data: [
      {
        userId,
        roomId: room.id,
      },
    ],
    skipDuplicates: true,
  });

  await prisma.radioLobbyPresence.updateMany({
    where: {
      userId,
      roomId: room.id,
      status: { not: "PLAYING" },
    },
    data: { status: "IDLE" },
  });

  const lobby = await getRadioLobby(params.radioId, userId);
  await Promise.all([
    notifyRadioLobbyChanged("radio.users.updated", params.radioId),
    notifyFriendsAboutRadioState(userId, params.radioId),
  ]);

  return NextResponse.json(lobby, { status: 201 });
}

// PATCH: update the ready status
// Expected request body: { ready: true } or { ready: false }.
export async function PATCH(request: NextRequest, { params }: RouteContext) {
  const userId = await getSessionUserId();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as { ready?: boolean };

  if (typeof body.ready !== "boolean") {
    return NextResponse.json(
      { error: "ready must be a boolean" },
      { status: 400 }
    );
  }

  const room = await prisma.radioRoom.findUnique({
    where: { radioId: params.radioId },
    select: { id: true },
  });

  if (!room) {
    return NextResponse.json({ error: "Radio room not found" }, { status: 404 });
  }

  const presence = await prisma.radioLobbyPresence.findUnique({
    where: {
      userId_roomId: {
        userId,
        roomId: room.id,
      },
    },
  });

  if (!presence) {
    return NextResponse.json(
      { error: "Join the radio room before changing ready status" },
      { status: 409 }
    );
  }

  if (presence.status === "PLAYING") {
    return NextResponse.json(
      { error: "A player in a game cannot change ready status" },
      { status: 409 }
    );
  }

  if (body.ready) {
    await prisma.$transaction([
      prisma.radioLobbyPresence.update({
        where: { id: presence.id },
        data: { status: "READY" },
      }),
      prisma.radioReadyQueue.upsert({
        where: {
          userId_roomId: {
            userId,
            roomId: room.id,
          },
        },
        create: {
          userId,
          roomId: room.id,
        },
        update: {
          readyAt: new Date(),
        },
      }),
    ]);
  } else {
    await prisma.$transaction([
      prisma.radioLobbyPresence.update({
        where: { id: presence.id },
        data: { status: "IDLE" },
      }),
      prisma.radioReadyQueue.deleteMany({
        where: {
          userId,
          roomId: room.id,
        },
      }),
    ]);
  }

  const lobby = await getRadioLobby(params.radioId, userId);
  await Promise.all([
    notifyRadioLobbyChanged("radio.ready.updated", params.radioId),
    notifyFriendsAboutRadioState(userId, params.radioId),
  ]);

  return NextResponse.json(lobby);
}

// DELETE: leave the radio lobby
export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  const userId = await getSessionUserId();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const room = await prisma.radioRoom.findUnique({
    where: { radioId: params.radioId },
    select: { id: true },
  });

  if (!room) {
    return NextResponse.json({ error: "Radio room not found" }, { status: 404 });
  }

  await prisma.$transaction([
    prisma.radioReadyQueue.deleteMany({
      where: {
        userId,
        roomId: room.id,
      },
    }),
    prisma.radioLobbyPresence.deleteMany({
      where: {
        userId,
        roomId: room.id,
        status: { not: "PLAYING" },
      },
    }),
  ]);

  await Promise.all([
    notifyRadioLobbyChanged("radio.users.updated", params.radioId),
    notifyFriendsAboutRadioState(userId, params.radioId),
  ]);

  return NextResponse.json({ ok: true });
}
