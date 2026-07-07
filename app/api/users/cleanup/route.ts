//Kick out users without heartbeat more than 2 minutes.
// the heartbeat of server.io is about 45 seconds.
// return NextResponse： tell the API caller it's done.

import { NextResponse } from 'next/server';
import { prisma } from '@/server/prisma';

export async function POST() {
  const cutoff = new Date(Date.now() - 120000); //2 minutes

  await prisma.user.updateMany({
    where: {
      isOnline: true,
      lastSeen: { lt: cutoff }  // lt = less than
    },
    data: { isOnline: false }
  });
  
  return NextResponse.json({ ok: true });
}
