"use client";

import { Card } from "@/components/ui";
import { useI18n } from "@/lib/i18n";

export default function ProfileUserNotFound() {
	const { dictionary } = useI18n();
	const t = dictionary.profile;

	return (
		<Card>
			<h1>{t.userNotFound}</h1>
		</Card>
	);
}
