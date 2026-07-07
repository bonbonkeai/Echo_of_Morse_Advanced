"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import type { UserLearningProgress } from "@/types/learning";

import PageShell from "@/components/layout/page-shell";
import LevelGrid from "@/components/learning/LevelGrid";
import { morseLevels } from "@/components/learning/data/morseLevels";

import styles from "@/components/learning/css/Learning.module.css";

type LevelsPageClientProps = {
  progress: UserLearningProgress;
};

export default function LevelsPageClient({
  progress,
}: LevelsPageClientProps) {
  const { dictionary } = useI18n();
  const t = dictionary.learning;

  return (
    <main id="main-content">
      <PageShell>
        <section className={styles.learningPage} aria-labelledby="levels-title">
          <div className={styles.learningContainer}>
            <nav className={styles.breadcrumb} aria-label={t.breadcrumb}>
              <Link className={styles.link} href="/learning">
                {t.breadcrumbLearning}
              </Link>
              <span aria-hidden="true"> / </span>
              <span className={styles.breadcrumbCurrent}>
                {t.breadcrumbLevels}
              </span>
            </nav>

            <section className={styles.hero}>
              <h1 id="levels-title" className={styles.title}>
                {t.breadcrumbLevels}
              </h1>

              <p className={styles.description}>
                {t.levelsPageDescription}
              </p>
            </section>

            <LevelGrid levels={morseLevels} progress={progress} />
          </div>
        </section>
      </PageShell>
    </main>
  );
}