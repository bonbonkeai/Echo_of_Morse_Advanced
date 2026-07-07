"use client";

import { useI18n } from "@/lib/i18n";
import PageShell from "@/components/layout/page-shell";

export default function TermsPage() {
	const { dictionary } = useI18n();
	const t = dictionary.termsOfService;

	return (
		<PageShell>
			<div className="mx-auto max-w-4xl px-6 py-10 text-gray-800 leading-7">
				<h1 className="mb-4 text-4xl font-bold">{t.title}</h1>

				<p className="text-sm text-gray-500">
					<em>{t.effectiveDate}</em>
				</p>

				{t.sections.map((section) => (
					<section className="mt-10 space-y-4" key={section.title}>
						<h2 className="text-2xl font-semibold">{section.title}</h2>

						{section.paragraphs.map((paragraph) => (
							<p key={paragraph}>{paragraph}</p>
						))}

						{section.items.length > 0 ? (
							<ul className="list-disc pl-6 space-y-2">
								{section.items.map((item) => (
									<li key={item}>{item}</li>
								))}
							</ul>
						) : null}
					</section>
				))}
			</div>
		</PageShell>
	);
}
