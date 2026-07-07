const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();
const PASSWORD = "MorseTest123!";

// Default users
const users = [
  { username: "lifan", learningLevel: 3 },
  { username: "yren", learningLevel: 4 },
  { username: "jdu", learningLevel: 2 },
  { username: "mlaurent", learningLevel: 5 },
  { username: "gustgonz", learningLevel: 3 },
  { username: "nobody", learningLevel: 1 },
  { username: "top_student", learningLevel: 12 }, // top student who has level 12.
];

// Random generator, ro create more realistic progress data for users.
function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function main() {
  const passwordHash = await bcrypt.hash(PASSWORD, 10);

  // creat the three radio rooms in the porject.
  const radioRooms = [
    {
      radioId: "01",
      name: "Radio Wave 01",
      wpm: 5,
      description: "A slower transmission for new Morse learners.",
    },
    {
      radioId: "02",
      name: "Radio Wave 02",
      wpm: 10,
      description: "A balanced transmission for intermediate players.",
    },
    {
      radioId: "03",
      name: "Radio Wave 03",
      wpm: 15,
      description: "A fast transmission for experienced decoders.",
    },
  ];

  for (const room of radioRooms) {
    await prisma.radioRoom.upsert({
      where: { radioId: room.radioId },
      create: room,
      update: {
        name: room.name,
        wpm: room.wpm,
        description: room.description,
      },
    });
  }

  // only when the database is empty, to avoid accidentally wiping data.
  const existing = await prisma.user.findFirst();
  if (existing) {
    // Keep existing local data, but update known seed accounts to the current
    // compliant test password.
    await prisma.user.updateMany({
      where: {
        email: {
          in: [
            ...users.map((user) => `${user.username}@test.com`),
            "learner@test.com",
          ],
        },
      },
      data: { passwordHash },
    });
    console.log("Radio rooms ensured; seed account passwords updated.");
    return;
  }
  console.log("Reset database...");

  // Clean existing data (order matters)
  await prisma.message.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.friendship.deleteMany();
  await prisma.gameInvitation.deleteMany();
  await prisma.userLetterProgress.deleteMany();
  await prisma.letter.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  console.log("Creating users...");

  const created = [];

  for (const u of users) {
    const user = await prisma.user.create({
      data: {
        username: u.username,
        email: `${u.username}@test.com`,
        passwordHash,
        learningLevel: u.learningLevel,
        bio: "",
        isOnline: false,
      },
    });

    created.push(user);
  }

  const map = Object.fromEntries(created.map((u) => [u.username, u]));

  // Create learner user
  console.log("Creating learner user...");

  const learnerPassword = await bcrypt.hash(PASSWORD, 10);

  const learner = await prisma.user.create({
    data: {
      username: "learner",
      email: "learner@test.com",
      passwordHash: learnerPassword,
      learningLevel: 1,
      bio: "AI test user",
    },
  });

  // Create letters
  console.log("Creating letters...");

  const LETTERS = [
    'A','B','C','D','E','F','G','H','I','J','K','L','M',
    'N','O','P','Q','R','S','T','U','V','W','X','Y','Z',
    '0','1','2','3','4','5','6','7','8','9',
    '.',',','?','!','/','-','(',')','&',':',';','=','+','_','"','$','@'
  ];

  for (const char of LETTERS) {
    await prisma.letter.create({
      data: { char },
    });
  }

  // Fetch letters after creation
  const letters = await prisma.letter.findMany();

  // Create learner progress
  console.log("Creating learner letter progress...");

  for (const letter of letters) {
    const totalSeen = rand(3, 25);
    const wrongCount = rand(0, Math.floor(totalSeen * 0.5));
    const correctCount = totalSeen - wrongCount;

    const accuracy = correctCount / totalSeen;

    const mastery = Math.max(
      0,
      Math.min(10, Math.round(accuracy * 10))
    );

    const now = new Date();

    const interval = Math.max(1, Math.round(mastery * 1.5));

    const nextReviewAt = new Date(
      now.getTime() + interval * 24 * 60 * 60 * 1000
    );

    const easeFactor =
      accuracy > 0.8 ? 2.6 :
      accuracy > 0.5 ? 2.2 :
      1.7;

    await prisma.userLetterProgress.create({
      data: {
        userId: learner.id,
        letterId: letter.id,
        mastery,
        correctCount,
        wrongCount,
        totalSeen,
        interval,
        easeFactor,
        nextReviewAt,
        lastReviewed: now,
      },
    });
  }

  // Create top student progress
  console.log("Creating top student letter progress...");

  const topStudent = map["top_student"];

  for (const letter of letters) {
    const totalSeen = rand(20, 80);
    const wrongCount = rand(0, Math.floor(totalSeen * 0.1));
    const correctCount = totalSeen - wrongCount;

    const accuracy = correctCount / totalSeen;

    const mastery = Math.max(
      8,
      Math.min(10, Math.round(accuracy * 10))
    );

    const now = new Date();

    const interval = Math.max(7, Math.round(mastery * 2));

    const nextReviewAt = new Date(
      now.getTime() + interval * 24 * 60 * 60 * 1000
    );

    const easeFactor =
      accuracy > 0.9 ? 2.8 :
      accuracy > 0.8 ? 2.6 :
      2.4;

    await prisma.userLetterProgress.create({
      data: {
        userId: topStudent.id,
        letterId: letter.id,
        mastery,
        correctCount,
        wrongCount,
        totalSeen,
        interval,
        easeFactor,
        nextReviewAt,
        lastReviewed: now,
      },
    });
  }

  // Create friendships
  console.log("Creating FULL friendships...");

  const group = ["lifan", "yren", "jdu", "mlaurent", "gustgonz"];

  for (let i = 0; i < group.length; i++) {
    for (let j = i + 1; j < group.length; j++) {
      const a = map[group[i]];
      const b = map[group[j]];

      await prisma.friendship.create({
        data: {
          senderId: a.id,
          receiverId: b.id,
          status: "ACCEPTED",
        },
      });
    }
  }

  // Create conversations and messages
  console.log("Creating conversations and messages...");

  const lifan = map["lifan"];
  const yren = map["yren"];
  const jdu = map["jdu"];

  const [aId, bId] = lifan.id < yren.id
    ? [lifan.id, yren.id]
    : [yren.id, lifan.id];

  const conv1 = await prisma.conversation.create({
    data: {
      userAId: aId,
      userBId: bId,
    },
  });

  await prisma.message.createMany({
    data: [
      {
        conversationId: conv1.id,
        senderId: lifan.id,
        rawText: "Hello in morse",
        translatedText: ".... . .-.. .-.. ---",
        mode: "LANGUAGE_TO_MORSE",
      },
      {
        conversationId: conv1.id,
        senderId: yren.id,
        rawText: "Reply here",
        translatedText: ".-. . .--. .-.. -.--",
        mode: "LANGUAGE_TO_MORSE",
      },
    ],
  });

  const [cId, dId] = lifan.id < jdu.id
    ? [lifan.id, jdu.id]
    : [jdu.id, lifan.id];

  await prisma.conversation.create({
    data: {
      userAId: cId,
      userBId: dId,
    },
  });

  console.log("Seed completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
