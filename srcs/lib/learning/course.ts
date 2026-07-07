//* Central configuration for the Morse learning course.
//* It defines the characters, question rules, and helper functions for all 12 levels.

import { getMorseForCharacter } from "../morse";

const CHARACTERS_BY_LEVEL = [
  ["E", "T", "I", "A"],
  ["N", "M", "S", "O"],
  ["R", "H", "D", "L"],
  ["U", "C", "F", "G"],
  ["P", "B", "W", "Y"],
  ["K", "V", "X", "J"],
  ["Q", "Z"],
  ["0", "1", "2", "3", "4"],
  ["5", "6", "7", "8", "9"],
  [".", ",", "?", "!", "/", "-"],
  ["(", ")", "&", ":", ";", "="],
  ["+", "_", '"', "$", "@"],
] as const;

export const LEVEL_RULES = {
  1: { questionCount: 20, passCount: 12, newRatio: 1 },
  2: { questionCount: 20, passCount: 12, newRatio: 0.7 },
  3: { questionCount: 20, passCount: 13, newRatio: 0.6 },
  4: { questionCount: 20, passCount: 13, newRatio: 0.6 },
  5: { questionCount: 20, passCount: 13, newRatio: 0.55 },
  6: { questionCount: 20, passCount: 14, newRatio: 0.55 },
  7: { questionCount: 20, passCount: 14, newRatio: 0.4 },
  8: { questionCount: 24, passCount: 17, newRatio: 0.5 },
  9: { questionCount: 25, passCount: 19, newRatio: 0.45 },
  10: { questionCount: 30, passCount: 23, newRatio: 0.5 },
  11: { questionCount: 30, passCount: 24, newRatio: 0.5 },
  12: { questionCount: 30, passCount: 24, newRatio: 0.5 },
} as const;

export type LevelId = keyof typeof LEVEL_RULES;

export type LearningCharacter = {
  character: string;
  morse: string;
  level: number;
};

export const TOTAL_LEVELS = CHARACTERS_BY_LEVEL.length;

export const MORSE_LEVELS: LearningCharacter[][] = CHARACTERS_BY_LEVEL.map(
  (characters, levelIndex) =>
    characters.map((character) => ({
      character,
      morse: getMorseForCharacter(character) ?? "",
      level: levelIndex + 1,
    }))
);

export function isLevelId(level: number): level is LevelId {
  return Number.isInteger(level) && level >= 1 && level <= TOTAL_LEVELS;
}

export function getLevelRule(level: number) {
  return isLevelId(level) ? LEVEL_RULES[level] : null;
}
