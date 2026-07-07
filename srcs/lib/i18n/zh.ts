const zh = {
	profile: {
		loading: "正在加载个人资料...",
		loginRequired: "请先登录以查看个人资料。",
		noEmail: "无邮箱",
		editProfile: "编辑资料",
		defaultUser: "用户",
		//------- statistique------- 
		bio: "个人签名",
		stats: "统计数据",
		accuracy: "准确率",
		learningLevel: "学习等级",
		levelPrefix: "等级",
		friends: "好友",
		joined: "注册时间",
		//------- oauth ------- 
		connectedAccounts: "绑定账号",
		notConnected: "未绑定",
		connected: "已绑定",
		bindGoogle: "绑定 Google",
		bindFortyTwo: "绑定 42",
		unlinkGoogle: "解绑 Google",
		unlinkFortyTwo: "解绑 42",
		unlinkError: "解绑失败，请稍后再试。",
		linkError: "绑定失败，请稍后再试。",
		//------------------ profil friends ------------------
		userNotFound: "未找到用户",
		avatarAlt: "{displayName} 的头像",
		//------------------ profil edit ------------------
		loadingCurrentProfile: "正在加载当前资料...",
		editLoginRequired: "请先登录以编辑个人资料。",
		saving: "保存中...",
		failedToLoadProfile: "加载个人资料失败。",
		loadProfileError: "加载个人资料时出现错误。",
		missingUserId: "缺少用户 ID。",
		changeAvatar: "更换头像",
		username: "用户名",
		usernamePlaceholder: "请输入用户名",
		bioPlaceholder: "介绍一下你自己",
		saveChanges: "保存修改",
		chooseImageFile: "请选择图片文件。",
		imageTooLarge: "请选择小于 500 KB 的图片。",
		readImageError: "无法读取这张图片。",
		failedToUpdateProfile: "更新个人资料失败。",
		updateProfileError: "更新个人资料时出现错误。",
		usernameRequired: "用户名不能为空。",
		usernameTooLong: "用户名不能超过 20 个字符。",
		bioTooLong: "个人签名不能超过 120 个字符。",
	},

	layout: {
		//------------------ navbar ------------------
		brand: "摩斯之声",
		dashboard: "主页",
		profile: "个人",
		login: "登录",
		logout: "退出",
		user: "用户",

		openNotifications: "打开通知",
		notifications: "通知",
		noNewNotifications: "没有新通知。",
		gameInvitations: "游戏邀请",
		friendRequests: "好友请求",
		radioLobbyFallback: "一个无线电大厅",
		invitedYouToRadio: "邀请你加入 {radioName}。你有 1 分钟接受邀请。",
		sentYouFriendRequest: "向你发送了好友请求。",
		view: "查看",
		messages: "消息",
		system: "系统",
		systemMessages: "系统消息",
		unreadSystemNotifications: "未读系统通知：{count} 条。",

		//------------------ footer ------------------
		footerDescription: "学习、交流，并通过摩斯码进行挑战。",
		privacyPolicy: "隐私政策",
		termsOfService: "服务条款",
		copyright: "© 2026 摩斯之声",
		footerNavigation: "页脚导航",
		mainNavigation: "主导航",

		//------------------ languageSwitcher ------------------
		languageSwitcher: "语言切换",

		//------------------ SkipLink ------------------
		skipToMainContent: "跳到主要内容",

	},

	dashboard: {
		modulesLabel: "仪表盘模块",

		openModule: "打开模块 →",

		learningTitle: "学习",
		learningDescription: "练习摩斯码，提升你的识别能力。",

		chatTitle: "聊天",
		chatDescription: "通过实时聊天和其他用户交流。",

		competitionTitle: "比赛",
		competitionDescription: "参加挑战并比较你的表现。",
	},

	home: {
		onlineNow: "当前在线",
		usersConnected: "{count} 位用户在线",

		introTitle: "摩斯项目？",
		introDescription: "摩斯码在这里成为学习信号、节奏、交流和互动的一种方式。",

		historyTitle: "摩斯码的历史",
		historyParagraph1: "摩斯码诞生于十九世纪，最初用于通过电报远距离发送信息。它把文字转换成短信号和长信号，也就是现在说的点和划。",
		historyParagraph2: "这个系统以 Samuel Morse 命名。他和 Alfred Vail 等合作者一起，为电报创造了一种实用的通信方法。",
		historyParagraph3: "摩斯码曾在铁路、海上通信、军事、新闻和紧急救援中发挥重要作用。它让信息传递得比信件和报纸更快。",
		historyParagraph4: "虽然它现在不再是全球通信的主要方式，但摩斯码仍然是一种重要的历史媒介，也是一种有用的学习工具。",

		onlineFriends: "在线好友",
		checkingSession: "正在检查登录状态...",
		onlineFriendsDescription: "当前可以聊天或比赛的好友。",
		loadingOnlineFriends: "正在加载在线好友...",
		noFriendsOnline: "目前没有在线好友。",
		viewAllFriends: "查看所有好友",
		unknownUser: "未知用户",
		avatarAlt: "{displayName} 的头像",
		chat: "聊天",
		invite: "邀请",
		pending: "等待中",
		inviteAlreadyPending: "已经有一个比赛邀请在等待中。",
		inviteSent: "已向 {displayName} 发送比赛邀请，等待对方回应。",
		failedToSendInvitation: "发送邀请失败。",
	},

	notification: {
		newGameInvitationTitle: "新的游戏邀请",
		gameInvitationToastBody: "{username} 邀请你加入 {radioName}。",
		newFriendRequestTitle: "新的好友请求",
		friendRequestToastBody: "{username} 向你发送了好友请求。",
		newMessageFromTitle: "来自 {username} 的新消息",
		radioLobbyFallback: "一个无线电大厅",
	},

	//=========================================== learning =========================================== 
	learningPractice: {
		//------------------ titre ------------------
		level: "等级",

		//------------------ exo ------------------
		decodeSignal: "识别信号",
		playing: "播放中...",
		replaySignal: "重播信号",
		encodeCharacter: "输入摩斯码",

		//------------------ en haut à doite ------------------
		correctCount: "题正确",

		//------------------ réponse ------------------
		yourAnswer: "你的答案",
		leftDot: ".",
		rightDash: "-",
		delete: "删除",
		submit: "提交",

		correct: "正确",
		wrong: "错误",
		correctAnswerText: "正确答案是 ",
		nextQuestion: "下一题",

		helpTitle: "键盘操作提示：",
		decodeHelpText: "听声音或观察灯光信号，然后用键盘输入对应字符。",
		encodeHelpText: "左箭头输入点，右箭头输入划，Backspace 删除。按 Enter 提交。",
		previewLevelTitle: "等级 {level} 预览",
		previewDescription: "在开始练习前，先看一遍本等级要学的新字符。点击卡片中心的灯或下方的声音按钮，会同时播放声音和灯光；点击灯外区域可以再次隐藏摩斯码。",
		tapToReveal: "点击灯外区域查看",
		tapToHide: "点击灯外区域隐藏",
		hiddenMorse: "···",
		bulbPlayLabel: "点击灯泡播放声音并闪灯",
		startPractice: "开始练习",

		//------------------ en bas ------------------
		audio: "声音",
		light: "灯光",

		//------------------ cheatSheet ------------------
		cheatSheetTitle: "摩斯提示卡",
		playSound: "播放",

		//------------------ resultat ------------------
		complete: "完成",

		levelPassed: "通过本关",
		tryAgain: "再试一次",
		
		resultSummary: "你答对了 {correctCount} / {questionCount} 题。",
		passConditionText: "通过条件：{passCount} / {questionCount}。",

		accuracy: "准确率",
		status: "状态",
		unlockedNext: "已解锁下一关",
		needsReview: "需要复习",

		practiceAgain: "重新练习",
		backToLevels: "返回等级列表",
		nextLevel: "下一关",
		
		//------------------ error ------------------
		noQuestion: "没有可用题目。"
	},

	learning: {
		//------------------ app/learning/page.tsx ------------------
		pageTitle: "学习摩斯码",
		pageDescription: "通过混合练习关卡继续训练摩斯码。",

		//------------------ srcs/components/learning/LearningProgressCard.tsx ------------------
		yourProgress: "你的进度",
		levelLabel: "等级 {level}",
		completedLevels: "你已完成 {completed} / {total} 个等级。",
		today: "今日",
		accuracy: "准确率",
		reaction: "反应",
		sessions: "练习次数",
		minutes: "{minutes} 分钟",
		hours: "{hours} 小时",
		hoursMinutes: "{hours} 小时 {minutes} 分钟",

		//------------------ srcs/components/learning/LearningEntryCards.tsx ------------------
		learningOptions: "学习选项",
		levels: "等级",
		chooseLevel: "选择等级",
		levelsDescription: "查看摩斯码练习等级，并选择已解锁的等级开始练习。",
		openLevels: "打开等级列表",

		review: "复习",
		reviewDueCharacters: "复习薄弱字符",
		reviewDescription: "根据练习结果，选出准确率较低的字符进行复习。",
		startReview: "开始复习",

		
		//------------------ app/learning/levels/page.tsx ------------------
		levelsPageDescription: "学习路径包含字母、数字和标点。每个等级都使用混合练习：有时识别摩斯码信号，有时用键盘输入摩斯码。",
		breadcrumbLearning: "学习",
		breadcrumbLevels: "等级",
		
		//------------------ srcs/components/learning/LevelGrid.tsx ------------------
		morseLevels: "摩斯码等级",
		globalAccuracy: "总体正确率",
		practiceSessions: "练习次数",

		//------------------ srcs/components/learning/LevelCard.tsx ------------------
		newCharacters: "新字符",
		questions: "题目",
		pass: "通过条件",
		locked: "未解锁",
		startPractice: "开始练习",

		completed: "已完成",
		current: "当前",
		unlocked: "已解锁",

		//------------------ srcs/components/learning/LetterProgressPreview.tsx------------------
		letterProgressLabel: "字符进度",
		letterProgressTitle: "每个字符的正确率",
		letterProgressDescription: "每根柱子表示一个字符的正确率。较弱的字符会排在前面。",
		letterProgressScrollHint: "横向滚动以查看所有字符。",
		successRate: "正确率",
		correct: "正确",
		wrong: "错误",

		//------------------ srcs/components/learning/LearningPlay.tsx------------------
		breadcrumb: "目录",
		breadcrumbPlay: "练习",
		playFallbackOptions: "练习选项",
		noCompletedLevelYet: "还没有完成的等级",
		playFallbackDescription: "练习模式会复习你已经完成的等级。请先完成当前等级，然后再回来随机练习。",
		currentLevel: "当前等级",
		startLevel: "开始等级 {level}",
		currentLevelDescription: "继续当前的混合练习。完成至少一个等级后，练习模式才会可用。",
		levelsFallbackDescription: "返回等级列表，选择一个已解锁的等级继续训练。",

	},

	learningReview: {
		title: "复习",
		noProgressDescription: "请先完成一些等级练习，系统才能建立你的复习计划。",

		loading: "正在准备复习题目...",
		unavailable: "暂时无法复习",
		loadError: "无法加载复习内容。",
		saveError: "无法保存复习结果。",
		noProgressTitle: "暂时没有可复习的字符",
		
		openLevels: "打开等级列表",
		sessionSummary: "目前有 {dueCount} 个待复习字符，本次优先复习 {reviewedCharacters} 个字符。",
		
		tryAgain: "重试",
		reviewComplete: "复习完成",
		reviewResultSummary: "你答对了 {correctCount} / {questionCount} 题。",
		accuracy: "准确率",
		reviewAgain: "再次复习",
		backToLearning: "返回学习主页",
	},

	//=========================================== chat =========================================== 
	chat: {
		//--------- friendList ---------
		chats: "聊天",
		close: "关闭",
		add: "+ 添加",

		added: "已添加",
		pending: "等待中",
		invite: "邀请",

		searchMyFriends: "搜索我的好友",
		searchUsersToAdd: "搜索要添加的用户",
		noUsersFound: "没有找到用户。",
		noFriendsFound: "没有找到好友。",

		systemMessages: "系统消息",
		noSystemMessages: "暂无系统消息。",
		
		//--------- ChatHeader ---------
		offline: "离线",
		online: "在线",
		
		viewProfile: "查看 {displayName} 的资料",
		avatarAlt: "{displayName} 的头像",
		openProfileHint: "点击头像打开个人资料。",
		closeChat: "关闭聊天",
		
		//--------- ChatModeSelector ---------
		languageToMorse: "文字 ⭢ 摩斯",
		morseToLanguage: "摩斯 ⭢ 文字",
		textOnly: "仅文字",
		morseOnly: "仅摩斯",
		encodeOnly: "仅编码",
		chatModeSelector: "聊天模式选择",
		
		//--------- MessageComposer ---------
		typeTextToMorse: "输入文字，显示文字和摩斯码...",
		enterMorseToDecode: "输入摩斯码进行解码...",
		typeMessage: "输入消息...",
		typeMorseOnly: "只输入摩斯码...",
		typeTextAsMorseOnly: "输入文字并只发送摩斯码...",
		send: "发送",
		
		//--------- FriendListItem ---------
		unknownUser: "未知用户",
		newRemarkName: "新备注名",
		deleteFriendConfirm: "从好友中删除 {displayName}？",
		gameInviteAlreadyPending: "已经有一个游戏邀请在等待中",
		inviteFriendToPlay: "邀请这个好友一起玩",
		friendOffline: "这个好友不在线",
		
		//--------- ContextMenu ---------
		renameRemark: "修改备注",
		shareFriend: "分享好友",
		inviteToGame: "邀请游戏",
		deleteFriend: "删除好友",
		friendOfflineOrPending: "这个好友不在线，或已经有等待中的邀请。",
		
		//--------- SystemMessage ---------
		systemDescription: "关于好友请求、分享联系人和聊天操作的通知。",
		systemMessageTemplates: {
			"gameInvitation.accepted.receiver": {
				title: "游戏邀请已接受",
				body: "你接受了 {username} 的 {radioName} 邀请。",
			},
			"gameInvitation.accepted.sender": {
				title: "游戏邀请已接受",
				body: "{username} 已接受你的 {radioName} 邀请，准备好后可以加入大厅。",
			},
			"gameInvitation.declined.receiver": {
				title: "游戏邀请已拒绝",
				body: "你拒绝了 {username} 的 {radioName} 邀请。",
			},
			"gameInvitation.declined.sender": {
				title: "游戏邀请已拒绝",
				body: "{username} 拒绝了你的 {radioName} 邀请。",
			},
			"gameInvitation.expired.sender": {
				title: "游戏邀请已过期",
				body: "{username} 没有在 1 分钟内回应，你的 {radioName} 邀请已取消。",
			},
			"friendRequest.received": {
				title: "好友请求",
				body: "{username} 向你发送了好友请求。",
			},
			"friendRequest.accepted.sender": {
				title: "好友请求已接受",
				body: "{username} 接受了你的好友请求。",
			},
			"friendRequest.accepted.receiver": {
				title: "好友已添加",
				body: "{username} 已添加到你的好友列表。",
			},
			"friend.removed": {
				title: "好友已删除",
				body: "{username} 已从你的好友列表中删除。",
			},
		},

		//--------- SystemMessageWindow ---------
		systemWindowDescription: "游戏邀请、好友请求和系统通知。",
		accepted: "已接受",
		declined: "已拒绝",
		expired: "已过期",
		actionFailed: "操作失败",
		updating: "更新中...",
		joining: "加入中...",
		joinLobby: "加入大厅",
		switchLobbyRequired: "你已经在另一个无线电大厅中。",
		leaveAndJoinLobby: "离开并加入",
		cancel: "取消",
		accept: "接受",
		decline: "拒绝",

		//--------- chat/page---------
		pageTitle: "聊天",
		pageDescription: "这个页面将用于实时聊天和交流功能。",
	},

	chatLayout: {
		newGameInvitationTitle: "新的游戏邀请",
		radioLobbyFallback: "某个无线电大厅",
		gameInvitationBody: "{username} 邀请你加入 {radioName}。你有 1 分钟时间接受邀请。",

		friendOffline: "这个好友不在线。",
		gameInvitationAlreadyPending: "已经向这个好友发送了游戏邀请。",
		friendHasPendingGameInvitation: "这个好友已有一个待处理的游戏邀请。",
		friendAlreadyInvitedYou: "这个好友已经邀请了你，请先接受或拒绝对方的邀请。",
		friendInGame: "这个好友正在游戏中。",
		friendReadyInLobby: "这个好友已经在大厅中准备好了。",

		failedToUpdateInvitation: "更新邀请失败。",
		systemMessageWithoutRadio: "这条系统消息没有关联无线电大厅。",
		failedToJoinRadioLobby: "加入无线电大厅失败。",
		failedToSendInvitation: "发送邀请失败。",

		failedToOpenConversation: "打开对话失败。",
		conversationNotReady: "对话还没有准备好。",
		failedToSendMessage: "发送消息失败。",

		userAlreadyFriend: "这个用户已经在你的好友列表中。",
		friendRequestAlreadySent: "好友请求已经发送。",
		friendRequestAlreadyExists: "已经存在与这个用户的好友请求。",
		failedToSendFriendRequest: "发送好友请求失败，请稍后再试。",
		networkError: "网络错误，请稍后再试。",
		friendRequestSentTitle: "好友请求已发送",
		friendRequestSentBody: "已向 {displayName} 发送好友请求，等待对方接受。",
		friendRequestReceivedTitle: "好友请求",
		friendRequestReceivedBody: "{username} 向你发送了好友请求。",
		failedToUpdateFriendRequest: "更新好友请求失败。",

		friendRemarkEmpty: "好友备注不能为空。",
		friendRemarkDuplicate: "这个备注名已经存在于你的好友列表中。",
		friendRemarkUpdatedTitle: "好友备注已更新",
		friendRemarkUpdatedBody: "{oldName} 已被重命名为 {newName}。",

		friendRemovedTitle: "好友已删除",
		friendRemovedBody: "{displayName} 已从本地好友列表中删除。",
		
		openChatBeforeSharingFriend: "请先打开一个聊天窗口再分享好友。",
		cannotShareFriendToThemselves: "不能把这个好友分享给自己。",
		sharedContactMessage: "分享联系人：{displayName} (@{username})",
		contactSharedTitle: "联系人已分享",
		contactSharedBody: "{displayName} 已分享给 {friendName}。",

		gameInvitationSentTitle: "游戏邀请已发送",
		gameInvitationSentBody: "已向 {displayName} 发送游戏邀请，等待对方回应。",

		emptyMessage: "消息不能为空。",
		invalidMorseInput: "摩斯码格式不正确。只能使用点、划、空格，以及用于分隔单词的 /。",
	},

	//=========================================== auth =========================================== 
	login: {
		title: "登录",
		description: "登录以继续使用你的账号。",

		email: "邮箱",
		password: "密码",
		emailPlaceholder: "请输入邮箱",
		passwordPlaceholder: "请输入密码",

		emailRequired: "邮箱不能为空。",
		passwordRequired: "密码不能为空。",

		invalidCredentials: "邮箱或密码不正确。",
		success: "登录成功。",
		genericError: "登录时出现错误。",

		submitting: "提交中...",
		loginButton: "登录",

		loginWithGoogle: "Google 登录",
		loginWithFortyTwo: "42 登录",

		noAccount: "还没有账号？",
		registerHere: "点击这里注册",

		showPassword: "显示",
		hidePassword: "隐藏",
	},

	register: {
		title: "注册",
		description: "创建你的账号以使用平台功能。",
		name: "用户名",
		email: "邮箱",
		password: "密码",
		confirmPassword: "确认密码",
		namePlaceholder: "请输入用户名",
		emailPlaceholder: "请输入邮箱",
		passwordPlaceholder: "请输入密码",
		confirmPasswordPlaceholder: "请再次输入密码",
		passwordHint: "密码至少需要 8 个字符。",
		submitting: "提交中...",
		createAccount: "创建账号",
		nameRequired: "用户名不能为空。",
		emailRequired: "邮箱不能为空。",
		passwordRequired: "密码不能为空。",
		passwordTooShort: "密码长度至少需要 8 个字符。",
		passwordsDoNotMatch: "两次输入的密码不一致。",
		success: "账号创建成功，正在跳转到登录页面...",
		genericError: "注册时出现错误，请稍后再试。",
		usernameOrEmailInUse: "用户名或邮箱已被使用。",
		nameTooLong: "用户名不能超过 20 个字符。",

		showPassword: "显示",
		hidePassword: "隐藏",

		emailInvalid: "邮箱格式不正确。",
	},
	
	authError: {
		title: "登录失败",
		accessDenied: "Google 或 42 账号还没有绑定，请先在个人主页绑定账号。",
		oauthCallback: "第三方登录回调失败，请稍后重试。",
		defaultError: "登录过程中出现错误，请稍后重试。",
		backToLogin: "返回登录页",
	},

	//=========================================== privacyPolicy =========================================== 
	privacyPolicy: {
		title: "隐私政策",
		effectiveDate: "生效日期：[10/07/2026]",
		sections: [
			{
				title: "1. 介绍",
				paragraphs: [
					"欢迎使用 摩斯之声。摩斯之声 是一个用于学习摩斯码、参加比赛并与其他用户交流的平台。本隐私政策说明 Morse Team 如何在你使用平台时收集、使用、保存和保护你的个人数据。",
					"使用 摩斯之声 即表示你同意本政策中描述的做法。",
				],
				items: [],
			},
			{
				title: "2. 数据控制方",
				paragraphs: ["Morse Team — morseteam@42.fr"],
				items: [],
			},
			{
				title: "3. 我们收集的数据",
				paragraphs: [
					"账号信息：注册账号时，我们会收集你的用户名和邮箱地址。你的密码会被加密保存，我们不会保存明文密码。",
					"第三方账号信息：当你绑定 Google 或 42 账号时，我们可能会接收你的用户名、邮箱地址和头像。",
					"私聊消息：通过私聊功能发送的消息会在你的账号存在期间保存在数据库中。",
				],
				items: [
					"学习进度和练习结果",
					"比赛记录和分数",
					"排行榜排名",
					"IP 地址、浏览器类型和操作系统",
					"会话和连接时间",
				],
			},
			{
				title: "4. 我们如何使用你的数据",
				paragraphs: [
					"我们使用你的数据来提供账号登录、学习进度记录、比赛功能、排行榜、好友和聊天功能，并维护平台安全。",
					"我们不会发送营销邮件，也不会将你的数据用于广告目的。",
				],
				items: [],
			},
			{
				title: "5. 第三方服务",
				paragraphs: [
					"我们使用 Google OAuth 和 42 OAuth 进行第三方账号绑定或登录。这些服务可能会根据它们自己的隐私政策收集数据。",
					"我们不会向第三方出售你的个人数据。",
				],
				items: [],
			},
			{
				title: "6. 私聊和内容管理",
				paragraphs: [
					"私聊消息会在你的账号存在期间被保存。如果发生违规举报，平台管理员可能会查看相关聊天内容以进行管理。",
					"请不要在聊天中分享敏感个人信息。",
				],
				items: [],
			},
			{
				title: "7. 数据保存",
				paragraphs: [
					"只要你的账号处于有效状态，我们会保存你的数据。账号删除后，你的个人资料和消息会被删除。",
					"比赛数据可能会以匿名形式保留，用于统计目的。",
				],
				items: [],
			},
			{
				title: "8. 你的权利",
				paragraphs: [
					"作为欧盟用户，你有权访问、更正、删除、限制处理或导出你的个人数据。你可以通过 morseteam@42.fr 联系我们行使这些权利。",
					"我们会在 30 天内回复。你也可以向所在国家的数据保护机构提出投诉。",
				],
				items: [],
			},
			{
				title: "9. 数据安全",
				paragraphs: [
					"我们使用加密密码存储、第三方登录和访问控制来保护你的数据。",
					"没有任何系统是绝对安全的。我们建议你使用强密码，并保护好你的第三方账号。",
				],
				items: [],
			},
			{
				title: "10. 儿童隐私",
				paragraphs: [
					"摩斯之声 不面向 13 岁以下儿童。如果你认为有儿童向我们提供了个人数据，请联系我们，我们会尽快删除相关数据。",
				],
				items: [],
			},
			{
				title: "11. 政策变更",
				paragraphs: [
					"我们可能会不时更新本隐私政策。政策更新后继续使用平台，即表示你接受更新后的政策。",
				],
				items: [],
			},
			{
				title: "12. 联系方式",
				paragraphs: ["Morse Team — morseteam@42.fr"],
				items: [],
			},
		],
	},

	//=========================================== termsOfService =========================================== 
	termsOfService: {
		title: "服务条款",
		effectiveDate: "生效日期：[10/07/2026]",
		sections: [
			{
				title: "1. 介绍",
				paragraphs: [
					"欢迎使用 摩斯之声。本服务条款适用于你对本平台的使用，包括摩斯码学习工具、比赛、排行榜、好友和消息功能。",
					"访问或使用 摩斯之声 即表示你同意本条款。如果你不同意，请不要使用本平台。",
				],
				items: [],
			},
			{
				title: "2. 使用资格",
				paragraphs: [
					"你必须年满 13 岁才能使用本平台。使用 摩斯之声 即表示你确认自己符合该要求。",
				],
				items: [],
			},
			{
				title: "3. 用户账号",
				paragraphs: [
					"使用平台功能需要创建账号，或使用已绑定的第三方账号登录。",
					"你需要负责维护账号安全，并对账号下发生的所有活动负责。",
				],
				items: [],
			},
			{
				title: "4. 可接受的使用方式",
				paragraphs: ["你同意不会进行以下行为："],
				items: [
					"将平台用于非法目的",
					"尝试攻击、破坏或过载平台服务",
					"在比赛中作弊或操纵排行榜",
					"发送辱骂、攻击性或有害消息",
					"冒充其他用户或组织",
				],
			},
			{
				title: "5. 比赛和排行榜",
				paragraphs: [
					"摩斯之声 提供比赛和排行榜功能，用于学习和娱乐目的。",
					"如果出现作弊、滥用或技术问题，我们保留删除分数、暂停账号或重置排名的权利。",
				],
				items: [],
			},
			{
				title: "6. 私聊消息",
				paragraphs: [
					"用户可以通过私聊功能进行交流。你需要对自己发送的内容负责。",
					"如果内容违反本条款或适用法律，我们保留管理或删除相关内容的权利。",
				],
				items: [],
			},
			{
				title: "7. 知识产权",
				paragraphs: [
					"除非另有说明，平台内容、设计、标志和学习材料属于 Morse Team。",
					"未经许可，你不得复制、重新分发或商业使用平台内容。",
				],
				items: [],
			},
			{
				title: "8. 服务可用性",
				paragraphs: [
					"我们会尽力保持平台可用，但不保证服务永远不中断。",
					"平台可能会在没有提前通知的情况下被修改、暂停或停止。",
				],
				items: [],
			},
			{
				title: "9. 责任限制",
				paragraphs: [
					"摩斯之声 按现状提供，不作任何形式的保证。",
					"Morse Team 不对因使用平台导致的数据丢失、服务中断或其他损害承担责任。",
				],
				items: [],
			},
			{
				title: "10. 账号终止",
				paragraphs: [
					"如果账号违反本条款或威胁平台安全，我们保留暂停或终止该账号的权利。",
				],
				items: [],
			},
			{
				title: "11. 条款变更",
				paragraphs: [
					"我们可能会不时更新本服务条款。条款更新后继续使用平台，即表示你接受更新后的条款。",
				],
				items: [],
			},
			{
				title: "12. 联系方式",
				paragraphs: ["Morse Team — morseteam@42.fr"],
				items: [],
			},
		],
	},

	//=========================================== competition =========================================== 
	competitionHome: {
		//--------- CompetitionHeader ---------
		pageTitle: "比赛",

		//--------- RadioSectionHeader ---------
		radioWaves: "无线电频道",
		radioWavesDescription: "选择一个传输速度，并进入对应的实时大厅。",

		//--------- CompetitionIntro.tsx ---------
		rules: "规则",
		rulesList: [
			"根据你的摩斯码水平选择一个无线电大厅。",
			"每个无线电大厅最多容纳 {maxUsers} 名玩家。",
			"点击准备，加入该频道的匹配队列。",
			"当至少两名玩家准备好后，可以开始游戏。",
			"所有准备好的玩家会实时接收相同的摩斯码序列。",
			"计时结束时，分数最高的玩家获胜。",
		],

		//--------- OnlineOverview.tsx ---------
		onlineOverview: "在线概览",
		onlineNow: "当前在线",
		liveDataConnected: "实时数据已连接。",
		disconnectedSnapshot: "连接已断开，正在显示数据库快照。",

		radioWave01: "无线电频道 01",
		radioWave02: "无线电频道 02",
		radioWave03: "无线电频道 03",

		//--------- RadioWaveCard.tsx ---------
		usersInside: "{count}/{maxUsers} 位用户在房间内",

		full: "已满",
		enter: "进入",

		lobbyFullAria: "{radioName}，{wpm} WPM，大厅已满",
		enterRadioAria: "进入 {radioName}，{wpm} WPM，{capacity}",

		radioWave01Description: "适合摩斯码初学者的较慢传输速度。",
		radioWave02Description: "适合中级玩家的平衡传输速度。",
		radioWave03Description: "适合熟练解码者的高速传输速度。",

		//--------- ReceivedInvitations.tsx ---------
		failedToAnswerInvitation: "处理邀请失败。",

		gameInvitations: "游戏邀请",

		invitedYouTo: "邀请你加入 {radioName}。你有 1 分钟接受邀请，之后邀请会过期。",
		unknownRadioLobby: "一个无线电大厅",

		accept: "接受",
		decline: "拒绝",
	},

	competitionRadio: {
		//--------- RadioHeader.tsx ---------
		backToCompetition: "← 返回比赛页",
		radioLobby: "无线电大厅",
		lobbyDescription: "{description} 这个大厅中的玩家可以加入准备队列，并一起开始实时摩斯码解码游戏。",
		radioInformation: "无线电信息",
		speed: "速度",
		usersInside: "房间人数",

		//--------- LobbyUserList.tsx ---------
		usersInThisRadio: "当前频道用户",

		seatsTaken: "{count}/{maxUsers} 个位置已占用。",
		statusExplanation: "灰色表示仅在大厅中，绿色表示已准备，黄色表示游戏中。",
		
		lobbyFull: "这个大厅已满。",
		inLobby: "在大厅中",
		ready: "准备",
		playing: "游戏中",
		
		you: "你",
		avatarAlt: "{displayName} 的头像",

		//--------- MatchmakingPanel.tsx ---------
		matchmakingQueue: "匹配队列",
		matchmakingDescription: "加入这个频道的队列。当至少两名玩家准备好后，任意已准备玩家都可以开始解码游戏。",
		cancelReady: "取消准备",
		startDecoding: "开始解码",
		leaveLobby: "离开大厅",

		currentReadyPlayers: "当前准备玩家:",
		currentReadyPoint: "。 ",
		requiredReadyPlayersPrefix: "至少需要",
		requiredReadyPlayersSuffix: "名准备玩家才能开始。",

		//--------- ReadyPlayersList.tsx ---------
		readyPlayers: "已准备玩家",
		readyPlayersDescription: "这些玩家会一起进入下一场游戏。",
		noReadyPlayers: "还没有玩家准备。点击准备加入队列。",

		//--------- InviteFriendsPanel.tsx ---------
		inviteFriends: "邀请好友",
		inviteFriendsDescription: "邀请在线好友加入 {radioName}。邀请会把他们带到这个大厅，而不是直接进入游戏。",
		loadingOnlineFriends: "正在加载在线好友...",
		
		noOnlineFriend: "现在没有在线好友可邀请。",
		signInToInvite: "请先登录以邀请在线好友。",
		
		onlineFriend: "在线好友",
		invited: "已邀请",
		invite: "邀请",
		lobbyFullInviteClosed: "{radioName} 已满，暂时无法发送新的邀请。",
		inviteHint: "邀请会保存在数据库中，并跳转到当前无线电大厅。",

		//--------- RadioWavePickerModal.tsx ---------
		chooseRadioWave: "选择无线电频道",
		inviteToRadioLobby: "邀请 {displayName} 加入一个无线电大厅。",
		closeRadioSelection: "关闭无线电选择",
		cancel: "取消",
		radioWave01: "无线电频道 01",
		radioWave02: "无线电频道 02",
		radioWave03: "无线电频道 03",
		radioWave01Description: "适合摩斯码初学者的较慢传输速度。",
		radioWave02Description: "适合中级玩家的平衡传输速度。",
		radioWave03Description: "适合熟练解码者的高速传输速度。",

		//--------- RadioLobbyClient.tsx ---------
		failedToLoadLobby: "加载无线电大厅失败。",
		failedToJoinLobby: "加入大厅失败。",
		failedToLeaveLobby: "离开大厅失败。",
		failedToAnswerInvitation: "处理邀请失败。",
		failedToUpdateReadyStatus: "更新准备状态失败。",
		needReadyBeforeStart: "你需要先点击准备才能开始游戏。",
		needTwoPlayers: "至少需要两名准备玩家才能开始。",
		failedToStartGame: "开始游戏失败。",
		failedToFetchFriends: "加载好友失败。",
		failedToSendInvitation: "发送邀请失败。",
	},

	competitionGame: {
		//--------- gameSession.tsx ---------
		noChallengeSequences: "这个游戏目前没有可用题目。",
		failedToLoadGameSession: "加载游戏失败。",
		failedToSaveGameResult: "保存游戏结果失败。",
		
		loadingGameSession: "正在加载游戏...",
		radioWaveTitle: "无线电频道 {radioId}",
		decodeSessionTitle: "{wpm} WPM 解码",
		showMorseText: "显示摩斯文本",

		abandonGame: "放弃",

		//--------- answer.tsx ---------
		morseScrollHint: "可使用键盘左/右箭头或鼠标，滑动查看完整内容。",
		hidden: "已隐藏",

		//--------- answer.tsx ---------
		answerPlaceholder: "在此输入你的解码结果...",

		//--------- ranking.tsx ---------
		ranking: "排行榜",
		rank: "排名",
		player: "玩家",
		score: "分数",
		accuracySymbol: "%",

		//--------- finalRanking.tsx ---------
		winner: "获胜者",
		tie: "平局",
		backToRadioLobby: "返回无线电大厅",
	},

};

export default zh;
