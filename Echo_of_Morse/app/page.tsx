import IntroSection from "@/components/home/intro-section";
import OnlineCounter from "@/components/home/online-counter";
import HistoryMorse from "@/components/home/history-morse";
import AuthenticatedOnlineFriends from "@/components/home/authenticated-online-friends";
import HomeHero from "@/components/home/home-hero";
import PageShell from "@/components/layout/page-shell";
import styles from "@/components/home/home.module.css";

export default function HomePage() {
  return (
    <main id="main-content">
      <PageShell>
        <HomeHero />

        <section className={styles.homeLayout}>
          <AuthenticatedOnlineFriends />

          <section className={styles.mainColumn}>
            <OnlineCounter />
            <IntroSection />
            <HistoryMorse />
          </section>
        </section>
      </PageShell>
    </main>
  );
}
