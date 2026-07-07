// return the ID list
//! only for dev, to del in the release version.

export const dynamic = "force-dynamic";

import { prisma } from "@/server/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      image: true,
      isOnline: true,
    },
  });

  return NextResponse.json(users);
}