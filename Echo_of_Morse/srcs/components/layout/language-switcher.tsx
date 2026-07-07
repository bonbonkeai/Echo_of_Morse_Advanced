"use client";

import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui";
import styles from "./language-switcher.module.css";

export default function LanguageSwitcher() {
	const { language, setLanguage, dictionary } = useI18n();

  return (
    <div className={styles.switcher} aria-label={dictionary.layout.languageSwitcher}>
      <Button
        type="button"
        size="sm"
        variant={language === "en" ? "primary" : "secondary"}
        onClick={() => setLanguage("en")}
        className={styles.button}
      >
        EN
      </Button>

      <Button
        type="button"
        size="sm"
        variant={language === "fr" ? "primary" : "secondary"}
        onClick={() => setLanguage("fr")}
        className={styles.button}
      >
        FR
      </Button>

      <Button
        type="button"
        size="sm"
        variant={language === "zh" ? "primary" : "secondary"}
        onClick={() => setLanguage("zh")}
        className={styles.button}
      >
        中文
      </Button>
    </div>
  );
}
