"use client";
import { useI18n } from "@/lib/i18n";

import Link from "next/link";
import type { MorseLevel, UserLearningProgress } from "@/types/learning";
import { getLevelStatus } from "@/lib/learning/levelAccess";
import styles from "@/components/learning/css/Learning.module.css";

type LevelCardProps = {
  level: MorseLevel;
  progress: UserLearningProgress;
};

export default function LevelCard({ level, progress }: LevelCardProps) {
  const { dictionary } = useI18n();
  const t = dictionary.learning;

  const status = getLevelStatus(level.level, progress);
  const isLocked = status === "locked";

  const statusLabel = {
		completed: t.completed,
		current: t.current,
		unlocked: t.unlocked,
		locked: t.locked,
	}[status];

  return (
    <article
      className={`${styles.levelCard} ${isLocked ? styles.levelCardLocked : ""}`}
      aria-labelledby={`level-${level.level}-title`}
    >
      <div>
        <div className={styles.levelTop}>
          <h2 id={`level-${level.level}-title`} className={styles.levelTitle}>
            {t.levelLabel.replace("{level}", String(level.level))}
          </h2>

          <span
            className={`${styles.statusBadge} ${
              isLocked ? styles.statusBadgeLocked : ""
            }`}
          >
            {statusLabel}
          </span>
        </div>

        <div className={styles.characterList} aria-label={t.newCharacters}>
          {level.newCharacters.map((character) => (
            <span className={styles.characterPill} key={character}>
              {character}
            </span>
          ))}
        </div>

        <dl className={styles.levelMeta}>
          <div className={styles.metaBox}>
            <dt className={styles.metaLabel}>{t.questions}</dt>
            <dd className={styles.metaValue}>{level.questionCount}</dd>
          </div>

          <div className={styles.metaBox}>
            <dt className={styles.metaLabel}>{t.pass}</dt>
            <dd className={styles.metaValue}>{level.passCondition}</dd>
          </div>
        </dl>
      </div>

      {isLocked ? (
        <button className={styles.disabledButton} type="button" disabled>
          {t.locked}
        </button>
      ) : (
        <Link
          className={styles.primaryButton}
          href={`/learning/levels/${level.level}/practice`}
        >
          {t.startPractice}
        </Link>
      )}
    </article>
  );
}
