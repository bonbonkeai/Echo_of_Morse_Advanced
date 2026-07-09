const en = {
	profile: {
		loading: "Loading profile...",
		loginRequired: "Please log in to view your profile.",
		noEmail: "No email",
		editProfile: "Edit profile",
		defaultUser: "User",
		//------- statistique------- 
		bio: "Bio",
		stats: "Statistics",
		accuracy: "Accuracy",
		learningLevel: "Learning level",
		levelPrefix: "Level",
		friends: "Friends",
		joined: "Joined",
		backToLearning: "Back to learning",
		//------- oauth ------- 
		connectedAccounts: "Linked accounts",
		notConnected: "Not linked",
		connected: "Linked",
		bindGoogle: "Link Google",
		bindFortyTwo: "Link 42",
		unlinkGoogle: "Unlink Google",
		unlinkFortyTwo: "Unlink 42",
		unlinkError: "Failed to unlink the account. Please try again later.",
		linkError: "Failed to link the account. Please try again later.",
		//------------------ profil friends ------------------
		userNotFound: "User not found",
		avatarAlt: "{displayName}'s avatar",
		//------------------ profil edit ------------------
		loadingCurrentProfile: "Loading current profile...",
		editLoginRequired: "Please log in to edit your profile.",
		saving: "Saving...",
		failedToLoadProfile: "Failed to load profile.",
		loadProfileError: "Something went wrong while loading profile.",
		missingUserId: "Missing user ID.",
		changeAvatar: "Change avatar",
		username: "Username",
		usernamePlaceholder: "Enter your username",
		bioPlaceholder: "Tell something about yourself",
		saveChanges: "Save changes",
		chooseImageFile: "Please choose an image file.",
		imageTooLarge: "Please choose an image smaller than 500 KB.",
		readImageError: "Unable to read this image.",
		failedToUpdateProfile: "Failed to update profile.",
		updateProfileError: "Something went wrong while updating profile.",
		usernameRequired: "Username is required.",
		usernameTooLong: "Username cannot be longer than 20 characters.",
		bioTooLong: "Bio cannot be longer than 120 characters.",
	},

	layout: {
		//------------------ navbar ------------------
		brand: "Echoes of Morse",
		dashboard: "Dashboard",
		profile: "Profile",
		login: "Login",
		logout: "Logout",
		user: "User",

		openNotifications: "Open notifications",
		notifications: "Notifications",
		noNewNotifications: "No new notifications.",
		gameInvitations: "Game invitations",
		friendRequests: "Friend requests",
		radioLobbyFallback: "a radio lobby",
		invitedYouToRadio: "invited you to {radioName}. You have 1 minute to accept.",
		sentYouFriendRequest: "sent you a friend request.",
		view: "View",
		messages: "Messages",
		system: "System",
		systemMessages: "System messages",
		unreadSystemNotifications: "Unread system notifications: {count}.",

		//------------------ footer ------------------
		footerDescription: "Learn, communicate, and compete through Morse code.",
		privacyPolicy: "Privacy Policy",
		termsOfService: "Terms of Service",
		copyright: "© 2026 Echoes of Morse",
		mainNavigation: "Main navigation",
		footerNavigation: "Footer navigation",

		//------------------ languageSwitcher ------------------
		languageSwitcher: "Language switcher",

		//------------------ SkipLink ------------------
		skipToMainContent: "Skip to main content",
	},

	dashboard: {
		modulesLabel: "Home modules",

		openModule: "Open module →",

		learningTitle: "Learning",
		learningDescription: "Practice Morse code and improve your decoding skills.",

		chatTitle: "Chat",
		chatDescription: "Communicate with other users through real-time chat.",

		competitionTitle: "Competition",
		competitionDescription: "Join challenges and compare your performance.",
	},

	home: {
		onlineNow: "Online now",
		usersConnected: "{count} users connected",

		heroEyebrow: "Morse learning studio",
		heroTitle: "Echoes of Morse",
		heroLead: "From first drills to live matches, everything flows through one workspace.",
		heroPrimaryAction: "Start learning",
		heroSecondaryAction: "Enter competition",
		signalPreviewLabel: "Signal preview",
		signalPreviewTitle: "Learning, chat, and radio matches",
		signalPreviewDescription: "Signals, progress, and match state stay in sync.",
		heroPillOne: "Spaced repetition",
		heroPillTwo: "Realtime chat",
		heroPillThree: "Radio lobbies",
		heroPillFour: "Friend status",

		introTitle: "A Project of Morse?",
		introDescription: "Morse code becomes here a way to learn signals, rhythm, communication, and interaction.",

		historyTitle: "History of Morse",
		historyParagraph1: "Morse code was developed in the nineteenth century as a way to send messages over long distances through the electric telegraph. It transformed written language into short and long signals, now known as dots and dashes.",
		historyParagraph2: "The system is named after Samuel Morse, who worked with collaborators such as Alfred Vail to create a practical communication method for the telegraph.",
		historyParagraph3: "Morse code played an important role in railway networks, maritime communication, military operations, journalism, and emergency rescue.",
		historyParagraph4: "Although it is no longer the main system of global communication, Morse code remains a powerful historical medium and a useful learning tool.",

		onlineFriends: "Online friends",
		checkingSession: "Checking your session...",
		onlineFriendsDescription: "Friends currently available for chat or competition.",
		loadingOnlineFriends: "Loading online friends...",
		noFriendsOnline: "No friends online for now.",
		viewAllFriends: "View all friends",
		unknownUser: "Unknown user",
		avatarAlt: "{displayName}'s avatar",
		chat: "Chat",
		invite: "Invite",
		pending: "Pending",
		inviteAlreadyPending: "A game invitation is already pending.",
		inviteSent: "Game invitation sent to {displayName}. Waiting for their response.",
		failedToSendInvitation: "Failed to send invitation.",
	},

	notification: {
		newGameInvitationTitle: "New game invitation",
		gameInvitationToastBody: "{username} invited you to {radioName}.",
		newFriendRequestTitle: "New friend request",
		friendRequestToastBody: "{username} sent you a friend request.",
		newMessageFromTitle: "New message from {username}",
		radioLobbyFallback: "a radio lobby",
	},

	//=========================================== learning =========================================== 
	learningPractice: {
		//------------------ titre ------------------
		level: "Level",

		//------------------ exo ------------------
		decodeSignal: "Decode signal",
		playing: "Playing...",
		replaySignal: "Replay signal",
		encodeCharacter: "Encode character",

		//------------------ en haut à doite ------------------
		correctCount: "Correct",

		//------------------ réponse ------------------
		yourAnswer: "Your answer",
		leftDot: ".",
		rightDash: "-",
		delete: "Delete",
		submit: "Submit",

		correct: "Correct",
		wrong: "Wrong",
		correctAnswerText: "The correct answer is ",
		nextQuestion: "Next question",

		helpTitle: "Keyboard help:",
		decodeHelpText: "Listen to the sound or watch the light signal, then type the matching character on your keyboard.",
		encodeHelpText: "Press Left Arrow for dot, Right Arrow for dash, Backspace to delete, and Enter to submit.",
		previewLevelTitle: "Level {level} preview",
		previewDescription: "Review the new characters for this level before starting practice. Tap the bulb or the sound button to play sound and light together, and tap outside the bulb to hide the Morse again.",
		tapToReveal: "Tap outside the bulb to reveal",
		tapToHide: "Tap outside the bulb to hide",
		hiddenMorse: "...",
		bulbPlayLabel: "Play sound and light from the bulb",
		startPractice: "Start practice",

		//------------------ en bas ------------------
		audio: "Audio",
		light: "Light",

		//------------------ cheatSheet ------------------
		cheatSheetTitle: "Morse reference card",
		playSound: "Play",

		//------------------ resultat ------------------
		complete: "complete",

		levelPassed: "Level passed",
		tryAgain: "Try again",

		resultSummary: "You answered {correctCount} of {questionCount} correctly.",
		passConditionText: "Pass condition: {passCount} / {questionCount}.",

		accuracy: "Accuracy",
		status: "Status",
		unlockedNext: "Unlocked next",
		needsReview: "Needs review",

		practiceAgain: "Practice again",
		backToLevels: "Back to levels",
		nextLevel: "Next level",
		
		//------------------ error ------------------
		noQuestion: "No question available."
	},

	learning: {
		//------------------ app/learning/page.tsx ------------------
		pageTitle: "Learn Morse Code",
		pageDescription: "Continue your Morse training through mixed practice levels.",

		//------------------ srcs/components/learning/LearningProgressCard.tsx ------------------
		yourProgress: "Your progress",
		levelLabel: "Level {level}",
		completedLevels: "You have completed {completed} of {total} levels.",
		today: "Today",
		accuracy: "Accuracy",
		reaction: "Reaction",
		sessions: "Sessions",
		minutes: "{minutes} min",
		hours: "{hours}h",
		hoursMinutes: "{hours}h {minutes}min",

		//------------------ srcs/components/learning/LearningEntryCards.tsx ------------------
		learningOptions: "Learning options",
		levels: "Levels",
		chooseLevel: "Choose a level",
		levelsDescription: "View all Morse levels and continue with an unlocked level.",
		openLevels: "Open levels",

		review: "Review",
		reviewDueCharacters: "Review weak characters",
		reviewDescription: "Generate practice questions from characters with lower accuracy based on your practice results.",
		startReview: "Start review",

		
		//------------------ app/learning/levels/page.tsx ------------------
		levelsPageDescription: "The path covers letters, numbers, and punctuation. Each level uses mixed practice: sometimes you decode Morse signals, sometimes you encode characters with the keyboard.",
		backToLearning: "Back to learning",
		breadcrumbLearning: "Learning",
		breadcrumbLevels: "Levels",

		//------------------ srcs/components/learning/LevelGrid.tsx ------------------
		morseLevels: "Morse levels",
		globalAccuracy: "Global accuracy",
		practiceSessions: "Practice sessions",

		//------------------ srcs/components/learning/LevelCard.tsx ------------------
		newCharacters: "New characters",
		questions: "Questions",
		pass: "Pass requirement",
		reviewFrom: "Review from",
		newRatio: "New characters",
		reviewRatio: "Review characters",
		actionHint: "Start practice for this level",
		locked: "Locked",
		startPractice: "Start practice",

		completed: "Completed",
		current: "Current",
		unlocked: "Unlocked",

		//------------------ srcs/components/learning/LetterProgressPreview.tsx------------------
		letterProgressLabel: "Character progress",
		letterProgressTitle: "Success rate by character",
		letterProgressDescription: "Each bar shows the success rate of one character. Weaker characters appear first.",
		letterProgressScrollHint: "Scroll horizontally to see all characters.",
		successRate: "success rate",
		correct: "correct",
		wrong: "wrong",

		//------------------ srcs/components/learning/LearningPlay.tsx------------------
		breadcrumb: "Navigation",
		breadcrumbPlay: "Play",
		playFallbackOptions: "Play options",
		noCompletedLevelYet: "No completed level yet",
		playFallbackDescription: "Play mode reviews levels you have already completed. Complete your current level first, then come back to practice one randomly.",
		currentLevel: "Current level",
		startLevel: "Start Level {level}",
		currentLevelDescription: "Continue your current mixed practice session. Play mode will be available after you complete at least one level.",
		levelsFallbackDescription: "Go back to the level directory and choose an unlocked level to continue your training.",

	},

	learningReview: {
		title: "Spaced review",
		noProgressDescription: "Complete some level practice first so the review system can build your schedule.",

		loading: "Preparing your review session...",
		unavailable: "Review unavailable",
		loadError: "Unable to load your review session.",
		saveError: "Unable to save your review results.",
		noProgressTitle: "No characters to review yet",
		
		openLevels: "Open levels",
		sessionSummary: "{dueCount} characters are due. This session covers {reviewedCharacters} priority characters.",
		
		tryAgain: "Try again",
		reviewComplete: "Review complete",
		reviewResultSummary: "You answered {correctCount} of {questionCount} questions correctly.",
		accuracy: "Accuracy",
		reviewAgain: "Review again",
		backToLearning: "Back to learning",
	},

	//=========================================== chat =========================================== 
	chat: {
		//--------- friendList ---------
		chats: "Chats",
		close: "Close",
		add: "+ Add",

		added: "Added",
		pending: "Pending",
		invite: "Invite",

		searchMyFriends: "Search in my friends",
		searchUsersToAdd: "Search users to add",
		noUsersFound: "No users found.",
		noFriendsFound: "No friends found.",

		systemMessages: "System messages",
		noSystemMessages: "No system messages yet.",
		
		//--------- ChatHeader ---------
		offline: "Offline",
		online: "Online",
		
		viewProfile: "View {displayName}'s profile",
		avatarAlt: "{displayName}'s avatar",
		openProfileHint: "Click the avatar to open this profile.",
		closeChat: "Close chat",
		
		//--------- ChatModeSelector ---------
		languageToMorse: "Language ⭢ Morse",
		morseToLanguage: "Morse ⭢ Language",
		textOnly: "Text only",
		morseOnly: "Morse only",
		encodeOnly: "Encode only",
		chatModeSelector: "Chat mode selector",
		
		//--------- MessageComposer ---------
		typeTextToMorse: "Type text to show text and Morse...",
		enterMorseToDecode: "Enter Morse code to decode...",
		typeMessage: "Type a message...",
		typeMorseOnly: "Type Morse code only...",
		typeTextAsMorseOnly: "Type text to send as Morse only...",
		send: "Send",
		
		//--------- FriendListItem ---------
		unknownUser: "Unknown user",
		newRemarkName: "New remark name",
		deleteFriendConfirm: "Delete {displayName} from friends?",
		gameInviteAlreadyPending: "A game invitation is already pending",
		inviteFriendToPlay: "Invite this friend to play",
		friendOffline: "This friend is offline",
		
		//--------- ContextMenu ---------
		renameRemark: "Rename remark",
		shareFriend: "Share friend",
		inviteToGame: "Invite to game",
		deleteFriend: "Delete friend",
		friendOfflineOrPending: "This friend is offline or already has a pending invitation.",
		
		//--------- SystemMessage ---------
		systemDescription: "Notifications about friend requests, shared contacts, and local chat actions.",
		systemMessageTemplates: {
			"gameInvitation.accepted.receiver": {
				title: "Game invitation accepted",
				body: "You accepted {username}'s invitation to {radioName}.",
			},
			"gameInvitation.accepted.sender": {
				title: "Game invitation accepted",
				body: "{username} accepted your invitation to {radioName}. Join the lobby when you are ready.",
			},
			"gameInvitation.declined.receiver": {
				title: "Game invitation declined",
				body: "You declined {username}'s invitation to {radioName}.",
			},
			"gameInvitation.declined.sender": {
				title: "Game invitation declined",
				body: "{username} declined your invitation to {radioName}.",
			},
			"gameInvitation.expired.sender": {
				title: "Game invitation expired",
				body: "{username} did not reply within 1 minute. Your invitation to {radioName} has been cancelled.",
			},
			"friendRequest.received": {
				title: "Friend request",
				body: "{username} sent you a friend request.",
			},
			"friendRequest.accepted.sender": {
				title: "Friend request accepted",
				body: "{username} accepted your friend request.",
			},
			"friendRequest.accepted.receiver": {
				title: "Friend added",
				body: "{username} was added to your friend list.",
			},
			"friend.removed": {
				title: "Friend removed",
				body: "{username} was removed from your friend list.",
			},
		},

		//--------- SystemMessageWindow ---------
		systemWindowDescription: "Game invitations, friend requests, and system notifications.",
		accepted: "Accepted",
		declined: "Declined",
		expired: "Expired",
		actionFailed: "Action failed",
		updating: "Updating...",
		joining: "Joining...",
		joinLobby: "Join lobby",
		switchLobbyRequired: "You are already in another radio lobby.",
		leaveAndJoinLobby: "Leave and join",
		cancel: "Cancel",
		accept: "Accept",
		decline: "Decline",

		//--------- chat/page---------
		pageTitle: "Chat",
		pageDescription: "This page will host real-time chat and communication features.",
	},

	chatLayout: {
		//--------- game invitation system message ---------
		newGameInvitationTitle: "New game invitation",
		radioLobbyFallback: "a radio lobby",
		gameInvitationBody: "{username} invited you to {radioName}. You have 1 minute to accept before it expires.",

		//--------- invite disabled reasons ---------
		friendOffline: "This friend is offline.",
		gameInvitationAlreadyPending: "A game invitation is already pending with this friend.",
		friendHasPendingGameInvitation: "This friend already has a pending game invitation.",
		friendAlreadyInvitedYou: "This friend has already invited you. Please accept or decline their invitation first.",
		friendInGame: "This friend is currently in a game.",
		friendReadyInLobby: "This friend is already ready in a lobby.",

		//--------- invitation errors ---------
		failedToUpdateInvitation: "Failed to update the invitation.",
		systemMessageWithoutRadio: "This system message does not include a radio lobby.",
		failedToJoinRadioLobby: "Failed to join the radio lobby.",
		failedToSendInvitation: "Failed to send invitation.",

		//--------- conversation errors ---------
		failedToOpenConversation: "Failed to open the conversation.",
		conversationNotReady: "The conversation is not ready yet.",
		failedToSendMessage: "Failed to send the message.",

		//--------- friend request ---------
		userAlreadyFriend: "This user is already in your friend list.",
		friendRequestAlreadySent: "Friend request already sent.",
		friendRequestAlreadyExists: "A friend request already exists with this user.",
		failedToSendFriendRequest: "Failed to send friend request. Please try again.",
		networkError: "Network error. Please try again.",
		friendRequestSentTitle: "Friend request sent",
		friendRequestSentBody: "Friend request sent to {displayName}. Waiting for acceptance.",
		friendRequestReceivedTitle: "Friend request",
		friendRequestReceivedBody: "{username} sent you a friend request.",
		failedToUpdateFriendRequest: "Failed to update the friend request.",

		//--------- friend remark ---------
		friendRemarkEmpty: "Friend remark name cannot be empty.",
		friendRemarkDuplicate: "This remark name already exists in your friend list.",
		friendRemarkUpdatedTitle: "Friend remark updated",
		friendRemarkUpdatedBody: "{oldName} was renamed to {newName}.",

		//--------- friend delete/share ---------
		friendRemovedTitle: "Friend removed",
		friendRemovedBody: "{displayName} was removed locally.",
		openChatBeforeSharingFriend: "Please open a chat before sharing a friend.",
		cannotShareFriendToThemselves: "You cannot share this friend to themselves.",
		sharedContactMessage: "Shared contact: {displayName} (@{username})",
		contactSharedTitle: "Contact shared",
		contactSharedBody: "{displayName} was shared to {friendName}.",

		//--------- game invitation sent ---------
		gameInvitationSentTitle: "Game invitation sent",
		gameInvitationSentBody: "Game invitation sent to {displayName}. Waiting for their response.",

		emptyMessage: "Message cannot be empty.",
		invalidMorseInput: "Invalid Morse input. Use only dots, dashes, spaces, and / between words.",
	},

	//=========================================== auth =========================================== 
	login: {
		title: "Login",
		description: "Sign in to continue to your account.",

		email: "Email",
		password: "Password",
		emailPlaceholder: "Enter your email",
		passwordPlaceholder: "Enter your password",

		emailRequired: "Email is required.",
		passwordRequired: "Password is required.",

		invalidCredentials: "Invalid email or password.",
		genericError: "Something went wrong during login.",
		success: "Login successful.",

		submitting: "Submitting...",
		loginButton: "Login",

		loginWithGoogle: "Login with Google",
		loginWithFortyTwo: "Login with 42",

		noAccount: "Don't have an account?",
		registerHere: "Register here",

		showPassword: "Show",
		hidePassword: "Hide",
	},

	register: {
		title: "Register",
		description: "Create your account to access the platform.",
		name: "Name",
		email: "Email",
		password: "Password",
		confirmPassword: "Confirm Password",
		namePlaceholder: "Enter your name",
		emailPlaceholder: "Enter your email",
		passwordPlaceholder: "Enter your password",
		confirmPasswordPlaceholder: "Confirm your password",
		passwordHint: "Password must contain at least 8 characters.",
		submitting: "Submitting...",
		createAccount: "Create account",
		nameRequired: "Name is required.",
		emailRequired: "Email is required.",
		passwordRequired: "Password is required.",
		passwordTooShort: "Password must be at least 8 characters long.",
		passwordsDoNotMatch: "Passwords do not match.",
		success: "Account created successfully. Redirecting to login...",
		genericError: "Something went wrong during registration.",
		usernameOrEmailInUse: "Username or email already in use.",
		nameTooLong: "Name cannot be longer than 20 characters.",

		showPassword: "Show",
		hidePassword: "Hide",
		
		emailInvalid: "Invalid email format.",
	},

	authError: {
		title: "Login failed",
		accessDenied: "This Google or 42 account is not linked yet. Please link it from your profile first.",
		oauthCallback: "The third-party login callback failed. Please try again later.",
		defaultError: "Something went wrong during login. Please try again later.",
		backToLogin: "Back to login",
	},

	//=========================================== privacyPolicy =========================================== 
	privacyPolicy: {
		title: "Privacy Policy",
		effectiveDate: "Effective Date: [10/07/2026]",
		sections: [
			{
				title: "1. Introduction",
				paragraphs: [
					"Welcome to Echoes of Morse, a platform for learning Morse code, joining competitions, and communicating with other users. This Privacy Policy explains how Morse Team collects, uses, stores, and protects your personal data when you use our platform.",
					"By using Echoes of Morse, you agree to the practices described in this policy.",
				],
				items: [],
			},
			{
				title: "2. Data Controller",
				paragraphs: ["Morse Team — morseteam@42.fr"],
				items: [],
			},
			{
				title: "3. Data We Collect",
				paragraphs: [
					"Account information: when you create an account, we collect your username and email address. Your password is stored in hashed form. We do not store plain text passwords.",
					"Third-party account information: when you link Google or 42, we may receive your username, email address, and profile picture.",
					"Private messages: messages sent through private chat are stored in our database while your account is active.",
				],
				items: [
					"Learning progress and practice results",
					"Competition history and scores",
					"Leaderboard rankings",
					"IP address, browser type, and operating system",
					"Session and connection timestamps",
				],
			},
			{
				title: "4. How We Use Your Data",
				paragraphs: [
					"We use your data to provide authentication, learning progress tracking, competitions, leaderboards, friends, chat features, and platform security.",
					"We do not send marketing emails. We do not use your data for advertising purposes.",
				],
				items: [],
			},
			{
				title: "5. Third-Party Services",
				paragraphs: [
					"We use Google OAuth and 42 OAuth for third-party account linking or login. These providers may collect data according to their own privacy policies.",
					"We do not sell your personal data to third parties.",
				],
				items: [],
			},
			{
				title: "6. Private Chat and Content Moderation",
				paragraphs: [
					"Private messages are retained while your account is active. In the event of a reported violation, platform administrators may access related chat content for moderation purposes.",
					"Please do not share sensitive personal information in chat.",
				],
				items: [],
			},
			{
				title: "7. Data Retention",
				paragraphs: [
					"We retain your data for as long as your account is active. Upon account deletion, your profile and messages are deleted.",
					"Competition data may be retained in anonymized form for statistical purposes.",
				],
				items: [],
			},
			{
				title: "8. Your Rights",
				paragraphs: [
					"As an EU user, you have the right to access, correct, delete, restrict, or export your personal data. To exercise these rights, contact us at morseteam@42.fr.",
					"We will respond within 30 days. You may also lodge a complaint with your national data protection authority.",
				],
				items: [],
			},
			{
				title: "9. Data Security",
				paragraphs: [
					"We use hashed password storage, third-party authentication, and access controls to protect your data.",
					"No system is completely secure. We recommend using strong passwords and protecting your third-party accounts.",
				],
				items: [],
			},
			{
				title: "10. Children's Privacy",
				paragraphs: [
					"Echoes of Morse is not directed at children under 13. If you believe a child has provided us with personal data, please contact us and we will delete it promptly.",
				],
				items: [],
			},
			{
				title: "11. Changes to This Policy",
				paragraphs: [
					"We may update this policy from time to time. Continued use of the platform after changes constitutes acceptance of the updated policy.",
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
		title: "Terms of Service",
		effectiveDate: "Effective Date: [10/07/2026]",
		sections: [
			{
				title: "1. Introduction",
				paragraphs: [
					"Welcome to Echoes of Morse. These Terms of Service govern your use of our platform, including Morse code learning tools, competitions, leaderboards, friends, and messaging features.",
					"By accessing or using Echoes of Morse, you agree to these Terms. If you do not agree, please do not use the platform.",
				],
				items: [],
			},
			{
				title: "2. Eligibility",
				paragraphs: [
					"You must be at least 13 years old to use this platform. By using Echoes of Morse, you confirm that you meet this requirement.",
				],
				items: [],
			},
			{
				title: "3. User Accounts",
				paragraphs: [
					"Access to platform features requires an account or a linked third-party login.",
					"You are responsible for maintaining the security of your account and for all activities carried out under your account.",
				],
				items: [],
			},
			{
				title: "4. Acceptable Use",
				paragraphs: ["You agree not to:"],
				items: [
					"Use the platform for illegal purposes",
					"Attempt to hack, disrupt, or overload the service",
					"Cheat in competitions or manipulate rankings",
					"Send abusive, offensive, or harmful messages",
					"Impersonate another user or organization",
				],
			},
			{
				title: "5. Competitions and Rankings",
				paragraphs: [
					"Echoes of Morse provides competitions and leaderboards for educational and entertainment purposes.",
					"We reserve the right to remove scores, suspend accounts, or reset rankings in cases of cheating, abuse, or technical issues.",
				],
				items: [],
			},
			{
				title: "6. Private Messaging",
				paragraphs: [
					"Users may communicate through private chat features. You are solely responsible for the content you send.",
					"We reserve the right to moderate or remove content that violates these Terms or applicable laws.",
				],
				items: [],
			},
			{
				title: "7. Intellectual Property",
				paragraphs: [
					"All platform content, design, logos, and learning materials are the property of Morse Team unless otherwise stated.",
					"You may not copy, redistribute, or commercially exploit platform content without permission.",
				],
				items: [],
			},
			{
				title: "8. Service Availability",
				paragraphs: [
					"We strive to maintain continuous access to the platform, but we do not guarantee uninterrupted service.",
					"The platform may be modified, suspended, or discontinued at any time without prior notice.",
				],
				items: [],
			},
			{
				title: "9. Limitation of Liability",
				paragraphs: [
					"Echoes of Morse is provided as is without warranties of any kind.",
					"Morse Team shall not be liable for data loss, service interruptions, or damages arising from the use of the platform.",
				],
				items: [],
			},
			{
				title: "10. Termination",
				paragraphs: [
					"We reserve the right to suspend or terminate accounts that violate these Terms or threaten platform security.",
				],
				items: [],
			},
			{
				title: "11. Changes to These Terms",
				paragraphs: [
					"We may update these Terms from time to time. Continued use of the platform after changes constitutes acceptance of the updated Terms.",
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
		pageTitle: "Competition",

		//--------- RadioSectionHeader ---------
		radioWaves: "Radio Waves",
		radioWavesDescription: "Choose a transmission speed and join its live lobby.",

		//--------- CompetitionIntro.tsx ---------
		rules: "Rules",
		rulesList: [
			"Choose a radio lobby according to your Morse level.",
			"Each radio lobby can host up to {maxUsers} players.",
			"Click Ready to join the matchmaking queue of this radio.",
			"When at least two players are ready, the session can start.",
			"All ready players receive the same Morse sequences in real time.",
			"The best score at the end of the timer wins the duel.",
		],

		//--------- OnlineOverview.tsx ---------
		onlineOverview: "Online Overview",
		onlineNow: "Online now",
		radioWave01: "Radio Wave 01",
		radioWave02: "Radio Wave 02",
		radioWave03: "Radio Wave 03",
		liveDataConnected: "Live data connected.",
		disconnectedSnapshot: "Disconnected. Showing database snapshot.",

		//--------- RadioWaveCard.tsx ---------
		usersInside: "{count}/{maxUsers} users inside",

		full: "Full",
		enter: "Enter",

		lobbyFullAria: "{radioName}, {wpm} WPM, lobby full",
		enterRadioAria: "Enter {radioName}, {wpm} WPM, {capacity}",

		radioWave01Description: "A slower transmission for new Morse learners.",
		radioWave02Description: "A balanced transmission for intermediate players.",
		radioWave03Description: "A fast transmission for experienced decoders.",

		//--------- ReceivedInvitations.tsx ---------
		failedToAnswerInvitation: "Failed to answer invitation.",

		gameInvitations: "Game Invitations",

		invitedYouTo: "invited you to {radioName}. You have 1 minute to accept before it expires.",
		unknownRadioLobby: "a radio lobby",

		accept: "Accept",
		decline: "Decline",
	},

	competitionRadio: {
		//--------- RadioHeader.tsx ---------
		backToCompetition: "Back to Competition",
		radioLobby: "Radio Lobby",
		lobbyDescription: "{description} Players in this lobby can join the ready queue and start a real-time Morse decoding session together.",
		radioInformation: "Radio information",
		speed: "Speed",
		usersInside: "Users inside",

		//--------- LobbyUserList.tsx ---------
		usersInThisRadio: "Users in this radio",
		seatsTaken: "{count}/{maxUsers} seats taken.",
		lobbyFull: "This lobby is full.",
		statusExplanation: "Gray means idle, green means ready, yellow means already playing.",
		inLobby: "In lobby",
		ready: "Ready",
		playing: "Playing",
		you: "you",
		avatarAlt: "{displayName} avatar",

		//--------- MatchmakingPanel.tsx ---------
		matchmakingQueue: "Matchmaking Queue",
		matchmakingDescription: "Join this radio queue. When at least two players are ready, one ready player can start the decoding session.",
		cancelReady: "Cancel Ready",
		startDecoding: "Start decoding",
		leaveLobby: "Leave lobby",

		currentReadyPlayers: "Current ready players:",
		currentReadyPoint: ".",
		requiredReadyPlayersPrefix: "\u00A0 At least",
		requiredReadyPlayersSuffix: "ready players are required to start.",

		//--------- ReadyPlayersList.tsx ---------
		readyPlayers: "Ready Players",
		readyPlayersDescription: "These players will enter the next game session together.",
		noReadyPlayers: "No player is ready yet. Click Ready to join the queue.",

		//--------- InviteFriendsPanel.tsx ---------
		inviteFriends: "Invite Friends",
		lobbyFullInviteClosed: "{radioName} is full, so new invitations are closed for now.",
		inviteFriendsDescription: "Invite online friends to join {radioName}. The invitation brings them to this lobby, not directly into a game session.",
		
		loadingOnlineFriends: "Loading online friends...",
		
		noOnlineFriend: "No online friend is available right now.",
		signInToInvite: "Sign in to invite online friends.",
		
		onlineFriend: "Online friend",
		invited: "Invited",
		invite: "Invite",
		inviteHint: "Invitations are stored in the database and lead to this radio lobby.",

		//--------- RadioWavePickerModal.tsx ---------
		chooseRadioWave: "Choose a Radio Wave",
		inviteToRadioLobby: "Invite {displayName} to join a radio lobby.",
		closeRadioSelection: "Close radio selection",
		cancel: "Cancel",
		radioWave01: "Radio Wave 01",
		radioWave02: "Radio Wave 02",
		radioWave03: "Radio Wave 03",
		radioWave01Description: "A slower transmission for new Morse learners.",
		radioWave02Description: "A balanced transmission for intermediate players.",
		radioWave03Description: "A fast transmission for experienced decoders.",

		//--------- RadioLobbyClient.tsx ---------
		failedToLoadLobby: "Failed to load the radio lobby.",
		failedToJoinLobby: "Failed to join the lobby.",
		failedToLeaveLobby: "Failed to leave the lobby.",
		failedToAnswerInvitation: "Failed to answer invitation.",
		failedToUpdateReadyStatus: "Failed to update ready status.",
		needReadyBeforeStart: "You need to click Ready before starting a game.",
		needTwoPlayers: "At least two ready players are required to start.",
		failedToStartGame: "Failed to start the game.",
		failedToFetchFriends: "Failed to fetch friends.",
		failedToSendInvitation: "Failed to send invitation.",
	},

	competitionGame: {
		//--------- gameSession.tsx ---------
		noChallengeSequences: "This game has no challenge sequences.",
		failedToLoadGameSession: "Failed to load game.",
		failedToSaveGameResult: "Failed to save game result.",
		
		loadingGameSession: "Loading game...",
		radioWaveTitle: "Radio Wave {radioId}",
		decodeSessionTitle: "{wpm} WPM Decode Session",
		showMorseText: "Show Morse text",

		abandonGame: "Abandon",

		//--------- answer.tsx ---------
		morseScrollHint: "Use the left/right arrow keys or mouse to scroll and view the full content.",
		hidden: "Hidden",

		//--------- answer.tsx ---------
		answerPlaceholder: "Enter your decoded result here...",

		//--------- ranking.tsx ---------
		ranking: "Ranking",
		rank: "Rank",
		player: "Player",
		score: "Score",
		accuracySymbol: "%",

		//--------- finalRanking.tsx ---------
		winner: "Winner",
		tie: "Tie",
		backToRadioLobby: "Back to Radio Lobby",
	},



};

export default en;
