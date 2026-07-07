import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";
import { getUserLearningProgress } from "@/lib/learning/progressService";

import LevelsPageClient from "@/components/learning/LevelsPageClient";

export default async function LevelsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) redirect("/login");

  const progress = await getUserLearningProgress(session.user.id);

  return <LevelsPageClient progress={progress} />;
}