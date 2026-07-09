const fr = {
	profile: {
		loading: "Chargement du profil...",
		loginRequired: "Veuillez vous connecter pour voir votre profil.",
		noEmail: "Aucun email",
		editProfile: "Modifier le profil",
		defaultUser: "Utilisateur",
		//------- statistique------- 
		bio: "Bio",
		stats: "Statistiques",
		accuracy: "Précision",
		learningLevel: "Niveau d'apprentissage",
		levelPrefix: "Niveau",
		friends: "Amis",
		joined: "Inscription",
		backToLearning: "Retour à l'apprentissage",
		//------- oauth ------- 
		connectedAccounts: "Comptes associés",
		notConnected: "Non associé",
		connected: "Associé",
		bindGoogle: "Associer Google",
		bindFortyTwo: "Associer 42",
		unlinkGoogle: "Dissocier Google",
		unlinkFortyTwo: "Dissocier 42",
		unlinkError: "Impossible de dissocier le compte. Veuillez réessayer plus tard.",
		linkError: "Impossible d'associer le compte. Veuillez réessayer plus tard.",
		//------------------ profil friends ------------------
		userNotFound: "Utilisateur introuvable",
		avatarAlt: "Photo de profil de {displayName}",
		//------------------ profil edit ------------------
		loadingCurrentProfile: "Chargement du profil actuel...",
		editLoginRequired: "Veuillez vous connecter pour modifier votre profil.",
		saving: "Enregistrement...",
		failedToLoadProfile: "Impossible de charger le profil.",
		loadProfileError: "Une erreur est survenue pendant le chargement du profil.",
		missingUserId: "Identifiant utilisateur manquant.",
		changeAvatar: "Changer d'avatar",
		username: "Nom d'utilisateur",
		usernamePlaceholder: "Entrez votre nom d'utilisateur",
		bioPlaceholder: "Parlez un peu de vous",
		saveChanges: "Enregistrer les modifications",
		chooseImageFile: "Veuillez choisir un fichier image.",
		imageTooLarge: "Veuillez choisir une image de moins de 500 Ko.",
		readImageError: "Impossible de lire cette image.",
		failedToUpdateProfile: "Impossible de mettre à jour le profil.",
		updateProfileError: "Une erreur est survenue pendant la mise à jour du profil.",
		usernameRequired: "Le nom d'utilisateur est requis.",
		usernameTooLong: "Le nom d'utilisateur ne peut pas depasser 20 caracteres.",
		bioTooLong: "La bio ne peut pas depasser 120 caracteres.",
	},

	layout: {
		//------------------ navbar ------------------
		brand: "Échos de Morse",
		dashboard: "Tableau de bord",
		profile: "Profil",
		login: "Connexion",
		logout: "Déconnexion",
		user: "Utilisateur",

		openNotifications: "Ouvrir les notifications",
		notifications: "Notifications",
		noNewNotifications: "Aucune nouvelle notification.",
		gameInvitations: "Invitations de jeu",
		friendRequests: "Demandes d'ami",
		radioLobbyFallback: "un lobby radio",
		invitedYouToRadio: "vous invite à rejoindre {radioName}. Vous avez 1 minute pour accepter.",
		sentYouFriendRequest: "vous a envoyé une demande d'ami.",
		view: "Voir",
		messages: "Messages",
		system: "Système",
		systemMessages: "Messages système",
		unreadSystemNotifications: "Notifications système non lues : {count}.",

		//------------------ footer ------------------
		footerDescription: "Apprenez, communiquez et relevez des défis avec le code Morse.",
		privacyPolicy: "Politique de confidentialité",
		termsOfService: "Conditions d'utilisation",
		copyright: "© 2026 Échos de Morse",
		mainNavigation: "Navigation principale",
		footerNavigation: "Navigation du pied de page",

		//------------------ languageSwitcher ------------------
		languageSwitcher: "Changer de langue",

		//------------------ SkipLink ------------------
		skipToMainContent: "Aller au contenu principal",
	},

	dashboard: {
		modulesLabel: "Modules d'accueil",

		openModule: "Ouvrir le module →",

		learningTitle: "Apprentissage",
		learningDescription: "Entraînez-vous au code Morse et améliorez votre décodage.",

		chatTitle: "Chat",
		chatDescription: "Discutez avec les autres utilisateurs en temps réel.",

		competitionTitle: "Compétition",
		competitionDescription: "Participez à des défis et comparez vos résultats.",
	},

	home: {
		onlineNow: "En ligne maintenant",
		usersConnected: "{count} utilisateur(s) connecté(s)",

		heroEyebrow: "Atelier Morse",
		heroTitle: "Échos de Morse",
		heroLead: "Des premiers exercices aux matchs en direct, tout passe par un même espace.",
		heroPrimaryAction: "Commencer l'apprentissage",
		heroSecondaryAction: "Entrer en compétition",
		signalPreviewLabel: "Aperçu du signal",
		signalPreviewTitle: "Apprentissage, chat et matchs radio",
		signalPreviewDescription: "Les signaux, la progression et l'état des matchs restent synchronisés.",
		heroPillOne: "Répétition espacée",
		heroPillTwo: "Chat en temps réel",
		heroPillThree: "Lobbys radio",
		heroPillFour: "Statut des amis",

		introTitle: "Un projet Morse ?",
		introDescription: "Le code Morse devient ici une façon d'apprendre les signaux, le rythme, la communication et l'interaction.",

		historyTitle: "Histoire du Morse",
		historyParagraph1: "Le code Morse a été créé au dix-neuvième siècle pour envoyer des messages à distance avec le télégraphe électrique. Il transforme le texte en signaux courts et longs.",
		historyParagraph2: "Le système porte le nom de Samuel Morse. Il a travaillé avec Alfred Vail et d'autres personnes pour créer une méthode pratique de communication.",
		historyParagraph3: "Le code Morse a été important pour les trains, la mer, l'armée, le journalisme et les secours d'urgence.",
		historyParagraph4: "Aujourd'hui, il n'est plus le moyen principal de communication mondiale, mais il reste un outil historique et utile pour apprendre.",

		onlineFriends: "Amis en ligne",
		checkingSession: "Vérification de votre session...",
		onlineFriendsDescription: "Amis disponibles pour discuter ou jouer.",
		loadingOnlineFriends: "Chargement des amis en ligne...",
		noFriendsOnline: "Aucun ami en ligne pour le moment.",
		viewAllFriends: "Voir tous les amis",
		unknownUser: "Utilisateur inconnu",
		avatarAlt: "Photo de profil de {displayName}",
		chat: "Chat",
		invite: "Inviter",
		pending: "En attente",
		inviteAlreadyPending: "Une invitation de jeu est déjà en attente.",
		inviteSent: "Invitation envoyée à {displayName}. En attente de sa réponse.",
		failedToSendInvitation: "Impossible d'envoyer l'invitation.",
	},

	notification: {
		newGameInvitationTitle: "Nouvelle invitation de jeu",
		gameInvitationToastBody: "{username} vous invite à rejoindre {radioName}.",
		newFriendRequestTitle: "Nouvelle demande d'ami",
		friendRequestToastBody: "{username} vous a envoyé une demande d'ami.",
		newMessageFromTitle: "Nouveau message de {username}",
		radioLobbyFallback: "un lobby radio",

	},
	//=========================================== learning =========================================== 
	learningPractice: {
		//------------------ titre ------------------
		level: "Niveau",

		//------------------ exo ------------------
		decodeSignal: "Décoder le signal",
		playing: "Lecture...",
		replaySignal: "Rejouer le signal",
		encodeCharacter: "Encoder le caractère",

		//------------------ en haut à doite ------------------
		correctCount: "correctes",

		//------------------ réponse ------------------
		yourAnswer: "Votre réponse",
		leftDot: ".",
		rightDash: "-",
		delete: "Supprimer",
		submit: "Valider",

		correct: "Correct",
		wrong: "Erreur",
		correctAnswerText: "La bonne réponse est ",
		nextQuestion: "Question suivante",

		helpTitle: "Aide clavier :",
		decodeHelpText: "Écoute le son ou observe le signal lumineux, puis saisis le caractère correspondant au clavier.",
		encodeHelpText: "Appuie sur la flèche gauche pour un point, la flèche droite pour un trait, Backspace pour supprimer, puis Entrée pour valider.",
		previewLevelTitle: "Aperçu du niveau {level}",
		previewDescription: "Revois les nouveaux caractères de ce niveau avant de commencer la pratique. Appuie sur l'ampoule ou sur le bouton son pour jouer le son et la lumière ensemble, puis appuie en dehors de l'ampoule pour masquer le Morse.",
		tapToReveal: "Appuyez en dehors de l'ampoule pour révéler",
		tapToHide: "Appuyez en dehors de l'ampoule pour masquer",
		hiddenMorse: "...",
		bulbPlayLabel: "Jouer le son et la lumière depuis l'ampoule",
		startPractice: "Commencer la pratique",

		//------------------ en bas ------------------
		audio: "Son",
		light: "Lumière",

		//------------------ cheatSheet ------------------
		cheatSheetTitle: "Carte de référence Morse",
		playSound: "Écouter",

		//------------------ resultat ------------------
		complete: "terminé",

		levelPassed: "Niveau réussi",
		tryAgain: "Réessayer",

		resultSummary: "Vous avez répondu correctement à {correctCount} question(s) sur {questionCount}.",
		passConditionText: "Condition de réussite : {passCount} / {questionCount}.",

		accuracy: "Précision",
		status: "Statut",
		unlockedNext: "Niveau suivant débloqué",
		needsReview: "Révision nécessaire",

		practiceAgain: "Recommencer",
		backToLevels: "Retour aux niveaux",
		nextLevel: "Niveau suivant",

		//------------------ error ------------------
		noQuestion: "Aucune question disponible."
	},

	learning: {
		//------------------ app/learning/page.tsx ------------------
		pageTitle: "Apprendre le code Morse",
		pageDescription: "Continuez votre entraînement Morse avec des niveaux de pratique mixte.",

		//------------------ srcs/components/learning/LearningProgressCard.tsx ------------------
		yourProgress: "Votre progression",
		levelLabel: "Niveau {level}",
		completedLevels: "Vous avez terminé {completed} niveau(x) sur {total}.",
		today: "Aujourd'hui",
		accuracy: "Précision",
		reaction: "Réaction",
		sessions: "Sessions",
		minutes: "{minutes} min",
		hours: "{hours} h",
		hoursMinutes: "{hours} h {minutes} min",

		//------------------ srcs/components/learning/LearningEntryCards.tsx ------------------
		learningOptions: "Options d'apprentissage",
		levels: "Niveaux",
		chooseLevel: "Choisir un niveau",
		levelsDescription: "Voir tous les niveaux Morse et continuer avec un niveau débloqué.",
		openLevels: "Ouvrir les niveaux",

		review: "Révision",
		reviewDueCharacters: "Réviser les caractères faibles",
		reviewDescription: "Génère des exercices avec les caractères les moins réussis selon vos résultats d'entraînement.",
		startReview: "Commencer la révision",

		//------------------ app/learning/levels/page.tsx ------------------
		levelsPageDescription: "Le parcours couvre les lettres, les chiffres et la ponctuation. Chaque niveau utilise une pratique mixte : parfois vous décodez des signaux Morse, parfois vous encodez des caractères au clavier.",
		backToLearning: "Retour à l'apprentissage",
		breadcrumbLearning: "Apprentissage",
		breadcrumbLevels: "Niveaux",

		//------------------ srcs/components/learning/LevelGrid.tsx ------------------
		morseLevels: "Niveaux Morse",
		globalAccuracy: "Réussite globale",
		practiceSessions: "Pratiques terminées",

		//------------------ srcs/components/learning/LevelCard.tsx ------------------
		newCharacters: "Nouveaux caractères",
		questions: "Questions",
		pass: "Condition de réussite",
		reviewFrom: "Révision depuis",
		newRatio: "Nouveaux caractères",
		reviewRatio: "Caractères de révision",
		actionHint: "Commencer la pratique de ce niveau",
		locked: "Verrouillé",
		startPractice: "Commencer",

		completed: "Terminé",
		current: "Actuel",
		unlocked: "Débloqué",

		//------------------ srcs/components/learning/LetterProgressPreview.tsx------------------
		letterProgressLabel: "Progression par caractère",
		letterProgressTitle: "Taux de réussite par caractère",
		letterProgressDescription: "Chaque barre représente le taux de réussite d'un caractère. Les caractères les plus faibles apparaissent en premier.",
		letterProgressScrollHint: "Faites défiler horizontalement pour voir tous les caractères.",
		successRate: "taux de réussite",
		correct: "correct",
		wrong: "faux",

		//------------------ srcs/components/learning/LearningPlay.tsx------------------
		breadcrumb: "Navigation",
		breadcrumbPlay: "Pratique",
		playFallbackOptions: "Options de pratique",
		noCompletedLevelYet: "Aucun niveau terminé",
		playFallbackDescription: "Le mode pratique révise les niveaux que vous avez déjà terminés. Terminez d'abord votre niveau actuel, puis revenez vous entraîner sur un niveau aléatoire.",
		currentLevel: "Niveau actuel",
		startLevel: "Commencer le niveau {level}",
		currentLevelDescription: "Continuez votre session de pratique mixte actuelle. Le mode pratique sera disponible après avoir terminé au moins un niveau.",
		levelsFallbackDescription: "Retournez à la liste des niveaux et choisissez un niveau débloqué pour continuer votre entraînement.",

	},

	learningReview: {
		title: "Révision espacée",

		loading: "Préparation de votre session de révision...",
		unavailable: "Révision indisponible",
		loadError: "Impossible de charger votre session de révision.",
		saveError: "Impossible d'enregistrer vos résultats.",
		noProgressTitle: "Aucun caractère à réviser",
		noProgressDescription: "Terminez d'abord quelques exercices afin de créer votre calendrier de révision.",
		
		openLevels: "Ouvrir les niveaux",
		sessionSummary: "{dueCount} caractères sont à réviser. Cette session couvre {reviewedCharacters} caractères prioritaires.",
		
		tryAgain: "Réessayer",
		reviewComplete: "Révision terminée",
		reviewResultSummary: "Vous avez répondu correctement à {correctCount} question(s) sur {questionCount}.",
		accuracy: "Précision",
		reviewAgain: "Réviser à nouveau",
		backToLearning: "Retour à l'apprentissage",
	},

	//=========================================== chat =========================================== 
	chat: {
		//--------- friendList ---------
		chats: "Chats",
		close: "Fermer",
		add: "+ Ajouter",

		added: "Ajouté",
		pending: "En attente",
		invite: "Inviter",

		searchMyFriends: "Chercher dans mes amis",
		searchUsersToAdd: "Chercher des utilisateurs à ajouter",
		noUsersFound: "Aucun utilisateur trouvé.",
		noFriendsFound: "Aucun ami trouvé.",

		systemMessages: "Messages système",
		noSystemMessages: "Aucun message système.",
		
		//--------- ChatHeader ---------
		offline: "Hors ligne",
		online: "En ligne",
		viewProfile: "Voir le profil de {displayName}",
		avatarAlt: "Avatar de {displayName}",
		openProfileHint: "Cliquez sur l'avatar pour ouvrir ce profil.",
		closeChat: "Fermer le chat",
		
		//--------- ChatModeSelector ---------
		languageToMorse: "Langue ⭢ Morse",
		morseToLanguage: "Morse ⭢ Langue",
		textOnly: "Texte seulement",
		morseOnly: "Morse seulement",
		encodeOnly: "Encoder seulement",
		chatModeSelector: "Sélecteur du mode chat",
		
		//--------- MessageComposer ---------
		typeTextToMorse: "Tapez du texte pour afficher le texte et le Morse...",
		enterMorseToDecode: "Entrez du code Morse à décoder...",
		typeMessage: "Tapez un message...",
		typeMorseOnly: "Tapez seulement du Morse...",
		typeTextAsMorseOnly: "Tapez du texte à envoyer en Morse seulement...",
		send: "Envoyer",
		
		//--------- FriendListItem ---------
		unknownUser: "Utilisateur inconnu",
		newRemarkName: "Nouvelle remarque",
		deleteFriendConfirm: "Supprimer {displayName} des amis ?",
		gameInviteAlreadyPending: "Une invitation de jeu est déjà en attente",
		inviteFriendToPlay: "Inviter cet ami à jouer",
		friendOffline: "Cet ami est hors ligne",
		
		//--------- ContextMenu ---------
		renameRemark: "Renommer la remarque",
		shareFriend: "Partager l'ami",
		inviteToGame: "Inviter au jeu",
		deleteFriend: "Supprimer l'ami",
		friendOfflineOrPending: "Cet ami est hors ligne ou a déjà une invitation en attente.",
		
		//--------- SystemMessage ---------
		systemDescription: "Notifications sur les demandes d'ami, les contacts partagés et les actions du chat.",
		systemMessageTemplates: {
			"gameInvitation.accepted.receiver": {
				title: "Invitation de jeu acceptée",
				body: "Vous avez accepté l'invitation de {username} à rejoindre {radioName}.",
			},
			"gameInvitation.accepted.sender": {
				title: "Invitation de jeu acceptée",
				body: "{username} a accepté votre invitation à rejoindre {radioName}. Rejoignez le lobby quand vous êtes prêt.",
			},
			"gameInvitation.declined.receiver": {
				title: "Invitation de jeu refusée",
				body: "Vous avez refusé l'invitation de {username} à rejoindre {radioName}.",
			},
			"gameInvitation.declined.sender": {
				title: "Invitation de jeu refusée",
				body: "{username} a refusé votre invitation à rejoindre {radioName}.",
			},
			"gameInvitation.expired.sender": {
				title: "Invitation de jeu expirée",
				body: "{username} n'a pas répondu dans la minute. Votre invitation à rejoindre {radioName} a été annulée.",
			},
			"friendRequest.received": {
				title: "Demande d'ami",
				body: "{username} vous a envoyé une demande d'ami.",
			},
			"friendRequest.accepted.sender": {
				title: "Demande d'ami acceptée",
				body: "{username} a accepté votre demande d'ami.",
			},
			"friendRequest.accepted.receiver": {
				title: "Ami ajouté",
				body: "{username} a été ajouté à votre liste d'amis.",
			},
			"friend.removed": {
				title: "Ami supprimé",
				body: "{username} a été supprimé de votre liste d'amis.",
			},
		},

		//--------- SystemMessageWindow ---------
		systemWindowDescription: "Invitations de jeu, demandes d'ami et notifications système.",
		accepted: "Acceptée",
		declined: "Refusée",
		expired: "Expirée",
		actionFailed: "Action échouée",
		updating: "Mise à jour...",
		joining: "Connexion...",
		joinLobby: "Rejoindre le lobby",
		switchLobbyRequired: "Vous êtes déjà dans un autre lobby radio.",
		leaveAndJoinLobby: "Quitter et rejoindre",
		cancel: "Annuler",
		accept: "Accepter",
		decline: "Refuser",

		//--------- chat/page---------
		pageTitle: "Chat",
		pageDescription: "Cette page accueillera le chat en temps réel et les fonctions de communication.",
	},

	chatLayout: {
		//--------- game invitation system message ---------
		newGameInvitationTitle: "Nouvelle invitation de jeu",
		radioLobbyFallback: "un lobby radio",
		gameInvitationBody: "{username} vous a invité à rejoindre {radioName}. Vous avez 1 minute pour accepter avant expiration.",

		//--------- invite disabled reasons ---------
		friendOffline: "Cet ami est hors ligne.",
		gameInvitationAlreadyPending: "Une invitation de jeu est déjà en attente avec cet ami.",
		friendHasPendingGameInvitation: "Cet ami a déjà une invitation de jeu en attente.",
		friendAlreadyInvitedYou: "Cet ami vous a déjà invité. Veuillez d'abord accepter ou refuser son invitation.",
		friendInGame: "Cet ami est actuellement en partie.",
		friendReadyInLobby: "Cet ami est déjà prêt dans un lobby.",

		//--------- invitation errors ---------
		failedToUpdateInvitation: "Impossible de mettre à jour l'invitation.",
		systemMessageWithoutRadio: "Ce message système ne contient aucun lobby radio.",
		failedToJoinRadioLobby: "Impossible de rejoindre le lobby radio.",
		failedToSendInvitation: "Impossible d'envoyer l'invitation.",

		//--------- conversation errors ---------
		failedToOpenConversation: "Impossible d'ouvrir la conversation.",
		conversationNotReady: "La conversation n'est pas encore prête.",
		failedToSendMessage: "Impossible d'envoyer le message.",

		//--------- friend request ---------
		userAlreadyFriend: "Cet utilisateur est déjà dans votre liste d'amis.",
		friendRequestAlreadySent: "Demande d'ami déjà envoyée.",
		friendRequestAlreadyExists: "Une demande d'ami existe déjà avec cet utilisateur.",
		failedToSendFriendRequest: "Impossible d'envoyer la demande d'ami. Veuillez réessayer.",
		networkError: "Erreur réseau. Veuillez réessayer.",
		friendRequestSentTitle: "Demande d'ami envoyée",
		friendRequestSentBody: "Demande d'ami envoyée à {displayName}. En attente de son acceptation.",
		friendRequestReceivedTitle: "Demande d'ami",
		friendRequestReceivedBody: "{username} vous a envoyé une demande d'ami.",
		failedToUpdateFriendRequest: "Impossible de mettre à jour la demande d'ami.",

		//--------- friend remark ---------
		friendRemarkEmpty: "La remarque de l'ami ne peut pas être vide.",
		friendRemarkDuplicate: "Cette remarque existe déjà dans votre liste d'amis.",
		friendRemarkUpdatedTitle: "Remarque de l'ami mise à jour",
		friendRemarkUpdatedBody: "{oldName} a été renommé en {newName}.",

		//--------- friend delete/share ---------
		friendRemovedTitle: "Ami supprimé",
		friendRemovedBody: "{displayName} a été supprimé localement.",
		openChatBeforeSharingFriend: "Veuillez ouvrir un chat avant de partager un ami.",
		cannotShareFriendToThemselves: "Vous ne pouvez pas partager cet ami avec lui-même.",
		sharedContactMessage: "Contact partagé : {displayName} (@{username})",
		contactSharedTitle: "Contact partagé",
		contactSharedBody: "{displayName} a été partagé avec {friendName}.",

		//--------- game invitation sent ---------
		gameInvitationSentTitle: "Invitation de jeu envoyée",
		gameInvitationSentBody: "Invitation de jeu envoyée à {displayName}. En attente de sa réponse.",

		emptyMessage: "Le message ne peut pas être vide.",
		invalidMorseInput: "Entrée Morse invalide. Utilisez seulement des points, des tirets, des espaces et / entre les mots.",
	},

	//=========================================== login =========================================== 
	login: {
		title: "Connexion",
		description: "Connectez-vous pour continuer vers votre compte.",
		
		email: "Email",
		password: "Mot de passe",
		emailPlaceholder: "Entrez votre email",
		passwordPlaceholder: "Entrez votre mot de passe",
		
		emailRequired: "L'email est requis.",
		passwordRequired: "Le mot de passe est requis.",
		
		invalidCredentials: "Email ou mot de passe incorrect.",
		genericError: "Une erreur est survenue pendant la connexion.",
		success: "Connexion réussie.",
		
		submitting: "Envoi en cours...",
		loginButton: "Connexion",
		
		loginWithGoogle: "Connexion avec Google",
		loginWithFortyTwo: "Connexion avec 42",
		
		noAccount: "Vous n'avez pas de compte ?",
		registerHere: "Inscrivez-vous ici",

		showPassword: "Afficher",
		hidePassword: "Masquer",
	},

	register: {
		title: "Inscription",
		description: "Créez votre compte pour accéder à la plateforme.",
		name: "Nom",
		email: "Email",
		password: "Mot de passe",
		confirmPassword: "Confirmer le mot de passe",
		namePlaceholder: "Entrez votre nom",
		emailPlaceholder: "Entrez votre email",
		passwordPlaceholder: "Entrez votre mot de passe",
		confirmPasswordPlaceholder: "Confirmez votre mot de passe",
		passwordHint: "Le mot de passe doit contenir au moins 8 caractères.",
		submitting: "Envoi en cours...",
		createAccount: "Créer un compte",
		nameRequired: "Le nom est requis.",
		emailRequired: "L'email est requis.",
		passwordRequired: "Le mot de passe est requis.",
		passwordTooShort: "Le mot de passe doit contenir au moins 8 caractères.",
		passwordsDoNotMatch: "Les mots de passe ne correspondent pas.",
		success: "Compte créé avec succès. Redirection vers la connexion...",
		genericError: "Une erreur est survenue lors de l'inscription.",
		usernameOrEmailInUse: "Le nom d'utilisateur ou l'email est déjà utilisé.",
		nameTooLong: "Le nom ne peut pas depasser 20 caracteres.",

		showPassword: "Afficher",
		hidePassword: "Masquer",

		emailInvalid: "Format d'email invalide.",
	},

	authError: {
		title: "Connexion échouée",
		accessDenied: "Ce compte Google ou 42 n'est pas encore lié. Veuillez d'abord le lier depuis votre profil.",
		oauthCallback: "Le retour de connexion du service tiers a échoué. Veuillez réessayer plus tard.",
		defaultError: "Une erreur est survenue pendant la connexion. Veuillez réessayer plus tard.",
		backToLogin: "Retour à la connexion",
	},
	
	//=========================================== privacyPolicy =========================================== 
	privacyPolicy: {
		title: "Politique de confidentialité",
		effectiveDate: "Date d'entrée en vigueur : [10/07/2026]",
		sections: [
			{
				title: "1. Introduction",
				paragraphs: [
					"Bienvenue sur Echoes of Morse, une plateforme pour apprendre le code Morse, participer à des compétitions et communiquer avec d'autres utilisateurs. Cette politique de confidentialité explique comment Morse Team collecte, utilise, conserve et protège vos données personnelles lorsque vous utilisez la plateforme.",
					"En utilisant Echoes of Morse, vous acceptez les pratiques décrites dans cette politique.",
				],
				items: [],
			},
			{
				title: "2. Responsable du traitement",
				paragraphs: ["Morse Team — morseteam@42.fr"],
				items: [],
			},
			{
				title: "3. Données que nous collectons",
				paragraphs: [
					"Informations de compte : lorsque vous créez un compte, nous collectons votre nom d'utilisateur et votre adresse email. Votre mot de passe est stocké sous forme hachée. Nous ne stockons pas les mots de passe en clair.",
					"Informations de compte tiers : lorsque vous liez Google ou 42, nous pouvons recevoir votre nom d'utilisateur, votre adresse email et votre photo de profil.",
					"Messages privés : les messages envoyés via le chat privé sont stockés dans notre base de données tant que votre compte est actif.",
				],
				items: [
					"Progression d'apprentissage et résultats d'exercices",
					"Historique des compétitions et scores",
					"Classements",
					"Adresse IP, type de navigateur et système d'exploitation",
					"Horodatages de session et de connexion",
				],
			},
			{
				title: "4. Comment nous utilisons vos données",
				paragraphs: [
					"Nous utilisons vos données pour fournir l'authentification, le suivi de progression, les compétitions, les classements, les amis, le chat et la sécurité de la plateforme.",
					"Nous n'envoyons pas d'emails marketing. Nous n'utilisons pas vos données à des fins publicitaires.",
				],
				items: [],
			},
			{
				title: "5. Services tiers",
				paragraphs: [
					"Nous utilisons Google OAuth et 42 OAuth pour lier un compte tiers ou se connecter. Ces fournisseurs peuvent collecter des données selon leurs propres politiques de confidentialité.",
					"Nous ne vendons pas vos données personnelles à des tiers.",
				],
				items: [],
			},
			{
				title: "6. Chat privé et modération",
				paragraphs: [
					"Les messages privés sont conservés tant que votre compte est actif. En cas de signalement, les administrateurs de la plateforme peuvent accéder aux messages concernés à des fins de modération.",
					"Veuillez ne pas partager d'informations personnelles sensibles dans le chat.",
				],
				items: [],
			},
			{
				title: "7. Conservation des données",
				paragraphs: [
					"Nous conservons vos données tant que votre compte est actif. Lors de la suppression du compte, votre profil et vos messages sont supprimés.",
					"Les données de compétition peuvent être conservées sous forme anonymisée à des fins statistiques.",
				],
				items: [],
			},
			{
				title: "8. Vos droits",
				paragraphs: [
					"En tant qu'utilisateur dans l'Union européenne, vous avez le droit d'accéder à vos données, de les corriger, de les supprimer, d'en limiter le traitement ou de les exporter. Pour exercer ces droits, contactez-nous à morseteam@42.fr.",
					"Nous répondrons sous 30 jours. Vous pouvez aussi déposer une plainte auprès de votre autorité nationale de protection des données.",
				],
				items: [],
			},
			{
				title: "9. Sécurité des données",
				paragraphs: [
					"Nous utilisons le stockage haché des mots de passe, l'authentification tierce et des contrôles d'accès pour protéger vos données.",
					"Aucun système n'est totalement sécurisé. Nous recommandons d'utiliser des mots de passe forts et de protéger vos comptes tiers.",
				],
				items: [],
			},
			{
				title: "10. Confidentialité des enfants",
				paragraphs: [
					"Echoes of Morse ne s'adresse pas aux enfants de moins de 13 ans. Si vous pensez qu'un enfant nous a fourni des données personnelles, contactez-nous et nous les supprimerons rapidement.",
				],
				items: [],
			},
			{
				title: "11. Modifications de cette politique",
				paragraphs: [
					"Nous pouvons mettre à jour cette politique de temps en temps. Continuer à utiliser la plateforme après des modifications vaut acceptation de la politique mise à jour.",
				],
				items: [],
			},
			{
				title: "12. Contact",
				paragraphs: ["Morse Team — morseteam@42.fr"],
				items: [],
			},
		],
	},


	//=========================================== termsOfService =========================================== 
	termsOfService: {
		title: "Conditions d'utilisation",
		effectiveDate: "Date d'entrée en vigueur : [10/07/2026]",
		sections: [
			{
				title: "1. Introduction",
				paragraphs: [
					"Bienvenue sur Echoes of Morse. Ces conditions d'utilisation encadrent votre utilisation de la plateforme, y compris les outils d'apprentissage du code Morse, les compétitions, les classements, les amis et la messagerie.",
					"En accédant à Echoes of Morse ou en l'utilisant, vous acceptez ces conditions. Si vous n'êtes pas d'accord, veuillez ne pas utiliser la plateforme.",
				],
				items: [],
			},
			{
				title: "2. Éligibilité",
				paragraphs: [
					"Vous devez avoir au moins 13 ans pour utiliser cette plateforme. En utilisant Echoes of Morse, vous confirmez respecter cette condition.",
				],
				items: [],
			},
			{
				title: "3. Comptes utilisateur",
				paragraphs: [
					"L'accès aux fonctionnalités de la plateforme nécessite un compte ou une connexion tierce liée.",
					"Vous êtes responsable de la sécurité de votre compte et de toutes les activités effectuées avec celui-ci.",
				],
				items: [],
			},
			{
				title: "4. Utilisation acceptable",
				paragraphs: ["Vous vous engagez à ne pas :"],
				items: [
					"Utiliser la plateforme à des fins illégales",
					"Tenter de pirater, perturber ou surcharger le service",
					"Tricher dans les compétitions ou manipuler les classements",
					"Envoyer des messages abusifs, offensants ou dangereux",
					"Usurper l'identité d'un autre utilisateur ou d'une organisation",
				],
			},
			{
				title: "5. Compétitions et classements",
				paragraphs: [
					"Echoes of Morse propose des compétitions et des classements à des fins éducatives et de divertissement.",
					"Nous nous réservons le droit de supprimer des scores, suspendre des comptes ou réinitialiser des classements en cas de triche, d'abus ou de problème technique.",
				],
				items: [],
			},
			{
				title: "6. Messagerie privée",
				paragraphs: [
					"Les utilisateurs peuvent communiquer via les fonctions de chat privé. Vous êtes seul responsable du contenu que vous envoyez.",
					"Nous nous réservons le droit de modérer ou supprimer le contenu qui enfreint ces conditions ou les lois applicables.",
				],
				items: [],
			},
			{
				title: "7. Propriété intellectuelle",
				paragraphs: [
					"Sauf indication contraire, le contenu, le design, les logos et les supports d'apprentissage de la plateforme appartiennent à Morse Team.",
					"Vous ne pouvez pas copier, redistribuer ou exploiter commercialement le contenu de la plateforme sans autorisation.",
				],
				items: [],
			},
			{
				title: "8. Disponibilité du service",
				paragraphs: [
					"Nous faisons de notre mieux pour maintenir l'accès à la plateforme, mais nous ne garantissons pas un service ininterrompu.",
					"La plateforme peut être modifiée, suspendue ou arrêtée à tout moment sans préavis.",
				],
				items: [],
			},
			{
				title: "9. Limitation de responsabilité",
				paragraphs: [
					"Echoes of Morse est fourni tel quel, sans garantie d'aucune sorte.",
					"Morse Team ne peut pas être tenu responsable des pertes de données, interruptions de service ou dommages liés à l'utilisation de la plateforme.",
				],
				items: [],
			},
			{
				title: "10. Résiliation",
				paragraphs: [
					"Nous nous réservons le droit de suspendre ou de fermer les comptes qui enfreignent ces conditions ou menacent la sécurité de la plateforme.",
				],
				items: [],
			},
			{
				title: "11. Modifications de ces conditions",
				paragraphs: [
					"Nous pouvons mettre à jour ces conditions de temps en temps. Continuer à utiliser la plateforme après des modifications vaut acceptation des conditions mises à jour.",
				],
				items: [],
			},
			{
				title: "12. Contact",
				paragraphs: ["Morse Team — morseteam@42.fr"],
				items: [],
			},
		],
	},


	//=========================================== competition =========================================== 
	competitionHome: {
		//--------- CompetitionHeader ---------
		pageTitle: "Compétition",

		//--------- RadioSectionHeader ---------
		radioWaves: "Canaux radio",
		radioWavesDescription: "Choisissez une vitesse de transmission et rejoignez son lobby en direct.",

		//--------- CompetitionIntro.tsx ---------
		rules: "Règles",
		rulesList: [
			"Choisissez un lobby radio selon votre niveau en Morse.",
			"Chaque lobby radio peut accueillir jusqu'à {maxUsers} joueurs.",
			"Cliquez sur Prêt pour rejoindre la file d'attente de cette radio.",
			"Quand au moins deux joueurs sont prêts, la session peut commencer.",
			"Tous les joueurs prêts reçoivent les mêmes séquences Morse en temps réel.",
			"Le meilleur score à la fin du chrono gagne le duel.",
		],

		//--------- OnlineOverview.tsx ---------
		onlineOverview: "Aperçu en ligne",
		onlineNow: "En ligne",
		radioWave01: "Canal radio 01",
		radioWave02: "Canal radio 02",
		radioWave03: "Canal radio 03",
		liveDataConnected: "Données en direct connectées.",
		disconnectedSnapshot: "Déconnecté. Affichage de l'instantané de la base de données.",

		//--------- RadioWaveCard.tsx ---------
		usersInside: "{count}/{maxUsers} utilisateurs dans le lobby",

		full: "Complet",
		enter: "Entrer",

		lobbyFullAria: "{radioName}, {wpm} WPM, lobby complet",
		enterRadioAria: "Entrer dans {radioName}, {wpm} WPM, {capacity}",

		radioWave01Description: "Une transmission plus lente pour débuter en Morse.",
		radioWave02Description: "Une transmission équilibrée pour les joueurs intermédiaires.",
		radioWave03Description: "Une transmission rapide pour les décodeurs expérimentés.",

		//--------- ReceivedInvitations.tsx ---------
		failedToAnswerInvitation: "Impossible de répondre à l'invitation.",

		gameInvitations: "Invitations de jeu",

		invitedYouTo: "vous invite à rejoindre {radioName}. Vous avez 1 minute pour accepter avant l'expiration de l'invitation.",
		unknownRadioLobby: "un lobby radio",

		accept: "Accepter",
		decline: "Refuser",
	},

	competitionRadio: {
		//--------- RadioHeader.tsx ---------
		backToCompetition: "Retour à la compétition",
		radioLobby: "Lobby radio",
		lobbyDescription: "{description} Les joueurs de ce lobby peuvent rejoindre la file Prêt et lancer ensemble une session de décodage Morse en temps réel.",
		radioInformation: "Informations radio",
		speed: "Vitesse",
		usersInside: "Utilisateurs dans le lobby",

		//--------- LobbyUserList.tsx ---------
		usersInThisRadio: "Utilisateurs dans cette radio",
		seatsTaken: "{count}/{maxUsers} places occupées.",
		lobbyFull: "Ce lobby est complet.",
		statusExplanation: "Gris signifie inactif, vert signifie prêt, jaune signifie déjà en jeu.",
		inLobby: "Dans le lobby",
		ready: "Prêt",
		playing: "En jeu",
		you: "vous",
		avatarAlt: "Avatar de {displayName}",

		//--------- MatchmakingPanel.tsx ---------
		matchmakingQueue: "File d'attente",
		matchmakingDescription: "Rejoignez la file de cette radio. Quand au moins deux joueurs sont prêts, un joueur prêt peut lancer la session de décodage.",
		cancelReady: "Annuler Prêt",
		startDecoding: "Commencer le décodage",
		leaveLobby: "Quitter le lobby",

		currentReadyPlayers: "Joueurs prêts:",
		currentReadyPoint: ".",
		requiredReadyPlayersPrefix: "\u00A0Au moins",
		requiredReadyPlayersSuffix: "joueurs prêts sont nécessaires pour commencer.",

		//--------- ReadyPlayersList.tsx ---------
		readyPlayers: "Joueurs prêts",
		readyPlayersDescription: "Ces joueurs entreront ensemble dans la prochaine session.",
		noReadyPlayers: "Aucun joueur n'est prêt pour le moment. Cliquez sur Prêt pour rejoindre la file.",

		//--------- InviteFriendsPanel.tsx ---------
		inviteFriends: "Inviter des amis",
		lobbyFullInviteClosed: "{radioName} est complet, les nouvelles invitations sont fermées pour le moment.",
		inviteFriendsDescription: "Invitez des amis en ligne à rejoindre {radioName}. L'invitation les amène dans ce lobby, pas directement dans une session de jeu.",
		loadingOnlineFriends: "Chargement des amis en ligne...",
		noOnlineFriend: "Aucun ami en ligne n'est disponible pour le moment.",
		signInToInvite: "Connectez-vous pour inviter des amis en ligne.",
		onlineFriend: "Ami en ligne",
		invited: "Invité",
		invite: "Inviter",
		inviteHint: "Les invitations sont stockées dans la base de données et mènent à ce lobby radio.",

		//--------- RadioWavePickerModal.tsx ---------
		chooseRadioWave: "Choisir un canal radio",
		inviteToRadioLobby: "Inviter {displayName} à rejoindre un lobby radio.",
		closeRadioSelection: "Fermer la sélection radio",
		cancel: "Annuler",
		radioWave01: "Canal radio 01",
		radioWave02: "Canal radio 02",
		radioWave03: "Canal radio 03",
		radioWave01Description: "Une transmission plus lente pour débuter en Morse.",
		radioWave02Description: "Une transmission équilibrée pour les joueurs intermédiaires.",
		radioWave03Description: "Une transmission rapide pour les décodeurs expérimentés.",

		//--------- RadioLobbyClient.tsx ---------
		failedToLoadLobby: "Impossible de charger le lobby radio.",
		failedToJoinLobby: "Impossible de rejoindre le lobby.",
		failedToLeaveLobby: "Impossible de quitter le lobby.",
		failedToAnswerInvitation: "Impossible de répondre à l'invitation.",
		failedToUpdateReadyStatus: "Impossible de mettre à jour le statut Prêt.",
		needReadyBeforeStart: "Vous devez cliquer sur Prêt avant de commencer une partie.",
		needTwoPlayers: "Il faut au moins deux joueurs prêts pour commencer.",
		failedToStartGame: "Impossible de lancer la partie.",
		failedToFetchFriends: "Impossible de charger les amis.",
		failedToSendInvitation: "Impossible d'envoyer l'invitation.",
	},

	competitionGame: {
		//--------- gameSession.tsx ---------
		noChallengeSequences: "Cette session de jeu ne contient aucune séquence.",
		failedToLoadGameSession: "Impossible de charger la session de jeu.",
		failedToSaveGameResult: "Impossible d'enregistrer le résultat du jeu.",
		
		loadingGameSession: "Chargement de la session de jeu...",
		radioWaveTitle: "Canal radio {radioId}",
		decodeSessionTitle: "Session de décodage {wpm} WPM",
		showMorseText: "Afficher le texte Morse",

		abandonGame: "Abandonner",
		
		//--------- morseStream.tsx ---------
		morseScrollHint: "Utilisez les flèches gauche/droite ou la souris pour faire défiler et voir tout le contenu.",
		hidden: "Masqué",

		//--------- answer.tsx ---------
		answerPlaceholder: "Entrez ici votre résultat décodé...",

		//--------- ranking.tsx ---------
		ranking: "Classement",
		rank: "Rang",
		player: "Joueur",
		score: "Score",
		accuracySymbol: "%",

		//--------- finalRanking.tsx ---------
		winner: "Vainqueur",
		tie: "Égalité",
		backToRadioLobby: "Retour au lobby radio",
	},
	

};

export default fr;
