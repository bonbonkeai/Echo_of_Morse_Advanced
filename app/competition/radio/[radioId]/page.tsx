import { notFound } from "next/navigation";
import PageShell from "@/components/layout/page-shell";
import RadioLobbyClient from "@/components/competition/RadioLobbyPage/RadioLobbyClient";
import { prisma } from "@/server/prisma";

// Render this page at request time because it reads live Prisma data.
// Static prerendering during Docker build cannot access the database.
export const dynamic = "force-dynamic";

type RadioLobbyPageProps = {
  params: {
    radioId: string;
  };
};

export default async function RadioLobbyPage({
  params,
}: RadioLobbyPageProps) {
  const radio = await prisma.radioRoom.findUnique({
    where: {
      radioId: params.radioId,
    },
    include: {
      lobbyPresences: {
        include: {
          user: true,
        },
      },
    },
  });

  if (!radio) {
    notFound();
  }

  const initialUsers = radio.lobbyPresences.map((p) => ({
    id: p.user.id,
    username: p.user.username,
    image: p.user.image,

    status: p.status.toLowerCase() as
      | "idle"
      | "ready"
      | "playing",

    displayName: p.user.username,
    avatarUrl: p.user.image,
    avatarInitial: p.user.username?.[0] ?? "?",
    isFriend: false,
  }));

  return (
    <main id="main-content">
      <PageShell>
        <RadioLobbyClient
          radio={radio}
          initialUsers={initialUsers}
        />
      </PageShell>
    </main>
  );
}
