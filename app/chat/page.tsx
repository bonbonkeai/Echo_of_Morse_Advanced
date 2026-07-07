"use client";

import { Suspense } from "react";
import PageShell from "@/components/layout/page-shell";
import { Card } from "@/components/ui";
import styles from "./chat.module.css";
import ChatLayout from "@/components/chat/ChatLayout";
import { useI18n } from "@/lib/i18n";

export default function ChatPage() {
	const { dictionary } = useI18n();
  	const t = dictionary.chat;

  return (
    <main id="main-content">
      <PageShell>
        <Card>
          <h1 className={styles.title}>{t.pageTitle}</h1>

          <p className={styles.description}>
            {t.pageDescription}
          </p>

          <Suspense fallback={null}>
            <ChatLayout />
          </Suspense>
        </Card>
      </PageShell>
    </main>
  );
}
