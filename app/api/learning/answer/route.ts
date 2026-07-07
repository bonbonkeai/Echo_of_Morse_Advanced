import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getLevelRule } from "@/lib/learning/course";
import { calculateSrsState, getNextReviewAt } from "@/lib/learning/srs";
import { prisma } from "@/server/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { levelId, char, correct, isLastQuestion, sessionCorrect } =
    await req.json();

  const userId = session.user.id;

  // 1. 找到这个字母在 Letter 表里的 id
  const letter = await prisma.letter.findUnique({ where: { char } });
  if (!letter) {
    return Response.json({ error: "Letter not found" }, { status: 404 });
  }

  // 2. 找到现有进度（没有就初始化）
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

  // 3. Upsert UserLetterProgress
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

  // 4. 最后一题：判断是否升级
  if (isLastQuestion) {
    const levelRule = getLevelRule(levelId);
    if (levelRule) {
      const passed = sessionCorrect >= levelRule.passCount;

      if (passed) {
        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: { learningLevel: true },
        });

        // 只有当前 level 通过才升级，不能跳级
        if (user && user.learningLevel === levelId) {
          await prisma.user.update({
            where: { id: userId },
            data: { learningLevel: { increment: 1 } },
          });

          return Response.json({ leveledUp: true, newLevel: levelId + 1 });
        }
      }

      return Response.json({ leveledUp: false, passed });
    }
  }

  return Response.json({ leveledUp: false });
}
