import { notFound } from "next/navigation";
import PageShell from "@/components/layout/page-shell";
import GameSession from "@/components/competition/GameSessionPage/gameSession";
import { prisma } from "@/server/prisma";

// Render this page at request time because it reads live Prisma data.
// Static prerendering during Docker build cannot access the database.
export const dynamic = "force-dynamic";

type GameSessionPageProps = {
  params: {
    radioId: string;
    sessionId: string;
  };
};

export default async function GameSessionPage({ params }: GameSessionPageProps) {
  const radio = await prisma.radioRoom.findUnique({
    where: { radioId: params.radioId },
    select: { wpm: true },
  });

  if (!radio) {
	//une fonction fournie par Next.js ==> afficher une page 404
    notFound();
  }

  return (
    <main id="main-content">
      <PageShell>
        <GameSession
			radioId={params.radioId}
			sessionId={params.sessionId}
			speedWpm={radio.wpm}
		/>
      </PageShell>
    </main>
  );
}
