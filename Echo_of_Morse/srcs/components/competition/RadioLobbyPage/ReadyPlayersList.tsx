"use client";

import { useI18n } from "@/lib/i18n";
import { Card } from "@/components/ui";
import type { RadioUser } from "@/types/competition";
import styles from "@/../app/competition/radio/[radioId]/radio-lobby.module.css";

type ReadyPlayersListProps = {
  readyPlayers: RadioUser[];
};

export default function ReadyPlayersList({
  readyPlayers,
}: ReadyPlayersListProps) {
	const { dictionary } = useI18n();
	const t = dictionary.competitionRadio;

  return (
    <Card className={styles.panel} aria-labelledby="ready-players">
      <div className={styles.panelHeader}>
        <div>
          <h2 id="ready-players" className={styles.panelTitle}>
            {t.readyPlayers}
          </h2>
          <p className={styles.panelText}>
            {t.readyPlayersDescription}
          </p>
        </div>
      </div>

      {readyPlayers.length === 0 ? (
        <p className={styles.emptyState}>
          {t.noReadyPlayers}
        </p>
      ) : (
        <ul className={styles.readyList}>
          {readyPlayers.map((player, index) => (
            <li key={player.id} className={styles.readyItem}>
              <span>
                {index + 1}. {player.displayName}
                {player.isCurrentUser ? ` (${t.you})` : ""}
              </span>
              <strong>{t.ready}</strong>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
