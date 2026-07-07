import styles from "./css/ranking.module.css";
import { useI18n } from "@/lib/i18n";

type Player = {
	id: string;
	username: string;
	score: number;
	correct: number;
	total: number;
};

type RankingProps = {
	players: Player[];
	status?: "live" | "final";
};

function getAccuracy(player: Player) {
	if (player.total === 0) {
		return "0%";
	}

	return `${Math.round((player.correct / player.total) * 100)}%`;
}

export default function Ranking({ players, status = "live" }: RankingProps) {
	const { dictionary } = useI18n();
	const t = dictionary.competitionGame;
	
	const highestScore = players[0]?.score ?? 0;

	return (
		<aside
			className={`${styles.ranking} ${ status === "final" ? styles.finalranking : styles.liveRanking}`}
		>
			<h2 className={styles.title}>{t.ranking}</h2>

			<div className={styles.rankingTable}>
				{/*----------- titre du tableau -----------*/}
					<div className={styles.rankingHeader}>
						<span>{t.rank}</span>
						<span>{t.player}</span>
						<span>{t.score}</span>
						<span>{t.accuracySymbol}</span>
					</div>
				{/*----------- données du tableau -----------*/}
				<ol className={styles.rankList}>
					{players.map((player, index) => {
						const rank = index + 1;
						//avec couleur et 👑, meme si 0
						const isWinner = player.score === highestScore;
						//supp couleur et 👑, lorsque = 0
						// const isWinner = highestScore > 0 && player.score === highestScore;

						return (
							<li
								key={player.id}
								className={`${styles.rankItem} ${isWinner ? styles.rankWinner : ""}`}
							>
								<span className={styles.rank}>
									{isWinner ? "👑" : rank}
								</span>

								<strong>{player.username}</strong>

								<span className={styles.score}>{player.score}</span>
								<span className={styles.accuracy}>{getAccuracy(player)}</span>
							</li>
						);
					})}
				</ol>
			</div>
		</aside>
	);
}
