export type NotificationFriendMessage = {
  id: string;
  conversationId: string;
  senderId: string;
  senderUsername: string;
  senderImage: string | null;
  rawText: string;
  translatedText: string | null;
  mode: string;
  createdAt: string;
};

export type NotificationGameInvitation = {
  id: string;
  status: "pending" | "accepted" | "declined" | "expired";
  createdAt: string;
  expiresAt?: string;
  fromUser: {
    id: string;
    username: string;
    image: string | null;
  };
  toUser: {
    id: string;
    username: string;
    image: string | null;
  };
  radio: {
    radioId: string;
    name: string;
  } | null;
};

export type NotificationFriendRequest = {
  id: number;
  createdAt: string;
  sender: {
    id: string;
    username: string;
    image: string | null;
  };
};

export type NotificationsSnapshot = {
  unreadSystemMessages: number;
  pendingGameInvitations: NotificationGameInvitation[];
  pendingFriendRequests: NotificationFriendRequest[];
  recentFriendMessages: NotificationFriendMessage[];
};

export type FriendUnreadCounts = Record<string, number>;
