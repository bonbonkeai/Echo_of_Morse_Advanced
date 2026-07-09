
"use client";

import { useI18n } from "@/lib/i18n";
import { RADIO_LOBBY_MAX_USERS } from "@/config/competition";
import type { RadioConfig } from "@/types/competition";
import BackLink from "@/components/ui/back-link";
import styles from "@/../app/competition/radio/[radioId]/radio-lobby.module.css";

type RadioHeaderProps = {
  radio: RadioConfig;
  usersCount: number;
};

export default function RadioHeader({
  radio,
  usersCount,
}: RadioHeaderProps) {
	const { dictionary } = useI18n();
	const t = dictionary.competitionRadio;

	const radioDescriptionById: Record<string, string> = {
		"01": t.radioWave01Description,
		"02": t.radioWave02Description,
		"03": t.radioWave03Description,
	};

	const radioNameById: Record<string, string> = {
		"01": t.radioWave01,
		"02": t.radioWave02,
		"03": t.radioWave03,
	};

	const radioName = radioNameById[radio.id];
	const radioDescription = radioDescriptionById[radio.id];

  return (
    <header className={styles.header}>
      <div>
        <BackLink href="/competition" className={styles.backLink}>
          {t.backToCompetition}
        </BackLink>
        <h1 className={styles.title}>{radioName}</h1>

        <p className={styles.description}>
          {t.lobbyDescription.replace("{description}", radioDescription)}
        </p>
      </div>

      <aside className={styles.metaBox} aria-label={t.radioInformation}>
        <div className={styles.metaGroup}>
          <p className={styles.metaLabel}>{t.speed}</p>
          <p className={styles.metaValue}>{radio.wpm} WPM</p>
        </div>

        <div className={styles.metaGroup}>
          <p className={styles.metaLabel}>{t.usersInside}</p>
          <p className={styles.metaValue}>
            {usersCount}/{RADIO_LOBBY_MAX_USERS}
          </p>
        </div>
      </aside>
    </header>
  );
}
