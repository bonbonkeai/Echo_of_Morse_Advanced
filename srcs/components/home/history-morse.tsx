"use client";
import { useI18n } from "@/lib/i18n";

import { Card } from "@/components/ui";
import styles from "./home.module.css";

export default function HistorySection() {
	const { dictionary } = useI18n();
	const t = dictionary.home;

  return (
    <Card className={styles.sectionBlock}>
      <h2 className={styles.sectionTitle}>{t.historyTitle}</h2>

      <p className={styles.sectionTextWithMargin}>
        {t.historyParagraph1}
      </p>

      <p className={styles.sectionTextWithMargin}>
        {t.historyParagraph2}
      </p>

      <p className={styles.sectionTextWithMargin}>
        {t.historyParagraph3}
      </p>

      <p className={styles.sectionText}>
        {t.historyParagraph4}
      </p>
    </Card>
  );
}
