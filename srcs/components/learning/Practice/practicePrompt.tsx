import styles from "@/components/learning/css/PracticeSession.module.css";
import type { Question } from "./practiceTypes";

type PracticePromptProps = {
	question: Question;
	bulbOn: boolean;
	visualEnabled: boolean;
	isPlaying: boolean;
	t: {
		decodeSignal: string;
		encodeCharacter: string;
		playing: string;
		replaySignal: string;
	};
	onReplaySignal: () => void;
};

export default function PracticePrompt({
	question,
	bulbOn,
	visualEnabled,
	isPlaying,
	t,
	onReplaySignal,
}: PracticePromptProps) {
	return (
		<section className={styles.promptPanel}>
			{/*------------ affiche pour la mode: encode/decode ------------*/}
			<div className={styles.modeBadge}>
				{question.mode === "decode" ? t.decodeSignal : t.encodeCharacter}
			</div>

			{question.mode === "decode" ? (
				<>
					{/*------------ ampoule ------------*/}
					<div
						className={`${styles.bulb} ${bulbOn ? styles.bulbOn : ""} ${!visualEnabled ? styles.bulbHidden : ""}`}
					>
						💡
					</div>

					{/*------------ bouton pour rejouer le signa ------------*/}
					<button
						type="button"
						className={styles.secondaryAction}
						onClick={onReplaySignal}
						disabled={isPlaying}
					>
						{isPlaying ? t.playing : t.replaySignal}
					</button>
				</>
			) : (
				<>
				{/* ------------ la mode encode: la lettre et text ------------ */}
				<div className={styles.characterPrompt}>{question.character}</div>
				</>
			)}
		</section>
	);
}
