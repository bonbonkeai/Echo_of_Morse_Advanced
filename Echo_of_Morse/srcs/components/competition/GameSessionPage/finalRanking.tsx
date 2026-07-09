import Ranking from "./ranking";
import styles from "./css/finalRanking.module.css";
import type { Player } from "./gameSessionType";
import { useI18n } from "@/lib/i18n";
import BackLink from "@/components/ui/back-link";

type FinalRankingProps = {
	radioId: string;
	players: Player[];
	winners: Player[];
};

function getWinnerNames(winners: Player[]) {
	return winners.map((winner) => winner.username).join(" / ");
}

export default function FinalRanking({
	radioId,
	players,
	winners,
}: FinalRankingProps) {
	const { dictionary } = useI18n();
	const t = dictionary.competitionGame;

	const isTie = winners.length > 1;

	return (
		<section className={styles.finalOverlay}>
			<div className={styles.winnerBlock}>
				<span>{isTie ? t.tie : t.winner}</span>
				<strong>{getWinnerNames(winners)}</strong>
			</div>

			<Ranking players={players} status="final" />

			<div className={styles.actions}>
				<BackLink href={`/competition/radio/${radioId}`}>
					{t.backToRadioLobby}
				</BackLink>
			</div>
		</section>
	);
}
