"use client";

import { useSession } from "next-auth/react";
import OnlineFriendsPreview from "./online-friend";
import styles from "./home.module.css";

export default function AuthenticatedOnlineFriends() {
  const { status } = useSession();

  // ! auth: Online friends is private user data.
  // ! Do not render this home page panel before login.
  // ! The whole left column should disappear before login,
  // ! otherwise the public home page keeps an empty visual block.
  if (status !== "authenticated") {
    return null;
  }

  return (
    <aside className={styles.leftColumn}>
      <OnlineFriendsPreview />
    </aside>
  );
}