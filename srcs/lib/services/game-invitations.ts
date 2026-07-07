//* A helper to deal with the invitation time-out issues. 

import type { Prisma } from "@prisma/client";


// Game invitations are short-lived 
// so lobby state does not stay blocked by old requests.
export const GAME_INVITATION_TIMEOUT_MS = 60 * 1000;

type DbClient = Prisma.TransactionClient;

type ExpirableInvitation = {
  id: string;
  fromUserId: string;
  toUserId: string;
  createdAt: Date;
  fromUser: {
    username: string;
  };
  toUser: {
    username: string;
  };
  radioRoom: {
    radioId: string;
    name: string;
  } | null;
};

export function getGameInvitationExpiresAt(createdAt: Date) {
  return new Date(createdAt.getTime() + GAME_INVITATION_TIMEOUT_MS);
}

export function isGameInvitationExpired(createdAt: Date, now = new Date()) {
  return getGameInvitationExpiresAt(createdAt).getTime() <= now.getTime();
}


// Sysmultilangue: To frontend i18m key and params.
// Only the sender receives a persisted expiration message;
// the receiver simply loses the pending action.
function buildSenderExpiredMessage(invitation: ExpirableInvitation) {
  return {
    userId: invitation.fromUserId,
    title: "Game invitation expired",
    body: `${invitation.toUser.username} did not reply within 1 minute. Your invitation to ${
      invitation.radioRoom?.name ?? "a radio lobby"
    } has been cancelled.`,
    isRead: false,
    kind: "game-invitation",
    invitationId: invitation.id,
    fromUserId: invitation.toUserId,
    radioId: invitation.radioRoom?.radioId ?? null,
    actionStatus: "expired",
    i18nKey: "gameInvitation.expired.sender",
    i18nParams: {
      username: invitation.toUser.username,
    },
  };
}

// Sweep expired pending invitations whenever a user refreshes notifications or invitation data.
export async function expirePendingGameInvitationsForUser(
  transaction: DbClient,
  userId: string,
  now = new Date()
) {
  const expiredBefore = new Date(now.getTime() - GAME_INVITATION_TIMEOUT_MS);

  const invitations = await transaction.gameInvitation.findMany({
    where: {
      status: "PENDING",
      createdAt: {
        lte: expiredBefore,
      },
      OR: [{ fromUserId: userId }, { toUserId: userId }],
    },
    include: {
      fromUser: {
        select: { username: true },
      },
      toUser: {
        select: { username: true },
      },
      radioRoom: {
        select: {
          radioId: true,
          name: true,
        },
      },
    },
  });

  if (invitations.length === 0) {
    return [];
  }

  const invitationIds = invitations.map((invitation) => invitation.id);

  const updateResult = await transaction.gameInvitation.updateMany({
    where: {
      id: { in: invitationIds },
      status: "PENDING",
    },
    data: {
      status: "EXPIRED",
    },
  });

  if (updateResult.count === 0) {
    return [];
  }

  await transaction.systemMessage.createMany({
    data: invitations.map(buildSenderExpiredMessage),
  });

  return invitations;
}

// Used when a receiver tries to answer an invitation that has already timed out.
export async function expirePendingGameInvitationById(
  transaction: DbClient,
  invitation: ExpirableInvitation
) {
  const updateResult = await transaction.gameInvitation.updateMany({
    where: {
      id: invitation.id,
      status: "PENDING",
    },
    data: {
      status: "EXPIRED",
    },
  });

  if (updateResult.count === 0) {
    return false;
  }

  await transaction.systemMessage.create({
    data: buildSenderExpiredMessage(invitation),
  });

  return true;
}
