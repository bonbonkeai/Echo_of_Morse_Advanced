-- Track invitations that were not answered before the 1-minute timeout.
ALTER TYPE "GameInviteStatus" ADD VALUE 'EXPIRED';
