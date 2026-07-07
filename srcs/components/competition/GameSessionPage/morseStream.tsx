"use client";
import { useEffect } from "react";
import styles from "./css/morseStream.module.css";
import { useI18n } from "@/lib/i18n";

type MorseStreamProps = {
	morse: string;
	showMorseText: boolean;
	speedWpm: number;
	disabled: boolean;
};

//attendre ms millisecondes
function wait(ms: number) {
	//resolve est la fonction qui termine une Promise
	return new Promise((resolve) => window.setTimeout(resolve, ms));
}

// occupe seulement de jouer un point ou un trait
async function playSymbol(
	context: AudioContext,
	symbol: string,
	dot: number,
	dash: number
) {
	//---------- generation ----------
	const oscillator = context.createOscillator();
	const gain = context.createGain();

	oscillator.type = "sine";
	oscillator.frequency.value = 650;
	gain.gain.value = 0.08;

	oscillator.connect(gain);
	gain.connect(context.destination);

	//---------- fait ----------
	oscillator.start();
	await wait(symbol === "-" ? dash : dot);
	oscillator.stop();
}

//la duree d'un point ou d'un trait
	//un mot standard par min = wmp * 50 dot
	//un dot standard = 60s / (wpm * 50(dot))
function getMorseDurations(speedWpm: number) {
	//WPM = le nombre de mots standard (5 caractères) transmis par minute
	const dot = Math.round(1200 / speedWpm);
	const dash = dot * 3;

	return { dot, dash };
}

async function waitAfterToken(nextToken: string | undefined, dot: number) {
	if (nextToken === "/") {
		await wait(dot * 7);
		return;
	}

	if (nextToken) {
		await wait(dot * 3);
	}
}

export default function MorseStream({
	morse,
	showMorseText,
	speedWpm,
	disabled,
}: MorseStreamProps) {

	const { dictionary } = useI18n();
	const t = dictionary.competitionGame;

	//useEffect ==> executer du code après l’affichage, pour contrôler quand exécuter les actions secondaires
	useEffect(() => {
		if (disabled || !morse.trim()) {
			return;
		}

		//let != const, on peut modifier apres
		// cancelled sert surtout aux cas spéciaux comme quitter la page...
		let cancelled = false;

		async function play() {
			const AudioContextClass = window.AudioContext;

			if (!AudioContextClass) {
				return;
			}

			//---------- des param ----------
			const { dot, dash } = getMorseDurations(speedWpm);
			const context = new AudioContextClass();
			//pour sesparer les caractere par les espace, et les mot par /
			//trim() ==> supp les espaces debut et de fin
			// / / ==> un regle, \s ==> espace, + ==> un ou plus
			const tokens = morse.trim().split(/\s+/);

			//---------- joue les symboles ----------
			for (let tokenIndex = 0; tokenIndex < tokens.length; tokenIndex += 1) {

				if (cancelled) {
					break;
				}

				const token = tokens[tokenIndex];

				if (token === "/") {
					continue;
				}

				//joue les symboles d'un token(un caractere)
				for (let symbolIndex = 0; symbolIndex < token.length; symbolIndex += 1) {
					if (cancelled) {
						break;
					}

					const symbol = token[symbolIndex];

					await playSymbol(context, symbol, dot, dash);

					//espace entre chaque caractere
					//si ce n'est pas le dernier symbole du token, attend un dot
					if (symbolIndex < token.length - 1) {
						await wait(dot);
					}
				}

				if (cancelled) {
					break;
				}

				//si un mot 7dot, sinon 3dot
				const nextToken = tokens[tokenIndex + 1];
				await waitAfterToken(nextToken, dot);

			}

			await context.close();
		}

		play();

		// la fonction de nettoyage
		// s’execute quand le composant disparaît ou avant que l’effet se relance
		return () => {
			cancelled = true;
		};
	}, [morse, speedWpm, disabled]);

	return (
		<div className={styles.streamPanel}>
			{showMorseText ? (
				<>
					<span className={styles.streamHint}>
						{t.morseScrollHint}
					</span>

					<strong className={styles.morseText}>{morse}</strong>
				</>
			) : (
				<strong className={`${styles.morseText} ${styles.hiddenText}`}>{t.hidden}</strong>
			)}
		</div>
	);
}

export function getSequenceDuration(morse: string, speedWpm: number) {
	const { dot, dash } = getMorseDurations(speedWpm);
	const tokens = morse.trim().split(/\s+/);
	let duration = 0;

	for (let tokenIndex = 0; tokenIndex < tokens.length; tokenIndex += 1) {
		const token = tokens[tokenIndex];

		if (token === "/") {
			continue;
		}

		for (let symbolIndex = 0; symbolIndex < token.length; symbolIndex += 1) {
			const symbol = token[symbolIndex];

			duration += symbol === "-" ? dash : dot;

			if (symbolIndex < token.length - 1) {
				duration += dot;
			}
		}

		const nextToken = tokens[tokenIndex + 1];

		if (nextToken === "/") {
			duration += dot * 7;
		} else if (nextToken) {
			duration += dot * 3;
		}
	}

	return duration;
}
