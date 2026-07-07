// API Route: /api/friends
// GET: check query param userId, only allow fetching own friends list
// POST: send friend request
 
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notifyWs } from "@/lib/notifyWs";
import { prisma } from "@/server/prisma";
import { getFriends } from "@/lib/services/friends";
import { GAME_INVITATION_TIMEOUT_MS } from "@/lib/services/game-invitations";
 
// GET /api/friends?userId=123 - get friends list for userId
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
 
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
 
  const sessionUserId = (session.user as { id?: string } | undefined)?.id;
 
  if (!sessionUserId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
 
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
 
  if (!userId) {
    return NextResponse.json({ error: "userId required" }, { status: 400 });
  }
 
  // only allow fetching own friends list
  if (userId !== sessionUserId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
 
  const friends = await getFriends(userId);
  const friendIds = friends.map((friend) => friend.user.id);
  const activeInvitationCutoff = new Date(
    Date.now() - GAME_INVITATION_TIMEOUT_MS
  );

  const pendingInvitationTargets =
    friendIds.length === 0
      ? []
      : await prisma.gameInvitation.findMany({
          where: {
            status: "PENDING",
            toUserId: { in: friendIds },
            createdAt: { gt: activeInvitationCutoff },
          },
          select: {
            toUserId: true,
          },
        });
  const pendingInvitationTargetIds = new Set(
    pendingInvitationTargets.map((invitation) => invitation.toUserId)
  );
  const conversations =
    friendIds.length === 0
      ? []
      : await prisma.conversation.findMany({
          where: {
            OR: [
              {
                userAId: userId,
                userBId: { in: friendIds },
              },
              {
                userAId: { in: friendIds },
                userBId: userId,
              },
            ],
          },
          select: {
            userAId: true,
            userBId: true,
            messages: {
              orderBy: {
                createdAt: "desc",
              },
              take: 1,
              select: {
                rawText: true,
                createdAt: true,
              },
            },
          },
        });
  const latestMessageByFriendId = new Map<
    string,
    { rawText: string; createdAt: Date }
  >();

  for (const conversation of conversations) {
    const latestMessage = conversation.messages[0];

    if (!latestMessage) {
      continue;
    }

    const friendId =
      conversation.userAId === userId
        ? conversation.userBId
        : conversation.userAId;

    latestMessageByFriendId.set(friendId, latestMessage);
  }
 
  // give frontend game session info of my friend.
  const formatted = friends.map((friend) => {
    const user = friend.user;
    const latestMessage = latestMessageByFriendId.get(user.id);
    const activeSession = user.radioSessionPlayers[0] ?? null;
    const lobbyPresence = user.radioLobbyPresences[0] ?? null;
    const isPlaying =
      Boolean(activeSession) || lobbyPresence?.status === "PLAYING";
    const isReady = lobbyPresence?.status === "READY";

    return {
      id: user.id,
      friendshipId: friend.friendshipId,
      username: user.username,
      displayName: friend.displayName,
      avatarUrl: user.image,
      image: user.image,
      isOnline: user.isOnline,
      lastMessage: latestMessage?.rawText ?? "",
      lastMessageAt: latestMessage?.createdAt.toISOString() ?? "",
      gameStatus: isPlaying ? "PLAYING" : "IDLE",
      lobbyStatus: isPlaying
        ? "PLAYING"
        : isReady
          ? "READY"
          : lobbyPresence?.status ?? null,
      currentRadioId:
        activeSession?.session.room.radioId ??
        lobbyPresence?.room.radioId ??
        null,
      hasPendingGameInvitation: pendingInvitationTargetIds.has(user.id),
    };
  });
 
  return NextResponse.json(formatted);
}
 
// POST /api/friends - send friend request with body { receiverId: string }
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
 
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
 
    const senderId = (session.user as { id?: string } | undefined)?.id;
 
    if (!senderId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
 
    const body = await request.json();
    const { receiverId } = body as { receiverId?: string };
 
    if (!receiverId) {
      return NextResponse.json(
        { error: "receiverId is required" },
        { status: 400 }
      );
    }
 
    if (receiverId === senderId) {
      return NextResponse.json(
        { error: "You cannot send a friend request to yourself" },
        { status: 400 }
      );
    }
 
    // check if friendship already exists in either direction
    const existing = await prisma.friendship.findFirst({
      where: {
        OR: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      },
    });
 
    if (existing) {
      return NextResponse.json(
        { ok: false, code: "FRIENDSHIP_ALREADY_EXISTS", error: "Friendship already exists" }
      );
    }
 
    // create friendship with status PENDING
    const friendship = await prisma.friendship.create({
      data: {
        senderId,
        receiverId,
        status: "PENDING",
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    await notifyWs("friend.request.created", {
      toUserId: receiverId,
      data: {
        friendshipId: friendship.id,
        fromUserId: senderId,
        username: friendship.sender.username,
      },
    });
 
    return NextResponse.json(friendship, { status: 201 });
  } catch (error) {
    console.error(error);
 
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
