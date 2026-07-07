// username 是真实用户名。
// displayName 是给好友设置的备注名。
// rawText 是用户输入的原始内容。
// translatedText 是自动转换后的内容。例如你输入英文，系统自动生成摩斯密码。
// mode 记录这条消息是在哪个聊天模式下发送的。

import type { MessageMode } from "@/lib/mappers/chat-mode";

export type ChatMode =
  | "LANGUAGE_TO_MORSE"
  | "morse-to-language"
  | "LANGUAGE_ONLY"
  | "morse-only"
  | "text-to-morse-only";

export type Friend = {
  id: string;
  friendshipId?: number;
  username: string;
  displayName: string;
  avatarInitial: string;
  avatarUrl?: string;
  lastMessage: string;
  lastMessageAt: string;
  isOnline: boolean;
  image: string | null;
  unreadCount?: number;
  gameStatus?: "IDLE" | "READY" | "PLAYING" | null;
  lobbyStatus?: "IDLE" | "READY" | "PLAYING" | null;
  currentRadioId?: string | null;
  hasPendingGameInvitation?: boolean;
};

export type ChatMessage = {
  id: string;
  friendId: string;
  sender: "me" | "friend";
  rawText: string;
  translatedText?: string;
  mode: MessageMode;
  createdAt: string;
};

export type SearchableUser = {
  id: string;
  username: string;
  displayName: string;
  avatarInitial: string;
  avatarUrl?: string;
};

export type SystemMessage = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  isRead: boolean;
  kind?: "info" | "game-invitation" | "join-lobby" | "friend-request";
  invitationId?: string;
  friendshipId?: number;
  fromUserId?: string;
  radioId?: string;
  i18nKey?: string;
  i18nParams?: Record<string, string>;

  // 当前用户已经所在的 lobby。
  // 仅在尝试加入另一个 lobby 时发生 409 冲突后写入。
  currentRadioId?: string;

  actionStatus?:
    | "idle"
    | "updating"
    | "accepted"
    | "declined"
    | "expired"
    | "error"
    | "switch-required";
};

export type ChatPanelView =
  | { type: "none" }
  | { type: "friend"; friendId: string }
  | { type: "system" };
