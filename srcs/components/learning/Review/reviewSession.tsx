"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";
import styles from "@/components/learning/css/PracticeSession.module.css";
import { PracticeAudio } from "@/components/learning/Practice/practiceAudio";
import PracticeAnswer from "@/components/learning/Practice/practiceAnswer";
import PracticeCheatSheet from "@/components/learning/Practice/practiceCheatSheet";
import PracticePrompt from "@/components/learning/Practice/practicePrompt";
import PracticeSettings from "@/components/learning/Practice/practiceSettings";
import type { CharacterItem } from "@/components/learning/Practice/practiceTypes";
import {
  getReviewSession,
  submitReviewSession,
  type ReviewAnswer,
  type ReviewQuestion,
  type ReviewResult as ReviewResultData,
} from "./reviewApi";
import ReviewResult from "./reviewResult";

export default function ReviewSession() {
  const { dictionary } = useI18n();
  const practiceText = dictionary.learningPractice;
  const reviewText = dictionary.learningReview;

  const [questions, setQuestions] = useState<ReviewQuestion[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [answers, setAnswers] = useState<ReviewAnswer[]>([]);
  const [result, setResult] = useState<ReviewResultData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [dueCount, setDueCount] = useState(0);
  const [reviewedCharacters, setReviewedCharacters] = useState(0);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [visualEnabled, setVisualEnabled] = useState(true);
  const isAdvancingRef = useRef(false);

  const {
    bulbOn,
    questionPlaying,
    playQuestionMorse,
    playCheatSheetMorse,
  } = PracticeAudio({ audioEnabled, visualEnabled });

  const question = questions[questionIndex];
  const expectedAnswer = question
    ? question.mode === "decode"
      ? question.character
      : question.morse
    : "";

  const cheatSheetItems = useMemo<CharacterItem[]>(
    () =>
      Array.from(
        new Map(
          questions.map((item) => [
            item.character,
            {
              character: item.character,
              morse: item.morse,
              level: 0,
            },
          ] as const)
        ).values()
      ),
    [questions]
  );

  async function loadReview() {
    setIsLoading(true);
    setError("");
    setResult(null);

    try {
      const data = await getReviewSession();
      setQuestions(data.questions);
      setDueCount(data.dueCount);
      setReviewedCharacters(data.reviewedCharacters);
      setQuestionIndex(0);
      setCorrectCount(0);
      setAnswer("");
      setFeedback("");
      setAnswers([]);
      isAdvancingRef.current = false;
    } catch (loadError) {
		setError(reviewText.loadError);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadReview();
  }, []);

  async function playSignal() {
    if (question) {
      await playQuestionMorse(question.morse);
    }
  }

  async function finishQuestion(
    submittedAnswer: string,
    wasCorrect: boolean,
    delay: number
  ) {
    if (!question || isSubmitting || isAdvancingRef.current) {
      return;
    }

    isAdvancingRef.current = true;

    const nextAnswer: ReviewAnswer = {
      char: question.character,
      mode: question.mode,
      answer: submittedAnswer,
    };
    const completedAnswers = [...answers, nextAnswer];

    setAnswers(completedAnswers);

    if (wasCorrect) {
      setCorrectCount((count) => count + 1);
    }

    window.setTimeout(async () => {
      if (questionIndex >= questions.length - 1) {
        setIsSubmitting(true);

        try {
          setResult(await submitReviewSession(completedAnswers));
        } catch (submitError) {
			setError(reviewText.saveError);
        } finally {
          setIsSubmitting(false);
          isAdvancingRef.current = false;
        }

        return;
      }

      setQuestionIndex((index) => index + 1);
      setAnswer("");
      setFeedback("");
      isAdvancingRef.current = false;
    }, delay);
  }

  function submitDecodeAnswer(value: string) {
    if (!question || question.mode !== "decode" || feedback) {
      return;
    }

    const normalized = value.toUpperCase();
    const wasCorrect = normalized === expectedAnswer;

    setAnswer(normalized);
    setFeedback(wasCorrect ? practiceText.correct : practiceText.wrong);

    if (wasCorrect) {
      void finishQuestion(normalized, true, 700);
    }
  }

  function submitEncodeAnswer() {
    if (!question || question.mode !== "encode" || feedback || !answer) {
      return;
    }

    const wasCorrect = answer === expectedAnswer;
    setFeedback(wasCorrect ? practiceText.correct : practiceText.wrong);

    if (wasCorrect) {
      void finishQuestion(answer, true, 700);
    }
  }

  function handleNextQuestion() {
    void finishQuestion(answer, false, 0);
  }

  useEffect(() => {
    if (!question) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (result || isSubmitting) {
        return;
      }

      if (
        feedback &&
        feedback !== practiceText.correct &&
        event.key === "Enter"
      ) {
        event.preventDefault();
        handleNextQuestion();
        return;
      }

      if (question.mode === "encode") {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          setAnswer((value) => value + ".");
        } else if (event.key === "ArrowRight") {
          event.preventDefault();
          setAnswer((value) => value + "-");
        } else if (event.key === "Backspace") {
          event.preventDefault();
          setAnswer((value) => value.slice(0, -1));
        } else if (event.key === "Enter") {
          event.preventDefault();
          submitEncodeAnswer();
        }

        return;
      }

      if (
        /^[a-zA-Z0-9]$/.test(event.key) ||
        /^[.,?!/()&:;=+_$@"-]$/.test(event.key)
      ) {
        submitDecodeAnswer(event.key);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [answer, feedback, isSubmitting, question, result]);

  useEffect(() => {
    if (question?.mode === "decode") {
      void playSignal();
    }
  }, [question]);

  if (isLoading) {
    return <section className={styles.practiceShell}>{reviewText.loading}</section>;
  }

  if (error) {
    return (
      <section className={styles.practiceShell}>
        <div className={styles.resultPanel}>
          <h1 className={styles.resultTitle}>{reviewText.unavailable}</h1>
          <p className={styles.resultText}>{error}</p>
          <button
            type="button"
            className={`${styles.resultButton} ${styles.resultNextButton}`}
            onClick={() => void loadReview()}
          >
            {reviewText.tryAgain}
          </button>
        </div>
      </section>
    );
  }

  if (questions.length === 0) {
    return (
      <section className={styles.practiceShell}>
        <div className={styles.resultPanel}>
          <h1 className={styles.resultTitle}>{reviewText.noProgressTitle}</h1>
          <p className={styles.resultText}>{reviewText.noProgressDescription}</p>
          <Link
            className={`${styles.resultButton} ${styles.resultNextButton}`}
            href="/learning/levels"
          >
            {reviewText.openLevels}
          </Link>
        </div>
      </section>
    );
  }

  if (result) {
    return (
      <ReviewResult
        result={result}
        onRestart={() => void loadReview()}
        t={reviewText}
      />
    );
  }

  return (
    <section className={styles.practiceShell} aria-labelledby="review-title">
      <div className={styles.practiceHeader}>
        <div className={styles.practiceTitleBlock}>
          <Link className={styles.backToLevelsButton} href="/learning">
            ‹
          </Link>
          <div>
            <h1 id="review-title" className={styles.practiceTitle}>
              {reviewText.title}
            </h1>
            <p>
              {reviewText.sessionSummary
                .replace("{dueCount}", String(dueCount))
                .replace(
                  "{reviewedCharacters}",
                  String(reviewedCharacters)
                )}
            </p>
          </div>
        </div>

        <div className={styles.scoreBox}>
          <span>
            {questionIndex + 1} / {questions.length}
          </span>
          <strong>
            {correctCount} {practiceText.correctCount}
          </strong>
        </div>
      </div>

      <div className={styles.practiceGrid}>
        <PracticePrompt
          question={question}
          bulbOn={bulbOn}
          visualEnabled={visualEnabled}
          isPlaying={questionPlaying}
          t={practiceText}
          onReplaySignal={() => void playSignal()}
        />

        <PracticeAnswer
          question={question}
          answer={answer}
          feedback={feedback}
          t={practiceText}
          onAddDot={() => setAnswer((value) => value + ".")}
          onAddDash={() => setAnswer((value) => value + "-")}
          onDelete={() => setAnswer((value) => value.slice(0, -1))}
          onSubmitEncode={submitEncodeAnswer}
          onNextQuestion={handleNextQuestion}
        />
      </div>

      <PracticeCheatSheet
        items={cheatSheetItems}
        title={practiceText.cheatSheetTitle}
        playLabel={practiceText.playSound}
        onPlay={playCheatSheetMorse}
      />

      <PracticeSettings
        audioLabel={practiceText.audio}
        lightLabel={practiceText.light}
        audioEnabled={audioEnabled}
        visualEnabled={visualEnabled}
        onAudioChange={setAudioEnabled}
        onVisualChange={setVisualEnabled}
      />
    </section>
  );
}
