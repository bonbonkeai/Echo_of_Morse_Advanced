//* Objectif : gerer la partie i18n (traduction)
//Ce fichier est s’exécute dans le navigateur donc on peut aussi utiliser les fonctions fournies par le navigateur.
//ex：ici on a utilise la fonction "useState"
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import en from "./en";
import fr from "./fr";
import zh from "./zh";

// Language = une entree possible: en, fr ou zh
//| = ou
export type Language = "en" | "fr" | "zh";

//typeof = permet de prendre le type d'une variable ou d'un objet
//pour les autres dictionnaires ont meme key que fr
type dictionaryContent = typeof fr;

// Record = un type <key, value>>
const dictionaries: Record<Language, dictionaryContent> = { en, fr, zh };

//======================================== 1. creer un global et met valeur par defaut (createContext) ========================================
//interface = comme "strcut" en C, mais pour les objets en TypeScript
interface I18nContextType {
	language: Language; 				//--> indique la langue
	dictionary: dictionaryContent;		//--> //--> les contenue dans le fichier pour cette langue
	setLanguage: (l: Language) => void;//une fonction qui prend une langue et ne retourne rien (void)
}

//createContext = un peu comme une variable globale（un box global）, les contenus sont accessibles dans tous
//dans createContext(...) = les valeurs par defaut
const I18nContext = createContext<I18nContextType>({
	language: "fr",
	dictionary: fr,
	setLanguage: () => {},
});

//======================================== 2. donner des valeur pour un global (useState & provider) ========================================
//{ children }: { children: React.ReactNode } = une action dans paramete, creer une varibale "children" qui est de type React.ReactNode
//React.ReactNode = type qui représente tout ce que React peut afficher dans une page
//ex: 
// <I18nProvider>
//   <App />
// </I18nProvider>
//ici, children = <App />
export function I18nProvider({ children }: { children: React.ReactNode }) {

	//useState = cree une variable geree par React et une fonction pour la modifier
	//il faut utiliser cette fonction pour que React mette a jour la page quand la variable change
	const [selectedLanguage, setSelectedLanguage] = useState<Language>("fr");

	//---------------- 1. lire la langue dans localStorage ----------------
	useEffect(() => {
		// localStorage --> un petit stockage du navigateur
		// getItem --> lit la cle "language"
		const savedLanguage = window.localStorage.getItem("language");

		if (savedLanguage === "en" || savedLanguage === "fr" || savedLanguage === "zh") {
			setSelectedLanguage(savedLanguage);
		}
	}, []);

	//---------------- 2. lorsque user change la langue ----------------
	function changeLanguage(language: Language) {
		setSelectedLanguage(language);
		//mettre par key value --> "language": language dans localStorage
		//pour aider de memoire
		window.localStorage.setItem("language", language);
	}

	return (
		//envoyer les donnes pour tous (le projet)
		//I18nContext.Provider value = --> on utilise le box global pour fournir les valeurs
		<I18nContext.Provider value={{ 
			language: selectedLanguage,					//langue actuelle
			dictionary: dictionaries[selectedLanguage], //dictionaire pour cette langue
			setLanguage: changeLanguage,				//une fonction pour changer de la langue
		}}>
		{children}
		</I18nContext.Provider>
	);
}

//======================================== 3. prrendre les valeurs de ce global (useContext) ========================================
export function useI18n() {
  return useContext(I18nContext);
}

