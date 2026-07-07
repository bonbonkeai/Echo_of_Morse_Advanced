"use client";
import { useI18n } from "@/lib/i18n";

import type { MorseLevel, UserLearningProgress } from "@/types/learning";
import LevelCard from "@/components/learning/LevelCard";
import styles from "@/components/learning/css/Learning.module.css";

type LevelGridProps = {
  levels: MorseLevel[];
  progress: UserLearningProgress;
};

export default function LevelGrid({ levels, progress }: LevelGridProps) {
	const { dictionary } = useI18n();
	const t = dictionary.learning;

  return (
    <div className={styles.levelGrid} aria-label={t.morseLevels}>
      {levels.map((level) => (
        <LevelCard key={level.level} level={level} progress={progress} />
      ))}
    </div>
  );
}