//负责一条消息气泡

import type { ChatMessage } from "@/types/chat";
import styles from "./css/MessageBubble.module.css";

type MessageBubbleProps = {
  message: ChatMessage;
};

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isMine = message.sender === "me";

  return (
    <article className={`${styles.row} ${isMine ? styles.mine : styles.friend}`}>
      <div className={styles.bubble}>
        <p className={styles.text}>{message.rawText}</p>

        {message.translatedText ? (
          <p className={styles.translation}>{message.translatedText}</p>
        ) : null}

        <time className={styles.time}>{message.createdAt}</time>
      </div>
    </article>
  );
}