//* API for creating a new game session in a radio room. 
//* Using transaction to ensure data consistency (or all succeed or all fail).
//* Frontend can call like "POST /api/competition/radio/[radioId]/session".
//* Chose all ready players and creat a game session with them.

import { NextRequest, NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/session-user";
import { prisma } from "@/server/prisma";
import { notifyWs } from "@/lib/notifyWs";

type RouteContext = {
  params: {
    radioId: string;
  };
};

export async function POST(_request: NextRequest, { params }: RouteContext) {
  const userId = await getSessionUserId();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const room = await prisma.radioRoom.findUnique({
    where: { radioId: params.radioId },
    select: { id: true, maxUsers: true },
  });

  if (!room) {
    return NextResponse.json({ error: "Radio room not found" }, { status: 404 });
  }

  // Get all ready players in the room, ordered by ready time.
  const readyPlayers = await prisma.radioReadyQueue.findMany({
    where: { roomId: room.id },
    orderBy: { readyAt: "asc" },
    take: room.maxUsers,
    select: { userId: true },
  });

  if (!readyPlayers.some((player) => player.userId === userId)) {
    return NextResponse.json(
      { error: "You must be ready before starting a game" },
      { status: 409 }
    );
  }

  if (readyPlayers.length < 2) {
    return NextResponse.json(
      { error: "At least two ready players are required" },
      { status: 409 }
    );
  }

  // Get all ready player ids
  const playerIds = readyPlayers.map((player) => player.userId);

  const gameSession = await prisma.$transaction(async (transaction) => {
    const created = await transaction.radioGameSession.create({
      data: {
        roomId: room.id,
        status: "ACTIVE",
        startedAt: new Date(),
        players: {
          create: playerIds.map((readyUserId) => ({
            userId: readyUserId,
          })),
        },
      },
      select: { id: true },
    });

    // change all ready players' lobby presence to "PLAYING"
    await transaction.radioLobbyPresence.updateMany({
      where: {
        roomId: room.id,
        userId: { in: playerIds },
      },
      data: { status: "PLAYING" },
    });

    await transaction.radioReadyQueue.deleteMany({
      where: {
        roomId: room.id,
        userId: { in: playerIds },
      },
    });

    return created;
  });

  // Other clients in the radio room need radioId to route to the new session.
  await notifyWs("radio.game.created", {
    radioId: params.radioId,
    data: {
      radioId: params.radioId,
      sessionId: gameSession.id,
      playerIds,
    },
  });
  return NextResponse.json(
    {
      radioId: params.radioId,
      sessionId: gameSession.id,
    },
    { status: 201 }
  );
}
