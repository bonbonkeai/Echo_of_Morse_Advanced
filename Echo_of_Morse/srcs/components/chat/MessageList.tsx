//消息列表

import type { ChatMessage } from "@/types/chat";
import MessageBubble from "./MessageBubble";
import styles from "./css/MessageList.module.css";

type MessageListProps = {
  messages: ChatMessage[];
};

export default function MessageList({ messages }: MessageListProps) {
  return (
    <div className={styles.list}>
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
    </div>
  );
}