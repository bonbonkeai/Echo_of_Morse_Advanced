import Link from "next/link";
import styles from "@/components/learning/css/PracticeSession.module.css";
import type { ReviewResult as ReviewResultData } from "./reviewApi";

type ReviewResultProps = {
  result: ReviewResultData;
  onRestart: () => void;
  t: {
    reviewComplete: string;
    reviewResultSummary: string;
    accuracy: string;
    reviewAgain: string;
    backToLearning: string;
  };
};

export default function ReviewResult({
  result,
  onRestart,
  t,
}: ReviewResultProps) {
  return (
    <section className={styles.practiceShell}>
      <div className={styles.resultPanel}>
        <p className={styles.kicker}>{t.reviewComplete}</p>

        <h1 className={styles.resultTitle}>{t.reviewComplete}</h1>

        <p className={styles.resultText}>
          {t.reviewResultSummary
            .replace("{correctCount}", String(result.correctCount))
            .replace("{questionCount}", String(result.questionCount))}
        </p>

        <div className={styles.resultStats}>
          <div>
            <span>{t.accuracy}</span>
            <strong>{result.accuracy}%</strong>
          </div>
        </div>

        <div className={styles.resultActions}>
          <Link
            className={`${styles.resultButton} ${styles.resultBackButton}`}
            href="/learning"
          >
            {t.backToLearning}
          </Link>

          <button
            type="button"
            className={`${styles.resultButton} ${styles.resultNextButton}`}
            onClick={onRestart}
          >
            {t.reviewAgain}
          </button>
        </div>
      </div>
    </section>
  );
}
