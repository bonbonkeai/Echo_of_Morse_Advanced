// ! backend/frontend contract:
// This endpoint is currently used as the global notification snapshot.
// If the backend data model changes, keep the response shape aligned with
// srcs/types/notifications.ts.

import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/session-user";
import {
  expirePendingGameInvitationsForUser,
  getGameInvitationExpiresAt,
} from "@/lib/services/game-invitations";
import { prisma } from "@/server/prisma";

const MAX_RECENT_MESSAGES = 80;

export async function GET() {
  const userId = await getSessionUserId();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [
    unreadSystemMessages,
    pendingGameInvitations,
    pendingFriendRequests,
    recentMessages,
  ] =
    await prisma.$transaction(async (transaction) => {
      // Notification polling is 
      // also the fallback that turns timed-out invites into expired records.
      await expirePendingGameInvitationsForUser(transaction, userId);

      return Promise.all([
        transaction.systemMessage.count({
          where: {
            userId,
            isRead: false,
            OR: [
              { i18nKey: null },
              { i18nKey: { not: "friendRequest.received" } },
            ],
          },
        }),

        transaction.gameInvitation.findMany({
          where: {
            toUserId: userId,
            status: "PENDING",
          },
          orderBy: {
            createdAt: "desc",
          },
          include: {
            fromUser: {
              select: {
                id: true,
                username: true,
                image: true,
              },
            },
            toUser: {
              select: {
                id: true,
                username: true,
                image: true,
              },
            },
            radioRoom: {
              select: {
                radioId: true,
                name: true,
              },
            },
          },
        }),

        transaction.friendship.findMany({
          where: {
            receiverId: userId,
            status: "PENDING",
          },
          orderBy: {
            createdAt: "desc",
          },
          include: {
            sender: {
              select: {
                id: true,
                username: true,
                image: true,
              },
            },
          },
        }),

        transaction.message.findMany({
          where: {
            senderId: {
              not: userId,
            },
            conversation: {
              OR: [{ userAId: userId }, { userBId: userId }],
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          take: MAX_RECENT_MESSAGES,
          include: {
            sender: {
              select: {
                id: true,
                username: true,
                image: true,
              },
            },
          },
        }),
      ]);
    });

  return NextResponse.json({
    unreadSystemMessages,

    pendingGameInvitations: pendingGameInvitations.map((invitation) => ({
      id: invitation.id,
      status: invitation.status.toLowerCase(),
      createdAt: invitation.createdAt,
      expiresAt: getGameInvitationExpiresAt(invitation.createdAt),
      fromUser: invitation.fromUser,
      toUser: invitation.toUser,
      radio: invitation.radioRoom,
    })),

    pendingFriendRequests: pendingFriendRequests.map((request) => ({
      id: request.id,
      createdAt: request.createdAt,
      sender: request.sender,
    })),

    recentFriendMessages: recentMessages.map((message) => ({
      id: message.id,
      conversationId: message.conversationId,
      senderId: message.senderId,
      senderUsername: message.sender.username,
      senderImage: message.sender.image,
      rawText: message.rawText,
      translatedText: message.translatedText,
      mode: message.mode,
      createdAt: message.createdAt,
    })),
  });
}
