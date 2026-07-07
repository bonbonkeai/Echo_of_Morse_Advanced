"use client";
import { useI18n } from "@/lib/i18n";
import { Card } from "@/components/ui";
import styles from "./home.module.css";

export default function IntroSection() {
	const { dictionary } = useI18n();
	const t = dictionary.home;

  return (
    <Card className={styles.sectionBlock}>
      <h2 className={styles.sectionTitle}>{t.introTitle}</h2>

      <p className={styles.sectionText}>
        {t.introDescription}
      </p>
    </Card>
  );
}
