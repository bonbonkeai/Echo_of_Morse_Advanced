import styles from "./css/gameTimer.module.css";

export default function GameTimer({ secondsLeft }: { secondsLeft: number }) {
	//Math.floor ==> prendre la partie entiere(vers le bas)
	const minutes = Math.floor(secondsLeft / 60);
	//padStart ==> ajouter des 0 devant les secondes si elles sont pas assez longues
	const seconds = String(secondsLeft % 60).padStart(2, "0");

  return (
		<div className={styles.timer}>
			{minutes}:{seconds}
		</div>
  );
}
