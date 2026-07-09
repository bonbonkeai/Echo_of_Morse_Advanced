
"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import BackLink from "@/components/ui/back-link";
import styles from "@/components/learning/css/Learning.module.css";

type LearningPlayProps = {
  currentLevel: number;
};

export default function LearningPlay({
  currentLevel,
}: LearningPlayProps) {
  const { dictionary } = useI18n();
  const t = dictionary.learning;
  const currentLevelText = String(currentLevel);

  return (
    <section className={styles.learningPage} aria-labelledby="play-title">
      <div className={styles.learningContainer}>
        <nav className={styles.breadcrumb} aria-label={t.breadcrumb}>
          <BackLink href="/learning">{t.breadcrumbLearning}</BackLink>
          <span aria-hidden="true"> / </span>
          <span className={styles.breadcrumbCurrent}>{t.breadcrumbPlay}</span>
        </nav>

        <section className={styles.hero}>
          <p className={styles.eyebrow}>{t.breadcrumbPlay}</p>
          <h1 id="play-title" className={styles.title}>
            {t.noCompletedLevelYet}
          </h1>
          <p className={styles.description}>{t.playFallbackDescription}</p>
        </section>

        <section className={styles.entryGrid} aria-label={t.playFallbackOptions}>
          <article className={styles.entryCard}>
            <div>
              <p className={styles.cardLabel}>{t.currentLevel}</p>
              <h2 className={styles.entryTitle}>
                {t.startLevel.replace("{level}", currentLevelText)}
              </h2>
              <p className={styles.cardText}>{t.currentLevelDescription}</p>
            </div>

            <Link
              className={styles.primaryButton}
              href={`/learning/levels/${currentLevel}/practice`}
            >
              {t.startLevel.replace("{level}", currentLevelText)}
            </Link>
          </article>

          <article className={styles.entryCard}>
            <div>
              <p className={styles.cardLabel}>{t.levels}</p>
              <h2 className={styles.entryTitle}>{t.chooseLevel}</h2>
              <p className={styles.cardText}>{t.levelsFallbackDescription}</p>
            </div>

            <Link className={styles.primaryButton} href="/learning/levels">
              {t.openLevels}
            </Link>
          </article>
        </section>
      </div>
    </section>
  );
}
