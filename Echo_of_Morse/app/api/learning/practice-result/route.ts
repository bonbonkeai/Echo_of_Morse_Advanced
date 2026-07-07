import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import { authOptions } from "@/lib/auth";
import { getLevelRule } from "@/lib/learning/course";
import { calculateSrsState, getNextReviewAt } from "@/lib/learning/srs";
import { prisma } from "@/server/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { levelId, answers } = await req.json();
  //console.log("answers received:", JSON.stringify(answers)); // debug log
  //console.log("levelId:", levelId, "passed:", passed); //debug log
  const userId = session.user.id;
  const levelRule = getLevelRule(levelId);

  if (!levelRule || !Array.isArray(answers)) {
    return Response.json({ error: "Invalid practice result" }, { status: 400 });
  }

  const passed =
    answers.filter((answer) => answer?.correct === true).length >=
    levelRule.passCount;

  // 1. Update UserLetterProgress for each answered question
  
  for (const { char, correct } of answers) {
    //console.log("looking for char:", JSON.stringify(char));//debug log 
    const letter = await prisma.letter.findUnique({ where: { char } });
    //console.log("letter found:", letter);//debug log

    if (!letter) continue;

    const existing = await prisma.userLetterProgress.findUnique({
      where: { userId_letterId: { userId, letterId: letter.id } },
    });

    const now = new Date();
    const state = calculateSrsState(correct, {
      mastery: existing?.mastery ?? 0,
      interval: existing?.interval ?? 1,
      easeFactor: existing?.easeFactor ?? 2.5,
    });
    const nextReviewAt = getNextReviewAt(now, state.interval);

    await prisma.userLetterProgress.upsert({
      where: { userId_letterId: { userId, letterId: letter.id } },
      update: {
        correctCount: { increment: correct ? 1 : 0 },
        wrongCount:   { increment: correct ? 0 : 1 },
        totalSeen:    { increment: 1 },
        mastery:      state.mastery,
        interval:     state.interval,
        easeFactor:   state.easeFactor,
        nextReviewAt,
        lastReviewed: now,
      },
      create: {
        userId,
        letterId: letter.id,
        correctCount: correct ? 1 : 0,
        wrongCount:   correct ? 0 : 1,
        totalSeen:    1,
        mastery:      correct ? 1 : 0,
        interval:     state.interval,
        easeFactor:   state.easeFactor,
        nextReviewAt,
        lastReviewed: now,
      },
    });
    console.log("upserted:", char, correct);
  }

  // 2. Level up if passed current level
  if (passed) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { learningLevel: true },
    });

    if (user && user.learningLevel === levelId) {
      await prisma.user.update({
        where: { id: userId },
        data: { learningLevel: { increment: 1 } },
      });
    }
  }

  // 3. Increment practice sessions count
  await prisma.user.update({
    where: { id: userId },
    data: { practiceSessions: { increment: 1 } },
  });

  return Response.json({ ok: true });
}
