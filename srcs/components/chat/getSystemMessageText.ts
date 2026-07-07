//* aider pour i18n avec i18nkey et i18nparams
//key：
	// "gameInvitation.accepted.receiver"
	// "gameInvitation.accepted.sender"
	// "gameInvitation.declined.receiver"
	// "gameInvitation.declined.sender"
	// "gameInvitation.expired.sender"
// i18nParams
	// { username }
//radioId
//--------- ex ---------
// i18nKey: "gameInvitation.accepted.receiver"
// i18nParams: { username: "lifan" }
// radioId: "01"
import type { SystemMessage } from "@/types/chat";

type ChatText = {
	systemMessageTemplates: Record<string, {
		title: string;
		body: string;
	}>;
};

type RadioText = {
	radioWave01: string;
	radioWave02: string;
	radioWave03: string;
	radioLobby: string;
};

function getRadioName(radioId: string | undefined, radioT: RadioText) {
	if (radioId === "01") return radioT.radioWave01;
	if (radioId === "02") return radioT.radioWave02;
	if (radioId === "03") return radioT.radioWave03;
	return radioT.radioLobby;
}

function formatTemplate(
	template: string,
	params: Record<string, string> | undefined,
	radioName: string
) {
	return template
		.replace("{username}", params?.username ?? "")
		.replace("{radioName}", radioName);
}

export function getSystemMessageText(
	message: SystemMessage,
	t: ChatText,
	radioT: RadioText
) {
	const template = message.i18nKey
		? t.systemMessageTemplates[message.i18nKey]
		: undefined;

	if (!template) {
		return { title: message.title, body: message.body };
	}

	const radioName = getRadioName(message.radioId, radioT);

	return {
		title: formatTemplate(template.title, message.i18nParams, radioName),
		body: formatTemplate(template.body, message.i18nParams, radioName),
	};
}
