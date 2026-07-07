import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { notifyWs } from "@/lib/notifyWs";
import { prisma } from "@/server/prisma";

function isInternalStatusUpdate(request: Request) {
  const sharedSecret = process.env.WS_SHARED_SECRET;
  const providedSecret = request.headers.get("x-ws-shared-secret");

  // ws-server uses this shared secret because it updates presence server-side.
  return Boolean(sharedSecret && providedSecret === sharedSecret);
}

async function abandonActiveRadioSessions(userId: string) {
  const activePlayers = await prisma.radioSessionPlayer.findMany({
    where: {
      userId,
      completed: false,
      abandoned: false,
      session: {
        status: {
          in: ["WAITING", "ACTIVE"],
        },
      },
    },
    include: {
      session: {
        include: {
          room: {
            select: { radioId: true },
          },
          players: {
            select: { userId: true },
          },
        },
      },
    },
  });

  const changedSessions: Array<{ radioId: string; sessionId: string }> = [];

  for (const player of activePlayers) {
    const session = player.session;

    await prisma.$transaction(async (transaction) => {
      // A socket logout/disconnect counts as abandoning the running match.
      // Keep the last known score/accuracy, but close this player slot.
      await transaction.radioSessionPlayer.update({
        where: { id: player.id },
        data: {
          completed: true,
          abandoned: true,
          timeMs: player.timeMs ?? 0,
        },
      });

      await transaction.radioLobbyPresence.updateMany({
        where: {
          roomId: session.roomId,
          userId,
        },
        data: { status: "IDLE" },
      });

      const remainingPlayers = await transaction.radioSessionPlayer.count({
        where: {
          sessionId: session.id,
          completed: false,
        },
      });

      if (remainingPlayers <= 1) {
        await transaction.radioGameSession.update({
          where: { id: session.id },
          data: {
            status: "FINISHED",
            endedAt: new Date(),
          },
        });

        await transaction.radioLobbyPresence.updateMany({
          where: {
            roomId: session.roomId,
            userId: {
              in: session.players.map((sessionPlayer) => sessionPlayer.userId),
            },
          },
          data: { status: "IDLE" },
        });
      }
    });

    changedSessions.push({
      radioId: session.room.radioId,
      sessionId: session.id,
    });
  }

  await Promise.all(
    changedSessions.map(({ radioId, sessionId }) =>
      notifyWs("game.session.updated", {
        sessionId,
        data: { radioId, sessionId },
      })
    )
  );
}

export async function POST(request: Request) {
  const { userId, isOnline } = (await request.json()) as {
    userId?: string;
    isOnline?: boolean;
  };

  if (!userId || typeof isOnline !== "boolean") {
    return NextResponse.json(
      { error: "userId and isOnline are required" },
      { status: 400 }
    );
  }

  const isInternal = isInternalStatusUpdate(request);

  if (!isInternal) {
    const session = await getServerSession(authOptions);

    // Browser callers may only update their own presence, never another user.
    if (session?.user?.id !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }
  
  await prisma.user.updateMany({
    where: { id: userId },
    data: { 
      isOnline,
      lastSeen: new Date()
    }
  });

  if (!isOnline) {
    await abandonActiveRadioSessions(userId);
  }
  
  return NextResponse.json({ ok: true });
}
