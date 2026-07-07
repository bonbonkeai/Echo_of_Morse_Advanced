"use client";

import { useI18n } from "@/lib/i18n";
import { useEffect, useRef, type ChangeEvent, type UIEvent } from "react";
import styles from "./css/answer.module.css";

type AnswerProps = {
	value: string;
	target: string;
	disabled: boolean;
	isCorrect: boolean;
	onChange: (value: string) => void;
};

export default function Answer({
	value,
	target,
	disabled,
	isCorrect,
	onChange,
}: AnswerProps) {
	const { dictionary } = useI18n();
	const t = dictionary.competitionGame;

	//useRef = arder une valeur sans relancer l’affichage de la page
	//HTMLTextAreaElement = textarea, et HTMLDivElement = div
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const previewRef = useRef<HTMLDivElement>(null);
	const normalizedTarget = target.toUpperCase();

	//lire la status du scroll du textarea
		//UIEvent = un type d’evnement(scroll du textarea, clic, input...)
	function syncPreviewScroll(event: UIEvent<HTMLTextAreaElement>) {
		if (previewRef.current) {
			//synchroniser la position du texte affiché
			//scrollLeft = la position horizontale du scroll
			previewRef.current.scrollLeft = event.currentTarget.scrollLeft;
		}
	}

	//remplace les retours à la ligne par des espaces
	function handleChange(event: ChangeEvent<HTMLTextAreaElement>) {

		//\r? ==> /r est optionnel, \n ==> retour à la ligne, g ==> global (tous les retours à la ligne), / ==> une expression régulière
		const newValue = event.target.value.replace(/\r?\n/g, " ");
		onChange(newValue);
	}

	useEffect(() => {
		//si les éléments ne sont pas encore chargés
		if (!textareaRef.current || !previewRef.current) {
			return;
		}

		//si il n'y a pas encore de valeur
		if (!value) {
			textareaRef.current.scrollLeft = 0;
		}

		previewRef.current.scrollLeft = textareaRef.current.scrollLeft;
	}, [value]);

	return (
		<section className={styles.answerBlock}>
			<div className={`${styles.answerField} ${isCorrect ? styles.answerCorrect : ""}`}>
				<div ref={previewRef} className={styles.answerPreview} aria-hidden="true">
					{/*--------------------- la reponse ---------------------*/}
					{/* rouge ==> valeur erreur ou depsse, noir ==> valeur correcte*/}
					{value ? (
						value.split("").map((character, index) => {
							const isWrong =
								(index >= normalizedTarget.length) || (character.toUpperCase() !== normalizedTarget[index]);
							return (
								<span
									key={`${character}-${index}`}
									className={isWrong ? styles.characterWrong : ""}
								>
									{character}
								</span>
							);
						})
					) : (
						<span className={styles.answerLabel}>
							{t.answerPlaceholder}
						</span>
					)}
				</div>

				{/*--------------------- la reponse ---------------------*/}
				{/*wrap="off" ==> désactiver le retour à la ligne automatique */}
				{/*spellCheck={false} ==> désactiver la vérification du navigateur*/}
				{/*onKeyDown ==> gérer les appuis sur les touches du clavier */}
				<textarea
					ref={textareaRef}
					value={value}
					readOnly={disabled}
					rows={1}
					wrap="off"
					spellCheck={false}
					onScroll={syncPreviewScroll}
					onChange={handleChange}
					onKeyDown={(event) => {
						if (event.key === "Enter") {
							event.preventDefault();
						}
					}}
				/>
			</div>
		</section>
	);
}