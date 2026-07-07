//* fonction outil 

import { LEVEL_RULES, MORSE_LEVELS, type LevelId } from "./practiceData";
import type { CharacterItem, PracticeMode, Question } from "./practiceTypes";

//Cette fonction prend une liste, choisit un index au hasard et le retourne.
	//<T> => le type est flexible, ex: T = string/T = number
	//Math.random() => genere un nb entre 0 - 1, mais pas = 1
	//Math.floor() => supp les virgules, prend le nb entier
function indexRandom<T>(items: T[]) {
	return items[Math.floor(Math.random() * items.length)];
}

//change l’ordre avec un hasard
	//Math.random() - 0.5 --> genere un nb negtif ou positif
	//sort() --> choisit lui-même quels éléments comparer, combien de fois, et dans quel ordre 
		// : négatif = 1e avant, positif = 2e avant
function Orderrandom<T>(items: T[]) {
	return [...items].sort(() => Math.random() - 0.5);
}

//wait(ms) attend un certain temps.
	//Promise() -> une action qui finit plus tard, await attend le Promise, quand resolve est appele, await continue
	//window vient de navigateur
	//window.setTimeout(resolve, ms) -> apres ms millisecondes, appelle resolve
	//resolve = une fonction pour dire promise c'est fini.
export function wait(ms: number) {
	return new Promise((resolve) => window.setTimeout(resolve, ms));
}

//trouve tous les contenu à apprendre
	//flat() --> transforme char** en char*
	//filter() --> prendre les contenue selon index
	// cad garde lorsque true（item.level < levelId）
export function getCharactersForLevel(levelId: LevelId) {
	const allCharacters = MORSE_LEVELS.flat();
	const newCharacters = MORSE_LEVELS[levelId - 1] ?? [];
	const reviewCharacters = allCharacters.filter((item) => item.level < levelId);

	return {
		newCharacters,
		reviewCharacters,
	};
}

//pour choisir la mode au hasard: decode/encode
	//: Queation =  le type de retour de la fonction
function createQuestionFromCharacter(item: CharacterItem): Question {
	const mode: PracticeMode = Math.random() < 0.5 ? "decode" : "encode";

	return {
		...item,
		mode,
	};
}

//créer plusieurs questions à partir d’un groupe de caractères
	// = [] --> un tableau vide
	//let = créer une variable qui peut changer （!= const）
function createQuestionsFromPool(pool: CharacterItem[], count: number) {
	const questions: Question[] = [];

	for (let index = 0; index < count; index += 1) {
		const item = indexRandom(pool);
		questions.push(createQuestionFromCharacter(item));
	}

	return questions;
}

export function createQuestionList(levelId: LevelId) {
	const rule = LEVEL_RULES[levelId];
	const { newCharacters, reviewCharacters } = getCharactersForLevel(levelId);

	const newQuestionCount = Math.round(rule.questionCount * rule.newRatio);
	const reviewQuestionCount = rule.questionCount - newQuestionCount;

	const newQuestions = newCharacters.length > 0
			? createQuestionsFromPool(newCharacters, newQuestionCount)
			: [];

	const reviewPool = reviewCharacters.length > 0 ? reviewCharacters : newCharacters;

	const reviewQuestions = reviewPool.length > 0
			? createQuestionsFromPool(reviewPool, reviewQuestionCount)
			: [];

	return Orderrandom([...newQuestions, ...reviewQuestions]);
}
