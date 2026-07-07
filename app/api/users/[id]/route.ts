// API Route: /api/users/[id]
// This file handles all HTTP requests for a specific user by their id.
// It allows the frontend to retrieve and update user information.
// The [id] in the path is a dynamic parameter.
// Example: GET /api/users/abc123 will return the information of user with id abc123.

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/server/prisma";
import { authOptions } from "@/lib/auth";
import { toUserDTO } from "@/lib/mappers/user";

const MAX_PROFILE_IMAGE_SIZE = 500_000;

// GET /api/users/[id] - Get user information.
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        image: true,

        bio: true,
        learningLevel: true,

        isOnline: true,
        createdAt: true,
        lastSeen: true,

        accounts: {
          select: {
            provider: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // we can get a friend by receving and sending the invitation.
    // so count the sender and receiver.
    // Update the accuracy : correct / all practice * 100
    const [friendCount, letterStats] = await Promise.all([
      prisma.friendship.count({
        where: {
          status: "ACCEPTED",
          OR: [{ senderId: id }, { receiverId: id }],
        },
      }),
      prisma.userLetterProgress.aggregate({
        where: { userId: id },
        _sum: {
          correctCount: true,
          totalSeen: true,
        },
      }),
    ]);

    const totalSeen = letterStats._sum.totalSeen ?? 0;
    const totalCorrect = letterStats._sum.correctCount ?? 0;
    const accuracy =
      totalSeen === 0 ? null : Math.round((totalCorrect / totalSeen) * 100);

    return NextResponse.json({
      ...toUserDTO(user, friendCount),
      accuracy,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/users/[id] - Update user information.
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sessionUserId = (session.user as { id?: string } | undefined)?.id;

    if (!sessionUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const userId = id;

    if (sessionUserId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const contentType = request.headers.get("content-type") ?? "";
    let body: {
      username?: string;
      email?: string;
      image?: string;
      bio?: string;
    } = {};

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const imageFile = formData.get("image");

      body = {
        username: formData.get("username")?.toString(),
        email: formData.get("email")?.toString(),
        bio: formData.get("bio")?.toString(),
      };

      // The browser sends the selected avatar as multipart data to avoid WAF
      // false positives on large base64 strings inside JSON.
      if (imageFile instanceof File && imageFile.size > 0) {
        if (!imageFile.type.startsWith("image/")) {
          return NextResponse.json(
            { error: "Profile image must be an image file" },
            { status: 400 }
          );
        }

        if (imageFile.size > MAX_PROFILE_IMAGE_SIZE) {
          return NextResponse.json(
            { error: "Profile image is too large" },
            { status: 413 }
          );
        }

        const buffer = Buffer.from(await imageFile.arrayBuffer());
        body.image = `data:${imageFile.type};base64,${buffer.toString("base64")}`;
      }
    } else {
      body = (await request.json()) as {
        username?: string;
        email?: string;
        image?: string;
        bio?: string;
      };
    }

    const { username, email, image, bio } = body;

    const nextUsername =
      typeof username === "string" ? username.trim() : undefined;
    const nextEmail = typeof email === "string" ? email.trim().toLowerCase() : undefined;
    const nextImage = typeof image === "string" ? image : undefined;
    const nextBio = typeof bio === "string" ? bio.trim() : undefined;

    if (nextUsername !== undefined && nextUsername.length === 0) {
      return NextResponse.json(
        { error: "Username cannot be empty" },
        { status: 400 }
      );
    }

	if (nextUsername !== undefined && nextUsername.length > 20) {
		return NextResponse.json(
			{ error: "Username cannot be longer than 20 characters" },
			{ status: 400 }
		);
	}

	if (nextBio !== undefined && nextBio.length > 120) {
		return NextResponse.json(
			{ error: "Bio cannot be longer than 120 characters" },
			{ status: 400 }
		);
	}
	
    if (nextEmail !== undefined) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailPattern.test(nextEmail)) {
        return NextResponse.json(
          { error: "Invalid email format" },
          { status: 400 }
        );
      }
    }

    if (nextImage && nextImage.length > MAX_PROFILE_IMAGE_SIZE * 2) {
      return NextResponse.json(
        { error: "Profile image is too large" },
        { status: 413 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(nextUsername !== undefined && { username: nextUsername }),
        ...(nextEmail !== undefined && { email: nextEmail }),
        ...(nextImage !== undefined && { image: nextImage }),
        //allow blank bio.
        ...(nextBio !== undefined && { bio: nextBio }),
      },
      select: {
        id: true,
        username: true,
        email: true,
        image: true,

        bio: true,
        learningLevel: true,

        isOnline: true,
        createdAt: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "Username or email already in use" },
        { status: 409 }
      );
    }

    console.error(error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
