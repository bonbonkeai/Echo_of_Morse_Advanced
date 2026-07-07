import { prisma } from "@/server/prisma";

// get friend list, without double.
export async function getFriends(userId: string) {
  const relations = await prisma.friendship.findMany({
    where: {
      OR: [
        { senderId: userId },
        { receiverId: userId },
      ],
      status: "ACCEPTED",
    },
    include: {
      sender: {
        select: {
          id: true,
          username: true,
          image: true,
          isOnline: true,
          radioLobbyPresences: {
            orderBy: { updatedAt: "desc" },
            take: 1,
            select: {
              status: true,
              room: {
                select: {
                  radioId: true,
                },
              },
            },
          },
          radioSessionPlayers: {
            where: {
              session: {
                status: { in: ["WAITING", "ACTIVE"] },
              },
            },
            orderBy: { joinedAt: "desc" },
            take: 1,
            select: {
              session: {
                select: {
                  room: {
                    select: {
                      radioId: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
      receiver: {
        select: {
          id: true,
          username: true,
          image: true,
          isOnline: true,
          radioLobbyPresences: {
            orderBy: { updatedAt: "desc" },
            take: 1,
            select: {
              status: true,
              room: {
                select: {
                  radioId: true,
                },
              },
            },
          },
          radioSessionPlayers: {
            where: {
              session: {
                status: { in: ["WAITING", "ACTIVE"] },
              },
            },
            orderBy: { joinedAt: "desc" },
            take: 1,
            select: {
              session: {
                select: {
                  room: {
                    select: {
                      radioId: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  type FriendListUser = (typeof relations)[number]["sender"];
  type FriendListRelation = (typeof relations)[number] & {
    senderRemark: string | null;
    receiverRemark: string | null;
  };
  const map = new Map<
    string,
    {
      user: FriendListUser;
      displayName: string;
      friendshipId: number;
    }
  >();

  for (const f of relations as FriendListRelation[]) {
    const user =
      f.senderId === userId ? f.receiver : f.sender;
    const remark =
      f.senderId === userId ? f.senderRemark : f.receiverRemark;

    map.set(user.id, {
      user,
      displayName: remark?.trim() || user.username,
      friendshipId: f.id,
    });
  }

  return Array.from(map.values());
}
