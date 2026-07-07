"use client";

import { useI18n } from "@/lib/i18n";

import PageShell from "@/components/layout/page-shell";
import LearningProgressCard from "@/components/learning/LearningProgressCard";
import LearningEntryCards from "@/components/learning/LearningEntryCards";
import LetterProgressPreview from "@/components/learning/LetterProgressPreview";
import styles from "@/components/learning/css/Learning.module.css";

import type { UserLearningProgress } from "@/types/learning";

type LearningPageClientProps = {
  progress: UserLearningProgress;
  totalLevels: number;
};

export default function LearningPageClient({
  progress,
  totalLevels,
}: LearningPageClientProps) {
  const { dictionary } = useI18n();
  const t = dictionary.learning;

  return (
    <main id="main-content">
      <PageShell>
        <section
          className={styles.learningPage}
          aria-labelledby="learning-title"
        >
          <div className={styles.learningContainer}>
            <section className={styles.hero}>
              <h1 id="learning-title" className={styles.title}>
                {t.pageTitle}
              </h1>

              <p className={styles.description}>
                {t.pageDescription}
              </p>
            </section>

            <LearningProgressCard
              progress={progress}
              totalLevels={totalLevels}
            />

            <LetterProgressPreview
              letterProgress={progress.letterProgress}
            />

            <LearningEntryCards progress={progress} />
          </div>
        </section>
      </PageShell>
    </main>
  );
}