import { NextResponse } from "next/server";
import { getOnlineOverview } from "@/lib/services/competition";
import { getSessionUserId } from "@/lib/session-user";

export const dynamic = "force-dynamic";

export async function GET() {
  const userId = await getSessionUserId();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json(await getOnlineOverview());
}
