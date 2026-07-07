// 负责输入框和发送按钮

"use client";

import { FormEvent, KeyboardEvent, useState } from "react";
import type { ChatMode } from "@/types/chat";
import { Button } from "@/components/ui";
import styles from "./css/MessageComposer.module.css";

import { useI18n } from "@/lib/i18n";

type MessageComposerProps = {
  chatMode: ChatMode;
  error: string;
  // onSendMessage: (text: string) => boolean;
  onSendMessage: (text: string) => Promise<boolean>;
};


export default function MessageComposer({
  chatMode,
  error,
  onSendMessage,
}: MessageComposerProps) {
	const { dictionary } = useI18n();
	const t = dictionary.chat;
	const placeholderByMode: Record<ChatMode, string> = {
		"LANGUAGE_TO_MORSE": t.typeTextToMorse,
		"morse-to-language": t.enterMorseToDecode,
		"LANGUAGE_ONLY": t.typeMessage,
		"morse-only": t.typeMorseOnly,
		"text-to-morse-only": t.typeTextAsMorseOnly,
	};

  const [text, setText] = useState("");

  function submitMessage() {
    if (!text.trim()) {
      return;
    }

    const didSendMessage = onSendMessage(text);

    setText("");
    // if (didSendMessage) {
    //   setText("");
    // }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submitMessage();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key !== "Enter") {
      return;
    }

    if (event.shiftKey) {
      return;
    }

    event.preventDefault();
    submitMessage();
  }

  return (
    <form className={styles.composer} onSubmit={handleSubmit}>
      <div className={styles.inputArea}>
        <textarea
          className={styles.textarea}
          value={text}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholderByMode[chatMode]}
          rows={2}
        />

        {error ? <p className={styles.error}>{error}</p> : null}
      </div>

      <Button type="submit" disabled={!text.trim()}>
        {t.send}
      </Button>
    </form>
  );
}
