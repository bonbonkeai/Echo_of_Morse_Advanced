"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import LanguageSwitcher from "@/components/layout/language-switcher";
import styles from "./navbar.module.css";

import { signOut, useSession } from "next-auth/react";
import { useI18n } from "@/lib/i18n";
import { useNotifications } from "@/components/notifications/NotificationProvider";
import type { NotificationFriendMessage } from "@/types/notifications";

function formatBadgeCount(count: number) {
  return count > 99 ? "99+" : String(count);
}

type GroupedFriendNotification = {
  senderId: string;
  senderUsername: string;
  latestMessage: NotificationFriendMessage;
  count: number;
};

function groupUnreadFriendMessagesBySender(
  messages: NotificationFriendMessage[],
  unreadCounts: Record<string, number>
): GroupedFriendNotification[] {
  const grouped = new Map<string, GroupedFriendNotification>();

  for (const message of messages) {
    const unreadCount = unreadCounts[message.senderId] ?? 0;

    if (unreadCount <= 0) {
      continue;
    }

    const existing = grouped.get(message.senderId);

    if (!existing) {
      grouped.set(message.senderId, {
        senderId: message.senderId,
        senderUsername: message.senderUsername,
        latestMessage: message,
        count: unreadCount,
      });

      continue;
    }

    const existingTime = new Date(existing.latestMessage.createdAt).getTime();
    const nextTime = new Date(message.createdAt).getTime();

    if (nextTime > existingTime) {
      grouped.set(message.senderId, {
        ...existing,
        latestMessage: message,
      });
    }
  }

  return Array.from(grouped.values()).sort((a, b) => {
    const aTime = new Date(a.latestMessage.createdAt).getTime();
    const bTime = new Date(b.latestMessage.createdAt).getTime();

    return bTime - aTime;
  });
}

export default function Navbar() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated";

  const {
    totalGlobalUnreadCount,
    pendingGameInvitations,
    pendingFriendRequests,
    recentFriendMessages,
    friendUnreadCounts,
    unreadSystemMessageCount,
    markFriendAsRead,
    markSystemNotificationsAsRead,
  } = useNotifications();

  const { dictionary } = useI18n();
  const t = dictionary.layout;
  const radioT = dictionary.competitionRadio;

  const radioNameById: Record<string, string> = {
	"01": radioT.radioWave01,
	"02": radioT.radioWave02,
	"03": radioT.radioWave03,
	};

  const visibleGameInvitations = pendingGameInvitations.slice(0, 4);
  const visibleFriendRequests = pendingFriendRequests.slice(0, 4);

  const groupedFriendNotifications = groupUnreadFriendMessagesBySender(
    recentFriendMessages,
    friendUnreadCounts
  ).slice(0, 4);

  const hasVisibleNotifications =
    visibleGameInvitations.length > 0 ||
    visibleFriendRequests.length > 0 ||
    groupedFriendNotifications.length > 0 ||
    unreadSystemMessageCount > 0;

  return (
    <header className={styles.header}>
      <Link href="/" className={styles.logo}>
        {t.brand}
      </Link>

      <nav className={styles.nav} aria-label={t.mainNavigation}>
        <Link href="/dashboard" className={styles.navLink}>
          {t.dashboard}
        </Link>

        {isLoggedIn ? (
          <>
            <Link href="/profile" className={styles.navLink}>
              {t.profile}
            </Link>

            <span className={styles.userName}>
              {session.user?.name ?? session.user?.email ?? t.user}
            </span>

            <button
              type="button"
              className={styles.navButton}
              onClick={async () => {
                await signOut({ redirect: false });
                router.push("/");
                router.refresh();
              }}
            >
              {t.logout}
            </button>

            <div className={styles.notificationWrapper}>
              <details className={styles.notificationDetails}>
                <summary
                  className={styles.notificationTrigger}
                  aria-label={t.openNotifications}
                >
                  <span className={styles.notificationIcon}>🔔</span>

                  {totalGlobalUnreadCount > 0 ? (
                    <span className={styles.notificationBadge}>
                      {formatBadgeCount(totalGlobalUnreadCount)}
                    </span>
                  ) : null}
                </summary>

                <div className={styles.notificationPanel}>
                  <div className={styles.notificationHeader}>
                    <strong>{t.notifications}</strong>

                    {totalGlobalUnreadCount > 0 ? (
                      <span className={styles.notificationCount}>
                        {formatBadgeCount(totalGlobalUnreadCount)}
                      </span>
                    ) : null}
                  </div>

                  {!hasVisibleNotifications ? (
                    <p className={styles.emptyNotification}>
                      {t.noNewNotifications}
                    </p>
                  ) : null}

                  {visibleGameInvitations.length > 0 ? (
                    <div className={styles.notificationSection}>
                      <p className={styles.notificationSectionTitle}>
                        {t.gameInvitations}
                      </p>

                      {visibleGameInvitations.map((invitation) => {
						  const radioId = invitation.radio?.radioId;
						const radioName = radioId
							? radioNameById[radioId] ?? t.radioLobbyFallback
							: t.radioLobbyFallback;
						return (
                        <Link
                          key={invitation.id}
                          href="/chat?panel=system"
                          className={styles.notificationItem}
                        >
                          <span className={styles.notificationItemMain}>
                            <strong>{invitation.fromUser.username}</strong>
                            <span>
                              {t.invitedYouToRadio.replace("{radioName}", radioName)}
                            </span>
                          </span>

                          <span className={styles.notificationItemAction}>
                            {t.view}
                          </span>
                        </Link>
                      )
					  })}
                    </div>
                  ) : null}

                  {visibleFriendRequests.length > 0 ? (
                    <div className={styles.notificationSection}>
                      <p className={styles.notificationSectionTitle}>
                        {t.friendRequests}
                      </p>

                      {visibleFriendRequests.map((request) => (
                        <Link
                          key={request.id}
                          href="/chat?panel=system"
                          className={styles.notificationItem}
                        >
                          <span className={styles.notificationItemMain}>
                            <strong>{request.sender.username}</strong>
                            <span>{t.sentYouFriendRequest}</span>
                          </span>

                          <span className={styles.notificationItemAction}>
                            {t.view}
                          </span>
                        </Link>
                      ))}
                    </div>
                  ) : null}

                  {groupedFriendNotifications.length > 0 ? (
                    <div className={styles.notificationSection}>
                      <p className={styles.notificationSectionTitle}>
                        {t.messages}
                      </p>

                      {groupedFriendNotifications.map((group) => (
                        <Link
                          key={group.senderId}
                          href={`/chat?friendId=${group.senderId}`}
                          className={styles.notificationItem}
                          onClick={() => markFriendAsRead(group.senderId)}
                        >
                          <span className={styles.notificationItemMain}>
                            <span className={styles.notificationSenderRow}>
                              <strong>{group.senderUsername}</strong>

                              <span className={styles.messageCountBadge}>
                                {formatBadgeCount(group.count)}
                              </span>
                            </span>

                            <span>{group.latestMessage.rawText}</span>
                          </span>

                          <span className={styles.notificationItemAction}>
                            {t.view}
                          </span>
                        </Link>
                      ))}
                    </div>
                  ) : null}

                  {unreadSystemMessageCount > 0 ? (
                    <div className={styles.notificationSection}>
                      <p className={styles.notificationSectionTitle}>
                        {t.system}
                      </p>

                      <Link
                        href="/chat?panel=system"
                        className={styles.notificationItem}
                        onClick={markSystemNotificationsAsRead}
                      >
                        <span className={styles.notificationItemMain}>
                          <strong>{t.systemMessages}</strong>
                          <span>
                            {t.unreadSystemNotifications.replace("{count}", String(unreadSystemMessageCount))}
                          </span>
                        </span>

                        <span className={styles.notificationItemAction}>
                          {t.view}
                        </span>
                      </Link>
                    </div>
                  ) : null}
                </div>
              </details>
            </div>
          </>
        ) : (
          <Link href="/login" className={styles.navLink}>
            {t.login}
          </Link>
        )}

        <LanguageSwitcher />
      </nav>
    </header>
  );
}

/*
  Notification model:
  - Chat messages are cleared by friend read state.
  - System messages are cleared by read state.
  - Game invitations are cleared only by invitation status updates.
*/
