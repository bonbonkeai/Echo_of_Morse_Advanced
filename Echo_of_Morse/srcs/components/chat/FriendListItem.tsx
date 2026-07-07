"use client";

import Link from "next/link";
import { useState } from "react";
import type { MouseEvent } from "react";
import type { Friend } from "@/types/chat";
import FriendContextMenu from "./FriendContextMenu";
import styles from "./css/FriendListItem.module.css";
import { useI18n } from "@/lib/i18n";

type FriendListItemProps = {
  friend: Friend;
  isSelected: boolean;
  isGameInvitePending: boolean;
  inviteDisabledReason?: string | null;
  onInviteFriendToGame: (friendId: string) => void;
  onSelectFriend: (friendId: string) => void;
  onRenameFriend: (friendId: string, nextDisplayName: string) => void;
  onDeleteFriend: (friendId: string) => void;
};

function formatLastMessageTime(value: string) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function FriendListItem({
  friend,
  isSelected,
  isGameInvitePending,
  inviteDisabledReason,
  onSelectFriend,
  onRenameFriend,
  onDeleteFriend,
  onInviteFriendToGame,
}: FriendListItemProps) {
  const { dictionary } = useI18n();
  const t = dictionary.chat;

  const [menuPosition, setMenuPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const profileHref = `/users/${friend.id}`;
  const displayName = friend.displayName || friend.username || t.unknownUser;
  const avatarLetter =
    friend.avatarInitial || displayName.charAt(0).toUpperCase();

  const inviteButtonLabel = isGameInvitePending ? t.pending : t.invite;
  const unreadCount = friend.unreadCount ?? 0;
  const isInviteDisabled = Boolean(inviteDisabledReason);
  const lastMessageTime = formatLastMessageTime(friend.lastMessageAt);

  function handleContextMenu(event: MouseEvent<HTMLDivElement>) {
    event.preventDefault();

    setMenuPosition({
      x: event.clientX,
      y: event.clientY,
    });
  }

  function handleRename() {
    const nextDisplayName = window.prompt(t.newRemarkName, friend.displayName);

    if (!nextDisplayName?.trim()) {
      return;
    }

    onRenameFriend(friend.id, nextDisplayName.trim());
    setMenuPosition(null);
  }

  function handleDelete() {
    const confirmed = window.confirm(
      t.deleteFriendConfirm.replace("{displayName}", friend.displayName)
    );

    if (!confirmed) {
      return;
    }

    onDeleteFriend(friend.id);
    setMenuPosition(null);
  }

  function handleInviteToGame(event: MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();

    if (isInviteDisabled) {
      return;
    }

    onInviteFriendToGame(friend.id);
  }

  function handleOpenProfile(event: MouseEvent<HTMLAnchorElement>) {
    event.stopPropagation();
  }

  return (
    <>
      <div
        onContextMenu={handleContextMenu}
        onClick={() => onSelectFriend(friend.id)}
        className={`${styles.item} ${isSelected ? styles.selected : ""}`}
      >
        <div className={styles.profileTrigger}>
          <Link
            href={profileHref}
            className={styles.avatarLink}
            aria-label={t.viewProfile.replace("{displayName}", displayName)}
            onClick={handleOpenProfile}
          >
            {friend.avatarUrl ? (
              <img
                className={styles.avatarImage}
                src={friend.avatarUrl}
                alt={t.avatarAlt.replace("{displayName}", displayName)}
              />
            ) : (
              <span className={styles.avatarFallback}>{avatarLetter}</span>
            )}
          </Link>

          <div className={styles.profilePreview}>
            <div className={styles.previewHeader}>
              {friend.avatarUrl ? (
                <img
                  className={styles.previewAvatar}
                  src={friend.avatarUrl}
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
                  @{friend.username} · {friend.isOnline ? t.online : t.offline}
                </p>
              </div>
            </div>

            <p className={styles.previewText}>{t.openProfileHint}</p>
          </div>
        </div>

        <div className={styles.content}>
          <div className={styles.row}>
            <span className={styles.nameLink}>
              {displayName}
            </span>

            <span className={styles.time}>{lastMessageTime}</span>
          </div>

          <div className={styles.previewButton}>
            <span className={styles.preview}>{friend.lastMessage}</span>

            <span className={styles.previewMeta}>
              {unreadCount > 0 ? (
                <span
                  className={styles.unreadBadge}
                  aria-label={`${unreadCount} unread messages`}
                >
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              ) : null}

              <span
                className={`${styles.status} ${
                  friend.isOnline ? styles.online : styles.offline
                }`}
                aria-label={friend.isOnline ? t.online : t.offline}
              />
            </span>
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.inviteButton}
              disabled={isInviteDisabled}
              onClick={handleInviteToGame}
              title={inviteDisabledReason ?? t.inviteFriendToPlay}
            >
              {inviteButtonLabel}
            </button>
          </div>
        </div>
      </div>

      {menuPosition ? (
        <FriendContextMenu
          x={menuPosition.x}
          y={menuPosition.y}
          onClose={() => setMenuPosition(null)}
          onRename={handleRename}
          onDelete={handleDelete}
        />
      ) : null}
    </>
  );
}
