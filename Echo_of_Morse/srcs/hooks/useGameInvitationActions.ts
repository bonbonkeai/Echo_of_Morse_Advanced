"use client";

import { useI18n } from "@/lib/i18n";
import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useSocket } from "@/providers/socket-provider";
import { useNotifications } from "@/components/notifications/NotificationProvider";
import { isGameInvitationExpired } from "@/lib/game-invitation-expiration";
import type { RadioId } from "@/types/competition";

type ApiRadio = {
  radioId?: string;
  name?: string;
} | null;

type SendGameInvitationResult = {
  ok?: boolean;
  id?: string;
  error?: string;
  code?: string;
  status?: number;
  radio?: ApiRadio;
  [key: string]: unknown;
};

type AnswerGameInvitationResult = {
  id?: string;
  status?: string;
  error?: string;
  radio?: ApiRadio;
  [key: string]: unknown;
};

type SendGameInvitationArgs = {
  toUserId: string;
  radioId: RadioId;
  redirectAfterSend?: boolean;
};

type AnswerGameInvitationArgs = {
  invitationId: string;
  action: "accept" | "decline";
  fallbackRadioId?: string;
  fromUserId?: string;
  expiresAt?: string;
  redirectOnAccept?: boolean;
};

export class GameInvitationActionError extends Error {
  status?: number;
  body?: unknown;

  constructor(message: string, status?: number, body?: unknown) {
    super(message);
    this.name = "GameInvitationActionError";
    this.status = status;
    this.body = body;
  }
}

async function readJsonSafely<T>(response: Response): Promise<T> {
  try {
    return (await response.json()) as T;
  } catch {
    return {} as T;
  }
}

function getActionStatus(action: "accept" | "decline") {
  return action === "accept" ? "accepted" : "declined";
}

export function useGameInvitationActions() {
	const { dictionary } = useI18n();
	const t = dictionary.competitionRadio;
  const chatText = dictionary.chatLayout;

  const router = useRouter();
  const { data: session } = useSession();
  const { socket } = useSocket();
  const {
    removeGameInvitation,
    refreshNotifications,
  } = useNotifications();

  const currentUserId = session?.user?.id;

  const sendGameInvitation = useCallback(
    async ({
      toUserId,
      radioId,
      redirectAfterSend = false,
    }: SendGameInvitationArgs) => {
      const invitationResponse = await fetch("/api/game/invitations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          toUserId,
          radioId,
        }),
      });

      const invitationBody =
        await readJsonSafely<SendGameInvitationResult>(invitationResponse);

      if (!invitationResponse.ok || !invitationBody.id) {
        const messageByCode: Record<string, string> = {
          FRIEND_ALREADY_INVITED_YOU: chatText.friendAlreadyInvitedYou,
          INVITATION_ALREADY_PENDING: chatText.gameInvitationAlreadyPending,
          TARGET_INVITATION_ALREADY_PENDING:
            chatText.friendHasPendingGameInvitation,
        };
        const status =
          typeof invitationBody.status === "number"
            ? invitationBody.status
            : invitationResponse.status;

        throw new GameInvitationActionError(
          (invitationBody.code && messageByCode[invitationBody.code]) ||
            invitationBody.error ||
            t.failedToSendInvitation,
          status,
          invitationBody
        );
      }

      socket?.emit("game-invitation:send", {
        invitation: invitationBody,
        invitationId: invitationBody.id,
        toUserId,
        fromUserId: currentUserId,
      });

      await refreshNotifications();

      if (redirectAfterSend) {
        router.push(`/competition/radio/${radioId}`);
      }

      return invitationBody;
    },
    [
      chatText.friendAlreadyInvitedYou,
      chatText.gameInvitationAlreadyPending,
      chatText.friendHasPendingGameInvitation,
      currentUserId,
      refreshNotifications,
      router,
      socket,
      t.failedToSendInvitation,
    ]
  );

  const answerGameInvitation = useCallback(
    async ({
      invitationId,
      action,
      fallbackRadioId,
      fromUserId,
      expiresAt,
      redirectOnAccept = true,
    }: AnswerGameInvitationArgs) => {
      if (isGameInvitationExpired({ expiresAt })) {
        removeGameInvitation(invitationId);
        await refreshNotifications();

        throw new GameInvitationActionError(
          "Invitation has expired.",
          410,
          { status: "expired" }
        );
      }

      const response = await fetch(`/api/game/invitations/${invitationId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action,
        }),
      });

      const body = await readJsonSafely<AnswerGameInvitationResult>(response);

      if (!response.ok) {
        // HTTP 410 means the pending invitation timed out.
        // Remove it locally and notify the sender-side UI to refresh.
        if (response.status === 410 || body.status === "expired") {
          removeGameInvitation(invitationId);
          await refreshNotifications();

          socket?.emit("game-invitation:answered", {
            toUserId: fromUserId,
            invitationId,
            status: "expired",
          });
        }

        throw new GameInvitationActionError(
          body.error || t.failedToAnswerInvitation,
          response.status,
          body
        );
      }

      removeGameInvitation(invitationId);
      await refreshNotifications();

      socket?.emit("game-invitation:answered", {
        toUserId: fromUserId,
        invitationId,
        status: getActionStatus(action),
      });

      if (action === "accept" && redirectOnAccept) {
        const radioId = body.radio?.radioId ?? fallbackRadioId;

        if (radioId) {
          router.push(`/competition/radio/${radioId}`);
        }
      }

      return body;
    },
    [
      refreshNotifications,
      removeGameInvitation,
      router,
      socket,
      t.failedToAnswerInvitation,
    ]
  );

  return {
    sendGameInvitation,
    answerGameInvitation,
  };
}
