export type LetterProgress = {
  character: string;
  morse: string;
  correctCount: number;
  wrongCount: number;
  totalSeen: number;
  mastery: number;
};

export const mockLetterProgress: LetterProgress[] = [
  // Letters
  { character: "A", morse: ".-", correctCount: 16, wrongCount: 4, totalSeen: 20, mastery: 80 },
  { character: "B", morse: "-...", correctCount: 7, wrongCount: 8, totalSeen: 15, mastery: 47 },
  { character: "C", morse: "-.-.", correctCount: 5, wrongCount: 10, totalSeen: 15, mastery: 33 },
  { character: "D", morse: "-..", correctCount: 10, wrongCount: 5, totalSeen: 15, mastery: 67 },
  { character: "E", morse: ".", correctCount: 22, wrongCount: 1, totalSeen: 23, mastery: 96 },
  { character: "F", morse: "..-.", correctCount: 4, wrongCount: 9, totalSeen: 13, mastery: 31 },
  { character: "G", morse: "--.", correctCount: 9, wrongCount: 6, totalSeen: 15, mastery: 60 },
  { character: "H", morse: "....", correctCount: 6, wrongCount: 11, totalSeen: 17, mastery: 35 },
  { character: "I", morse: "..", correctCount: 18, wrongCount: 3, totalSeen: 21, mastery: 86 },
  { character: "J", morse: ".---", correctCount: 3, wrongCount: 7, totalSeen: 10, mastery: 30 },
  { character: "K", morse: "-.-", correctCount: 8, wrongCount: 6, totalSeen: 14, mastery: 57 },
  { character: "L", morse: ".-..", correctCount: 2, wrongCount: 8, totalSeen: 10, mastery: 20 },
  { character: "M", morse: "--", correctCount: 17, wrongCount: 2, totalSeen: 19, mastery: 89 },
  { character: "N", morse: "-.", correctCount: 14, wrongCount: 5, totalSeen: 19, mastery: 74 },
  { character: "O", morse: "---", correctCount: 8, wrongCount: 9, totalSeen: 17, mastery: 47 },
  { character: "P", morse: ".--.", correctCount: 4, wrongCount: 10, totalSeen: 14, mastery: 29 },
  { character: "Q", morse: "--.-", correctCount: 1, wrongCount: 9, totalSeen: 10, mastery: 10 },
  { character: "R", morse: ".-.", correctCount: 6, wrongCount: 10, totalSeen: 16, mastery: 38 },
  { character: "S", morse: "...", correctCount: 15, wrongCount: 6, totalSeen: 21, mastery: 71 },
  { character: "T", morse: "-", correctCount: 21, wrongCount: 2, totalSeen: 23, mastery: 91 },
  { character: "U", morse: "..-", correctCount: 9, wrongCount: 8, totalSeen: 17, mastery: 53 },
  { character: "V", morse: "...-", correctCount: 5, wrongCount: 8, totalSeen: 13, mastery: 38 },
  { character: "W", morse: ".--", correctCount: 12, wrongCount: 5, totalSeen: 17, mastery: 71 },
  { character: "X", morse: "-..-", correctCount: 2, wrongCount: 6, totalSeen: 8, mastery: 25 },
  { character: "Y", morse: "-.--", correctCount: 3, wrongCount: 7, totalSeen: 10, mastery: 30 },
  { character: "Z", morse: "--..", correctCount: 1, wrongCount: 5, totalSeen: 6, mastery: 17 },

  // Numbers
  { character: "0", morse: "-----", correctCount: 6, wrongCount: 2, totalSeen: 8, mastery: 75 },
  { character: "1", morse: ".----", correctCount: 7, wrongCount: 3, totalSeen: 10, mastery: 70 },
  { character: "2", morse: "..---", correctCount: 5, wrongCount: 5, totalSeen: 10, mastery: 50 },
  { character: "3", morse: "...--", correctCount: 4, wrongCount: 6, totalSeen: 10, mastery: 40 },
  { character: "4", morse: "....-", correctCount: 3, wrongCount: 7, totalSeen: 10, mastery: 30 },
  { character: "5", morse: ".....", correctCount: 2, wrongCount: 8, totalSeen: 10, mastery: 20 },
  { character: "6", morse: "-....", correctCount: 3, wrongCount: 5, totalSeen: 8, mastery: 38 },
  { character: "7", morse: "--...", correctCount: 4, wrongCount: 4, totalSeen: 8, mastery: 50 },
  { character: "8", morse: "---..", correctCount: 5, wrongCount: 3, totalSeen: 8, mastery: 63 },
  { character: "9", morse: "----.", correctCount: 6, wrongCount: 2, totalSeen: 8, mastery: 75 },

  // Punctuation
  { character: ".", morse: ".-.-.-", correctCount: 5, wrongCount: 5, totalSeen: 10, mastery: 50 },
  { character: ",", morse: "--..--", correctCount: 3, wrongCount: 7, totalSeen: 10, mastery: 30 },
  { character: "?", morse: "..--..", correctCount: 2, wrongCount: 8, totalSeen: 10, mastery: 20 },
  { character: "'", morse: ".----.", correctCount: 0, wrongCount: 0, totalSeen: 0, mastery: 0 },
  { character: "!", morse: "-.-.--", correctCount: 1, wrongCount: 5, totalSeen: 6, mastery: 17 },
  { character: "/", morse: "-..-.", correctCount: 2, wrongCount: 4, totalSeen: 6, mastery: 33 },
  { character: "(", morse: "-.--.", correctCount: 1, wrongCount: 3, totalSeen: 4, mastery: 25 },
  { character: ")", morse: "-.--.-", correctCount: 1, wrongCount: 3, totalSeen: 4, mastery: 25 },
  { character: "&", morse: ".-...", correctCount: 0, wrongCount: 0, totalSeen: 0, mastery: 0 },
  { character: ":", morse: "---...", correctCount: 0, wrongCount: 0, totalSeen: 0, mastery: 0 },
  { character: ";", morse: "-.-.-.", correctCount: 0, wrongCount: 0, totalSeen: 0, mastery: 0 },
  { character: "=", morse: "-...-", correctCount: 0, wrongCount: 0, totalSeen: 0, mastery: 0 },
  { character: "+", morse: ".-.-.", correctCount: 0, wrongCount: 0, totalSeen: 0, mastery: 0 },
  { character: "-", morse: "-....-", correctCount: 0, wrongCount: 0, totalSeen: 0, mastery: 0 },
  { character: "_", morse: "..--.-", correctCount: 0, wrongCount: 0, totalSeen: 0, mastery: 0 },
  { character: '"', morse: ".-..-.", correctCount: 0, wrongCount: 0, totalSeen: 0, mastery: 0 },
  { character: "$", morse: "...-..-", correctCount: 0, wrongCount: 0, totalSeen: 0, mastery: 0 },
  { character: "@", morse: ".--.-.", correctCount: 0, wrongCount: 0, totalSeen: 0, mastery: 0 },
];