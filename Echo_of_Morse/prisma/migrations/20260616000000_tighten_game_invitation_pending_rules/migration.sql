-- One pair of users may only have one pending invitation at a time,
-- regardless of direction or target radio room.
CREATE UNIQUE INDEX "GameInvitation_pending_user_pair_key"
ON "GameInvitation" (
  LEAST("fromUserId", "toUserId"),
  GREATEST("fromUserId", "toUserId")
)
WHERE "status" = 'PENDING';

-- A user may only have one active received invitation at a time.
CREATE UNIQUE INDEX "GameInvitation_pending_received_user_key"
ON "GameInvitation" ("toUserId")
WHERE "status" = 'PENDING';
