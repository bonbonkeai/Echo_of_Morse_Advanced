import assert from "node:assert/strict";
import test from "node:test";

import { getInviteFriendState } from "./invite-friend-state";

const baseState = {
  isLobbyFull: false,
  isPending: false,
  currentRadioId: null,
  targetRadioId: "01",
  gameStatus: "IDLE" as const,
  lobbyStatus: "IDLE" as const,
};

test("enables an eligible friend who is outside the target lobby", () => {
  assert.deepEqual(getInviteFriendState(baseState), {
    disabled: false,
    reason: "available",
  });
});

test("disables a friend while an invitation is pending", () => {
  assert.deepEqual(
    getInviteFriendState({ ...baseState, isPending: true }),
    { disabled: true, reason: "pending" }
  );
});

test("disables a friend who is already in the target lobby", () => {
  assert.deepEqual(
    getInviteFriendState({ ...baseState, currentRadioId: "01" }),
    { disabled: true, reason: "in-lobby" }
  );
});

test("disables invitations when the lobby is full", () => {
  assert.deepEqual(
    getInviteFriendState({ ...baseState, isLobbyFull: true }),
    { disabled: true, reason: "lobby-full" }
  );
});

test("disables friends who are ready or playing", () => {
  assert.deepEqual(
    getInviteFriendState({ ...baseState, lobbyStatus: "READY" }),
    { disabled: true, reason: "unavailable" }
  );
  assert.deepEqual(
    getInviteFriendState({ ...baseState, gameStatus: "PLAYING" }),
    { disabled: true, reason: "unavailable" }
  );
});
