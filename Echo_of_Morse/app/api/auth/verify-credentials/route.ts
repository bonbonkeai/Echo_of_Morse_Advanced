import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { prisma } from "@/server/prisma";

export async function POST(request: Request) {
  const { email, password } = (await request.json()) as {
    email?: string;
    password?: string;
  };

  if (!email?.trim() || !password) {
    return NextResponse.json({ ok: false });
  }

  const user = await prisma.user.findUnique({
    where: { email: email.trim().toLowerCase() },
    select: { passwordHash: true },
  });

  if (!user?.passwordHash) {
    return NextResponse.json({ ok: false });
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);

  return NextResponse.json({ ok: isValid });
}
