"use client";

import { useI18n } from "@/lib/i18n";

export default function SkipLink() {
	const { dictionary } = useI18n();
	const t = dictionary.layout;

	return (
		<a href="#main-content" className="skip-link">
			{t.skipToMainContent}
		</a>
	);
}