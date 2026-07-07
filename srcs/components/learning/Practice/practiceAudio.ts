//* jouer le son et la lumiere

import { useEffect, useRef, useState } from "react";
import { wait } from "./practiceQuestionList";

type PlayMorseOptions = {
	audioEnabled: boolean;
	visualEnabled: boolean;
};

//----------------------------- creer le contexte audio -----------------------------
async function createAudioContext(audioEnabled: boolean) {
	// 2e ==> verifie si le code s'execute hors du navigateur
	// 3e ==> verifie si le navigateur ne supporte pas l'API audio
	if (!audioEnabled || typeof window === "undefined" || !window.AudioContext) {
		return null;
	}

	let context: AudioContext | null = null;

	try {
		context = new AudioContext();

		//si le contexte audio est en pause
		if (context.state === "suspended") {
			//essaie de le reactiver 
			await context.resume();
		}

		return context;

	} catch (error) {

		if (context) {
			await context.close().catch(() => {});
		}

		return null;
	}
}

//----------------------------- jouer le son -----------------------------
async function playTone(context: AudioContext | null, duration: number) {
	//verifier le contexte audio
	if (!context) {
		await wait(duration);
		return;
	}

	//generer le son
	const oscillator = context.createOscillator();
	//controle du volume
	const gain = context.createGain();

	//son: type, frequence, volume
	oscillator.type = "sine";
	oscillator.frequency.value = 650;
	gain.gain.value = 0.12;

	// connecter l'audio : generateur -> volume -> haut-parleur
	oscillator.connect(gain);
	gain.connect(context.destination);

	oscillator.start();
	await wait(duration);
	oscillator.stop();

	oscillator.disconnect();
	gain.disconnect();
}

export function PracticeAudio({
	audioEnabled,
	visualEnabled,
}: PlayMorseOptions) {
	//----------------------------- init -----------------------------
	const [bulbOn, setBulbOn] = useState(false);
	const [questionPlaying, setQuestionPlaying] = useState(false);
	const [cheatSheetPlaying, setCheatSheetPlaying] = useState(false);

	// donne un id a chaque lecture pour annuler l'ancienne lecture
	const playIdRef = useRef(0);
	//pour annuler l'action lorsqu'on quitte, ou l'ancienne lecture
	const isMountedRef = useRef(true);

	//----------------------------- fonction pour annuler tous -----------------------------
	//annuler tous les actions de la lecture actuelle
	function stopCurrentPlay() {
		playIdRef.current += 1;

		// change l’id actuel : les anciennes lectures deviennent invalides
		if (!isMountedRef.current) {
			return;
		}

		setBulbOn(false);
		setQuestionPlaying(false);
		setCheatSheetPlaying(false);
	}

	//----------------------------- fonction principal pour jouer -----------------------------
	async function playMorse(
		morse: string,
		useLight: boolean,
		setBusy: (value: boolean) => void
	) {
		//--------- 1. stopper tous ---------
		stopCurrentPlay();

		//--------- 2. obtenir id ---------
		const playId = playIdRef.current;

		let context: AudioContext | null = null;

		//si la page existe encore
		if (isMountedRef.current) {
			setBusy(true);
		}

		try {
			//--------- 3. creer l'env audio, si le son ferme, context = null ---------
			context = await createAudioContext(audioEnabled);

			// --------- 4. jouer tous les symboles ---------
			for (let index = 0; index < morse.length; index += 1) {
				// si une nouvelle lecture a commence, on arrete cette ancienne lecture
				if (playIdRef.current !== playId) {
					return;
				}

				const symbol = morse[index];
				const duration = symbol === "." ? 160 : 420;

				// debut d'un symbole : on allume la lampe
				if (useLight && visualEnabled && isMountedRef.current) {
					setBulbOn(true);
				}

				await playTone(context, duration);

				// fin d'un symbole : on eteint la lampe
				if (useLight && isMountedRef.current) {
					setBulbOn(false);
				}

				// apres await, une nouvelle lecture a peut-etre commence
				if (playIdRef.current !== playId) {
					return;
				}

				//entre chaque symbole
				if (index < morse.length - 1) {
					await wait(160);
				}
			}
		} catch (error) {
		} finally {
			//nettoie l'etat a la fin de la lecture
			if (context) {
				await context.close().catch(() => {});
			}

			if (isMountedRef.current && playIdRef.current === playId) {
				setBulbOn(false);
				setBusy(false);
			}
		}
	}

	//----------------------------- 2 fonction pour jouer -----------------------------
	async function playQuestionMorse(morse: string) {
		await playMorse(morse, true, setQuestionPlaying);
	}

	async function playCheatSheetMorse(morse: string) {
		await playMorse(morse, false, setCheatSheetPlaying);
	}

	//----------------------------- nettoyer -----------------------------
	// [] ==> une fois
	// sert au nettoyage quand le composant disparait
	useEffect(() => {
		isMountedRef.current = true;

		return () => {
			isMountedRef.current = false;
			playIdRef.current += 1;
		};
	}, []);

	return {
		bulbOn,
		questionPlaying,
		playQuestionMorse,
		playCheatSheetMorse,
	};
}
