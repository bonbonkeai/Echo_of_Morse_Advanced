type LobbyPresenceWriter = {
  radioLobbyPresence: {
    createMany(args: {
      data: Array<{ userId: string; roomId: string }>;
      skipDuplicates: true;
    }): PromiseLike<unknown>;
    updateMany(args: {
      where: {
        userId: string;
        roomId: string;
        status: { not: "PLAYING" };
      };
      data: { status: "IDLE" };
    }): PromiseLike<unknown>;
  };
};

type EnsureInviterLobbyPresenceArgs = {
  userId: string;
  roomId: string;
  inviterAlreadyPresent: boolean;
  lobbyUserCount: number;
  maxUsers: number;
};

export async function ensureInviterLobbyPresence(
  transaction: LobbyPresenceWriter,
  args: EnsureInviterLobbyPresenceArgs
) {
  const countAfterInviterJoins =
    args.lobbyUserCount + (args.inviterAlreadyPresent ? 0 : 1);

  if (countAfterInviterJoins >= args.maxUsers) {
    throw new Error("ROOM_LACKS_INVITE_CAPACITY");
  }

  await transaction.radioLobbyPresence.createMany({
    data: [{ userId: args.userId, roomId: args.roomId }],
    skipDuplicates: true,
  });

  await transaction.radioLobbyPresence.updateMany({
    where: {
      userId: args.userId,
      roomId: args.roomId,
      status: { not: "PLAYING" },
    },
    data: { status: "IDLE" },
  });
}
