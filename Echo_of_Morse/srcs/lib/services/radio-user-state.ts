//* Helper function 
//* With the given userID, get its radio status
//* Request in three tables (RadioLobbyPresence, RadioReadyQueue, RadioSessionPlayer)

import type { Prisma } from "@prisma/client";
import { prisma } from "@/server/prisma";

type DbClient = Prisma.TransactionClient | typeof prisma;

export async function getRadioUserState(client: DbClient, userId: string) {
  const [presence, readyQueue, activePlayer] = await Promise.all([
    client.radioLobbyPresence.findFirst({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      include: {
        room: {
          select: {
            id: true,
            radioId: true,
            name: true,
          },
        },
      },
    }),
    client.radioReadyQueue.findFirst({
      where: { userId },
      select: {
        roomId: true,
        room: {
          select: {
            radioId: true,
            name: true,
          },
        },
      },
    }),
    client.radioSessionPlayer.findFirst({
      where: {
        userId,
        session: {
          status: { in: ["WAITING", "ACTIVE"] },
        },
      },
      orderBy: { joinedAt: "desc" },
      select: {
        session: {
          select: {
            roomId: true,
            room: {
              select: {
                radioId: true,
                name: true,
              },
            },
          },
        },
      },
    }),
  ]);

  const isPlaying = Boolean(activePlayer || presence?.status === "PLAYING");
  const isReady = Boolean(readyQueue || presence?.status === "READY");
  const currentRoomId =
    activePlayer?.session.roomId ?? readyQueue?.roomId ?? presence?.roomId ?? null;
  const currentRadioId =
    activePlayer?.session.room.radioId ??
    readyQueue?.room.radioId ??
    presence?.room.radioId ??
    null;

  return {
    presence,
    readyQueue,
    activePlayer,
    isPlaying,
    isReady,
    currentRoomId,
    currentRadioId,
    lobbyStatus: isPlaying ? "PLAYING" : isReady ? "READY" : presence?.status ?? null,
    gameStatus: isPlaying ? "PLAYING" : "IDLE",
  };
}
