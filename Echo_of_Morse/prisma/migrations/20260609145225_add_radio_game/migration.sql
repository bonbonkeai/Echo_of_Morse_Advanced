-- CreateEnum
CREATE TYPE "RadioUserStatus" AS ENUM ('IDLE', 'READY', 'PLAYING');

-- CreateEnum
CREATE TYPE "RadioSessionStatus" AS ENUM ('WAITING', 'ACTIVE', 'FINISHED');

-- AlterTable
ALTER TABLE "GameInvitation" ADD COLUMN     "radioRoomId" TEXT;

-- CreateTable
CREATE TABLE "RadioRoom" (
    "id" TEXT NOT NULL,
    "radioId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "wpm" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "maxUsers" INTEGER NOT NULL DEFAULT 7,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RadioRoom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RadioLobbyPresence" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "status" "RadioUserStatus" NOT NULL DEFAULT 'IDLE',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RadioLobbyPresence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RadioReadyQueue" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "readyAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RadioReadyQueue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RadioGameSession" (
    "id" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "status" "RadioSessionStatus" NOT NULL DEFAULT 'WAITING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startedAt" TIMESTAMP(3),
    "endedAt" TIMESTAMP(3),

    CONSTRAINT "RadioGameSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RadioSessionPlayer" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "score" INTEGER,
    "timeMs" INTEGER,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RadioSessionPlayer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RadioRoom_radioId_key" ON "RadioRoom"("radioId");

-- CreateIndex
CREATE UNIQUE INDEX "RadioLobbyPresence_userId_roomId_key" ON "RadioLobbyPresence"("userId", "roomId");

-- CreateIndex
CREATE UNIQUE INDEX "RadioReadyQueue_userId_roomId_key" ON "RadioReadyQueue"("userId", "roomId");

-- CreateIndex
CREATE UNIQUE INDEX "RadioSessionPlayer_sessionId_userId_key" ON "RadioSessionPlayer"("sessionId", "userId");

-- AddForeignKey
ALTER TABLE "GameInvitation" ADD CONSTRAINT "GameInvitation_radioRoomId_fkey" FOREIGN KEY ("radioRoomId") REFERENCES "RadioRoom"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RadioLobbyPresence" ADD CONSTRAINT "RadioLobbyPresence_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RadioLobbyPresence" ADD CONSTRAINT "RadioLobbyPresence_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "RadioRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RadioReadyQueue" ADD CONSTRAINT "RadioReadyQueue_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RadioReadyQueue" ADD CONSTRAINT "RadioReadyQueue_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "RadioRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RadioGameSession" ADD CONSTRAINT "RadioGameSession_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "RadioRoom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RadioSessionPlayer" ADD CONSTRAINT "RadioSessionPlayer_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "RadioGameSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RadioSessionPlayer" ADD CONSTRAINT "RadioSessionPlayer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
