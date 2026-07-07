import type { UserLearningProgress } from "@/types/learning";

export function isLevelUnlocked(
  level: number,
  progress: UserLearningProgress
): boolean {
  return progress.unlockedLevels.includes(level);
}

export function isLevelCompleted(
  level: number,
  progress: UserLearningProgress
): boolean {
  return progress.completedLevels.includes(level);
}

export function getLevelStatus(
  level: number,
  progress: UserLearningProgress
): "completed" | "current" | "unlocked" | "locked" {
  if (isLevelCompleted(level, progress)) {
    return "completed";
  }

  if (level === progress.currentLevel) {
    return "current";
  }

  if (isLevelUnlocked(level, progress)) {
    return "unlocked";
  }

  return "locked";
}

/**
 * Optional helper (useful for UI safety)
 */
export function hasLearningProgress(
  progress: UserLearningProgress | null | undefined
): progress is UserLearningProgress {
  return (
    !!progress &&
    Array.isArray(progress.unlockedLevels) &&
    Array.isArray(progress.completedLevels)
  );
}