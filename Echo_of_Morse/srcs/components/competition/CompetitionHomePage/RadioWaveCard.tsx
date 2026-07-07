"use client";

import { useI18n } from "@/lib/i18n";
import Link from "next/link";
import { Card } from "@/components/ui";
import { RADIO_LOBBY_MAX_USERS } from "@/config/competition";
import type { RadioConfig } from "@/types/competition";
import styles from "@/../app/competition/competition.module.css";

type RadioWaveCardProps = {
  radio: RadioConfig;
  usersCount: number;
};

export default function RadioWaveCard({
  radio,
  usersCount,
}: RadioWaveCardProps) {
	const { dictionary } = useI18n();
	const t = dictionary.competitionHome;
	const radioNameById: Record<string, string> = {
		"01": t.radioWave01,
		"02": t.radioWave02,
		"03": t.radioWave03,
	};

	const radioDescriptionById: Record<string, string> = {
		"01": t.radioWave01Description,
		"02": t.radioWave02Description,
		"03": t.radioWave03Description,
	};

	const radioName = radioNameById[radio.id];
	const radioDescription = radioDescriptionById[radio.id];

  const isLobbyFull = usersCount >= RADIO_LOBBY_MAX_USERS;
  const usersCapacityLabel = t.usersInside
	.replace("{count}", String(usersCount))
	.replace("{maxUsers}", String(RADIO_LOBBY_MAX_USERS));

  const card = (
    <Card
      as="article"
      className={`${styles.radioCard} ${isLobbyFull ? styles.radioCardFull : ""}`}
    >
      <div className={styles.radioTopLine}>
        <span className={styles.radioName}>{radioName}</span>
        <span className={styles.radioWpm}>{radio.wpm} WPM</span>
      </div>

      <p className={styles.radioDescription}>{radioDescription}</p>

      <div className={styles.radioFooter}>
        <span>{usersCapacityLabel}</span>
        <span className={isLobbyFull ? styles.radioFullBadge : ""}>
          {isLobbyFull ? t.full : t.enter}
        </span>
      </div>
    </Card>
  );

  if (isLobbyFull) {
    return (
      <div
        className={styles.radioUnavailable}
        aria-label={t.lobbyFullAria
			.replace("{radioName}", radioName)
			.replace("{wpm}", String(radio.wpm))}
      >
        {card}
      </div>
    );
  }

  return (
    <Link
      href={`/competition/radio/${radio.id}`}
      className={styles.radioLink}
      aria-label={t.enterRadioAria
		.replace("{radioName}", radioName)
		.replace("{wpm}", String(radio.wpm))
		.replace("{capacity}", usersCapacityLabel)}
    >
      {card}
    </Link>
  );
}
