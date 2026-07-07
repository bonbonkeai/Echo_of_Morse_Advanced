import type { ChatMode } from "@/types/chat";

export type MessageMode =
  | "LANGUAGE_TO_MORSE"
  | "MORSE_TO_LANGUAGE"
  | "LANGUAGE_ONLY";

export function mapChatModeToDB(mode: ChatMode): MessageMode {
  switch (mode) {
    case "LANGUAGE_TO_MORSE":
      return "LANGUAGE_TO_MORSE";

    case "morse-to-language":
      return "MORSE_TO_LANGUAGE";

    case "LANGUAGE_ONLY":
      return "LANGUAGE_ONLY";

    case "morse-only":
      return "LANGUAGE_ONLY";

    case "text-to-morse-only":
      return "LANGUAGE_TO_MORSE";
  }
}

export function mapDBToChatMode(mode: MessageMode): ChatMode {
  switch (mode) {
    case "LANGUAGE_TO_MORSE":
      return "LANGUAGE_TO_MORSE";

    case "MORSE_TO_LANGUAGE":
      return "morse-to-language";

    case "LANGUAGE_ONLY":
      return "LANGUAGE_ONLY";
  }
}