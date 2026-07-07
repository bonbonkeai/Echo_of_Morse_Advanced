import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { getUserLearningProgress } from "@/lib/learning/progressService";
import { morseLevels } from "@/components/learning/data/morseLevels";
import LearningPageClient from "@/components/learning/LearningPageClient"

/**
 * Server Component
 * Responsible for:
 * - Authentication check
 * - Fetching user learning progress from backend
 * - Passing data to client component
 */
export default async function LearningPage() {
  // Get current user session from NextAuth
  const session = await getServerSession(authOptions);

  // If user is not logged in, redirect to login page
  if (!session?.user?.id) redirect("/login");

  // Fetch user's learning progress from database or API
  const progress = await getUserLearningProgress(session.user.id);

  // Total number of learning levels (static data for now)
  const totalLevels = morseLevels.length;

  // Pass data to Client Component for rendering UI
  return (
    <LearningPageClient
      progress={progress}
      totalLevels={totalLevels}
    />
  );
}