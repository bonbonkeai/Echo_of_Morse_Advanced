// check the login, go query in DBmm and return id/username/avatar/online

export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query")?.trim() || "";

    if (!query) {
      return NextResponse.json([]);
    }

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const users = await prisma.user.findMany({
      where: {
        AND: [
          {
            NOT: {
              id: session.user.id,
            },
          },
          {
            OR: [
              {
                username: {
                  contains: query,
                  mode: "insensitive",
                },
              },
            ],
          },
        ],
      },
      select: {
        id: true,
        username: true,
        image: true,
        isOnline: true,
      },
      take: 10,
    });

    const formatted = users.map((u) => ({
      id: u.id,
      username: u.username,
      displayName: u.username,
      avatarUrl: u.image,
      isOnline: u.isOnline,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
