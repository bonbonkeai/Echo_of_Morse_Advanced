"use client";

import { useI18n } from "@/lib/i18n";
import styles from "@/../app/competition/competition.module.css";

export default function CompetitionHeader() {
	const { dictionary } = useI18n();
	const t = dictionary.competitionHome;

	return (
		<header className={styles.hero}>
			<h1 className={styles.title}>{t.pageTitle}</h1>
		</header>
	);
}
