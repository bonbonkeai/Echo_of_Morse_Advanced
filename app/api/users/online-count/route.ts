// app/api/users/online-count/route.ts
// Front-end calls this to get the number of online users

export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server';
import { prisma } from '@/server/prisma';

export async function GET() {
  const count = await prisma.user.count({
    where: { isOnline: true }
  });
  
  return NextResponse.json({ count });
}
