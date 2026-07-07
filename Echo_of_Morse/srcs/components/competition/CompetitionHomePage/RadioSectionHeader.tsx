"use client";

import { useI18n } from "@/lib/i18n";
import styles from "@/../app/competition/competition.module.css";

export default function RadioSectionHeader() {
	const { dictionary } = useI18n();
	const t = dictionary.competitionHome;

	return (
		<div className={styles.sectionHeader}>
			<div>
				<h2 id="radio-waves" className={styles.sectionTitle}>
					{t.radioWaves}
				</h2>
				<p className={styles.sectionDescription}>
					{t.radioWavesDescription}
				</p>
			</div>
		</div>
	);
}
