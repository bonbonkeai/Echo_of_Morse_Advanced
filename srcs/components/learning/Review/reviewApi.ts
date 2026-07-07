import type { PracticeMode } from "@/components/learning/Practice/practiceTypes";

export type ReviewQuestion = {
  id: string;
  character: string;
  morse: string;
  level: 0;
  mode: PracticeMode;
};

export type ReviewAnswer = {
  char: string;
  mode: PracticeMode;
  answer: string;
};

export type ReviewSessionPayload = {
  questions: ReviewQuestion[];
  dueCount: number;
  reviewedCharacters: number;
};

export type ReviewResult = {
  correctCount: number;
  questionCount: number;
  accuracy: number;
};

export async function getReviewSession(): Promise<ReviewSessionPayload> {
  const response = await fetch("/api/learning/review", {
    cache: "no-store",
  });
  const data = (await response.json()) as ReviewSessionPayload & {
    error?: string;
  };

  if (!response.ok) {
    throw new Error(data.error || "Failed to load the review session.");
  }

  return data;
}

export async function submitReviewSession(
  answers: ReviewAnswer[]
): Promise<ReviewResult> {
  const response = await fetch("/api/learning/review", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ answers }),
  });
  const data = (await response.json()) as ReviewResult & { error?: string };

  if (!response.ok) {
    throw new Error(data.error || "Failed to save the review session.");
  }

  return data;
}
