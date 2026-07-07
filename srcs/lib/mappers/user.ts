// convert the full API user info to simpler UI user info.

import type { User } from "@prisma/client";

import type { UserDTO } from "@/types/user";

export function toUserDTO(
  user: any,
  friendCount?: number
) {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    image: user.image,

    bio: user.bio,
    learningLevel: user.learningLevel,

    isOnline: user.isOnline,
    createdAt: user.createdAt,
    lastSeen: user.lastSeen,

    friendCount,

    providers: user.accounts.map(
      (acc: { provider: string }) => acc.provider
    ),
  };
}
