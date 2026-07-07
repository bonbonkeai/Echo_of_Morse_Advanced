export type RadioUserStatus = "idle" | "ready" | "playing";

export type RadioUser = {
  id: string;
  username: string;
  image: string | null;

  status: RadioUserStatus;

  displayName: string;
  avatarUrl: string | null;
  avatarInitial: string;

  isFriend: boolean;
  isCurrentUser?: boolean;
};