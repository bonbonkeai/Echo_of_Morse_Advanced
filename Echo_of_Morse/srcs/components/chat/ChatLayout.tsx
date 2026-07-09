
//* The layout for the entire chat page
//* Including the friend list, system messages, and the active chat window.
//* New add: GET /api/system-messages, get sys messages from the DB.

"use client";
import { useI18n } from "@/lib/i18n";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type {
  ChatMessage,
  ChatMode,
  ChatPanelView,
  Friend,
  SearchableUser,
  SystemMessage,
} from "@/types/chat";
import FriendList from "./FriendList";
import ChatWindow from "./ChatWindow";
import SystemMessageWindow from "./SystemMessageWindow";
import { transformChatMessage } from "@/lib/chat-transform";
import styles from "./css/ChatLayout.module.css";
import { useSession } from "next-auth/react";
import { mapChatModeToDB } from "@/lib/mappers/chat-mode";
import { useSocket } from "@/providers/socket-provider";
import { useNotifications } from "@/components/notifications/NotificationProvider";
import { isGameInvitationExpired } from "@/lib/game-invitation-expiration";
import RadioWavePickerModal from "@/components/competition/RadioLobbyPage/RadioWavePickerModal";
import type { RadioId } from "@/types/competition";
import {
  GameInvitationActionError,
  useGameInvitationActions,
} from "@/hooks/useGameInvitationActions";

type ApiMessage = {
  id: string;
  conversationId: string;
  senderId: string;
  rawText: string;
  translatedText: string | null;
  mode: ChatMessage["mode"];
  createdAt: string;
};

type ApiSystemMessage = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  isRead: boolean;
  kind?: SystemMessage["kind"] | null;
  invitationId?: string | null;
  fromUserId?: string | null;
  radioId?: string | null;
  actionStatus?: SystemMessage["actionStatus"] | null;
  i18nKey?: string | null;
  i18nParams?: Record<string, string> | null;
};

type InvitationActionStatus = NonNullable<SystemMessage["actionStatus"]>;

type ActiveConversation = {
  friendId: string;
  id: string;
};

type SelectFriendOptions = {
  updateUrl?: boolean;
};

type FriendWithOptionalGameStatus = Friend & {
  gameStatus?: "IDLE" | "READY" | "PLAYING" | null;
  lobbyStatus?: "IDLE" | "READY" | "PLAYING" | null;
  currentRadioId?: string | null;
};

type JoinRadioLobbyErrorResponse = {
  error?: string;
  code?: string;
  currentRadioId?: string | null;
  targetRadioId?: string | null;
};

function formatSystemMessageTime(createdAt: string) {
  return new Date(createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ChatLayout() {
	const { dictionary, language } = useI18n();
	const t = dictionary.chatLayout;
	const radioT = dictionary.competitionRadio;

  const { data: session, status: sessionStatus } = useSession();
  const userId = session?.user?.id;
  const { socket } = useSocket();
  const router = useRouter();
  const searchParams = useSearchParams();
  const friendIdFromQuery = searchParams.get("friendId");
  const panelFromQuery = searchParams.get("panel");

  const { sendGameInvitation, answerGameInvitation } =
    useGameInvitationActions();

  const {
    pendingGameInvitations,
    pendingFriendRequests,
    friendUnreadCounts,
    unreadSystemMessageCount: globalUnreadSystemMessageCount,
    refreshNotifications,
    markFriendAsRead,
    markSystemNotificationsAsRead,
    removeGameInvitation,
  } = useNotifications();

  const [friends, setFriends] = useState<Friend[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentView, setCurrentView] = useState<ChatPanelView>({
    type: "none",
  });
  const [activeConversation, setActiveConversation] =
    useState<ActiveConversation | null>(null);
  const [chatMode, setChatMode] = useState<ChatMode>("LANGUAGE_TO_MORSE");
  const [friendSearchQuery, setFriendSearchQuery] = useState("");
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [userSearchResults, setUserSearchResults] = useState<SearchableUser[]>(
    []
  );
  const [isAddFriendOpen, setIsAddFriendOpen] = useState(false);

  const [systemMessages, setSystemMessages] = useState<SystemMessage[]>([]);

  const [invitationActionStatuses, setInvitationActionStatuses] = useState<
    Record<string, InvitationActionStatus>
  >({});

  const [pendingFriendRequestUserIds, setPendingFriendRequestUserIds] =
    useState<string[]>([]);
  const [pendingGameInviteFriendIds, setPendingGameInviteFriendIds] = useState<
    string[]
  >([]);
  const [composerError, setComposerError] = useState("");
  useEffect(() => { setComposerError(""); }, [language]);
  const [inviteTargetFriendId, setInviteTargetFriendId] = useState<
    string | null
  >(null);
  const suppressFriendQuerySelection = useRef(false);
  const pendingFriendUrlSync = useRef<string | null>(null);
  const conversationRequestId = useRef(0);
  const messageRequestId = useRef(0);

  const loadFriends = useCallback(async () => {
    if (!userId) {
      setSystemMessages([]);
      setFriends([]);
      return;
    }

    try {
      const res = await fetch(`/api/friends?userId=${userId}`);
      if (!res.ok) {
        setFriends([]);
        return;
      }

      const data = await res.json();

      setFriends(Array.isArray(data) ? data : []);
    } catch {
      setFriends([]);
    }
  }, [userId]);

  useEffect(() => {
    void loadFriends();
  }, [loadFriends]);

  const loadSystemMessages = useCallback(async () => {
    if (!userId) {
      setSystemMessages([]);
      return;
    }

    let response: Response;

    try {
      response = await fetch("/api/system-messages", {
        cache: "no-store",
      });
    } catch {
      setSystemMessages([]);
      return;
    }

    if (!response.ok) {
      setSystemMessages([]);
      return;
    }

    const data = (await response.json().catch(() => [])) as ApiSystemMessage[];

    setSystemMessages(
      data.map((message) => ({
        id: message.id,
        title: message.title,
        body: message.body,
        createdAt: formatSystemMessageTime(message.createdAt),
        isRead: message.isRead,
        kind: message.kind ?? undefined,
        invitationId: message.invitationId ?? undefined,
        fromUserId: message.fromUserId ?? undefined,
        radioId: message.radioId ?? undefined,
        actionStatus: message.actionStatus ?? undefined,
        i18nKey: message.i18nKey ?? undefined,
        i18nParams: message.i18nParams ?? undefined,
      }))
    );
  }, [userId]);


  // Load persisted system-message history from the backend.
  // Pending invitations are still merged separately because they are active actions.
  useEffect(() => {
    void loadSystemMessages();
  }, [loadSystemMessages]);

  useEffect(() => {
    if (!socket) {
      return;
    }

    const handleInvitationAnswered = () => {
      void loadSystemMessages();
    };

    socket.on("game-invitation:answered", handleInvitationAnswered);
    socket.on("game-invitation:updated", handleInvitationAnswered);
    socket.on("friend:request:new", handleInvitationAnswered);
    socket.on("friend:request:accepted", handleInvitationAnswered);
    socket.on("friend:removed", handleInvitationAnswered);

    return () => {
      socket.off("game-invitation:answered", handleInvitationAnswered);
      socket.off("game-invitation:updated", handleInvitationAnswered);
      socket.off("friend:request:new", handleInvitationAnswered);
      socket.off("friend:request:accepted", handleInvitationAnswered);
      socket.off("friend:removed", handleInvitationAnswered);
    };
  }, [loadSystemMessages, socket]);

  useEffect(() => {
    if (!socket) {
      return;
    }

    const handleOnlineUsers = (onlineUserIds: string[]) => {
      const onlineUserIdSet = new Set(onlineUserIds);

      setFriends((currentFriends) =>
        currentFriends.map((friend) => ({
          ...friend,
          isOnline: onlineUserIdSet.has(friend.id),
        }))
      );
    };

    socket.on("online-users", handleOnlineUsers);
    socket.on("friend:presence-updated", loadFriends);
    socket.on("friend:request:accepted", loadFriends);
    socket.on("friend:removed", loadFriends);

    return () => {
      socket.off("online-users", handleOnlineUsers);
      socket.off("friend:presence-updated", loadFriends);
      socket.off("friend:request:accepted", loadFriends);
      socket.off("friend:removed", loadFriends);
    };
  }, [loadFriends, socket]);

  const selectedFriendId =
    currentView.type === "friend" ? currentView.friendId : null;

  useEffect(() => {
    if (
      sessionStatus !== "authenticated" ||
      !userId ||
      !activeConversation ||
      activeConversation.friendId !== selectedFriendId
    ) {
      return;
    }

    const requestId = messageRequestId.current + 1;
    messageRequestId.current = requestId;
    const conversation = activeConversation;

    const loadMessages = async () => {
      try {
        const res = await fetch(
          `/api/messages?conversationId=${conversation.id}`
        );

        if (messageRequestId.current !== requestId) {
          return;
        }

        if (!res.ok) {
          setMessages((current) =>
            current.filter(
              (message) => message.friendId !== conversation.friendId
            )
          );
          return;
        }

        const data = await res.json();

        if (messageRequestId.current !== requestId) {
          return;
        }

        const nextMessages: ChatMessage[] = Array.isArray(data)
          ? data.map((message: ApiMessage) => ({
              id: message.id,
              friendId: conversation.friendId,
              sender: message.senderId === userId ? "me" : "friend",
              rawText: message.rawText,
              translatedText: message.translatedText ?? undefined,
              mode: message.mode,
              createdAt: new Date(message.createdAt).toLocaleTimeString(),
            }))
          : [];

        setMessages((current) => [
          ...current.filter(
            (message) => message.friendId !== conversation.friendId
          ),
          ...nextMessages,
        ]);
      } catch {
        if (messageRequestId.current !== requestId) {
          return;
        }

        setMessages((current) =>
          current.filter(
            (message) => message.friendId !== conversation.friendId
          )
        );
      }
    };

    void loadMessages();
  }, [activeConversation, selectedFriendId, sessionStatus, userId]);

  useEffect(() => {
    if (!socket || !userId) {
      return;
    }

    function handleNewMessage(message: ApiMessage) {
      if (message.senderId === userId) {
        return;
      }

      if (selectedFriendId === message.senderId) {
        markFriendAsRead(message.senderId);
      }

      setMessages((current) => {
        if (current.some((item) => item.id === message.id)) {
          return current;
        }

        return [
          ...current,
          {
            id: message.id,
            friendId: message.senderId,
            sender: "friend",
            rawText: message.rawText,
            translatedText: message.translatedText ?? undefined,
            mode: message.mode,
            createdAt: new Date(message.createdAt).toLocaleTimeString(),
          },
        ];
      });

      setFriends((current) =>
        current.map((friend) =>
          friend.id === message.senderId
            ? {
                ...friend,
                lastMessage: message.rawText,
                lastMessageAt: message.createdAt,
              }
            : friend
        )
      );
    }

    socket.on("chat:message:new", handleNewMessage);

    return () => {
      socket.off("chat:message:new", handleNewMessage);
    };
  }, [markFriendAsRead, selectedFriendId, socket, userId]);

  const friendsWithUnread = useMemo(
    () =>
      friends.map((friend) => ({
        ...friend,
        unreadCount: friendUnreadCounts[friend.id] ?? 0,
      })),
    [friends, friendUnreadCounts]
  );

  const selectedFriend = useMemo(() => {
    if (!selectedFriendId) {
      return null;
    }

    return (
      friendsWithUnread.find((friend) => friend.id === selectedFriendId) ?? null
    );
  }, [friendsWithUnread, selectedFriendId]);

  const selectedMessages = useMemo(() => {
    if (!selectedFriendId) {
      return [];
    }

    return messages.filter((message) => message.friendId === selectedFriendId);
  }, [messages, selectedFriendId]);

  const filteredFriends = useMemo(() => {
    const query = friendSearchQuery.trim();

    if (!query) {
      return friendsWithUnread;
    }

    return friendsWithUnread.filter(
      (friend) =>
        friend.displayName.includes(query) || friend.username.includes(query)
    );
  }, [friendsWithUnread, friendSearchQuery]);

  // Pending invitations stay action-oriented and are displayed above persisted
  // system-message history until they are accepted or declined.
  const gameInvitationMessages = useMemo<SystemMessage[]>(
    () =>
      pendingGameInvitations.map((invitation) => {
		const radioNameById: Record<string, string> = {
			"01": radioT.radioWave01,
			"02": radioT.radioWave02,
			"03": radioT.radioWave03,
		};
		const radioId = invitation.radio?.radioId;
		const radioName = radioId ? radioNameById[radioId] ?? t.radioLobbyFallback : t.radioLobbyFallback;

		return{
			id: `game-invitation:${invitation.id}`,
			title: t.newGameInvitationTitle,
			body: t.gameInvitationBody
						.replace("{username}", invitation.fromUser.username)
						.replace("{radioName}", radioName),
			createdAt: new Date(invitation.createdAt).toLocaleTimeString([], {
			hour: "2-digit",
			minute: "2-digit",
			}),
			isRead: false,
			kind: "game-invitation",
			invitationId: invitation.id,
			fromUserId: invitation.fromUser.id,
			radioId: invitation.radio?.radioId,
			actionStatus: invitationActionStatuses[invitation.id] ?? "idle",
		}
      }),
    [invitationActionStatuses, pendingGameInvitations, radioT, t]
  );

  const friendRequestMessages = useMemo<SystemMessage[]>(
    () =>
      pendingFriendRequests.map((request) => ({
        id: `friend-request:${request.id}`,
        title: t.friendRequestReceivedTitle,
        body: t.friendRequestReceivedBody.replace(
          "{username}",
          request.sender.username
        ),
        createdAt: new Date(request.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isRead: false,
        kind: "friend-request",
        friendshipId: request.id,
        fromUserId: request.sender.id,
        actionStatus: invitationActionStatuses[`friend:${request.id}`] ?? "idle",
      })),
    [invitationActionStatuses, pendingFriendRequests, t]
  );

  const visibleSystemMessages = useMemo(
    () => [...gameInvitationMessages, ...friendRequestMessages, ...systemMessages],
    [friendRequestMessages, gameInvitationMessages, systemMessages]
  );

  const unreadSystemMessageCount =
    globalUnreadSystemMessageCount +
    pendingGameInvitations.length +
    pendingFriendRequests.length;

  const incomingPendingInviteFriendIds = useMemo(
    () =>
      new Set(
        pendingGameInvitations
          .map((invitation) => invitation.fromUser.id)
          .filter(Boolean)
      ),
    [pendingGameInvitations]
  );

  function getCurrentTime() {
    return new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function addSystemMessage(title: string, body: string) {
    const next: SystemMessage = {
      id: crypto.randomUUID(),
      title,
      body,
      createdAt: getCurrentTime(),
      isRead: false,
    };

    setSystemMessages((prev) => [next, ...prev]);
  }

  function markSystemMessagesAsRead() {
    setSystemMessages((prev) =>
      prev.map((message) => ({
        ...message,
        isRead: true,
      }))
    );
  }

  function markGameInviteFriendAsPending(friendId: string) {
    setPendingGameInviteFriendIds((current) =>
      current.includes(friendId) ? current : [...current, friendId]
    );
  }

  function updateSystemMessage(
    messageId: string,
    patch: Partial<SystemMessage>
  ) {
    setSystemMessages((current) =>
      current.map((item) =>
        item.id === messageId
          ? {
              ...item,
              ...patch,
            }
          : item
      )
    );
  }

  function getFriendInviteDisabledReason(friend: Friend): string | null {
    const friendWithStatus = friend as FriendWithOptionalGameStatus;

    if (!friend.isOnline) {
      return t.friendOffline;
    }

    if (pendingGameInviteFriendIds.includes(friend.id)) {
      return t.gameInvitationAlreadyPending;
    }

    if (friend.hasPendingGameInvitation) {
      return t.friendHasPendingGameInvitation;
    }

    if (incomingPendingInviteFriendIds.has(friend.id)) {
      return t.friendAlreadyInvitedYou;
    }

    if (
      friendWithStatus.gameStatus === "PLAYING" ||
      friendWithStatus.lobbyStatus === "PLAYING"
    ) {
      return t.friendInGame;
    }

    if (friendWithStatus.lobbyStatus === "READY") {
      return t.friendReadyInLobby;
    }

    return null;
  }

  const inviteDisabledReasons = useMemo(() => {
    const reasons: Record<string, string | null> = {};

    for (const friend of friendsWithUnread) {
      reasons[friend.id] = getFriendInviteDisabledReason(friend);
    }

    return reasons;
  }, [
    friendsWithUnread,
    incomingPendingInviteFriendIds,
    pendingGameInviteFriendIds,
	t,
  ]);

  async function handleAnswerGameInvitation(
    message: SystemMessage,
    action: "accept" | "decline"
  ) {
    if (!message.invitationId) {
      return;
    }

    const pendingInvitation = pendingGameInvitations.find(
      (invitation) => invitation.id === message.invitationId
    );

    if (pendingInvitation && isGameInvitationExpired(pendingInvitation)) {
      removeGameInvitation(pendingInvitation.id);
      void refreshNotifications();
      return;
    }

    setInvitationActionStatuses((current) => ({
      ...current,
      [message.invitationId as string]: "updating",
    }));

    try {
      await answerGameInvitation({
        invitationId: message.invitationId,
        action,
        fallbackRadioId: message.radioId,
        fromUserId: message.fromUserId,
        expiresAt: pendingInvitation?.expiresAt,
        redirectOnAccept: true,
      });

      const actionStatus = action === "accept" ? "accepted" : "declined";

      setInvitationActionStatuses((current) => ({
        ...current,
        [message.invitationId as string]: actionStatus,
      }));

      await loadSystemMessages();
    } catch (error) {
      if (
        error instanceof GameInvitationActionError &&
        error.status === 410
      ) {
        removeGameInvitation(message.invitationId);
        setInvitationActionStatuses((current) => ({
          ...current,
          [message.invitationId as string]: "expired",
        }));
        return;
      }

      setInvitationActionStatuses((current) => ({
        ...current,
        [message.invitationId as string]: "error",
      }));

	window.alert(t.failedToUpdateInvitation);
    }
  }

  async function handleAnswerFriendRequest(
    message: SystemMessage,
    action: "accept" | "decline"
  ) {
    if (!message.friendshipId) {
      return;
    }

    const statusKey = `friend:${message.friendshipId}`;

    setInvitationActionStatuses((current) => ({
      ...current,
      [statusKey]: "updating",
    }));

    try {
      const response = await fetch(`/api/friends/${message.friendshipId}`, {
        method: action === "accept" ? "PUT" : "DELETE",
        headers:
          action === "accept"
            ? {
                "Content-Type": "application/json",
              }
            : undefined,
        body:
          action === "accept"
            ? JSON.stringify({ status: "ACCEPTED" })
            : undefined,
      });

      if (!response.ok) {
        setInvitationActionStatuses((current) => ({
          ...current,
          [statusKey]: "error",
        }));
        window.alert(t.failedToUpdateFriendRequest);
        return;
      }

      setInvitationActionStatuses((current) => ({
        ...current,
        [statusKey]: action === "accept" ? "accepted" : "declined",
      }));

      await Promise.all([refreshNotifications(), loadFriends()]);
    } catch {
      setInvitationActionStatuses((current) => ({
        ...current,
        [statusKey]: "error",
      }));

      window.alert(t.failedToUpdateFriendRequest);
    }
  }


  // Join-lobby messages are created when a receiver accepts an invitation.
  // The sender joins only after clicking this action.
  async function handleJoinRadioLobbyFromSystemMessage(message: SystemMessage) {
    if (!message.radioId) {
      window.alert(t.systemMessageWithoutRadio);
      return;
    }

    updateSystemMessage(message.id, { actionStatus: "updating" });

    let response: Response;

    try {
      response = await fetch(`/api/competition/radio/${message.radioId}`, {
        method: "POST",
      });
    } catch {
      updateSystemMessage(message.id, { actionStatus: "error" });

      window.alert(t.failedToJoinRadioLobby);
      return;
    }

    if (!response.ok) {
      const body = (await response
        .json()
        .catch(() => ({}))) as JoinRadioLobbyErrorResponse;

      //! A 在01, 邀请B 去02， B 接受了，然后现在A 收到系统信息
      //! TODO jdu: If the backend says the user is already in another lobby,
      //! show a clear Leave current lobby / switch lobby flow instead of only alerting.
      //! You can use:
      //! DELETE /api/competition/radio/[currentRadioId]
      //! POST /api/competition/radio/[targetRadioId]
      //! jdu follow-up: handled ALREADY_IN_OTHER_LOBBY by setting this message
      //! to switch-required with currentRadioId, then SystemMessageWindow shows
      //! Leave and join / Cancel actions. The switch action below calls DELETE
      //! current lobby first, then POST target lobby.
      if (
        response.status === 409 &&
        body.code === "ALREADY_IN_OTHER_LOBBY" &&
        body.currentRadioId
      ) {
        updateSystemMessage(message.id, {
          actionStatus: "switch-required",
          currentRadioId: body.currentRadioId,
          radioId: body.targetRadioId ?? message.radioId,
        });

        return;
      }

      updateSystemMessage(message.id, { actionStatus: "error" });

	  window.alert(t.failedToJoinRadioLobby);
      return;
    }

    router.push(`/competition/radio/${message.radioId}`);
  }

  async function handleSwitchRadioLobbyFromSystemMessage(
    message: SystemMessage
  ) {
    if (!message.currentRadioId || !message.radioId) {
      window.alert(t.systemMessageWithoutRadio);
      return;
    }

    updateSystemMessage(message.id, { actionStatus: "updating" });

    try {
      const leaveResponse = await fetch(
        `/api/competition/radio/${message.currentRadioId}`,
        {
          method: "DELETE",
        }
      );

      if (!leaveResponse.ok) {
        updateSystemMessage(message.id, { actionStatus: "error" });
        window.alert(t.failedToJoinRadioLobby);
        return;
      }

      const joinResponse = await fetch(
        `/api/competition/radio/${message.radioId}`,
        {
          method: "POST",
        }
      );

      if (!joinResponse.ok) {
        const body = (await joinResponse
          .json()
          .catch(() => ({}))) as JoinRadioLobbyErrorResponse;

        updateSystemMessage(message.id, { actionStatus: "error" });
        window.alert(body.error ?? t.failedToJoinRadioLobby);
        return;
      }

      router.push(`/competition/radio/${message.radioId}`);
    } catch {
      updateSystemMessage(message.id, { actionStatus: "error" });

      window.alert(t.failedToJoinRadioLobby);
    }
  }

  function handleCancelRadioLobbySwitch(message: SystemMessage) {
    updateSystemMessage(message.id, {
      actionStatus: "idle",
      currentRadioId: undefined,
    });
  }

  function isDuplicateDisplayName(
    nextDisplayName: string,
    currentFriendId?: string
  ) {
    const trimmed = nextDisplayName.trim();

    return friends.some((friend) => {
      if (friend.id === currentFriendId) {
        return false;
      }

      return friend.displayName.trim() === trimmed;
    });
  }

  // Opening the system panel marks persisted system messages as read
  // on both the local UI and the backend unread counter.
  async function handleSelectSystemMessages() {
    conversationRequestId.current += 1;
    messageRequestId.current += 1;
    pendingFriendUrlSync.current = null;
    setComposerError("");
    suppressFriendQuerySelection.current = true;
    router.replace("/chat?panel=system", { scroll: false });
    setActiveConversation(null);
    setCurrentView({ type: "system" });

    try {
      await Promise.all([refreshNotifications(), loadSystemMessages()]);
    } finally {
      markSystemMessagesAsRead();
      await markSystemNotificationsAsRead();
      await refreshNotifications();
    }
  }

  async function handleOpenSystemMessagesWithoutMarkingRead() {
    conversationRequestId.current += 1;
    messageRequestId.current += 1;
    pendingFriendUrlSync.current = null;
    setComposerError("");
    setActiveConversation(null);
    setCurrentView({ type: "system" });

    try {
      await Promise.all([refreshNotifications(), loadSystemMessages()]);
    } catch {
      setSystemMessages([]);
    }
  }

  useEffect(() => {
    if (panelFromQuery !== "system") {
      return;
    }

    suppressFriendQuerySelection.current = false;
    void handleOpenSystemMessagesWithoutMarkingRead();
  }, [panelFromQuery]);

  function handleChangeChatMode(mode: ChatMode) {
    setChatMode(mode);
    setComposerError("");
  }

  const handleSelectFriend = useCallback(
    async (friendId: string, options: SelectFriendOptions = {}) => {
      const updateUrl = options.updateUrl ?? true;
      const requestId = conversationRequestId.current + 1;
      conversationRequestId.current = requestId;
      messageRequestId.current += 1;
      setComposerError("");
      suppressFriendQuerySelection.current = false;

      if (updateUrl) {
        pendingFriendUrlSync.current = friendId;
        router.replace(`/chat?friendId=${encodeURIComponent(friendId)}`, {
          scroll: false,
        });
      }

      markFriendAsRead(friendId);
      setCurrentView({
        type: "friend",
        friendId,
      });
      setActiveConversation(null);

      let res: Response;

      try {
        res = await fetch("/api/conversations", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userBId: friendId,
          }),
        });
      } catch {
        if (conversationRequestId.current !== requestId) {
          return;
        }

        setComposerError(t.failedToOpenConversation);
        return;
      }

      const data = await res.json().catch(() => ({}));

      if (conversationRequestId.current !== requestId) {
        return;
      }

      if (!res.ok || !data.id) {
		setComposerError(t.failedToOpenConversation);

        return;
      }

      setActiveConversation({
        friendId,
        id: data.id,
      });
    },
    [markFriendAsRead, router, t]
  );

  useEffect(() => {
    if (
      !friendIdFromQuery ||
      panelFromQuery === "system" ||
      suppressFriendQuerySelection.current
    ) {
      return;
    }

    if (pendingFriendUrlSync.current) {
      if (friendIdFromQuery === pendingFriendUrlSync.current) {
        pendingFriendUrlSync.current = null;
      }

      return;
    }

    const friendExists = friends.some(
      (friend) => friend.id === friendIdFromQuery
    );

    if (!friendExists) {
      return;
    }

    if (
      currentView.type === "friend" &&
      currentView.friendId === friendIdFromQuery
    ) {
      return;
    }

    void handleSelectFriend(friendIdFromQuery, { updateUrl: false });
  }, [
    currentView,
    friendIdFromQuery,
    friends,
    handleSelectFriend,
    panelFromQuery,
  ]);

  function handleSearchUsers(query: string) {
    setUserSearchQuery(query);

    const trimmed = query.trim();

    if (!trimmed) {
      setUserSearchResults([]);
      return;
    }

    const fetchUsers = async () => {
      try {
        const res = await fetch(`/api/users/search?query=${trimmed}`);
        if (!res.ok) {
          setUserSearchResults([]);
          return;
        }

        const data = await res.json();

        setUserSearchResults(Array.isArray(data) ? data : []);
      } catch {
        setUserSearchResults([]);
      }
    };

    void fetchUsers();
  }

  function handleToggleAddFriend() {
    const nextIsOpen = !isAddFriendOpen;

    setIsAddFriendOpen(nextIsOpen);

    if (!nextIsOpen) {
      setUserSearchQuery("");
      setUserSearchResults([]);
    }
  }

  async function handleSendFriendRequest(
    user: SearchableUser
  ): Promise<boolean> {
    if (friends.some((friend) => friend.id === user.id)) {
      window.alert(t.userAlreadyFriend);
      return false;
    }

    if (pendingFriendRequestUserIds.includes(user.id)) {
      window.alert(t.friendRequestAlreadySent);
      return false;
    }

    try {
      const res = await fetch("/api/friends", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          receiverId: user.id,
        }),
      });

      const body = await res.json().catch(() => null);

      if (res.status === 409 || body?.code === "FRIENDSHIP_ALREADY_EXISTS") {
        window.alert(t.friendRequestAlreadyExists);
        return false;
      }

      if (!res.ok) {
        window.alert(t.failedToSendFriendRequest);
        return false;
      }
    } catch {
      window.alert(t.networkError);
      return false;
    }

    setPendingFriendRequestUserIds((prev) => [...prev, user.id]);

    addSystemMessage(
      t.friendRequestSentTitle,
      t.friendRequestSentBody.replace("{displayName}", user.displayName)
    );

    return true;
  }

  async function handleRenameFriend(friendId: string, nextDisplayName: string) {
    const trimmed = nextDisplayName.trim();

    if (!trimmed) {
      window.alert(t.friendRemarkEmpty);
      return;
    }

    if (isDuplicateDisplayName(trimmed, friendId)) {
      window.alert(t.friendRemarkDuplicate);
      return;
    }

    const target = friends.find((friend) => friend.id === friendId);

    if (!target) {
      return;
    }

    try {
      const response = await fetch(`/api/friends/${friendId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ displayName: trimmed }),
      });

      if (!response.ok) {
        window.alert(t.failedToUpdateFriendRequest);
        return;
      }
    } catch {
      window.alert(t.networkError);
      return;
    }

    setFriends((prev) =>
      prev.map((friend) =>
        friend.id === friendId
          ? {
              ...friend,
              displayName: trimmed,
            }
          : friend
      )
    );

    addSystemMessage(
      t.friendRemarkUpdatedTitle,
      t.friendRemarkUpdatedBody
        .replace("{oldName}", target.displayName)
        .replace("{newName}", trimmed)
    );
  }

  async function handleDeleteFriend(friendId: string) {
    const target = friends.find((friend) => friend.id === friendId);

    if (!target) {
      return;
    }

    try {
      const response = await fetch(`/api/friends/${friendId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        window.alert(t.failedToUpdateFriendRequest);
        return;
      }
    } catch {
      window.alert(t.networkError);
      return;
    }

    setFriends((prev) => prev.filter((friend) => friend.id !== friendId));
    setMessages((prev) =>
      prev.filter((message) => message.friendId !== friendId)
    );
    setPendingGameInviteFriendIds((prev) =>
      prev.filter((id) => id !== friendId)
    );

    if (selectedFriendId === friendId) {
      conversationRequestId.current += 1;
      messageRequestId.current += 1;
      pendingFriendUrlSync.current = null;
      setActiveConversation(null);
      setCurrentView({
        type: "none",
      });
    }

    addSystemMessage(
      t.friendRemovedTitle,
      t.friendRemovedBody.replace("{displayName}", target.displayName)
    );
  }

  function handleInviteFriendToGame(friendId: string) {
    const invited = friends.find((friend) => friend.id === friendId);

    if (!invited) {
      return;
    }

    const disabledReason = getFriendInviteDisabledReason(invited);

    if (disabledReason) {
      window.alert(disabledReason);
      return;
    }

    setInviteTargetFriendId(friendId);
  }

  async function handleSelectInviteRadio(radioId: RadioId) {
    const invited = friends.find(
      (friend) => friend.id === inviteTargetFriendId
    );

    if (!invited || !userId) {
      setInviteTargetFriendId(null);
      return;
    }

    const disabledReason = getFriendInviteDisabledReason(invited);

    if (disabledReason) {
      window.alert(disabledReason);
      setInviteTargetFriendId(null);
      return;
    }

    try {
      await sendGameInvitation({
        toUserId: invited.id,
        radioId,
        redirectAfterSend: true,
      });

      markGameInviteFriendAsPending(invited.id);

      addSystemMessage(
        t.gameInvitationSentTitle,
		t.gameInvitationSentBody.replace("{displayName}", invited.displayName)
      );

      setInviteTargetFriendId(null);
    } catch (error) {
      if (error instanceof GameInvitationActionError && error.status === 409) {
        markGameInviteFriendAsPending(invited.id);
        window.alert(error.message);
        return;
      }
		window.alert(t.failedToSendInvitation);
    }
  }

  async function handleSendMessage(text: string): Promise<boolean> {
    if (!selectedFriend) {
      return false;
    }

    const transformed = transformChatMessage(text, chatMode);

	if (transformed.error) {
		if (transformed.error === "Message cannot be empty.") {
			setComposerError(t.emptyMessage);
		} else {
			setComposerError(t.invalidMorseInput);
		}

		return false;
	}

    if (!transformed.rawText) {
      return false;
    }

    setComposerError("");

    const dbMode = mapChatModeToDB(chatMode);

    if (
      !activeConversation ||
      activeConversation.friendId !== selectedFriend.id ||
      !userId
    ) {
      setComposerError(t.conversationNotReady);
      return false;
    }

    let response: Response;

    try {
      response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conversationId: activeConversation.id,
          rawText: transformed.rawText,
          translatedText: transformed.translatedText,
          mode: dbMode,
        }),
      });
    } catch {
      setComposerError(t.failedToSendMessage);
      return false;
    }

    const result = (await response.json().catch(() => ({}))) as {
      message?: ApiMessage;
      recipientId?: string;
      error?: string;
    };

    if (!response.ok || !result.message || !result.recipientId) {
		setComposerError(t.failedToSendMessage);
      return false;
    }

    setMessages((prev) => {
      if (prev.some((message) => message.id === result.message!.id)) {
        return prev;
      }

      return [
        ...prev,
        {
          id: result.message!.id,
          friendId: selectedFriend.id,
          sender: "me",
          rawText: result.message!.rawText,
          translatedText: result.message!.translatedText ?? undefined,
          mode: result.message!.mode,
          createdAt: new Date(result.message!.createdAt).toLocaleTimeString(),
        },
      ];
    });

    setFriends((current) =>
      current.map((friend) =>
        friend.id === selectedFriend.id
          ? {
              ...friend,
              lastMessage: result.message!.rawText,
              lastMessageAt: result.message!.createdAt,
            }
          : friend
      )
    );

    socket?.emit("chat:message:send", {
      senderId: userId,
      toUserId: result.recipientId,
      message: result.message,
    });

    return true;
  }

  function handleClosePanel() {
    conversationRequestId.current += 1;
    messageRequestId.current += 1;
    pendingFriendUrlSync.current = null;
    setComposerError("");
    suppressFriendQuerySelection.current = true;
    router.replace("/chat", { scroll: false });
    setActiveConversation(null);
    setCurrentView({
      type: "none",
    });
  }

  const hasOpenPanel = currentView.type !== "none";

  return (
    <section
      className={`${styles.layout} ${
        hasOpenPanel ? styles.withChat : styles.onlyFriendList
      }`}
    >
      <FriendList
        friends={filteredFriends}
        allFriends={friendsWithUnread}
        selectedFriendId={selectedFriendId ?? ""}
        systemMessages={visibleSystemMessages}
        unreadSystemMessageCount={unreadSystemMessageCount}
        isSystemPanelSelected={currentView.type === "system"}
        friendSearchQuery={friendSearchQuery}
        userSearchQuery={userSearchQuery}
        userSearchResults={userSearchResults}
        isAddFriendOpen={isAddFriendOpen}
        pendingFriendRequestUserIds={pendingFriendRequestUserIds}
        pendingGameInviteFriendIds={pendingGameInviteFriendIds}
        inviteDisabledReasons={inviteDisabledReasons}
        onSelectFriend={handleSelectFriend}
        onSelectSystemMessages={handleSelectSystemMessages}
        onChangeFriendSearchQuery={setFriendSearchQuery}
        onChangeUserSearchQuery={handleSearchUsers}
        onToggleAddFriend={handleToggleAddFriend}
        onSendFriendRequest={handleSendFriendRequest}
        onRenameFriend={handleRenameFriend}
        onDeleteFriend={handleDeleteFriend}
        onInviteFriendToGame={handleInviteFriendToGame}
      />

      {currentView.type === "friend" && selectedFriend ? (
        <ChatWindow
          friend={selectedFriend}
          messages={selectedMessages}
          chatMode={chatMode}
          composerError={composerError}
          onChangeChatMode={handleChangeChatMode}
          onSendMessage={handleSendMessage}
          onCloseChat={handleClosePanel}
        />
      ) : null}

      {currentView.type === "system" ? (
        <SystemMessageWindow
          messages={visibleSystemMessages}
          onClose={handleClosePanel}
          onAnswerGameInvitation={handleAnswerGameInvitation}
          onAnswerFriendRequest={handleAnswerFriendRequest}
          onJoinRadioLobby={handleJoinRadioLobbyFromSystemMessage}
          onSwitchRadioLobby={handleSwitchRadioLobbyFromSystemMessage}
          onCancelRadioLobbySwitch={handleCancelRadioLobbySwitch}
        />
      ) : null}

      <RadioWavePickerModal
        isOpen={inviteTargetFriendId !== null}
        targetDisplayName={
          friends.find((friend) => friend.id === inviteTargetFriendId)
            ?.displayName ?? ""
        }
        onClose={() => setInviteTargetFriendId(null)}
        onSelectRadio={handleSelectInviteRadio}
      />
    </section>
  );
}
