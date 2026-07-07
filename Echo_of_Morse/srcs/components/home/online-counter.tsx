"use client";
import { useI18n } from "@/lib/i18n";
import { useEffect, useState } from "react";

import { useSocket } from "@/providers/socket-provider";
import styles from "./home.module.css";
import { Card } from "@/components/ui";

export default function OnlineCounter() {
	const { dictionary } = useI18n();
  	const t = dictionary.home;

  const { socket, isConnected } = useSocket();

  const [onlineCount, setOnlineCount] = useState(0);

  useEffect(() => {
    if (!socket) {
      // Sans socket (déconnecté ou visiteur anonyme), pas de push en direct :
      // on lit le compte réel depuis la DB au lieu de garder l'ancienne valeur.
      fetch("/api/users/online-count")
        .then((res) => res.json())
        .then((data) => setOnlineCount(data.count ?? 0))
        .catch(() => {});
      return;
    }

    const handleUsersCount = (count: number) => {
      setOnlineCount(count);
    };

    socket.on("users-count", handleUsersCount);

    if (socket.connected) {
      socket.emit("get-users-count");
    }

    return () => {
      socket.off("users-count", handleUsersCount);
    };
  }, [socket]);

  return (
  <Card className={styles.sectionBlock}>
    <h2 className={styles.sectionTitle}>{t.onlineNow}</h2>

    <p className={styles.onlineText}>
      {t.usersConnected.replace("{count}", String(onlineCount))}
    </p>
  </Card>
  );
}
