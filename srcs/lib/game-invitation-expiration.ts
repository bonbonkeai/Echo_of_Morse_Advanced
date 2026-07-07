const FALLBACK_GAME_INVITATION_TIMEOUT_MS = 60 * 1000;

type ExpiringGameInvitation = {
  status?: string;
  createdAt?: string;
  expiresAt?: string;
};

function parseTime(value?: string) {
  if (!value) {
    return null;
  }

  const time = new Date(value).getTime();

  return Number.isFinite(time) ? time : null;
}

export function getGameInvitationExpiresAtMs(
  invitation: ExpiringGameInvitation
) {
  const explicitExpiresAt = parseTime(invitation.expiresAt);

  if (explicitExpiresAt !== null) {
    return explicitExpiresAt;
  }

  const createdAt = parseTime(invitation.createdAt);

  return createdAt === null
    ? null
    : createdAt + FALLBACK_GAME_INVITATION_TIMEOUT_MS;
}

export function isGameInvitationExpired(
  invitation: ExpiringGameInvitation,
  now = Date.now()
) {
  const expiresAt = getGameInvitationExpiresAtMs(invitation);

  return expiresAt !== null && expiresAt <= now;
}

export function isActiveGameInvitation(
  invitation: ExpiringGameInvitation,
  now = Date.now()
) {
  return (
    (invitation.status ?? "pending").toLowerCase() === "pending" &&
    !isGameInvitationExpired(invitation, now)
  );
}

export function filterActiveGameInvitations<T extends ExpiringGameInvitation>(
  invitations: T[],
  now = Date.now()
) {
  return invitations.filter((invitation) =>
    isActiveGameInvitation(invitation, now)
  );
}

export function getNextGameInvitationExpiryDelay(
  invitations: ExpiringGameInvitation[],
  now = Date.now()
) {
  const nextExpiry = invitations.reduce<number | null>((nearest, invitation) => {
    const expiresAt = getGameInvitationExpiresAtMs(invitation);

    if (expiresAt === null) {
      return nearest;
    }

    return nearest === null ? expiresAt : Math.min(nearest, expiresAt);
  }, null);

  return nextExpiry === null ? null : Math.max(0, nextExpiry - now);
}
