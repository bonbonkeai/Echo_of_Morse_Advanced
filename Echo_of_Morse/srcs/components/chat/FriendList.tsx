"use client";
// 负责左侧好友列表。
// There are two different search functions here:
// 1. Search in my friends: Search only within the list of friends you've already added.
// 2. Search users to add: Search registered users you can send friend requests to.
// 3. Add friend.
// 4. Invite friend to game.

import type { ChangeEvent } from "react";
import { useState } from "react";
import type { Friend, SearchableUser, SystemMessage } from "@/types/chat";
import { Button, Input } from "@/components/ui";
import FriendListItem from "./FriendListItem";
import { getSystemMessageText } from "./getSystemMessageText";
import styles from "./css/FriendList.module.css";
import { useI18n } from "@/lib/i18n";

type FriendListProps = {
  friends: Friend[];
  allFriends: Friend[];
  selectedFriendId: string;

  systemMessages: SystemMessage[];
  unreadSystemMessageCount: number;
  isSystemPanelSelected: boolean;

  friendSearchQuery: string;
  userSearchQuery: string;
  userSearchResults: SearchableUser[];
  isAddFriendOpen: boolean;
  pendingFriendRequestUserIds: string[];
  pendingGameInviteFriendIds: string[];
  inviteDisabledReasons: Record<string, string | null>;

  onSelectFriend: (friendId: string) => void;
  onSelectSystemMessages: () => void;

  onChangeFriendSearchQuery: (query: string) => void;
  onChangeUserSearchQuery: (query: string) => void;
  onToggleAddFriend: () => void;
  onSendFriendRequest: (user: SearchableUser) => Promise<boolean>;

  onRenameFriend: (friendId: string, nextDisplayName: string) => void;
  onDeleteFriend: (friendId: string) => void;

  onInviteFriendToGame: (friendId: string) => void;
};

export default function FriendList({
  friends,
  allFriends,
  selectedFriendId,
  systemMessages,
  unreadSystemMessageCount,
  isSystemPanelSelected,
  friendSearchQuery,
  userSearchQuery,
  userSearchResults,
  isAddFriendOpen,
  pendingFriendRequestUserIds,
  pendingGameInviteFriendIds,
  inviteDisabledReasons,
  onSelectFriend,
  onSelectSystemMessages,
  onChangeFriendSearchQuery,
  onChangeUserSearchQuery,
  onToggleAddFriend,
  onSendFriendRequest,
  onRenameFriend,
  onDeleteFriend,
  onInviteFriendToGame,
}: FriendListProps) {
  const { dictionary } = useI18n();
  const t = dictionary.chat;
  const radioT = dictionary.competitionRadio;
  const [contextMenuState, setContextMenuState] = useState<{
    friendId: string;
  } | null>(null);

  const latestSystemMessage = systemMessages[0] ?? null;
  function handleFriendSearchChange(event: ChangeEvent<HTMLInputElement>) {
    onChangeFriendSearchQuery(event.target.value);
  }

  function handleUserSearchChange(event: ChangeEvent<HTMLInputElement>) {
    onChangeUserSearchQuery(event.target.value);
  }

  function handleRequestContextMenu(friendId: string) {
    setContextMenuState({ friendId });
  }

  function handleCloseContextMenu() {
    setContextMenuState(null);
  }

  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <h2 className={styles.title}>{t.chats}</h2>

          <Button type="button" size="sm" onClick={onToggleAddFriend}>
            {isAddFriendOpen ? t.close : t.add}
          </Button>
        </div>

        <Input
          value={friendSearchQuery}
          onChange={handleFriendSearchChange}
          placeholder={t.searchMyFriends}
        />

        {isAddFriendOpen ? (
          <div className={styles.addFriendPanel}>
            <Input
              value={userSearchQuery}
              onChange={handleUserSearchChange}
              placeholder={t.searchUsersToAdd}
            />

            {userSearchQuery.trim() ? (
              <div className={styles.searchResults}>
                {userSearchResults.length > 0 ? (
                  userSearchResults.map((user) => {
                    const isAlreadyFriend = allFriends.some(
                      (friend) => friend.username.trim() === user.username.trim()
                    );

                    const isPending = pendingFriendRequestUserIds.includes(
                      user.id
                    );

                    const buttonLabel = isAlreadyFriend
                      ? t.added
                      : isPending
                        ? t.pending
                        : t.add;

                    return (
                      <div key={user.id} className={styles.searchResult}>
                        <div className={styles.searchAvatar}>
                          {user.avatarInitial}
                        </div>

                        <div className={styles.searchContent}>
                          <p className={styles.searchName}>
                            {user.displayName}
                          </p>

                          <p className={styles.searchUsername}>
                            @{user.username}
                          </p>
                        </div>

                        <Button
                          type="button"
                          size="sm"
                          disabled={isAlreadyFriend || isPending}
                          onClick={() => onSendFriendRequest(user)}
                        >
                          {buttonLabel}
                        </Button>
                      </div>
                    );
                  })
                ) : (
                  <p className={styles.emptySearch}>{t.noUsersFound}</p>
                )}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className={styles.list}>
        <button
          type="button"
          className={`${styles.systemItem} ${
            isSystemPanelSelected ? styles.systemItemSelected : ""
          }`}
          onClick={onSelectSystemMessages}
        >
          <div className={styles.systemIcon}>!</div>

          <div className={styles.systemContent}>
            <div className={styles.systemRow}>
              <span className={styles.systemTitle}>{t.systemMessages}</span>

              {unreadSystemMessageCount > 0 ? (
                <span className={styles.unreadBadge}>
                  {unreadSystemMessageCount}
                </span>
              ) : null}
            </div>

            <p className={styles.systemPreview}>
              {latestSystemMessage
                ? getSystemMessageText(latestSystemMessage, t, radioT).body
                : t.noSystemMessages}
            </p>
          </div>
        </button>

        {friends.length > 0 ? (
          friends.map((friend) => {
            const isGameInvitePending =
              pendingGameInviteFriendIds.includes(friend.id);

            return (
              <FriendListItem
                key={friend.id}
                friend={friend}
                isSelected={friend.id === selectedFriendId}
                isGameInvitePending={isGameInvitePending}
                inviteDisabledReason={inviteDisabledReasons[friend.id] ?? null}
                onSelectFriend={onSelectFriend}
                onInviteFriendToGame={onInviteFriendToGame}
                onRequestContextMenu={handleRequestContextMenu}
                activeContextMenuFriendId={contextMenuState?.friendId ?? null}
                onCloseContextMenu={handleCloseContextMenu}
                onRenameFriend={onRenameFriend}
                onDeleteFriend={onDeleteFriend}
              />
            );
          })
        ) : (
          <p className={styles.empty}>{t.noFriendsFound}</p>
        )}
      </div>

    </aside>
  );
}
