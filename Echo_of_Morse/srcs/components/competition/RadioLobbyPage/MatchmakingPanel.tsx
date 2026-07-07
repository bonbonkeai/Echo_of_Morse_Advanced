"use client";

import { useI18n } from "@/lib/i18n";
import { Button, Card } from "@/components/ui";
import styles from "@/../app/competition/radio/[radioId]/radio-lobby.module.css";

type MatchmakingPanelProps = {
  isCurrentUserReady: boolean;
  readyPlayersCount: number;
  canStartGame: boolean;
  message: string;
  isUpdating: boolean;
  onToggleReady: () => void;
  onStartGame: () => void;
  onLeaveLobby: () => void;
};

export default function MatchmakingPanel({
  isCurrentUserReady,
  readyPlayersCount,
  canStartGame,
  message,
  isUpdating,
  onToggleReady,
  onStartGame,
  onLeaveLobby,
}: MatchmakingPanelProps) {
	const { dictionary } = useI18n();
	const t = dictionary.competitionRadio;

  return (
    <Card className={styles.panel} aria-labelledby="matchmaking-panel">
      <div className={styles.panelHeader}>
        <div>
          <h2 id="matchmaking-panel" className={styles.panelTitle}>
            {t.matchmakingQueue}
          </h2>

          <p className={styles.panelText}>
            {t.matchmakingDescription}
          </p>
        </div>
      </div>

      <div className={styles.matchmakingActions}>
        <Button
          type="button"
          variant="secondary"
          disabled={isUpdating}
          onClick={onToggleReady}
        >
          {isCurrentUserReady ? t.cancelReady : t.ready}
        </Button>

        <Button
          type="button"
          variant={canStartGame ? "primary" : "secondary"}
          className={canStartGame ? "" : styles.startButtonBlocked}
          aria-disabled={!canStartGame}
          disabled={isUpdating}
          onClick={onStartGame}
        >
          {t.startDecoding}
        </Button>

        <Button
          type="button"
          variant="secondary"
          disabled={isUpdating}
          onClick={onLeaveLobby}
        >
          {t.leaveLobby}
        </Button>
      </div>

      <p className={styles.queueInfo}>
		{t.currentReadyPlayers} <strong>{readyPlayersCount}</strong> {t.currentReadyPoint}
		{t.requiredReadyPlayersPrefix} <strong>2</strong> {t.requiredReadyPlayersSuffix}
      </p>

      {message ? <p className={styles.message}>{message}</p> : null}
    </Card>
  );
}
