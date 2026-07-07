"use client";
import { useI18n } from "@/lib/i18n";
import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Button, Card } from "@/components/ui";
import { useSocket } from "@/providers/socket-provider";
import {
  filterActiveGameInvitations,
  getNextGameInvitationExpiryDelay,
  isGameInvitationExpired,
} from "@/lib/game-invitation-expiration";
import styles from "@/../app/competition/competition.module.css";
import {
  GameInvitationActionError,
  useGameInvitationActions,
} from "@/hooks/useGameInvitationActions";

type GameInvitation = {
  id: string;
  status?: string;
  expiresAt?: string;
  fromUser: {
    id: string;
    username: string;
    image: string | null;
  };
  radio: {
    radioId: string;
    name: string;
  } | null;
};

export default function ReceivedInvitations() {
	const { dictionary } = useI18n();
	const t = dictionary.competitionHome;
	
  const { status } = useSession();
  const { socket, isConnected } = useSocket();
  const { answerGameInvitation } = useGameInvitationActions();

  const [invitations, setInvitations] = useState<GameInvitation[]>([]);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadInvitations = useCallback(async () => {
    if (status !== "authenticated") {
      setInvitations([]);
      return;
    }

    let response: Response;

    try {
      response = await fetch("/api/game/invitations?direction=received", {
        cache: "no-store",
      });
    } catch {
      setInvitations([]);
      return;
    }

    if (!response.ok) {
      setInvitations([]);
      return;
    }

    const nextInvitations = (await response
      .json()
      .catch(() => [])) as GameInvitation[];

    setInvitations(filterActiveGameInvitations(nextInvitations));
  }, [status]);

  useEffect(() => {
    void loadInvitations();

    // Socket events refresh immediately; polling catches delayed events quickly.
    const intervalMs = isConnected ? 5000 : 3000;
    const intervalId = window.setInterval(() => {
      void loadInvitations();
    }, intervalMs);

    return () => window.clearInterval(intervalId);
  }, [isConnected, loadInvitations]);

  useEffect(() => {
    if (!socket) {
      return;
    }

    function handleInvitationEvent() {
      void loadInvitations();
    }

    socket.on("game-invitation:new", handleInvitationEvent);
    socket.on("game-invitation:updated", handleInvitationEvent);
    socket.on("game-invitation:answered", handleInvitationEvent);

    return () => {
      socket.off("game-invitation:new", handleInvitationEvent);
      socket.off("game-invitation:updated", handleInvitationEvent);
      socket.off("game-invitation:answered", handleInvitationEvent);
    };
  }, [loadInvitations, socket]);

  useEffect(() => {
    if (invitations.length === 0) {
      return;
    }

    const expiryDelay = getNextGameInvitationExpiryDelay(invitations);

    if (expiryDelay === null) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setInvitations((current) => filterActiveGameInvitations(current));
      void loadInvitations();
    }, expiryDelay);

    return () => window.clearTimeout(timeoutId);
  }, [invitations, loadInvitations]);

  async function answerInvitation(
    invitation: GameInvitation,
    action: "accept" | "decline"
  ) {
    if (isGameInvitationExpired(invitation)) {
      setInvitations((current) =>
        current.filter((item) => item.id !== invitation.id)
      );
      void loadInvitations();
      return;
    }

    setUpdatingId(invitation.id);

    try {
      await answerGameInvitation({
        invitationId: invitation.id,
        action,
        fallbackRadioId: invitation.radio?.radioId,
        fromUserId: invitation.fromUser.id,
        expiresAt: invitation.expiresAt,
        redirectOnAccept: true,
      });

      setInvitations((current) =>
        current.filter((item) => item.id !== invitation.id)
      );
    } catch (error) {
      // Expired invitations should disappear from the competition page immediately.
      if (
        error instanceof GameInvitationActionError &&
        error.status === 410
      ) {
        setInvitations((current) =>
          current.filter((item) => item.id !== invitation.id)
        );
        void loadInvitations();
        return;
      }
		window.alert(t.failedToAnswerInvitation);

    } finally {
      setUpdatingId(null);
    }
  }

  if (status !== "authenticated" || invitations.length === 0) {
    return null;
  }

  return (
    <Card className={styles.invitationPanel} aria-labelledby="game-invitations">
      <h2 id="game-invitations" className={styles.cardTitle}>
        {t.gameInvitations}
      </h2>

      <div className={styles.invitationList}>
        {invitations.map((invitation) => (
          <article key={invitation.id} className={styles.invitationItem}>
            <div>
              <strong>{invitation.fromUser.username}</strong>
              <p>
				{t.invitedYouTo.replace("{radioName}", invitation.radio?.name ?? t.unknownRadioLobby)}
              </p>
            </div>

            <div className={styles.invitationActions}>
              <Button
                type="button"
                size="sm"
                disabled={updatingId === invitation.id || !invitation.radio}
                onClick={() => answerInvitation(invitation, "accept")}
              >
               {t.accept}
              </Button>

              <Button
                type="button"
                size="sm"
                variant="secondary"
                disabled={updatingId === invitation.id}
                onClick={() => answerInvitation(invitation, "decline")}
              >
                {t.decline}
              </Button>
            </div>
          </article>
        ))}
      </div>
    </Card>
  );
}
