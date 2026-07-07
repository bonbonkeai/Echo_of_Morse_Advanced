import Link from "next/link";
import styles from "@/components/learning/css/PracticeSession.module.css";

type PracticeResultProps = {
	levelId: number;
	correctCount: number;
	questionCount: number;
	passCount: number;
	finalAccuracy: number;
	hasPassed: boolean;
	t: {
		level: string;
		complete: string;
		levelPassed: string;
		tryAgain: string;
		resultSummary: string;
		passConditionText: string;
		accuracy: string;
		status: string;
		unlockedNext: string;
		needsReview: string;

		practiceAgain: string;
		backToLevels: string;
		nextLevel: string;
	};
	//recevoir une fonction onRestart qui retourne rien et pas besoin d'avoir param
	onRestart: () => void;
};

export default function PracticeResult({
	levelId,
	correctCount,
	questionCount,
	passCount,
	finalAccuracy,
	hasPassed,
	t,
	onRestart,
}: PracticeResultProps) {
	return (
		<section className={styles.practiceShell}>
			<div className={styles.resultPanel}>
				<p className={styles.kicker}>
					{t.level} {levelId} {t.complete}
				</p>
				{/*------------------ titre resultat ------------------*/}
				<h1 className={styles.resultTitle}>
					{hasPassed ? `🎉 ${t.levelPassed} 🎉` : t.tryAgain}
				</h1>

				{/*------------------ des donnees pour resultat ------------------*/}
				<p className={styles.resultText}>
					<span>
						{t.resultSummary
							.replace("{correctCount}", String(correctCount))
							.replace("{questionCount}", String(questionCount))}
					</span>
					<span>
						{t.passConditionText
							.replace("{passCount}", String(passCount))
							.replace("{questionCount}", String(questionCount))}
					</span>
				</p>

				<div className={styles.resultStats}>
					<div>
						<span>{t.accuracy}</span>
						<strong>{finalAccuracy}%</strong>
					</div>

					<div>
						<span>{t.status}</span>
						<strong>{hasPassed ? t.unlockedNext : t.needsReview}</strong>
					</div>
				</div>

				{/*------------------ des boutons ------------------*/}
				<div className={styles.resultActions}>
					<Link
						className={`${styles.resultButton} ${styles.resultBackButton}`}
						href="/learning/levels"
					>
						{t.backToLevels}
					</Link>

					<div className={styles.resultRightActions}>
						<button
							type="button"
							className={`${styles.resultButton} 
										${ hasPassed ? styles.resultRetryButton : styles.resultNextButton}`}
							onClick={onRestart}
						>
							{t.practiceAgain}
						</button>

						{hasPassed && levelId < 12 ? (
							<Link
								className={`${styles.resultButton} ${styles.resultNextButton}`}
								href={`/learning/levels/${levelId + 1}/practice`}
							>
								{t.nextLevel}
							</Link>
						) : null}
					</div>

				</div>
			</div>
		</section>
	);
}
