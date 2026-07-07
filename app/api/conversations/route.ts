//* API to get conversation between two friends.
//* If doesn't exist, creates a new conversation and returns it.

import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/session-user";
import { prisma } from "@/server/prisma";


export async function POST(request: Request) {
  const userId = await getSessionUserId();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    userBId?: string;
  };
  const friendId = body.userBId;

  if (!friendId || friendId === userId) {
    return NextResponse.json(
      { error: "A valid friend user ID is required" },
      { status: 400 }
    );
  }

  const friendship = await prisma.friendship.findFirst({
    where: {
      status: "ACCEPTED",
      OR: [
        { senderId: userId, receiverId: friendId },
        { senderId: friendId, receiverId: userId },
      ],
    },
    select: { id: true },
  });

  if (!friendship) {
    return NextResponse.json(
      { error: "An accepted friendship is required" },
      { status: 403 }
    );
  }

  // Make an order, to be sure there will not be double conversation.
  const [userAId, userBId] =
    userId < friendId ? [userId, friendId] : [friendId, userId];

  //upsert (update if exist, otherwise insert)
  const conversation = await prisma.conversation.upsert({
    where: {
      userAId_userBId: {
        userAId,
        userBId,
      },
    },
    create: {
      userAId,
      userBId,
    },
    update: {},
  });

  return NextResponse.json(conversation);
}
