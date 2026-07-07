// 负责右侧聊天窗口。
// 包括聊天头部、聊天模式选择器、消息列表和输入框。

import type { ChatMessage, ChatMode, Friend } from "@/types/chat";
import ChatHeader from "./ChatHeader";
import ChatModeSelector from "./ChatModeSelector";
import MessageList from "./MessageList";
import MessageComposer from "./MessageComposer";
import styles from "./css/ChatWindow.module.css";

type ChatWindowProps = {
  friend: Friend;
  messages: ChatMessage[];
  chatMode: ChatMode;
  composerError: string;
  onChangeChatMode: (mode: ChatMode) => void;
  // onSendMessage: (text: string) => boolean;
  onSendMessage: (text: string) => Promise<boolean>;
  onCloseChat: () => void;
};

export default function ChatWindow({
  friend,
  messages,
  chatMode,
  composerError,
  onChangeChatMode,
  onSendMessage,
  onCloseChat,
}: ChatWindowProps) {
  return (
    <section className={styles.window}>
      <ChatHeader friend={friend} onCloseChat={onCloseChat} />

      <ChatModeSelector value={chatMode} onChange={onChangeChatMode} />

      <MessageList messages={messages} />

      <MessageComposer
        chatMode={chatMode}
        error={composerError}
        onSendMessage={onSendMessage}
      />
    </section>
  );
}