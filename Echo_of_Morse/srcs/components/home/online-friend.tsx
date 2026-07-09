"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Card, Button } from "@/components/ui";
import buttonStyles from "@/components/ui/button.module.css";
import styles from "./online-friend.module.css";
import { useI18n } from "@/lib/i18n";
import { useSocket } from "@/providers/socket-provider";
import RadioWavePickerModal from "@/components/competition/RadioLobbyPage/RadioWavePickerModal";
import type { RadioId } from "@/types/competition";
import {
  GameInvitationActionError,
  useGameInvitationActions,
} from "@/hooks/useGameInvitationActions";

type ApiFriend = {
  id: string;
  username: string;
  avatarUrl: string | null;
  isOnline: boolean;
  hasPendingGameInvitation?: boolean;
};

type OnlineFriend = {
  id: string;
  username: string;
  avatarUrl: string | null;
  isOnline: boolean;
  hasPendingGameInvitation?: boolean;
};

type SentGameInvitation = {
  toUser: { id: string };
};

type ReceivedGameInvitation = {
  fromUser: { id: string };
};

export default function OnlineFriendsPreview() {
  const { dictionary } = useI18n();
  const t = dictionary.home;

  const { data: session, status } = useSession();
  const { socket } = useSocket();
  const { sendGameInvitation } = useGameInvitationActions();

  const currentUserId = (session?.user as { id?: string } | undefined)?.id;

  const [onlineFriends, setOnlineFriends] = useState<OnlineFriend[]>([]);
  const [isLoadingFriends, setIsLoadingFriends] = useState(false);
  const [presenceRevision, setPresenceRevision] = useState(0);

  const [pendingGameInviteFriendIds, setPendingGameInviteFriendIds] = useState<
    string[]
  >([]);
  const [inviteTargetFriendId, setInviteTargetFriendId] = useState<
    string | null
  >(null);

  useEffect(() => {
    if (status !== "authenticated" || !currentUserId) {
      setOnlineFriends([]);
      setPendingGameInviteFriendIds([]);
      return;
    }

    async function fetchOnlineFriends() {
      try {
        setIsLoadingFriends(true);

        const [
          friendsResponse,
          sentInvitationsResponse,
          receivedInvitationsResponse,
        ] = await Promise.all([
          fetch(`/api/friends?userId=${currentUserId}`),
          fetch("/api/game/invitations?direction=sent"),
          fetch("/api/game/invitations?direction=received"),
        ]);

        if (
          !friendsResponse.ok ||
          !sentInvitationsResponse.ok ||
          !receivedInvitationsResponse.ok
        ) {
          setOnlineFriends([]);
          setPendingGameInviteFriendIds([]);
          return;
        }

        const friends = (await friendsResponse.json()) as ApiFriend[];
        const sentInvitations =
          (await sentInvitationsResponse.json()) as SentGameInvitation[];
        const receivedInvitations =
          (await receivedInvitationsResponse.json()) as ReceivedGameInvitation[];

        const onlineOnly = friends.filter((friend) => friend.isOnline);

        setOnlineFriends(onlineOnly);
        setPendingGameInviteFriendIds([
          ...new Set([
            ...sentInvitations.map((invitation) => invitation.toUser.id),
            ...receivedInvitations.map(
              (invitation) => invitation.fromUser.id
            ),
            ...friends
              .filter((friend) => friend.hasPendingGameInvitation)
              .map((friend) => friend.id),
          ]),
        ]);
      } catch (error) {
        setOnlineFriends([]);
      } finally {
        setIsLoadingFriends(false);
      }
    }

    void fetchOnlineFriends();
  }, [status, currentUserId, presenceRevision]);

  useEffect(() => {
    if (!socket) {
      return;
    }

    const handleOnlineUsers = () => {
      setPresenceRevision((revision) => revision + 1);
    };

    socket.on("online-users", handleOnlineUsers);

    return () => {
      socket.off("online-users", handleOnlineUsers);
    };
  }, [socket]);

  function markFriendAsPending(friendId: string) {
    setPendingGameInviteFriendIds((current) =>
      current.includes(friendId) ? current : [...current, friendId]
    );
  }

  function handleInviteFriendToGame(friendId: string) {
    const alreadyPending = pendingGameInviteFriendIds.includes(friendId);

    if (alreadyPending) {
      window.alert(t.inviteAlreadyPending);
      return;
    }

    setInviteTargetFriendId(friendId);
  }

  async function handleSelectInviteRadio(radioId: RadioId) {
    const invited = onlineFriends.find(
      (friend) => friend.id === inviteTargetFriendId
    );

    if (!invited) {
      setInviteTargetFriendId(null);
      return;
    }

    try {
      await sendGameInvitation({
        toUserId: invited.id,
        radioId,
        redirectAfterSend: true,
      });

      markFriendAsPending(invited.id);
      setInviteTargetFriendId(null);
    } catch (error) {
      if (error instanceof GameInvitationActionError && error.status === 409) {
        markFriendAsPending(invited.id);
        window.alert(error.message);
        return;
      }
		window.alert(t.failedToSendInvitation);
    }
  }

  if (status === "loading") {
    return (
      <Card className={styles.card}>
        <h2 className={styles.title}>{t.onlineFriends}</h2>
        <p className={styles.description}>{t.checkingSession}</p>
      </Card>
    );
  }

  if (status !== "authenticated") {
    return null;
  }

  return (
    <Card className={styles.card}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>{t.onlineFriends}</h2>
          <p className={styles.description}>{t.onlineFriendsDescription}</p>
        </div>
      </div>

      {isLoadingFriends ? (
        <p className={styles.empty}>{t.loadingOnlineFriends}</p>
      ) : onlineFriends.length > 0 ? (
        <ul className={styles.list}>
          {onlineFriends.map((friend) => {
            const profileHref = `/users/${friend.id}`;
            const displayName = friend.username || t.unknownUser;
            const avatarLetter = displayName.charAt(0).toUpperCase();

            const isGameInvitePending = pendingGameInviteFriendIds.includes(
              friend.id
            );

            const inviteButtonLabel = isGameInvitePending
              ? t.pending
              : t.invite;

            return (
              <li key={friend.id} className={styles.item}>
                <Link href={profileHref} className={styles.profileLink}>
                  {friend.avatarUrl ? (
                    <img
                      className={styles.avatar}
                      src={friend.avatarUrl}
                      alt={t.avatarAlt.replace("{displayName}", displayName)}
                    />
                  ) : (
                    <span className={styles.avatarFallback}>
                      {avatarLetter}
                    </span>
                  )}

                  <span className={styles.identity}>
                    <span className={styles.name}>{displayName}</span>
                    <span className={styles.username}>@{friend.username}</span>
                  </span>
                </Link>

                <div className={styles.actions}>
                  <Link
                    href={`/chat?friendId=${encodeURIComponent(friend.id)}`}
                    className={styles.chatLink}
                  >
                    {t.chat}
                  </Link>

                  <Button
                    type="button"
                    variant="secondary"
                    disabled={isGameInvitePending}
                    onClick={() => handleInviteFriendToGame(friend.id)}
                  >
                    {inviteButtonLabel}
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className={styles.empty}>{t.noFriendsOnline}</p>
      )}

      <Link
        href="/chat"
        className={`${buttonStyles.button} ${buttonStyles.secondary} ${buttonStyles.sm} ${styles.viewAllButton}`}
      >
        {t.viewAllFriends}
      </Link>

      <RadioWavePickerModal
        isOpen={inviteTargetFriendId !== null}
        targetDisplayName={
          onlineFriends.find((friend) => friend.id === inviteTargetFriendId)
            ?.username ?? ""
        }
        onClose={() => setInviteTargetFriendId(null)}
        onSelectRadio={handleSelectInviteRadio}
      />
    </Card>
  );
}
