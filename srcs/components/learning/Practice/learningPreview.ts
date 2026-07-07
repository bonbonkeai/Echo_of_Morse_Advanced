import { MORSE_LEVELS, type LevelId } from "../../../lib/learning/course";

export type LearningPreviewItem = {
  character: string;
  morse: string;
};

export function getLearningPreviewItems(levelId: number): LearningPreviewItem[] {
  const safeLevelId = Math.min(Math.max(levelId, 1), 12) as LevelId;
  const newCharacters = MORSE_LEVELS[safeLevelId - 1] ?? [];

  return newCharacters.map(({ character, morse }) => ({
    character,
    morse,
  }));
}
