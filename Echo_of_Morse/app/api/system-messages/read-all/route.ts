//* stock the unread count persisted on the DB
//* mark as read in the backend.


import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/session-user";
import { prisma } from "@/server/prisma";


// update read status.
export async function PATCH() {
  const userId = await getSessionUserId();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await prisma.systemMessage.updateMany({
    where: {
      userId,
      isRead: false,
    },
    data: { isRead: true },
  });

  return NextResponse.json({ ok: true });
}
