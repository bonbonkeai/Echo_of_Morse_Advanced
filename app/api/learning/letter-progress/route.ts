// Returns the current user's mastery level for every letter they have practiced.
// Used by the UI (to display progress) and by the AI module (to generate adaptive questions).

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/server/prisma";
import { Prisma } from "@prisma/client";

type ProgressWithLetter = Prisma.UserLetterProgressGetPayload<{
  select: {
    mastery: true;
    correctCount: true;
    wrongCount: true;
    totalSeen: true;
    lastReviewed: true;
    nextReviewAt: true;
    letter: {
      select: { char: true };
    };
  };
}>;

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  const progresses: ProgressWithLetter[] =
    await prisma.userLetterProgress.findMany({
      where: { userId },
      select: {
        mastery: true,
        correctCount: true,
        wrongCount: true,
        totalSeen: true,
        lastReviewed: true,
        nextReviewAt: true,
        letter: {
          select: { char: true },
        },
      },
      orderBy: {
        letter: { char: "asc" },
      },
    });

  const data = progresses.map((p) => ({
    char: p.letter.char,
    mastery: p.mastery, // 0–10, higher = more familiar
    correctCount: p.correctCount,
    wrongCount: p.wrongCount,
    totalSeen: p.totalSeen,
    accuracy:
      p.totalSeen > 0
        ? Math.round((p.correctCount / p.totalSeen) * 100)
        : 0, // 0–100 percentage
    lastReviewed: p.lastReviewed,
    nextReviewAt: p.nextReviewAt,
  }));

  return Response.json({ userId, letters: data });
}