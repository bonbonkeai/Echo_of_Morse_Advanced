"use client";
import { useI18n } from "@/lib/i18n";

import Link from "next/link";
import type { UserLearningProgress } from "@/types/learning";
import styles from "@/components/learning/css/Learning.module.css";

type LearningEntryCardsProps = {
  progress: UserLearningProgress;
};

export default function LearningEntryCards({
  progress,
}: LearningEntryCardsProps) {
	const { dictionary } = useI18n();
	const t = dictionary.learning;

  return (
    <section className={styles.entryGrid} aria-label={t.learningOptions}>
      <article className={styles.entryCard}>
        <div>
          <p className={styles.cardLabel}>{t.levels}</p>

          <h2 className={styles.entryTitle}>{t.chooseLevel}</h2>

          <p className={styles.cardText}>
           	{t.levelsDescription}
          </p>
        </div>

        <Link className={styles.primaryButton} href="/learning/levels">
          {t.openLevels}
        </Link>
      </article>

      <article className={styles.entryCard}>
        <div>
          <p className={styles.cardLabel}>{t.review}</p>

          <h2 className={styles.entryTitle}>{t.reviewDueCharacters}</h2>

          <p className={styles.cardText}>{t.reviewDescription}</p>
        </div>

        <Link className={styles.primaryButton} href="/learning/review">
          {t.startReview}
        </Link>
      </article>
    </section>
  );
}
