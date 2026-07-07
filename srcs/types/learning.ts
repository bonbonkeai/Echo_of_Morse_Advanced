export type MorseLevel = {
  level: number;
  title: string;
  newCharacters: string[];
  reviewFrom: string;
  newRatio: string;
  reviewRatio: string;
  questionCount: number;
  passCondition: string;
};

export type UserLearningProgress = {
  currentLevel: number;
  unlockedLevels: number[];
  completedLevels: number[];

  /**
   * Global accuracy across all completed learning practice sessions.
   * Formula:
   * totalCorrectAnswers / totalAnsweredQuestions * 100
   * null means there is not enough backend data yet.
   */
  globalAccuracy: number | null;

  /**
   * Number of completed learning practice sessions.
   * One completed level practice = one practice session.
   * null means the backend does not return this data yet.
   */
  totalPracticeSessions: number;
  weakCharacters: string[];
  letterProgress: LetterProgress[]; 
};

export type LetterProgress = {
  character: string;
  morse: string;
  correctCount: number;
  wrongCount: number;
  totalSeen: number;
  mastery: number;
};