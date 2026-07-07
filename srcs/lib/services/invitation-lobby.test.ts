import assert from "node:assert/strict";
import test from "node:test";

import { ensureInviterLobbyPresence } from "./invitation-lobby";

function createTransactionDouble() {
  const createManyCalls: unknown[] = [];
  const updateManyCalls: unknown[] = [];

  return {
    createManyCalls,
    updateManyCalls,
    transaction: {
      radioLobbyPresence: {
        async createMany(args: unknown) {
          createManyCalls.push(args);
          return { count: 1 };
        },
        async updateMany(args: unknown) {
          updateManyCalls.push(args);
          return { count: 1 };
        },
      },
    },
  };
}

test("joins an absent inviter while reserving one lobby place for the invitee", async () => {
  const double = createTransactionDouble();

  await ensureInviterLobbyPresence(double.transaction, {
    userId: "user-a",
    roomId: "room-01",
    inviterAlreadyPresent: false,
    lobbyUserCount: 5,
    maxUsers: 7,
  });

  assert.deepEqual(double.createManyCalls, [
    {
      data: [{ userId: "user-a", roomId: "room-01" }],
      skipDuplicates: true,
    },
  ]);
  assert.equal(double.updateManyCalls.length, 1);
});

test("rejects when joining the inviter would consume the invitee's final place", async () => {
  const double = createTransactionDouble();

  await assert.rejects(
    ensureInviterLobbyPresence(double.transaction, {
      userId: "user-a",
      roomId: "room-01",
      inviterAlreadyPresent: false,
      lobbyUserCount: 6,
      maxUsers: 7,
    }),
    { message: "ROOM_LACKS_INVITE_CAPACITY" }
  );

  assert.equal(double.createManyCalls.length, 0);
});

test("does not require an extra inviter place when the inviter is already present", async () => {
  const double = createTransactionDouble();

  await ensureInviterLobbyPresence(double.transaction, {
    userId: "user-a",
    roomId: "room-01",
    inviterAlreadyPresent: true,
    lobbyUserCount: 6,
    maxUsers: 7,
  });

  assert.equal(double.createManyCalls.length, 1);
});
