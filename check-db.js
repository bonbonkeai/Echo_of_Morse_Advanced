// check-db.js，放在项目根目录
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const conversations = await prisma.conversation.findMany();
  console.log("Conversations:", JSON.stringify(conversations, null, 2));

  const messages = await prisma.message.findMany();
  console.log("Messages:", JSON.stringify(messages, null, 2));
  const users = await prisma.user.findMany({
  select: { id: true, username: true }
});
console.log("Users:", JSON.stringify(users, null, 2));
}

main().finally(() => prisma.$disconnect());