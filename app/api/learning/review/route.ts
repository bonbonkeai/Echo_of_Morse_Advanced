//* API route for the review feature in the learning section.
//* It reuses components from the 12-level practice system with review-specific behavior.
//* GET: Retrieves the current user's learning progress and generates a review session.
//* POST: Validates submitted answers, updates review progress, and records a practice session.

import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import { authOptions } from "@/lib/auth";
import { getMorseForCharacter } from "@/lib/morse";
import { calculateSrsState, getNextReviewAt } from "@/lib/learning/srs";
import { prisma } from "@/server/prisma";

const REVIEW_QUESTION_COUNT = 20;

type ReviewMode = "decode" | "encode";

// The client submits its raw answer instead of a trusted correct/incorrect flag.
// POST recalculates correctness from the server-side Morse table.
type ReviewAnswer = {
  char?: string;
  mode?: ReviewMode;
  answer?: string;
};

function getAccuracy(correctCount: number, totalSeen: number) {
  return totalSeen === 0 ? 0 : correctCount / totalSeen;
}

function shuffle<T>(items: T[]) {
  const shuffled = [...items];

  // Fisher-Yates keeps the selected priority characters but randomizes their order.
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [
      shuffled[swapIndex],
      shuffled[index],
    ];
  }

  return shuffled;
}

export async function GET() {
  // Review data always belongs to the authenticated user.
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();

  // Only practiced characters can enter review. Unseen characters remain part
  // of the normal 12-level learning path.
  const progressRows = await prisma.userLetterProgress.findMany({
    where: {
      userId: session.user.id,
      totalSeen: { gt: 0 },
    },
    include: {
      letter: {
        select: { char: true },
      },
    },
  });

  const reviewableProgressRows = progressRows.filter((progress) =>
    Boolean(getMorseForCharacter(progress.letter.char))
  );

  // Priority order:
  // 1. Characters whose nextReviewAt date has passed.
  // 2. Lower mastery.
  // 3. Lower historical accuracy.
  // 4. Earlier scheduled review date.
  const prioritized = [...reviewableProgressRows].sort((left, right) => {
    const leftDue = left.nextReviewAt <= now ? 0 : 1;
    const rightDue = right.nextReviewAt <= now ? 0 : 1;

    if (leftDue !== rightDue) {
      return leftDue - rightDue;
    }

    if (left.mastery !== right.mastery) {
      return left.mastery - right.mastery;
    }

    const accuracyDifference =
      getAccuracy(left.correctCount, left.totalSeen) -
      getAccuracy(right.correctCount, right.totalSeen);

    if (accuracyDifference !== 0) {
      return accuracyDifference;
    }

    return left.nextReviewAt.getTime() - right.nextReviewAt.getTime();
  });

  if (prioritized.length === 0) {
    return Response.json({
      questions: [],
      dueCount: 0,
      reviewedCharacters: 0,
    });
  }

  const candidates = prioritized.slice(
    0,
    Math.min(prioritized.length, REVIEW_QUESTION_COUNT)
  );

  // A session always contains 20 questions. When fewer than 20 priority
  // characters exist, candidates repeat so weak characters receive more practice.
  const questions = Array.from(
    { length: REVIEW_QUESTION_COUNT },
    (_, index) => candidates[index % candidates.length]
  ).map((progress, index) => ({
    id: `${progress.letterId}-${index}`,
    character: progress.letter.char,
    morse: getMorseForCharacter(progress.letter.char) ?? "",
    level: 0,
    // Match the existing level practice by mixing decoding and encoding.
    mode: (Math.random() < 0.5 ? "decode" : "encode") as ReviewMode,
  }));

  return Response.json({
    questions: shuffle(questions),
    dueCount: reviewableProgressRows.filter(
      (progress) => progress.nextReviewAt <= now
    ).length,
    reviewedCharacters: candidates.length,
  });
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as { answers?: ReviewAnswer[] };

  if (
    !Array.isArray(body.answers) ||
    body.answers.length === 0 ||
    body.answers.length > REVIEW_QUESTION_COUNT
  ) {
    return Response.json({ error: "Answers are required" }, { status: 400 });
  }

  const answers = body.answers.filter(
    (answer): answer is Required<ReviewAnswer> =>
      typeof answer.char === "string" &&
      (answer.mode === "decode" || answer.mode === "encode") &&
      typeof answer.answer === "string"
  );

  if (answers.length !== body.answers.length) {
    return Response.json({ error: "Invalid review answer" }, { status: 400 });
  }

  const characters = [...new Set(answers.map((answer) => answer.char))];

  // Fetch progress through the authenticated user so submitted characters
  // cannot update another user's records.
  const progressRows = await prisma.userLetterProgress.findMany({
    where: {
      userId: session.user.id,
      letter: {
        char: { in: characters },
      },
    },
    include: {
      letter: {
        select: { char: true },
      },
    },
  });

  const progressByCharacter = new Map(
    progressRows.map((progress) => [progress.letter.char, progress])
  );
  const resultByCharacter = new Map<
    string,
    {
      correctCount: number;
      wrongCount: number;
      totalSeen: number;
      allCorrect: boolean;
    }
  >();

  let correctCount = 0;

  // Re-evaluate every answer on the server. Results are grouped by character
  // because the same priority character may appear more than once in a session.
  for (const answer of answers) {
    const progress = progressByCharacter.get(answer.char);
    const morse = getMorseForCharacter(answer.char);

    if (!progress || !morse) {
      return Response.json(
        { error: "Review character not found" },
        { status: 400 }
      );
    }

    const expectedAnswer =
      answer.mode === "decode" ? answer.char.toUpperCase() : morse;
    const submittedAnswer =
      answer.mode === "decode"
        ? answer.answer.trim().toUpperCase()
        : answer.answer.trim();
    const correct = submittedAnswer === expectedAnswer;

    if (correct) {
      correctCount += 1;
    }

    const current = resultByCharacter.get(answer.char) ?? {
      correctCount: 0,
      wrongCount: 0,
      totalSeen: 0,
      allCorrect: true,
    };

    resultByCharacter.set(answer.char, {
      correctCount: current.correctCount + (correct ? 1 : 0),
      wrongCount: current.wrongCount + (correct ? 0 : 1),
      totalSeen: current.totalSeen + 1,
      allCorrect: current.allCorrect && correct,
    });
  }

  const now = new Date();

  // Update every reviewed character and the session counter atomically.
  // A character's counters include every appearance, but its scheduling state
  // changes only once: one mistake resets it; otherwise the interval grows.
  await prisma.$transaction([
    ...Array.from(resultByCharacter.entries()).map(([char, result]) => {
      const progress = progressByCharacter.get(char)!;
      const state = calculateSrsState(result.allCorrect, progress, {
        ensureIntervalGrowth: true,
      });
      const nextReviewAt = getNextReviewAt(now, state.interval);

      return prisma.userLetterProgress.update({
        where: { id: progress.id },
        data: {
          mastery: state.mastery,
          interval: state.interval,
          easeFactor: state.easeFactor,
          correctCount: { increment: result.correctCount },
          wrongCount: { increment: result.wrongCount },
          totalSeen: { increment: result.totalSeen },
          lastReviewed: now,
          nextReviewAt,
        },
      });
    }),
    prisma.user.update({
      where: { id: session.user.id },
      data: { practiceSessions: { increment: 1 } },
    }),
  ]);

  return Response.json({
    correctCount,
    questionCount: answers.length,
    accuracy: Math.round((correctCount / answers.length) * 100),
  });
}
