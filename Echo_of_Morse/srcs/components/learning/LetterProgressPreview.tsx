//This version is connected with real db data. 

"use client";

import styles from "@/components/learning/css/Learning.module.css";
import type { LetterProgress } from "@/types/learning";

import { useI18n } from "@/lib/i18n";

// Calcule le taux de réussite en pourcentage
function getAccuracy(correctCount: number, totalSeen: number): number {
  if (totalSeen === 0) return 0;
  return Math.round((correctCount / totalSeen) * 100);
}

// Trie les caractères du plus faible au plus fort en fonction de leur taux de réussite
function getVisibleLetters(letters: LetterProgress[]): LetterProgress[] {
  return [...letters].sort((a, b) => {
    const accuracyA = getAccuracy(a.correctCount, a.totalSeen);
    const accuracyB = getAccuracy(b.correctCount, b.totalSeen);

    if (a.totalSeen === 0 && b.totalSeen > 0) return 1;
    if (a.totalSeen > 0 && b.totalSeen === 0) return -1;

    return accuracyA - accuracyB;
  });
}

// Affiche une barre de progression pour chaque caractère, triée du plus faible au plus fort
type LetterProgressPreviewProps = {
  letterProgress: LetterProgress[];
};

export default function LetterProgressPreview({ letterProgress }: LetterProgressPreviewProps) {
	const { dictionary } = useI18n();
	const t = dictionary.learning;
  const visibleLetters = getVisibleLetters(letterProgress);

  return (
    <section className={styles.letterChartCard}>
      <div className={styles.letterChartHeader}>
        <div>
          <p className={styles.cardLabel}>{t.letterProgressLabel}</p>
          <h2 className={styles.entryTitle}>{t.letterProgressTitle}</h2>
          <p className={styles.cardText}> {t.letterProgressDescription}</p>
        </div>
      </div>

      <div className={styles.verticalChartWrapper}>
        <div className={styles.verticalChartScale} aria-hidden="true">
          <span>100%</span>
          <span>75%</span>
          <span>50%</span>
          <span>25%</span>
          <span>0%</span>
        </div>

        <div className={styles.verticalChartScroll}>
          <div className={styles.verticalChart}>
            {visibleLetters.map((letter) => {
              const accuracy = getAccuracy(letter.correctCount, letter.totalSeen);

              return (
                <div className={styles.verticalChartItem} key={letter.character}>
                  <div className={styles.verticalChartBarArea}>
                    <span className={styles.verticalChartValue}>{accuracy}%</span>
                    <div
                      className={styles.verticalChartBar}
                      style={{ height: `${accuracy}%` }}
                      aria-label={`${letter.character}: ${accuracy}% ${t.successRate}`}
                      title={`${letter.character} ${letter.morse}: ${accuracy}% · ${letter.correctCount}/${letter.totalSeen} ${t.correct} · ${letter.wrongCount} ${t.wrong}`}
                    />
                  </div>
                  <div className={styles.verticalChartLabel}>
                    <strong>{letter.character}</strong>
                    <span>{letter.morse}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <p className={styles.chartScrollHint}>
        {t.letterProgressScrollHint}
      </p>
    </section>
  );
}
