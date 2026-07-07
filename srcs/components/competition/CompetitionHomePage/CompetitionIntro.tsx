"use client";

import { useI18n } from "@/lib/i18n";
import { Card } from "@/components/ui";
import { RADIO_LOBBY_MAX_USERS } from "@/config/competition";
import styles from "@/../app/competition/competition.module.css";

export default function CompetitionIntro() {
	const { dictionary } = useI18n();
	const t = dictionary.competitionHome;

  return (
    <Card className={styles.rulesCard} aria-labelledby="competition-rules">
      <h2 id="competition-rules" className={styles.cardTitle}>
        {t.rules}
      </h2>

      <ol className={styles.rulesList}>
		{t.rulesList.map((rule) => (
			<li key={rule}>
				{rule.replace("{maxUsers}", String(RADIO_LOBBY_MAX_USERS))}
			</li>
		))}
      </ol>
    </Card>
  );
}
