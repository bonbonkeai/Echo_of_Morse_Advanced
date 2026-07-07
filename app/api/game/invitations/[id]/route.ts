//* This API route handles accepting or declining game invitations.
//* PATCH to modify the status of an invitation.

import { NextRequest, NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/session-user";
import {
  expirePendingGameInvitationById,
  getGameInvitationExpiresAt,
  isGameInvitationExpired,
} from "@/lib/services/game-invitations";
import { getRadioUserState } from "@/lib/services/radio-user-state";
import { prisma } from "@/server/prisma";

type RouteContext = {
  params: {
    // [id] is the invitation ID from the URL.
    id: string;
  };
};

// Accept or decline an existing game invitation.
export async function PATCH(request: NextRequest, { params }: RouteContext) {
  const userId = await getSessionUserId();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    action?: "accept" | "decline";
  };

  // Only the two supported invitation actions are accepted.
  if (body.action !== "accept" && body.action !== "decline") {
    return NextResponse.json(
      { error: "action must be accept or decline" },
      { status: 400 }
    );
  }

  // Fetch the invitation along with the radio room and count of current presences
  const invitation = await prisma.gameInvitation.findUnique({
    where: { id: params.id },
    include: {
      fromUser: {
        select: { username: true },
      },
      toUser: {
        select: { username: true },
      },
      radioRoom: {
        include: {
          _count: {
            select: { lobbyPresences: true },
          },
        },
      },
    },
  });

  if (!invitation) {
    return NextResponse.json({ error: "Invitation not found" }, { status: 404 });
  }

  // Only the invited user can answer this invitation.
  if (invitation.toUserId !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // An invitation can only be answered once.
  if (invitation.status !== "PENDING") {
    const isExpired = invitation.status === "EXPIRED";

    return NextResponse.json(
      {
        error:
          isExpired
            ? "Invitation has expired."
            : "Invitation has already been answered",
        status: invitation.status.toLowerCase(),
      },
      { status: isExpired ? 410 : 409 }
    );
  }
  // If the row is still pending but its deadline has passed, expire it before answering.
  if (isGameInvitationExpired(invitation.createdAt)) {
    await prisma.$transaction(async (transaction) => {
      await expirePendingGameInvitationById(transaction, invitation);
    });

    return NextResponse.json(
      {
        error: "Invitation has expired.",
        status: "expired",
        expiresAt: getGameInvitationExpiresAt(invitation.createdAt),
      },
      { status: 410 }
    );
  }

  // now, decline -> change invitation status, creat two sys messages.
  if (body.action === "decline") {
    const declined = await prisma.$transaction(async (transaction) => {
      const updated = await transaction.gameInvitation.update({
        where: { id: invitation.id },
        data: { status: "DECLINED" },
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

      // the first message is for the receiver, the second is for the sender.
      // Sysmultilangue: refuse key
      await transaction.systemMessage.createMany({
        data: [
          {
            userId: updated.toUserId,
            title: "Game invitation declined",
            body: `You declined ${updated.fromUser.username}'s invitation to ${
              updated.radioRoom?.name ?? "a radio lobby"
            }.`,
            isRead: true,
            kind: "game-invitation",
            invitationId: updated.id,
            fromUserId: updated.fromUserId,
            radioId: updated.radioRoom?.radioId ?? null,
            actionStatus: "declined",
            i18nKey: "gameInvitation.declined.receiver",
            i18nParams: {
              username: updated.fromUser.username,
            },
          },
          {
            userId: updated.fromUserId,
            title: "Game invitation declined",
            body: `${updated.toUser.username} declined your invitation to ${
              updated.radioRoom?.name ?? "a radio lobby"
            }.`,
            isRead: false,
            kind: "game-invitation",
            invitationId: updated.id,
            fromUserId: updated.toUserId,
            radioId: updated.radioRoom?.radioId ?? null,
            actionStatus: "declined",
            i18nKey: "gameInvitation.declined.sender",
            i18nParams: {
              username: updated.toUser.username,
            },
          },
        ],
      });

      return updated;
    });

    return NextResponse.json({
      id: declined.id,
      status: declined.status.toLowerCase(),
      radio: declined.radioRoom,
    });
  }

  if (!invitation.radioRoom) {
    return NextResponse.json(
      { error: "The invited radio room no longer exists" },
      { status: 409 }
    );
  }

  try {
    const updated = await prisma.$transaction(async (transaction) => {
      const freshInvitation = await transaction.gameInvitation.findUnique({
        where: { id: invitation.id },
        include: {
          fromUser: {
            select: { username: true },
          },
          toUser: {
            select: { username: true },
          },
          radioRoom: {
            include: {
              _count: {
                select: { lobbyPresences: true },
              },
            },
          },
        },
      });

      if (!freshInvitation || freshInvitation.toUserId !== userId) {
        throw new Error("INVITATION_NOT_AVAILABLE");
      }

      if (freshInvitation.status !== "PENDING") {
        throw new Error("INVITATION_ALREADY_ANSWERED");
      }
      // Re-check inside the transaction so two fast clicks cannot accept an expired invite.
      if (isGameInvitationExpired(freshInvitation.createdAt)) {
        await expirePendingGameInvitationById(transaction, freshInvitation);
        throw new Error("INVITATION_EXPIRED");
      }

      if (!freshInvitation.radioRoom) {
        throw new Error("ROOM_NOT_FOUND");
      }

      const [targetState, senderState] = await Promise.all([
        getRadioUserState(transaction, userId),
        getRadioUserState(transaction, freshInvitation.fromUserId),
      ]);

      if (targetState.isPlaying) {
        throw new Error("TARGET_PLAYING");
      }

      if (targetState.isReady) {
        throw new Error("TARGET_READY");
      }

      if (senderState.isPlaying) {
        throw new Error("SENDER_PLAYING");
      }

      if (senderState.isReady) {
        throw new Error("SENDER_READY");
      }

      if (
        senderState.presence &&
        senderState.presence.roomId !== freshInvitation.radioRoom.id
      ) {
        throw new Error("SENDER_IN_OTHER_ROOM");
      }

      const existingPresence =
        targetState.presence?.roomId === freshInvitation.radioRoom.id;

      if (
        !existingPresence &&
        freshInvitation.radioRoom._count.lobbyPresences >=
          freshInvitation.radioRoom.maxUsers
      ) {
        throw new Error("ROOM_FULL");
      }

      await transaction.radioReadyQueue.deleteMany({
        where: {
          userId,
          roomId: { not: freshInvitation.radioRoom.id },
        },
      });

      await transaction.radioLobbyPresence.deleteMany({
        where: {
          userId,
          roomId: { not: freshInvitation.radioRoom.id },
          status: { not: "PLAYING" },
        },
      });

      // Accept and join the lobby.
      // The sender is not auto-joined when the invitation is sent.
      // After the receiver accepts, this actionable message lets the sender
      // explicitly join the lobby.
      await transaction.radioLobbyPresence.createMany({
        data: [
          {
            userId,
            roomId: freshInvitation.radioRoom.id,
          },
        ],
        skipDuplicates: true,
      });

      await transaction.radioLobbyPresence.updateMany({
        where: {
          userId,
          roomId: freshInvitation.radioRoom.id,
          status: { not: "PLAYING" },
        },
        data: { status: "IDLE" },
      });

      const updated = await transaction.gameInvitation.update({
        where: { id: freshInvitation.id },
        data: { status: "ACCEPTED" },
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

      // the first message is for the receiver, the second is for the sender.
      await transaction.systemMessage.createMany({
        data: [
          // Sysmultilangue: accept key
          {
            userId: updated.toUserId,
            title: "Game invitation accepted",
            body: `You accepted ${updated.fromUser.username}'s invitation to ${
              updated.radioRoom?.name ?? "a radio lobby"
            }.`,
            isRead: true,
            kind: "game-invitation",
            invitationId: updated.id,
            fromUserId: updated.fromUserId,
            radioId: updated.radioRoom?.radioId ?? null,
            actionStatus: "accepted",
            i18nKey: "gameInvitation.accepted.receiver",
            i18nParams: {
              username: updated.fromUser.username,
            },
          },
          {
            userId: updated.fromUserId,
            title: "Game invitation accepted",
            body: `${updated.toUser.username} accepted your invitation to ${
              updated.radioRoom?.name ?? "a radio lobby"
            }. Join the lobby when you are ready.`,
            isRead: false,
            kind: "join-lobby",
            invitationId: updated.id,
            fromUserId: updated.toUserId,
            radioId: updated.radioRoom?.radioId ?? null,
            actionStatus: "idle",
            i18nKey: "gameInvitation.accepted.sender",
            i18nParams: {
              username: updated.toUser.username,
            },
          },
        ],
      });

      return updated;
    });

    return NextResponse.json({
      id: updated.id,
      status: updated.status.toLowerCase(),
      radio: updated.radioRoom,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "INVITATION_ACCEPT_FAILED";

    const errors: Record<string, { error: string; status: number }> = {
      INVITATION_NOT_AVAILABLE: {
        error: "Invitation not found",
        status: 404,
      },
      INVITATION_ALREADY_ANSWERED: {
        error: "Invitation has already been answered",
        status: 409,
      },
      INVITATION_EXPIRED: {
        error: "Invitation has expired.",
        status: 410,
      },
      ROOM_NOT_FOUND: {
        error: "The invited radio room no longer exists",
        status: 409,
      },
      TARGET_PLAYING: {
        error: "You are currently in a game",
        status: 409,
      },
      TARGET_READY: {
        error: "You are already ready in a lobby",
        status: 409,
      },
      TARGET_IN_OTHER_ROOM: {
        error:
          "Leave your current radio room before accepting an invitation to another one",
        status: 409,
      },
      SENDER_PLAYING: {
        error: "The inviter is currently in a game",
        status: 409,
      },
      SENDER_READY: {
        error: "The inviter is already ready in a lobby",
        status: 409,
      },
      SENDER_IN_OTHER_ROOM: {
        error: "The inviter is now in another radio room",
        status: 409,
      },
      ROOM_FULL: {
        error: "Radio room is full",
        status: 409,
      },
    };

    if (errors[message]) {
      return NextResponse.json(
        { error: errors[message].error },
        { status: errors[message].status }
      );
    }

    console.error("PATCH /api/game/invitations/[id]", error);
    return NextResponse.json(
      { error: "Failed to update invitation" },
      { status: 500 }
    );
  }
}
