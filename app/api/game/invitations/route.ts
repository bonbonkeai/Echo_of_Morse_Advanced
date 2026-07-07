//* The API route for managing game invitations.
//* This route supports two operations:
//* GET: query pending invitations for the current user.
//* POST: create a new game invitation to invite a friend.

import { NextRequest, NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/session-user";
import {
  expirePendingGameInvitationsForUser,
  getGameInvitationExpiresAt,
} from "@/lib/services/game-invitations";
import { ensureInviterLobbyPresence } from "@/lib/services/invitation-lobby";
import { getRadioUserState } from "@/lib/services/radio-user-state";
import { prisma } from "@/server/prisma";

function isUniqueConstraintError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: unknown }).code === "P2002"
  );
}

// Get pending invitations sent or received by the current user.
export async function GET(request: NextRequest) {
  const userId = await getSessionUserId();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const direction = searchParams.get("direction") ?? "received";
  const radioId = searchParams.get("radioId");

  // Only the supported query directions are accepted.
  if (direction !== "sent" && direction !== "received") {
    return NextResponse.json(
      { error: "direction must be sent or received" },
      { status: 400 }
    );
  }

  const invitations = await prisma.$transaction(async (transaction) => {
    // Clear timed-out invitations first so the response only contains active actions.
    await expirePendingGameInvitationsForUser(transaction, userId);

    return transaction.gameInvitation.findMany({
      where: {
        status: "PENDING",
        // Filter by sender or receiver according to the requested direction.
        ...(direction === "sent"
          ? { fromUserId: userId }
          : { toUserId: userId }),
        // radioId is an optional filter.
        ...(radioId ? { radioRoom: { radioId } } : {}),
      },
      orderBy: { createdAt: "desc" },
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
    });
  });

  return NextResponse.json(
    invitations.map((invitation) => ({
      id: invitation.id,
      status: invitation.status.toLowerCase(),
      createdAt: invitation.createdAt,
      expiresAt: getGameInvitationExpiresAt(invitation.createdAt),
      fromUser: invitation.fromUser,
      toUser: invitation.toUser,
      radio: invitation.radioRoom,
    }))
  );
}

// Create a new invitation to join a radio lobby.
export async function POST(request: NextRequest) {
  // The sender identity always comes from the authenticated session.
  const fromUserId = await getSessionUserId();

  if (!fromUserId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    toUserId?: string;
    radioId?: string;
  };

  if (!body.toUserId || !body.radioId) {
    return NextResponse.json(
      { error: "toUserId and radioId are required" },
      { status: 400 }
    );
  }

  const toUserId = body.toUserId;

  if (toUserId === fromUserId) {
    return NextResponse.json(
      { error: "Cannot invite yourself" },
      { status: 400 }
    );
  }

  const [room, friendship, targetUser] = await Promise.all([
    prisma.radioRoom.findUnique({
      where: { radioId: body.radioId },
      include: {
        _count: {
          select: { lobbyPresences: true },
        },
      },
    }),
    prisma.friendship.findFirst({
      where: {
        status: "ACCEPTED",
        OR: [
          { senderId: fromUserId, receiverId: toUserId },
          { senderId: toUserId, receiverId: fromUserId },
        ],
      },
      select: { id: true },
    }),
    prisma.user.findUnique({
      where: { id: toUserId },
      select: { id: true, isOnline: true },
    }),
  ]);

  if (!room) {
    return NextResponse.json({ error: "Radio room not found" }, { status: 404 });
  }

  if (room._count.lobbyPresences >= room.maxUsers) {
    return NextResponse.json({ error: "Radio room is full" }, { status: 409 });
  }

  if (!friendship) {
    return NextResponse.json(
      { error: "Only accepted friends can be invited" },
      { status: 403 }
    );
  }

  if (!targetUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (!targetUser.isOnline) {
    return NextResponse.json({ error: "Friend is offline" }, { status: 409 });
  }
  // To avoid pending conflicts, request status of both sender & target
  // Search for their pending invitation status and wether they have other invitation.
  try {
    const invitation = await prisma.$transaction(async (transaction) => {
      // Expire old pending invitations before checking uniqueness rules.
      await Promise.all([
        expirePendingGameInvitationsForUser(transaction, fromUserId),
        expirePendingGameInvitationsForUser(transaction, toUserId),
      ]);

      const [
        senderState,
        targetState,
        existingInvitation,
        targetPending,
        lobbyUserCount,
      ] =
        await Promise.all([
          getRadioUserState(transaction, fromUserId),
          getRadioUserState(transaction, toUserId),
          transaction.gameInvitation.findFirst({
            where: {
              status: "PENDING",
              OR: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId },
              ],
            },
            select: { id: true, fromUserId: true, toUserId: true },
          }),
          transaction.gameInvitation.findFirst({
            where: {
              status: "PENDING",
              toUserId,
            },
            select: { id: true },
          }),
          transaction.radioLobbyPresence.count({
            where: { roomId: room.id },
          }),
        ]);

      if (senderState.isPlaying) {
        throw new Error("SENDER_PLAYING");
      }

      if (senderState.isReady) {
        throw new Error("SENDER_READY");
      }

      if (senderState.presence && senderState.presence.roomId !== room.id) {
        throw new Error("SENDER_IN_OTHER_ROOM");
      }

      if (targetState.isPlaying) {
        throw new Error("TARGET_PLAYING");
      }

      if (targetState.isReady) {
        throw new Error("TARGET_READY");
      }

      if (targetState.presence?.roomId === room.id) {
        throw new Error("TARGET_IN_SAME_ROOM");
      }

      if (
        existingInvitation?.fromUserId === toUserId &&
        existingInvitation.toUserId === fromUserId
      ) {
        throw new Error("FRIEND_ALREADY_INVITED_YOU");
      }

      if (existingInvitation) {
        throw new Error("INVITATION_ALREADY_PENDING");
      }

      if (targetPending) {
        throw new Error("TARGET_INVITATION_ALREADY_PENDING");
      }

      await ensureInviterLobbyPresence(transaction, {
        userId: fromUserId,
        roomId: room.id,
        inviterAlreadyPresent: senderState.presence?.roomId === room.id,
        lobbyUserCount,
        maxUsers: room.maxUsers,
      });

      return transaction.gameInvitation.create({
        data: {
          fromUserId,
          toUserId,
          radioRoomId: room.id,
        },
        select: {
          id: true,
          status: true,
          createdAt: true,
        },
      });
    });

    return NextResponse.json(
      {
        ...invitation,
        expiresAt: getGameInvitationExpiresAt(invitation.createdAt),
      },
      { status: 201 }
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "INVITATION_CREATE_FAILED";

    if (isUniqueConstraintError(error)) {
      return NextResponse.json(
        {
          ok: false,
          error: "Invitation already pending",
          code: "INVITATION_ALREADY_PENDING",
          status: 409,
        }
      );
    }

    const errors: Record<string, string> = {
      SENDER_PLAYING: "You are currently in a game",
      SENDER_READY: "You are already ready in a lobby",
      SENDER_IN_OTHER_ROOM:
        "Leave your current radio room before inviting friends to another one",
      TARGET_PLAYING: "Friend is currently in a game",
      TARGET_READY: "Friend is already ready in a lobby",
      TARGET_IN_SAME_ROOM: "Friend is already in this radio room",
      FRIEND_ALREADY_INVITED_YOU:
        "This friend has already invited you. Please accept or decline their invitation first.",
      INVITATION_ALREADY_PENDING: "Invitation already pending",
      TARGET_INVITATION_ALREADY_PENDING:
        "This friend already has a pending game invitation",
      ROOM_LACKS_INVITE_CAPACITY:
        "The radio room needs one free place for your friend",
    };

    if (errors[message]) {
      return NextResponse.json(
        { ok: false, error: errors[message], code: message, status: 409 }
      );
    }

    console.error("POST /api/game/invitations", error);
    return NextResponse.json(
      { error: "Failed to create invitation" },
      { status: 500 }
    );
  }
}
