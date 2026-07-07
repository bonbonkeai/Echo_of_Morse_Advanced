// 负责普通语言和莫斯密码之间的转换

import type { ChatMode } from "@/types/chat";
import { decode, encode, isMorseInput } from "@/lib/morse";

type TransformResult = {
  rawText: string;
  translatedText: string;
  error?: string;
};

export function transformChatMessage(
  text: string,
  mode: ChatMode
): TransformResult {
  const normalizedText = text.trim();

  if (!normalizedText) {
    return {
      rawText: "",
      translatedText: "",
      error: "Message cannot be empty.",
    };
  }

  if (mode === "LANGUAGE_TO_MORSE") {
    return {
      rawText: normalizedText,
      translatedText: encode(normalizedText),
    };
  }

  if (mode === "morse-to-language") {
    if (!isMorseInput(normalizedText)) {
      return {
        rawText: "",
        translatedText: "",
        error:
          "Invalid Morse input. Use only dots, dashes, spaces, and / between words.",
      };
    }

    return {
      rawText: normalizedText,
      translatedText: decode(normalizedText),
    };
  }

  if (mode === "LANGUAGE_ONLY") {
    return {
      rawText: normalizedText,
      translatedText: "",
    };
  }

  if (mode === "morse-only") {
    if (!isMorseInput(normalizedText)) {
      return {
        rawText: "",
        translatedText: "",
        error:
          "Invalid Morse input. Use only dots, dashes, spaces, and / between words.",
      };
    }

    return {
      rawText: normalizedText,
      translatedText: "",
    };
  }

  if (mode === "text-to-morse-only") {
    return {
      rawText: encode(normalizedText),
      translatedText: "",
    };
  }

  return {
    rawText: normalizedText,
    translatedText: "",
  };
}