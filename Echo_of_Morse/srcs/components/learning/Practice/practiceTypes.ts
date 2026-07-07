//* Types utilises dans pratique 

export type PracticeMode = "decode" | "encode";

//des elements pour un caractere
export type CharacterItem = {
	character: string;
	morse: string;
	level: number;
};

export type Question = CharacterItem & { mode: PracticeMode; };