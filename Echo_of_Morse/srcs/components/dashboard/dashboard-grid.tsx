
"use client";
import { useI18n } from "@/lib/i18n";

import Link from "next/link";
import styles from "./dashboard.module.css";
import { useEffect, useState } from "react";

type DashboardCardProps = {
  title: string;
  description: string;
  href: string;
  actionLabel: string;
};

function DashboardCard({ title, description, href, actionLabel }: DashboardCardProps) {
  return (
    <Link href={href} className={styles.card}>
      <div>
        <h2 className={styles.cardTitle}>{title}</h2>

        <p className={styles.cardDescription}>{description}</p>
      </div>

      <span className={styles.cardAction}>{actionLabel}</span>
    </Link>
  );
}

export default function DashboardGrid() {
	const { dictionary } = useI18n();
	const t = dictionary.dashboard;

  const cards = [
    {
      title: t.learningTitle,
      description: t.learningDescription,
      href: "/learning",
    },
    {
      title: t.chatTitle,
      description: t.chatDescription,
      href: "/chat",
    },
    {
      title: t.competitionTitle,
      description: t.competitionDescription,
      href: "/competition",
    },
  ];

  return (
    <section aria-label={t.modulesLabel}>
      <div className={styles.hero}>
        <h1 className={styles.title}>{t.modulesLabel}</h1>
      </div>

      <div className={styles.cardGrid}>
        {cards.map((card) => (
          <DashboardCard
            key={card.title}
            title={card.title}
            description={card.description}
            href={card.href}
			actionLabel={t.openModule}
          />
        ))}
      </div>
    </section>
  );
}
