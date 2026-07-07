import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUserLearningProgress } from "@/lib/learning/progressService";
import PageShell from "@/components/layout/page-shell";
import LearningPlay from "@/components/learning/LearningPlay";

export const dynamic = "force-dynamic";

function getRandomCompletedLevel(completedLevels: number[]): number | null {
  if (completedLevels.length === 0) return null;
  return completedLevels[Math.floor(Math.random() * completedLevels.length)];
}

export default async function LearningPlayPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const progress = await getUserLearningProgress(session.user.id);
  const selectedLevel = getRandomCompletedLevel(progress.completedLevels);

  if (selectedLevel) {
    redirect(`/learning/levels/${selectedLevel}/practice`);
  }

  return (
    <main id="main-content">
      <PageShell>
        <LearningPlay currentLevel={progress.currentLevel} />
      </PageShell>
    </main>
  );
}
