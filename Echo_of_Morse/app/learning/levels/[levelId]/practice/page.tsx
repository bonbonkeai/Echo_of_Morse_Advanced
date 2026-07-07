import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import PageShell from "@/components/layout/page-shell";
import LearningPracticeFlow from "@/components/learning/Practice/LearningPracticeFlow";
import styles from "@/components/learning/css/Learning.module.css";

type PracticePageProps = {
  params: {
    levelId: string;
  };
};

/**
 * Practice Page (Server Component)
 * This page is responsible for:
 * - Reading the dynamic route parameter (levelId)
 * - Validating the levelId
 * - Returning a 404 page if the level is invalid
 * - Rendering the PracticeSession component
 */
export default async function PracticePage({ params }: PracticePageProps) {

	const session = await getServerSession(authOptions);

	if (!session?.user?.id) {
		redirect("/login");
	}
	
  // Convert levelId from string to number
  const levelId = Number(params.levelId);

  /**
   * Validate levelId:
   * - Must be an integer
   * - Must be within allowed range (1–12)
   * If invalid, show Next.js 404 page
   */
  if (!Number.isInteger(levelId) || levelId < 1 || levelId > 12) {
    notFound();
  }

  return (
    <main id="main-content">
      <PageShell>
        <section className={styles.learningPage}>
          <div className={styles.learningContainer}>

            {/*
              LearningPracticeFlow adds the preview step before the existing
              practice session so users can review the new characters first.
            */}
            <LearningPracticeFlow levelId={levelId} />

          </div>
        </section>
      </PageShell>
    </main>
  );
}
