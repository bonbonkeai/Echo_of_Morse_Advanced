import { prisma } from "@/server/prisma";
import { getMorseForCharacter } from "@/lib/morse";
import { TOTAL_LEVELS } from "@/lib/learning/course";
import type { UserLearningProgress } from "@/types/learning";

// if lower than these thresholds, the character is considered weak and should be prioritized for practice.
const WEAK_MASTERY_THRESHOLD = 4;

export async function getUserLearningProgress(
  userId: string
): Promise<UserLearningProgress> {
  // Fetch the user's learning progress data from the database
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    select: {
      learningLevel: true,
      practiceSessions: true,
      letterProgresses: {
        select: {
          mastery: true,
          correctCount: true,
          wrongCount: true,
          totalSeen: true,
          letter: { select: { char: true } },
        },
      },
    },
  });

  // Calculate the current level, completed levels, and unlocked levels based on the user's learning level
  const currentLevel = Math.min(user.learningLevel, TOTAL_LEVELS);

  const completedLevels = Array.from(
    { length: currentLevel - 1 },
    (_, index) => index + 1
  );

  const unlockedLevels = Array.from(
    { length: currentLevel },
    (_, index) => index + 1
  );

  // Global stats
  const totalSeen = user.letterProgresses.reduce(
    (sum, progress) => sum + progress.totalSeen,
    0
  );

  const totalCorrect = user.letterProgresses.reduce(
    (sum, progress) => sum + progress.correctCount,
    0
  );

  const globalAccuracy =
    totalSeen === 0 ? null : Math.round((totalCorrect / totalSeen) * 100);

  // Map letter progress first (used by weak character detection)
  const letterProgress = user.letterProgresses.map((p) => ({
    character: p.letter.char,
    morse: getMorseForCharacter(p.letter.char) ?? "",
    correctCount: p.correctCount,
    wrongCount: p.wrongCount,
    totalSeen: p.totalSeen,
    mastery: p.mastery,
  }));

  // Weak characters derived ONLY from letterProgress
  const weakCharacters = letterProgress
    .filter(
      (p) =>
        p.totalSeen > 0 && p.mastery < WEAK_MASTERY_THRESHOLD
    )
    .sort((a, b) => a.mastery - b.mastery)
    .map((p) => p.character);

  return {
    currentLevel,
    unlockedLevels,
    completedLevels,
    globalAccuracy,
    totalPracticeSessions: user.practiceSessions,
    weakCharacters,
    letterProgress,
  };
}
