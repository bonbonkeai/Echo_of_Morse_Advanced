//* Options pour le son et la lumiere

import styles from "@/components/learning/css/PracticeSession.module.css";

// onAudioChange est une fonction. 
// Elle recoit true ou false. Elle sert a dire au parent si le son est active ou non. 
// void veut dire qu’elle ne retourne rien d’important.
type PracticeSettingsProps = {
	audioLabel: string;
	lightLabel: string;
	audioEnabled: boolean;
	visualEnabled: boolean;
	onAudioChange: (enabled: boolean) => void;
	onVisualChange: (enabled: boolean) => void;
};

export default function PracticeSettings({
	audioLabel,
	lightLabel,
	audioEnabled,
	visualEnabled,
	onAudioChange,
	onVisualChange,
}: PracticeSettingsProps) {
	return (
		<section className={styles.settingsPanel}>
			<label>
				<input
					type="checkbox"
					checked={audioEnabled}
					// Si la case est cochee, elle envoie true. Sinon, elle envoie false
					onChange={(event) => onAudioChange(event.target.checked)}
				/>
				{audioLabel}
			</label>

			<label>
				<input
					type="checkbox"
					checked={visualEnabled}
					onChange={(event) => onVisualChange(event.target.checked)}
				/>
				{lightLabel}
			</label>
		</section>
	);
}
