"use client";

import { useI18n } from "@/lib/i18n";
import { Card } from "@/components/ui";
import { RADIO_LOBBY_MAX_USERS } from "@/config/competition";
import type { RadioUser, RadioUserStatus } from "@/types/competition";
import styles from "@/../app/competition/radio/[radioId]/radio-lobby.module.css";

type LobbyUserListProps = {
  users: RadioUser[];
};

const statusClassByStatus: Record<RadioUserStatus, string> = {
  idle: styles.statusIdle,
  ready: styles.statusReady,
  playing: styles.statusPlaying,
};

export default function LobbyUserList({ users }: LobbyUserListProps) {
	const { dictionary } = useI18n();
	const t = dictionary.competitionRadio;

	const statusLabelByStatus: Record<RadioUserStatus, string> = {
		idle: t.inLobby,
		ready: t.ready,
		playing: t.playing,
	};

  const isLobbyFull = users.length >= RADIO_LOBBY_MAX_USERS;

  return (
    <Card className={styles.panel} aria-labelledby="lobby-users">
      <div className={styles.panelHeader}>
        <div>
          <h2 id="lobby-users" className={styles.panelTitle}>
            {t.usersInThisRadio}
          </h2>
          <p className={styles.panelText}>
            {t.seatsTaken
				.replace("{count}", String(users.length))
				.replace("{maxUsers}", String(RADIO_LOBBY_MAX_USERS))}{" "}
			{isLobbyFull ? t.lobbyFull : t.statusExplanation}
          </p>
        </div>
      </div>

      <div className={styles.userGrid}>
        {users.map((user) => (
          <article key={user.id} className={styles.userCard}>
            <span
              className={`${styles.statusDot} ${
                statusClassByStatus[user.status]
              }`}
              aria-label={statusLabelByStatus[user.status]}
              title={statusLabelByStatus[user.status]}
            />

            {user.avatarUrl ? (
              <img
                className={styles.avatarImage}
                src={user.avatarUrl}
                alt={t.avatarAlt.replace("{displayName}", user.displayName)}
              />
            ) : (
              <span className={styles.avatarFallback} aria-hidden="true">
                {user.avatarInitial}
              </span>
            )}

            <div className={styles.userInfo}>
              <p className={styles.username}>
                {user.displayName}
                {user.isCurrentUser ? ` (${t.you})` : ""}
              </p>
              <p className={styles.statusLabel}>
                {statusLabelByStatus[user.status]}
              </p>
            </div>
          </article>
        ))}
      </div>
    </Card>
  );
}
