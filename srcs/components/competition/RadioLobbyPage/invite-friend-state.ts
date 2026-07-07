type InviteFriendStateInput = {
  isLobbyFull: boolean;
  isPending: boolean;
  currentRadioId?: string | null;
  targetRadioId: string;
  gameStatus?: "IDLE" | "READY" | "PLAYING" | null;
  lobbyStatus?: "IDLE" | "READY" | "PLAYING" | null;
};

export type InviteFriendState = {
  disabled: boolean;
  reason:
    | "available"
    | "pending"
    | "in-lobby"
    | "lobby-full"
    | "unavailable";
};

export function getInviteFriendState(
  input: InviteFriendStateInput
): InviteFriendState {
  if (input.isLobbyFull) {
    return { disabled: true, reason: "lobby-full" };
  }

  if (input.currentRadioId === input.targetRadioId) {
    return { disabled: true, reason: "in-lobby" };
  }

  if (
    input.gameStatus === "PLAYING" ||
    input.lobbyStatus === "PLAYING" ||
    input.lobbyStatus === "READY"
  ) {
    return { disabled: true, reason: "unavailable" };
  }

  if (input.isPending) {
    return { disabled: true, reason: "pending" };
  }

  return { disabled: false, reason: "available" };
}
