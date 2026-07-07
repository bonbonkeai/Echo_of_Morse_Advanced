// 显示当前好友头像、名称、状态和关闭按钮

import Link from "next/link";
import type { Friend } from "@/types/chat";
import styles from "./css/ChatHeader.module.css";
import { useI18n } from "@/lib/i18n";

type ChatHeaderProps = {
  friend: Friend;
  onCloseChat: () => void;
};

export default function ChatHeader({ friend, onCloseChat }: ChatHeaderProps) {
	const { dictionary } = useI18n();
	const t = dictionary.chat;

  const profileHref = `/users/${friend.id}`;
  const displayName = friend.displayName || friend.username;
  const avatarLetter = displayName.charAt(0).toUpperCase();
  const statusText = friend.isOnline ? t.online : t.offline;

  return (
    <header className={styles.header}>
      <div className={styles.friendArea}>
        <div className={styles.profileTrigger}>
          <Link
            href={profileHref}
            className={styles.avatarLink}
            aria-label={t.viewProfile.replace("{displayName}", displayName)}
          >
            {friend.image ? (
              <img
                className={styles.avatarImage}
                src={friend.image}
                alt={t.avatarAlt.replace("{displayName}", displayName)}
              />
            ) : (
              <span className={styles.avatarFallback}>{avatarLetter}</span>
            )}
          </Link>

          <Link href={profileHref} className={styles.nameLink}>
            {displayName}
          </Link>

          <div className={styles.profilePreview}>
            <div className={styles.previewHeader}>
              {friend.image ? (
                <img
                  className={styles.previewAvatar}
                  src={friend.image}
                  alt={t.avatarAlt.replace("{displayName}", displayName)}
                />
              ) : (
                <span className={styles.previewAvatarFallback}>
                  {avatarLetter}
                </span>
              )}

              <div>
                <p className={styles.previewName}>{displayName}</p>
                <p className={styles.previewStatus}>
                  @{friend.username} · {statusText}
                </p>
              </div>
            </div>

            <p className={styles.previewText}>
              {t.openProfileHint}
            </p>
          </div>
        </div>
      </div>

      <button
        type="button"
        className={styles.closeButton}
        onClick={onCloseChat}
        aria-label={t.closeChat}
      >
        ×
      </button>
    </header>
  );
}
