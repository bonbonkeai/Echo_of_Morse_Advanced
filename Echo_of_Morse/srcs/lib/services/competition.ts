//* Services related to the competition features (DB)
//* Managing radio lobbies, sessions, and fetching configurations.

import { prisma } from "@/server/prisma";
import type { RadioUser } from "@/types/competition";

const SESSION_DURATION_SECONDS = 90;
const SESSION_SEQUENCE_COUNT = 12;

// A fixed list of words to generate session sequences from.
// TODO maybe expand this list or fetch from DB in the future for more variety?
const SESSION_WORDS = [
  "HELLO",
  "WORLD",
  "MORSE",
  "CODE",
  "RADIO",
  "SIGNAL",
  "READY",
  "WAVE",
  "LEARN",
  "LISTEN",
  "DECODE",
  "MESSAGE",
  "FRIEND",
  "QUICK",
  "FOCUS",
  "TRANSMIT",
];

export function createSessionSequences(sessionId: string) {
  let seed = 0;

  for (const character of sessionId) {
    seed = (seed * 31 + character.charCodeAt(0)) >>> 0;
  }

  const words = [...SESSION_WORDS];

  for (let index = words.length - 1; index > 0; index -= 1) {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    const swapIndex = seed % (index + 1);
    [words[index], words[swapIndex]] = [words[swapIndex], words[index]];
  }

  return words.slice(0, SESSION_SEQUENCE_COUNT);
}

export function getSessionDurationSeconds() {
  return SESSION_DURATION_SECONDS;
}


// The most important function
// Fetches the radio lobby details
// Include user info, friendship status, and active session for the current user
export async function getRadioLobby(radioId: string, currentUserId: string) {
  const room = await prisma.radioRoom.findUnique({
    where: { radioId },
    include: {
      lobbyPresences: {
        orderBy: { joinedAt: "asc" },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              image: true,
            },
          },
        },
      },
    },
  });

  if (!room) {
    return null;
  }

  const friendshipRows = await prisma.friendship.findMany({
    where: {
      status: "ACCEPTED",
      OR: [
        { senderId: currentUserId },
        { receiverId: currentUserId },
      ],
    },
    select: {
      senderId: true,
      receiverId: true,
    },
  });

  const friendIds = new Set(
    friendshipRows.map((friendship) =>
      friendship.senderId === currentUserId
        ? friendship.receiverId
        : friendship.senderId
    )
  );

  const users: RadioUser[] = room.lobbyPresences.map((presence) => ({
    id: presence.user.id,
    username: presence.user.username,
    displayName: presence.user.username,
    avatarUrl: presence.user.image,
    avatarInitial: presence.user.username.charAt(0).toUpperCase() || "?",
    status: presence.status.toLowerCase() as RadioUser["status"],
    isFriend: friendIds.has(presence.user.id),
    isCurrentUser: presence.user.id === currentUserId,
  }));

  // Abandon feature: so completed or abandoned player won't go back to old game.
  const activePlayer = await prisma.radioSessionPlayer.findFirst({
    where: {
      userId: currentUserId,
      completed: false,
      session: {
        roomId: room.id,
        status: { in: ["WAITING", "ACTIVE"] },
      },
    },
    orderBy: { joinedAt: "desc" },
    select: {
      sessionId: true,
    },
  });

  return {
    radio: {
      id: room.id,
      radioId: room.radioId,
      name: room.name,
      wpm: room.wpm,
      description: room.description,
      maxUsers: room.maxUsers,
    },
    users,
    activeSessionId: activePlayer?.sessionId ?? null,
  };
}

// Fetch all radio configurations for lobby listing
export async function getRadioConfigs() {
  const radios = await prisma.radioRoom.findMany({
    orderBy: { radioId: "asc" },
  });

  return radios.map((r) => ({
    id: r.radioId,
    name: r.name,
    wpm: r.wpm,
    description: r.description,
    maxUsers: r.maxUsers,
  }));
}

// Fetch online user counts for lobby overview
export async function getOnlineOverview() {
  const totalOnlineUsers = await prisma.user.count({
    where: { isOnline: true },
  });

  const rooms = await prisma.radioRoom.findMany({
    include: {
      lobbyPresences: true,
    },
  });

  const radioUsers: Record<string, number> = {};

  for (const room of rooms) {
    radioUsers[room.radioId] = room.lobbyPresences.length;
  }

  return {
    totalOnlineUsers,
    radioUsers,
  };
}
