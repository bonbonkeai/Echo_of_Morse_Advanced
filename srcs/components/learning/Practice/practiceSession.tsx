//* Session de pratique morse : questions, reponses, son et lumiere.
"use client";

import { useI18n } from "@/lib/i18n";
import { useEffect, useState } from "react";
import styles from "@/components/learning/css/PracticeSession.module.css";
import Link from "next/link";

import { PracticeAudio } from "./practiceAudio";
import PracticeResult from "./practiceResult";
import type { Question } from "./practiceTypes";
import PracticeSettings from "./practiceSettings";
import { createQuestionList, getCharactersForLevel} from "./practiceQuestionList";
import { submitPracticeResult } from "./practiceApi";
import type { AnswerRecord } from "./practiceApi";
import PracticeCheatSheet from "./practiceCheatSheet";
import { LEVEL_RULES, type LevelId } from "./practiceData";
import PracticePrompt from "./practicePrompt";
import PracticeAnswer from "./practiceAnswer";

export default function PracticeSession({ levelId }: { levelId: number }) {
	//========================================== init ==========================================
	// --------- i18n ---------
	const { dictionary } = useI18n();
	const t = dictionary.learningPractice;

	// --------- valeurs de base ---------
	// Math.max(levelId, 1) ==> si trop petit, on garde 1
	// Math.min(Math.max(levelId, 1), 12) ==> si trop grand, on garde 12
	// But : garder levelId entre 1 et 12
	const safeLevelId = Math.min(Math.max(levelId, 1), 12) as LevelId;
	const rule = LEVEL_RULES[safeLevelId];

	// --------- question ---------
	// Avec () =>, appele seulement au premier rendu
	// Sans () =>, createQuestionList serait appele a chaque rendu
	// useState<type de retour>(valeur initiale)
	// questions = toute la liste de la session
	const [questions, setQuestions] = useState<Question[]>(() => createQuestionList(safeLevelId));
	const [questionIndex, setQuestionIndex] = useState(1);
	// question = la question actuelle
	const question = questions[questionIndex - 1];

	// --------- verification ---------
	const [correctCount, setCorrectCount] = useState(0);
	const [answer, setAnswer] = useState("");
	// message affiche quand l'utilisateur a fini
	const [feedback, setFeedback] = useState("");
	const [isFinished, setIsFinished] = useState(false);

	// --------- lampe et audio ---------
	const [audioEnabled, setAudioEnabled] = useState(true);
	const [visualEnabled, setVisualEnabled] = useState(true);

	const {
		bulbOn,
		questionPlaying,
		playQuestionMorse,
		playCheatSheetMorse,
	} = PracticeAudio({audioEnabled, visualEnabled,});


	// --------- historique des reponses ---------
	const [answerHistory, setAnswerHistory] = useState<AnswerRecord[]>([]);

	const progressText = `${questionIndex} / ${rule.questionCount}`;

	const finalAccuracy = Math.round((correctCount / rule.questionCount) * 100);
	const hasPassed = correctCount >= rule.passCount;

	// Deux conditions : question existe, puis mode decode ou encode
	const expectedAnswer = question // (=false) --> expectedAnswer = ""
		? question.mode === "decode" // (=false) --> question.morse
			? question.character
			: question.morse
		: "";

	// --------- donnes cheatSheet ---------
	const { newCharacters, reviewCharacters } = getCharactersForLevel(safeLevelId);
	const cheatSheetItems = [...reviewCharacters, ...newCharacters];

	//========================================== fonction ==========================================
	async function playSignal() {
		if (!question) {
			return;
		}

		await playQuestionMorse(question.morse);
	}

	// --------- memoriser la reponse en cours ---------
	function recordAnswer(wasCorrect: boolean) {
		const newRecord: AnswerRecord = { char: question.character, correct: wasCorrect };
		setAnswerHistory((prev) => [...prev, newRecord]);

		if (wasCorrect) {
			setCorrectCount((count) => count + 1);
		}
	}

	// --------- envoyer le resultat final ---------
	async function submitResult() {
		const finalCorrectCount = answerHistory.filter((record) => record.correct).length;
		const accuracy = Math.round((finalCorrectCount / rule.questionCount) * 100);
		const passed = finalCorrectCount >= rule.passCount;

		try {
			await submitPracticeResult({
				levelId: safeLevelId,
				correctCount: finalCorrectCount,
				questionCount: rule.questionCount,
				accuracy,
				passed,
				answers: answerHistory,
			});
		} catch (error) {
		}

		setIsFinished(true);
	}

	// --------- verifier la reponse en mode decode ---------
	function submitDecodeAnswer(value: string) {
		if (!question) {
			return;
		}

		if (question.mode !== "decode" || feedback) {
			return;
		}

		const normalized = value.toUpperCase();
		const wasCorrect = normalized === expectedAnswer;

		setAnswer(normalized);
		setFeedback(wasCorrect ? t.correct : t.wrong);
		recordAnswer(wasCorrect);
	}

	// --------- verifier la reponse en mode encode ---------
	function submitEncodeAnswer() {
		if (!question) {
			return;
		}
		if (question.mode !== "encode" || feedback || !answer) {
			return;
		}

		const wasCorrect = answer === expectedAnswer;

		setFeedback(wasCorrect ? t.correct : t.wrong);
		recordAnswer(wasCorrect);
	}

	function handleNextQuestion() {
		if (questionIndex >= rule.questionCount) {
			void submitResult();
			return;
		}

		setQuestionIndex((index) => index + 1);
		setAnswer("");
		setFeedback("");
	}

	useEffect(() => {
		if (!question) {
			return;
		}

		// event: KeyboardEvent ==> type de l'evenement clavier
		function handleKeyDown(event: KeyboardEvent) {
			if (isFinished) {
				return;
			}

			// --------- quand le feedback est visible ----------
			if (feedback && event.key === "Enter") {
				event.preventDefault();
				handleNextQuestion();
				return;
			}

			// --------- mode encode (morse) ---------
			if (question.mode === "encode") {
				if (event.key === "ArrowLeft") {
					event.preventDefault(); // bloque l'action normale du navigateur
					setAnswer((value) => value + ".");
				}

				if (event.key === "ArrowRight") {
					event.preventDefault();
					setAnswer((value) => value + "-");
				}

				// supprime le dernier caractere
				// slice garde tout sauf le dernier caractere
				if (event.key === "Backspace") {
					event.preventDefault();
					setAnswer((value) => value.slice(0, -1));
				}

				if (event.key === "Enter") {
					event.preventDefault();
					submitEncodeAnswer();
				}

				return;
			}

			// --------- mode decode (caractere) ---------
			// lettres, chiffres ou symboles autorises
			// /^...$/  ==> correspond a un seul caractere
			// test() renvoie true ou false
			if (/^[a-zA-Z0-9]$/.test(event.key) || /^[.,?!/()&:;=+_$@"-]$/.test(event.key)) {
				submitDecodeAnswer(event.key);
			}
		}

		// ajoute l'ecoute clavier
		window.addEventListener("keydown", handleKeyDown);
		// retire l'ecoute pour eviter les doublons
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [answer, expectedAnswer, feedback, isFinished, question, questionIndex, t]);

	useEffect(() => {
		if (!question) {
			return;
		}
		if (question.mode === "decode") {
			playSignal();
		}
	}, [question]);

	if (!question) {
		return <div><h1>{t.noQuestion}</h1></div>;
	}

	//========================================== page affichee ==========================================
	// ------------------ page resultat (PracticeResult) ------------------
	if (isFinished) {
		return (
			<PracticeResult
				levelId={safeLevelId}
				correctCount={correctCount}
				questionCount={rule.questionCount}
				passCount={rule.passCount}
				finalAccuracy={finalAccuracy}
				hasPassed={hasPassed}
				t={t}
				onRestart={() => {
					setQuestions(createQuestionList(safeLevelId));
					setQuestionIndex(1);
					setCorrectCount(0);
					setAnswer("");
					setFeedback("");
					setIsFinished(false);
					setAnswerHistory([]);
				}}
			/>
		);
	}

	return (
		<section className={styles.practiceShell} aria-labelledby="practice-title">
			{/* ======================== entete ======================== */}
			<div className={styles.practiceHeader}>
				{/* ------------ titre du niveau ------------ */}
				<div className={styles.practiceTitleBlock}>
					<Link className={styles.backToLevelsButton} href="/learning/levels">
						‹
					</Link>

					<h1 id="practice-title" className={styles.practiceTitle}>
						{t.level} {safeLevelId}
					</h1>
				</div>
				{/* ------------ score et progression ------------ */}
				<div className={styles.scoreBox}>
					<span>{progressText}</span>
					<strong>{correctCount} {t.correctCount}</strong>
				</div>
			</div>

			<div className={styles.practiceGrid}>
				{/* ======================== carte question ======================== */}
				<PracticePrompt
					question={question}
					bulbOn={bulbOn}
					visualEnabled={visualEnabled}
					isPlaying={questionPlaying}
					t={t}
					onReplaySignal={playSignal}
				/>

				{/* ======================== carte reponse ======================== */}
				<PracticeAnswer
					question={question}
					answer={answer}
					feedback={feedback}
					t={t}
					onAddDot={() => setAnswer((value) => value + ".")}
					onAddDash={() => setAnswer((value) => value + "-")}
					onDelete={() => setAnswer((value) => value.slice(0, -1))}
					onSubmitEncode={submitEncodeAnswer}
					onNextQuestion={handleNextQuestion}
				/>
			</div>

			<PracticeCheatSheet
				items={cheatSheetItems}
				title={t.cheatSheetTitle}
				playLabel={t.playSound}
				onPlay={playCheatSheetMorse}
			/>

			<PracticeSettings
				audioLabel={t.audio}
				lightLabel={t.light}
				audioEnabled={audioEnabled}
				visualEnabled={visualEnabled}
				onAudioChange={setAudioEnabled}
				onVisualChange={setVisualEnabled}
			/>
		</section>
	);
}
