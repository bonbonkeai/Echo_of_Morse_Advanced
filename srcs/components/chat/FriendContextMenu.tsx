//负责鼠标右键：修改备注、删除好友、分享好友、邀请好友进行游戏

"use client";

import { useI18n } from "@/lib/i18n";

import { useEffect } from "react";
import styles from "./css/FriendContextMenu.module.css";

type FriendContextMenuProps = {
  x: number;
  y: number;
  onClose: () => void;
  onRename: () => void;
  onDelete: () => void;
};

export default function FriendContextMenu({
  x,
  y,
  onClose,
  onRename,
  onDelete,
}: FriendContextMenuProps) {
	const { dictionary } = useI18n();
	const t = dictionary.chat;

  useEffect(() => {
    function handleClick() {
      onClose();
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("click", handleClick);
    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("click", handleClick);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  return (
    <div
      className={styles.menu}
      style={{
        left: x,
        top: y,
      }}
      role="menu"
      onClick={(event) => event.stopPropagation()}
    >
      <button type="button" onClick={onRename} className={styles.item}>
        {t.renameRemark}
      </button>

      <button type="button" onClick={onDelete} className={styles.deleteItem}>
        {t.deleteFriend}
      </button>
    </div>
  );
}
