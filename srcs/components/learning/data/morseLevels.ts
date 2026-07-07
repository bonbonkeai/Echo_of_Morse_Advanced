import {
  LEVEL_RULES,
  MORSE_LEVELS,
  type LevelId,
} from "@/components/learning/Practice/practiceData";
import type { MorseLevel } from "@/types/learning";

export const morseLevels: MorseLevel[] = MORSE_LEVELS.map(
  (characters, levelIndex) => {
    const level = (levelIndex + 1) as LevelId;
    const rule = LEVEL_RULES[level];
    const newPercentage = Math.round(rule.newRatio * 100);
    const passPercentage =
      Math.floor(((rule.passCount / rule.questionCount) * 100) / 5) * 5;

    return {
      level,
      title: `Level ${level}`,
      newCharacters: characters.map(
        ({ character, morse }) => `${character} ${morse}`
      ),
      reviewFrom:
        level === 1
          ? "No review"
          : level === 2
            ? "Level 1"
            : `Levels 1-${level - 1}`,
      newRatio: `${newPercentage}% new`,
      reviewRatio: `${100 - newPercentage}% review`,
      questionCount: rule.questionCount,
      passCondition: `≥ ${passPercentage}% (${rule.passCount}/${rule.questionCount})`,
    };
  }
);
