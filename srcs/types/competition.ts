export type RadioId = string;

export type RadioUserStatus = "idle" | "ready" | "playing";


//deprecated Replaced by Prisma RadioRoom
export type RadioConfig = {
  id: RadioId;
  name: string;
  wpm: number;
  description: string;
};

export type RadioUser = {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  avatarInitial: string;
  status: RadioUserStatus;
  isFriend: boolean;
  isCurrentUser?: boolean;
};
