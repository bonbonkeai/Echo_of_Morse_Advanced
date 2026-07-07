export const MORSE: Readonly<Record<string, string>> = {
  A: ".-",
  B: "-...",
  C: "-.-.",
  D: "-..",
  E: ".",
  F: "..-.",
  G: "--.",
  H: "....",
  I: "..",
  J: ".---",
  K: "-.-",
  L: ".-..",
  M: "--",
  N: "-.",
  O: "---",
  P: ".--.",
  Q: "--.-",
  R: ".-.",
  S: "...",
  T: "-",
  U: "..-",
  V: "...-",
  W: ".--",
  X: "-..-",
  Y: "-.--",
  Z: "--..",

  "0": "-----",
  "1": ".----",
  "2": "..---",
  "3": "...--",
  "4": "....-",
  "5": ".....",
  "6": "-....",
  "7": "--...",
  "8": "---..",
  "9": "----.",

  ".": ".-.-.-",
  ",": "--..--",
  "?": "..--..",
  "'": ".----.",
  "!": "-.-.--",
  "/": "-..-.",
  "(": "-.--.",
  ")": "-.--.-",
  "&": ".-...",
  ":": "---...",
  ";": "-.-.-.",
  "=": "-...-",
  "+": ".-.-.",
  "-": "-....-",
  "_": "..--.-",
  '"': ".-..-.",
  "$": "...-..-",
  "@": ".--.-.",
};

const TEXT_BY_MORSE: Record<string, string> = Object.fromEntries(
  Object.entries(MORSE).map(([character, code]) => [code, character])
);

export function encode(text: string): string {
  return text
    .trim()
    .toUpperCase()
    .split(/\s+/)
    .map((word) =>
      word
        .split("")
        .map((character) => MORSE[character])
        .filter(Boolean)
        .join(" ")
    )
    .join(" / ");
}

export function decode(morse: string): string {
  return morse
    .trim()
    .split(/\s*\/\s*/)
    .map((word) =>
      word
        .trim()
        .split(/\s+/)
        .map((code) => TEXT_BY_MORSE[code] ?? "?")
        .join("")
    )
    .join(" ");
}

export function isMorseInput(text: string): boolean {
  return /^[.\-/\s]+$/.test(text.trim());
}

export function getMorseForCharacter(character: string): string | null {
  return MORSE[character.toUpperCase()] ?? null;
}
