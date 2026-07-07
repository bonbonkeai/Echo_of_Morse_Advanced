// Health check for web container.

import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({ ok: true });
}
