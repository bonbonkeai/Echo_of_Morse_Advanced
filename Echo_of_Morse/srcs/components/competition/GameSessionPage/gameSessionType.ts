//Abandon feature: add completed and abandoned boolean to mark the finish status.
export type Player = {
	id: string;
	username: string;
	score: number;
	correct: number;
	total: number;
	streak: number;
	completed: boolean;
	abandoned: boolean;
};


//Abandon feature: add playerStatus
export type PlayerStatus = "playing" | "completed" | "abandoned";

export type GameSessionData = {
	id: string;
	status: "waiting" | "active" | "finished";
	duration: number;
	sequences: string[];
	speedWpm: number;
	players: Player[];
};

export type LoadGameSessionParams = {
	radioId: string;
	sessionId: string;
};
