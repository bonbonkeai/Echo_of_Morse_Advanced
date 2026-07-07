// Reset only transient radio test state after concurrent-user tests.
// This does not delete users or finished game history.

const path = require("path");
const dotenv = require("dotenv");
const { PrismaClient } = require("@prisma/client");

dotenv.config({ path: path.join(__dirname, "..", ".env.dev") });

function getCandidateUrls() {
  const url = process.env.DATABASE_URL;

  if (!url) {
    return [];
  }

  const urls = [url];

  // The same script can run inside Docker ("db") or from the host ("localhost").
  if (url.includes("@db:")) {
    urls.push(url.replace("@db:", "@localhost:"));
  }

  return urls;
}

async function clearRadioState(databaseUrl) {
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
  });

  try {
    return await prisma.$transaction(async (transaction) => {
      // Pending invites, ready rows, and lobby presences are live state.
      const pendingInvitations = await transaction.gameInvitation.deleteMany({
        where: {
          status: "PENDING",
        },
      });

      const readyQueue = await transaction.radioReadyQueue.deleteMany({});
      const lobbyPresences = await transaction.radioLobbyPresence.deleteMany({});

      // Any interrupted active session is closed so the next test starts cleanly.
      const activeSessionPlayers =
        await transaction.radioSessionPlayer.deleteMany({
          where: {
            session: {
              status: {
                in: ["WAITING", "ACTIVE"],
              },
            },
          },
        });

      const activeSessions = await transaction.radioGameSession.updateMany({
        where: {
          status: {
            in: ["WAITING", "ACTIVE"],
          },
        },
        data: {
          status: "FINISHED",
          endedAt: new Date(),
        },
      });

      return {
        pendingInvitations: pendingInvitations.count,
        readyQueue: readyQueue.count,
        lobbyPresences: lobbyPresences.count,
        activeSessionPlayers: activeSessionPlayers.count,
        activeSessions: activeSessions.count,
      };
    });
  } finally {
    await prisma.$disconnect();
  }
}

async function main() {
  const urls = getCandidateUrls();

  if (urls.length === 0) {
    throw new Error("DATABASE_URL is not set. Check .env.dev or your shell.");
  }

  let lastError = null;

  for (const url of urls) {
    try {
      const result = await clearRadioState(url);

      console.log("Cleared radio test state:");
      console.log(JSON.stringify(result, null, 2));
      return;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError;
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
