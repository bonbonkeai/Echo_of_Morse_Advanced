// API Route: /api/friends/requests
// GET: get pending friend requests I received

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/server/prisma";

// GET /api/friends/requests - get pending friend requests I received
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as { id?: string } | undefined)?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const requests = await prisma.friendship.findMany({
    where: {
      receiverId: userId,
      status: "PENDING",
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
    orderBy: {
      createdAt: "desc",
    },
  });

  const formatted = requests.map((req) => ({
    id: req.id,              // friendship id，to PUT /api/friends/[id] receive or refuse friend request
    senderId: req.senderId,
    senderUsername: req.sender.username,
    senderAvatarUrl: req.sender.image,
    createdAt: req.createdAt,
  }));

  return NextResponse.json(formatted);
}