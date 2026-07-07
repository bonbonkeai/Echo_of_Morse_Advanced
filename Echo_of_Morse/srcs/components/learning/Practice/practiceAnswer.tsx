import styles from "@/components/learning/css/PracticeSession.module.css";
import type { Question } from "./practiceTypes";

type PracticeAnswerProps = {
	question: Question;
	answer: string;
	feedback: string;
	t: {
		yourAnswer: string;
		leftDot: string;
		rightDash: string;
		delete: string;
		submit: string;
		helpTitle: string;
		decodeHelpText: string;
		encodeHelpText: string;
		correct: string;
		correctAnswerText: string;
		nextQuestion: string;
	};
	onAddDot: () => void;
	onAddDash: () => void;
	onDelete: () => void;
	onSubmitEncode: () => void;
	onNextQuestion: () => void;
};

export default function PracticeAnswer({
	question,
	answer,
	feedback,
	t,
	onAddDot,
	onAddDash,
	onDelete,
	onSubmitEncode,
	onNextQuestion,
}: PracticeAnswerProps) {

	const correctAnswer = question.mode === "decode" ? question.character : question.morse;

	function displayMorseAnswer(morse: string) {
		//.split("") pour separer chaque charactere
		//.map((symbol, index) => ( ... )) pour transformer chaque charactere dans un tableau
		return morse.split("").map((symbol, index) => (
			<span
				// ici key ==> aide pour react pour differencier les elements d'une liste
				key={`${symbol}-${index}`}
				className={symbol === "." ? styles.morseDot : styles.morseDash}
			/>
		));
	}


	return (
		<section className={styles.answerPanel}>
			{/* ------------ la partie reponse (decode) ------------ */}
			<div className={styles.answerBox}>
				<span>{t.yourAnswer}</span>
				<strong>
					{answer}
				</strong>
			</div>

			{question.mode === "decode" && !feedback ? (
				<p className={styles.hint}>
					<strong>{t.helpTitle}</strong>
					<br />
					{t.decodeHelpText}
				</p>
			) : null}

			{/* ------------ la partie reponse (encode) ------------ */}
			{question.mode === "encode" && !feedback ? (
				<>
					<div className={styles.keyGrid}>
						<button type="button" className={styles.morseKey} onClick={onAddDot}>
							{t.leftDot}
						</button>

						<button type="button" className={styles.morseKey} onClick={onAddDash}>
							{t.rightDash}
						</button>
					</div>

					{/* ------------ text pour l'aide ----------- */}
					<p className={styles.hint}>
						<strong>{t.helpTitle}</strong>
						<br />
						{t.encodeHelpText}
					</p>

					<div className={styles.keyGrid}>
						<button type="button" className={styles.deleteKey} onClick={onDelete}>
							{t.delete}
						</button>

						<button type="button" onClick={onSubmitEncode}>
							{t.submit}
						</button>
					</div>
				</>
			) : null}

			{/* ------------ la partie resultat ------------ */}
			{feedback ? (
				<>
					<p
						className={`${styles.feedback} ${feedback === t.correct ? styles.feedbackGood : styles.feedbackBad}`}
					>
						<strong>{feedback}</strong>
						<br />
						<span>{t.correctAnswerText}</span>
						{question.mode === "encode" ? (
							<span className={styles.feedbackMorseAnswer}>
								{displayMorseAnswer(correctAnswer)}
							</span>
						) : (
							<span>{correctAnswer}</span>
						)}
					</p>
					
					<button
						type="button"
						className={`${styles.primaryAction} ${styles.nextAction}`}
						onClick={onNextQuestion}
					>
						{t.nextQuestion}
					</button>
				</>
			) : null}
		</section>
	);
}
