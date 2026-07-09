//负责选择聊天模式
"use client";
import type { ChatMode } from "@/types/chat";
import { Button } from "@/components/ui";
import styles from "./css/ChatModeSelector.module.css";
import { useI18n } from "@/lib/i18n";

type ChatModeSelectorProps = {
  value: ChatMode;
  onChange: (mode: ChatMode) => void;
};

export default function ChatModeSelector({
  value,
  onChange,
}: ChatModeSelectorProps) {
	const { dictionary } = useI18n();
	const t = dictionary.chat;
	const modes = [
		{ value: "LANGUAGE_TO_MORSE", label: t.languageToMorse },
		{ value: "morse-to-language", label: t.morseToLanguage },
		{ value: "LANGUAGE_ONLY", label: t.textOnly },
		{ value: "morse-only", label: t.morseOnly },
		{ value: "text-to-morse-only", label: t.encodeOnly },
	] as const;

  return (
    <div className={styles.selector} aria-label={t.chatModeSelector}>
      {modes.map((mode) => (
        <Button
          key={mode.value}
          type="button"
          size="sm"
          variant={value === mode.value ? "primary" : "secondary"}
          onClick={() => onChange(mode.value)}
          className={styles.modeButton}
        >
          {mode.label}
        </Button>
      ))}
    </div>
  );
}
