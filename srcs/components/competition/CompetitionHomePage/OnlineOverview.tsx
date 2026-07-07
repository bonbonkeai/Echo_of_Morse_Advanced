"use client";

import { useI18n } from "@/lib/i18n";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui";
import { useSocket } from "@/providers/socket-provider";
import styles from "@/../app/competition/competition.module.css";

type OnlineOverviewProps = {
  overview: {
    totalOnlineUsers: number;
    radioUsers: Record<string, number>;
  };
};

export default function OnlineOverview({ overview }: OnlineOverviewProps) {
	const { dictionary } = useI18n();
	const t = dictionary.competitionHome;
  const { socket, isConnected } = useSocket();

  const [onlineNow, setOnlineNow] = useState(overview.totalOnlineUsers);
  const [radioUsers, setRadioUsers] = useState(overview.radioUsers);

  useEffect(() => {
    if (!socket) return;

    function handleUsersCount(count: number) {
      setOnlineNow(count);
    }

    /**
     * optional: future event for live lobby updates
     */
    function handleRadioUpdate(data: {
      radioId: string;
      count: number;
    }) {
      setRadioUsers((prev) => ({
        ...prev,
        [data.radioId]: data.count,
      }));
    }

    socket.on("users-count", handleUsersCount);
    socket.on("radio-users-update", handleRadioUpdate);
    socket.emit("get-users-count");

    return () => {
      socket.off("users-count", handleUsersCount);
      socket.off("radio-users-update", handleRadioUpdate);
    };
  }, [socket]);

  useEffect(() => {
    let cancelled = false;

    async function refreshOverview() {
      const response = await fetch("/api/competition/overview", {
        cache: "no-store",
      });

      if (!response.ok) {
        return;
      }

      const data = (await response.json()) as {
        totalOnlineUsers: number;
        radioUsers: Record<string, number>;
      };

      if (!cancelled) {
        setOnlineNow(data.totalOnlineUsers);
        setRadioUsers(data.radioUsers);
      }
    }

    void refreshOverview().catch(() => undefined);
    // Socket events keep this live; polling catches delayed updates quickly.
    const intervalMs = isConnected ? 5000 : 3000;
    const intervalId = window.setInterval(() => {
      void refreshOverview().catch(() => undefined);
    }, intervalMs);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, [isConnected]);

  return (
    <Card className={styles.overviewCard} aria-labelledby="online-overview">
      <h2 id="online-overview" className={styles.cardTitle}>
        {t.onlineOverview}
      </h2>

      <dl className={styles.statsList}>
        <div className={styles.statRow}>
          <dt>{t.onlineNow}</dt>
          <dd>{onlineNow}</dd>
        </div>

        <div className={styles.statRow}>
          <dt>{t.radioWave01}</dt>
          <dd>{radioUsers["01"] ?? 0}</dd>
        </div>

        <div className={styles.statRow}>
          <dt>{t.radioWave02}</dt>
          <dd>{radioUsers["02"] ?? 0}</dd>
        </div>

        <div className={styles.statRow}>
          <dt>{t.radioWave03}</dt>
          <dd>{radioUsers["03"] ?? 0}</dd>
        </div>
      </dl>

      <p className={styles.socketHint}>
        {isConnected? t.liveDataConnected : t.disconnectedSnapshot}
      </p>
    </Card>
  );
}
