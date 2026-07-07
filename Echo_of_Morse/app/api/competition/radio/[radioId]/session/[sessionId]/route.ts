//* The API route for fetching and updating a radio game session.
//* GET: Returns the current state of the session
//* PATCH: Updates the player's score and completion status (score and finish)


import { NextRequest, NextResponse } from "next/server";
import {
  createSessionSequences,
  getSessionDurationSeconds,
} from "@/lib/services/competition";
import { getSessionUserId } from "@/lib/session-user";
import { notifyWs } from "@/lib/notifyWs";
import { prisma } from "@/server/prisma";

type RouteContext = {
  params: {
    radioId: string;
    sessionId: string;
  };
};

async function notifyGameSessionChanged(radioId: string, sessionId: string) {
  // The session response contains current-user fields like id: "me".
  // Broadcast only a change signal; each browser reloads its own snapshot.
  await notifyWs("game.session.updated", {
    sessionId,
    data: { radioId, sessionId },
  });
}


// Helper function to find a game session.
// Should have corresponding radioId and sessionId
// To avoid wrong accessed route (A session of radio 1, accessed by radio 2 route)
async function findSession(radioId: string, sessionId: string) {
  return prisma.radioGameSession.findFirst({
    where: {
      id: sessionId,
      room: { radioId },
    },
    include: {
      room: {
        select: {
          radioId: true,
          wpm: true,
        },
      },
      players: {
        orderBy: { joinedAt: "asc" },
        include: {
          user: {
            select: {
              id: true,
              username: true,
            },
          },
        },
      },
    },
  });
}

// Helper function to format the session data for API response
function formatSession(
  session: NonNullable<Awaited<ReturnType<typeof findSession>>>,
  currentUserId: string
) {
  // Calculate lasted time.
  const elapsedSeconds = session.startedAt
    ? Math.floor((Date.now() - session.startedAt.getTime()) / 1000)
    : 0;
  const duration = Math.max(
    getSessionDurationSeconds() - elapsedSeconds,
    0
  );

  return {
    id: session.id,
    status: session.status.toLowerCase(),
    duration,
    sequences: createSessionSequences(session.id),
    speedWpm: session.room.wpm,
    players: session.players.map((player) => ({
      id: player.userId === currentUserId ? "me" : player.userId,
      username:
        player.userId === currentUserId ? "You" : player.user.username,
      score: player.score ?? 0,
      correct: player.correct,
      total: player.total,
      streak: 0,
      completed: player.completed,
      abandoned: player.abandoned,
    })),
  };
}


// GET handler to fetch the current state of the game session
export async function GET(_request: NextRequest, { params }: RouteContext) {
  const userId = await getSessionUserId();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const gameSession = await findSession(params.radioId, params.sessionId);

  if (!gameSession) {
    return NextResponse.json({ error: "Game session not found" }, { status: 404 });
  }

  if (!gameSession.players.some((player) => player.userId === userId)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json(formatSession(gameSession, userId));
}


// PATCH handler to update the player's score and completion status
export async function PATCH(request: NextRequest, { params }: RouteContext) {
  const userId = await getSessionUserId();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  // Abandon feature: verify playerStatus - set abandon or complete
  const body = (await request.json()) as {
    score?: number;
    correct?: number;
    total?: number;
    timeMs?: number;
    playerStatus?: "playing" | "completed" | "abandoned";
  };

  const { score, correct, total, timeMs, playerStatus } = body;

  if (
    typeof score !== "number" ||
    !Number.isInteger(score) ||
    score < 0 ||
    typeof correct !== "number" ||
    !Number.isInteger(correct) ||
    correct < 0 ||
    typeof total !== "number" ||
    !Number.isInteger(total) ||
    total < 0 ||
    correct > total ||
    typeof timeMs !== "number" ||
    !Number.isInteger(timeMs) ||
    timeMs < 0 ||
    (playerStatus !== "playing" &&
      playerStatus !== "completed" &&
      playerStatus !== "abandoned")
  ) {
    return NextResponse.json(
      {
        error:
          "score, correct, total and timeMs must be valid non-negative integers and playerStatus must be playing, completed or abandoned",
      },
      { status: 400 }
    );
  }

  const gameSession = await findSession(params.radioId, params.sessionId);

  if (!gameSession) {
    return NextResponse.json({ error: "Game session not found" }, { status: 404 });
  }

  const currentPlayer = gameSession.players.find(
    (player) => player.userId === userId
  );

  if (!currentPlayer) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (currentPlayer.completed) {
    return NextResponse.json(formatSession(gameSession, userId));
  }

  if (playerStatus === "playing") {
    const updatedProgress = await prisma.radioSessionPlayer.updateMany({
      where: {
        id: currentPlayer.id,
        completed: false,
        OR: [
          { score: null },
          { score: { lt: score } },
          { correct: { lt: correct } },
          { total: { lt: total } },
        ],
      },
      data: { score, correct, total, timeMs },
    });

    const updatedSession = await findSession(params.radioId, params.sessionId);
    if (updatedProgress.count > 0) {
      await notifyGameSessionChanged(params.radioId, params.sessionId);
    }
    return NextResponse.json(formatSession(updatedSession!, userId));
  }

  await prisma.$transaction(async (transaction) => {
    await transaction.radioSessionPlayer.update({
      where: { id: currentPlayer.id },
      data: {
        score,
        correct,
        total,
        timeMs,
        completed: true,
        abandoned: playerStatus === "abandoned",
      },
    });

    if (playerStatus === "abandoned") {
      await transaction.radioLobbyPresence.updateMany({
        where: {
          roomId: gameSession.roomId,
          userId,
        },
        data: { status: "IDLE" },
      });
    }
  });

  const remainingPlayers = await prisma.radioSessionPlayer.count({
    where: {
      sessionId: gameSession.id,
      completed: false,
    },
  });

  // Abandon feature: if only one left, finish the session
  // But the left one keep his score.
  const shouldFinishSession =
    remainingPlayers === 0 ||
    (playerStatus === "abandoned" && remainingPlayers === 1);

  if (shouldFinishSession) {
    await prisma.$transaction([
      prisma.radioGameSession.update({
        where: { id: gameSession.id },
        data: {
          status: "FINISHED",
          endedAt: new Date(),
        },
      }),
      prisma.radioLobbyPresence.updateMany({
        where: {
          roomId: gameSession.roomId,
          userId: {
            in: gameSession.players.map((player) => player.userId),
          },
        },
        data: { status: "IDLE" },
      }),
    ]);
  }

  const updatedSession = await findSession(params.radioId, params.sessionId);
  await notifyGameSessionChanged(params.radioId, params.sessionId);
  return NextResponse.json(formatSession(updatedSession!, userId));
}
