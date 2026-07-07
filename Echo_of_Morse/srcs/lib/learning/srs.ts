//* SRS means Spaced Repetition System.
//* It schedules reviews according to how well the user remembers each Morse character.

const MIN_MASTERY = 0;
const MAX_MASTERY = 10;
const MIN_EASE_FACTOR = 1.3;
const MAX_EASE_FACTOR = 3;
const DAY_IN_MS = 24 * 60 * 60 * 1000;

export type SrsState = {
  mastery: number;
  interval: number;
  easeFactor: number;
};

type SrsOptions = {
  ensureIntervalGrowth?: boolean;
};


// A correct answer increases mastery and usually extends the review interval.
// An incorrect answer lowers mastery and resets the review interval to one day.
// nextReviewAt stores the date when the character should be reviewed again.
export function calculateSrsState(
  correct: boolean,
  current: SrsState,
  options: SrsOptions = {}
): SrsState {
  if (!correct) {
    return {
      // -1 mastery point, >= 0.
      mastery: Math.max(current.mastery - 1, MIN_MASTERY),
      interval: 1,
      // Make future interval growth slower, >= 1.3.
      easeFactor: Math.max(current.easeFactor - 0.2, MIN_EASE_FACTOR),
    };
  }

  const calculatedInterval = Math.round(
    current.interval * current.easeFactor
  );

  const interval = options.ensureIntervalGrowth
    ? Math.max(current.interval + 1, calculatedInterval)
    : calculatedInterval;

  return {
    // mastery point + 1, always <= 10
    mastery: Math.min(current.mastery + 1, MAX_MASTERY),
    interval,
    // Make future interval growth faster, but <= 3.
    easeFactor: Math.min(current.easeFactor + 0.1, MAX_EASE_FACTOR),
  };
}

export function getNextReviewAt(now: Date, interval: number) {
  return new Date(now.getTime() + interval * DAY_IN_MS);
}
