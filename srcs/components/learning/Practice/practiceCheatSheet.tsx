"use client";

import { useState } from "react";
import styles from "@/components/learning/css/PracticeSession.module.css";
import type { CharacterItem } from "./practiceTypes";

type PracticeCheatSheetProps = {
	items: CharacterItem[];
	title: string;
	playLabel: string;
	onPlay: (morse: string) => void;
};

export default function PracticeCheatSheet({
	items,
	title,
	playLabel,
	onPlay,
}: PracticeCheatSheetProps) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<section className={styles.cheatSheet}>
			<button
				type="button"
				className={styles.cheatSheetToggle}
				onClick={() => setIsOpen((value) => !value)}
			>
				{/* ------------ titre ------------ */}
				<span className={styles.cheatSheetArrow}>
					{isOpen ? "▼" : "▶"}
				</span>
				<span>{title}</span>

			</button>

			{isOpen ? (
				<div className={styles.cheatSheetContent}>
					<div className={styles.cheatSheetGrid}>
						{items.map((item) => (
							<div key={item.character} className={styles.cheatSheetItem}>
								<strong>{item.character}</strong>
								<span>{item.morse}</span>

								<button
									type="button"
									className={styles.cheatSheetSoundButton}
									onClick={() => onPlay(item.morse)}
									title={playLabel}
								>
									<span>📢</span>
									<span>{playLabel}</span>
								</button>

							</div>
						))}
					</div>
				</div>
			) : null}
		</section>
	);
}
