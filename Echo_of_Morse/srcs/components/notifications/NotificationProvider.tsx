"use client";
import { useI18n } from "@/lib/i18n";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useSession } from "next-auth/react";
import { useSocket } from "@/providers/socket-provider";
import {
  filterActiveGameInvitations,
  getNextGameInvitationExpiryDelay,
  isActiveGameInvitation,
} from "@/lib/game-invitation-expiration";
import type {
  FriendUnreadCounts,
  NotificationFriendMessage,
  NotificationFriendRequest,
  NotificationGameInvitation,
  NotificationsSnapshot,
} from "@/types/notifications";
import styles from "./notification-center.module.css";

type ToastNotification = {
  id: string;
  title: string;
  body: string;
  href?: string;
};

type NotificationContextType = {
  pendingGameInvitations: NotificationGameInvitation[];
  pendingGameInvitationCount: number;
  pendingFriendRequests: NotificationFriendRequest[];
  pendingFriendRequestCount: number;
  recentFriendMessages: NotificationFriendMessage[];
  friendUnreadCounts: FriendUnreadCounts;
  totalFriendUnreadCount: number;
  unreadSystemMessageCount: number;
  totalGlobalUnreadCount: number;
  refreshNotifications: () => Promise<void>;
  markFriendAsRead: (friendId: string) => void;
  markSystemNotificationsAsRead: () => Promise<void>;
  removeGameInvitation: (invitationId: string) => void;
};

const NotificationContext = createContext<NotificationContextType | null>(null);

function readJsonRecord(key: string): Record<string, number> {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const raw = window.localStorage.getItem(key);

    if (!raw) {
      return {};
    }

    const parsed = JSON.parse(raw) as Record<string, unknown>;

    return Object.fromEntries(
      Object.entries(parsed).filter(([, value]) => typeof value === "number")
    ) as Record<string, number>;
  } catch {
    return {};
  }
}

function writeJsonRecord(key: string, value: Record<string, number>) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

function isPendingInvitation(invitation: NotificationGameInvitation) {
  return isActiveGameInvitation(invitation);
}

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {

	const { dictionary } = useI18n();
	const t = dictionary.notification;
	const radioT = dictionary.competitionRadio;
	const radioNameById: Record<string, string> = useMemo(() => ({
		"01": radioT.radioWave01,
		"02": radioT.radioWave02,
		"03": radioT.radioWave03,
	}), [radioT]);


  const { status, data: session } = useSession();
  const { socket, isConnected } = useSocket();
  const userId = session?.user?.id;

  const [pendingGameInvitations, setPendingGameInvitations] = useState<
    NotificationGameInvitation[]
  >([]);

  const [recentFriendMessages, setRecentFriendMessages] = useState<
    NotificationFriendMessage[]
  >([]);
  const [pendingFriendRequests, setPendingFriendRequests] = useState<
    NotificationFriendRequest[]
  >([]);

  const [unreadSystemMessagesFromServer, setUnreadSystemMessagesFromServer] =
    useState(0);

  const [friendReadAt, setFriendReadAt] = useState<Record<string, number>>({});
  const [toast, setToast] = useState<ToastNotification | null>(null);

  const hasLoadedOnce = useRef(false);
  const knownInvitationIds = useRef<Set<string>>(new Set());
  const knownFriendRequestIds = useRef<Set<number>>(new Set());
  const knownMessageIds = useRef<Set<string>>(new Set());

  const friendReadStorageKey = userId
    ? `morse.friendReadAt.${userId}`
    : "morse.friendReadAt.anonymous";

  useEffect(() => {
    if (status !== "authenticated" || !userId) {
      setFriendReadAt({});
      return;
    }

    setFriendReadAt(readJsonRecord(friendReadStorageKey));
  }, [friendReadStorageKey, status, userId]);

  const clearNotificationState = useCallback(() => {
    setPendingGameInvitations([]);
    setPendingFriendRequests([]);
    setRecentFriendMessages([]);
    setUnreadSystemMessagesFromServer(0);

    hasLoadedOnce.current = false;
    knownInvitationIds.current = new Set();
    knownFriendRequestIds.current = new Set();
    knownMessageIds.current = new Set();
  }, []);

  const refreshNotifications = useCallback(async () => {
    if (status !== "authenticated") {
      clearNotificationState();
      return;
    }

    try {
      const response = await fetch("/api/notifications", {
        cache: "no-store",
      });

      if (!response.ok) {
        setPendingGameInvitations([]);
        setPendingFriendRequests([]);
        setRecentFriendMessages([]);
        setUnreadSystemMessagesFromServer(0);
        return;
      }

      const snapshot = (await response.json()) as NotificationsSnapshot;

      const pendingOnlyInvitations =
        snapshot.pendingGameInvitations.filter(isPendingInvitation);

      const nextInvitationIds = new Set(
        pendingOnlyInvitations.map((invitation) => invitation.id)
      );

      const nextMessageIds = new Set(
        snapshot.recentFriendMessages.map((message) => message.id)
      );
      const nextFriendRequestIds = new Set(
        snapshot.pendingFriendRequests.map((request) => request.id)
      );

      if (hasLoadedOnce.current) {
        const newestInvitation = pendingOnlyInvitations.find(
          (invitation) => !knownInvitationIds.current.has(invitation.id)
        );

        const newestMessage = snapshot.recentFriendMessages.find(
          (message) => !knownMessageIds.current.has(message.id)
        );
        const newestFriendRequest = snapshot.pendingFriendRequests.find(
          (request) => !knownFriendRequestIds.current.has(request.id)
        );

        if (newestInvitation) {
			const radioId = newestInvitation.radio?.radioId;
			const radioName = radioId
				? radioNameById[radioId] ?? t.radioLobbyFallback
				: t.radioLobbyFallback;

          setToast({
            id: `invite:${newestInvitation.id}`,
            title: t.newGameInvitationTitle,
            body: t.gameInvitationToastBody
					.replace("{username}", newestInvitation.fromUser.username)
					.replace("{radioName}", radioName),
            href: "/chat?panel=system",
          });
        } else if (newestFriendRequest) {
          setToast({
            id: `friend-request:${newestFriendRequest.id}`,
            title: t.newFriendRequestTitle,
            body: t.friendRequestToastBody.replace(
              "{username}",
              newestFriendRequest.sender.username
            ),
            href: "/chat?panel=system",
          });
        } else if (newestMessage) {
          setToast({
            id: `message:${newestMessage.id}`,
            title: t.newMessageFromTitle.replace( "{username}", newestMessage.senderUsername),
            body: newestMessage.rawText,
            href: `/chat?friendId=${newestMessage.senderId}`,
          });
        }
      }

      hasLoadedOnce.current = true;
      knownInvitationIds.current = nextInvitationIds;
      knownFriendRequestIds.current = nextFriendRequestIds;
      knownMessageIds.current = nextMessageIds;

      setPendingGameInvitations(pendingOnlyInvitations);
      setPendingFriendRequests(snapshot.pendingFriendRequests);
      setRecentFriendMessages(snapshot.recentFriendMessages);
      setUnreadSystemMessagesFromServer(snapshot.unreadSystemMessages);
    } catch {
      setPendingGameInvitations([]);
      setPendingFriendRequests([]);
      setRecentFriendMessages([]);
      setUnreadSystemMessagesFromServer(0);
    }
  }, [clearNotificationState, status, t, radioNameById]);

  useEffect(() => {
    void refreshNotifications();

    if (status !== "authenticated") {
      return;
    }

    // Keep polling frequent enough that missed Socket.IO events recover quickly.
    const intervalMs = isConnected ? 5000 : 3000;
    const intervalId = window.setInterval(() => {
      void refreshNotifications();
    }, intervalMs);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isConnected, refreshNotifications, status]);

  useEffect(() => {
    if (pendingGameInvitations.length === 0) {
      return;
    }

    const expiryDelay = getNextGameInvitationExpiryDelay(
      pendingGameInvitations
    );

    if (expiryDelay === null) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setPendingGameInvitations((current) =>
        filterActiveGameInvitations(current)
      );
      void refreshNotifications();
    }, expiryDelay);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [pendingGameInvitations, refreshNotifications]);

  useEffect(() => {
    if (!socket) {
      return;
    }

    const handleNotificationEvent = () => {
      void refreshNotifications();
    };

    socket.on("chat:message:new", handleNotificationEvent);
    socket.on("game-invitation:new", handleNotificationEvent);
    socket.on("game-invitation:updated", handleNotificationEvent);
    socket.on("game-invitation:answered", handleNotificationEvent);
    socket.on("friend:request:new", handleNotificationEvent);
    socket.on("friend:request:accepted", handleNotificationEvent);
    socket.on("friend:removed", handleNotificationEvent);

    return () => {
      socket.off("chat:message:new", handleNotificationEvent);
      socket.off("game-invitation:new", handleNotificationEvent);
      socket.off("game-invitation:updated", handleNotificationEvent);
      socket.off("game-invitation:answered", handleNotificationEvent);
      socket.off("friend:request:new", handleNotificationEvent);
      socket.off("friend:request:accepted", handleNotificationEvent);
      socket.off("friend:removed", handleNotificationEvent);
    };
  }, [refreshNotifications, socket]);

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setToast(null);
    }, 2000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [toast]);

  const friendUnreadCounts = useMemo(() => {
    const counts: FriendUnreadCounts = {};

    for (const message of recentFriendMessages) {
      const readAt = friendReadAt[message.senderId] ?? 0;
      const messageTime = new Date(message.createdAt).getTime();

      if (messageTime > readAt) {
        counts[message.senderId] = (counts[message.senderId] ?? 0) + 1;
      }
    }

    return counts;
  }, [friendReadAt, recentFriendMessages]);

  const totalFriendUnreadCount = useMemo(() => {
    return Object.values(friendUnreadCounts).reduce(
      (sum, count) => sum + count,
      0
    );
  }, [friendUnreadCounts]);

  const pendingGameInvitationCount = pendingGameInvitations.length;
  const pendingFriendRequestCount = pendingFriendRequests.length;

  const unreadSystemMessageCount = unreadSystemMessagesFromServer;

  const totalGlobalUnreadCount =
    totalFriendUnreadCount +
    unreadSystemMessageCount +
    pendingGameInvitationCount +
    pendingFriendRequestCount;

  const markFriendAsRead = useCallback(
    (friendId: string) => {
      setFriendReadAt((current) => {
        const next = {
          ...current,
          [friendId]: Date.now(),
        };

        writeJsonRecord(friendReadStorageKey, next);

        return next;
      });
    },
    [friendReadStorageKey]
  );

  const markSystemNotificationsAsRead = useCallback(async () => {
    setUnreadSystemMessagesFromServer(0);

    if (status !== "authenticated") {
      return;
    }

    let response: Response;

    try {
      response = await fetch("/api/system-messages/read-all", {
        method: "PATCH",
      });
    } catch {
      await refreshNotifications();
      return;
    }

    if (!response.ok) {
      await refreshNotifications();
      return;
    }
  }, [refreshNotifications, status]);

  const removeGameInvitation = useCallback((invitationId: string) => {
    setPendingGameInvitations((current) =>
      current.filter((invitation) => invitation.id !== invitationId)
    );
  }, []);

  const value = useMemo<NotificationContextType>(
    () => ({
      pendingGameInvitations,
      pendingGameInvitationCount,
      pendingFriendRequests,
      pendingFriendRequestCount,
      recentFriendMessages,
      friendUnreadCounts,
      totalFriendUnreadCount,
      unreadSystemMessageCount,
      totalGlobalUnreadCount,
      refreshNotifications,
      markFriendAsRead,
      markSystemNotificationsAsRead,
      removeGameInvitation,
    }),
    [
      pendingGameInvitations,
      pendingGameInvitationCount,
      pendingFriendRequests,
      pendingFriendRequestCount,
      recentFriendMessages,
      friendUnreadCounts,
      totalFriendUnreadCount,
      unreadSystemMessageCount,
      totalGlobalUnreadCount,
      refreshNotifications,
      markFriendAsRead,
      markSystemNotificationsAsRead,
      removeGameInvitation,
    ]
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}

      {toast ? (
        <a href={toast.href ?? "/chat"} className={styles.toast}>
          <strong className={styles.toastTitle}>{toast.title}</strong>
          <span className={styles.toastBody}>{toast.body}</span>
        </a>
      ) : null}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error("useNotifications must be used inside NotificationProvider");
  }

  return context;
}
