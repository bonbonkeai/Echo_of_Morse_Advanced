import IntroSection from "@/components/home/intro-section";
import OnlineCounter from "@/components/home/online-counter";
import HistoryMorse from "@/components/home/history-morse";
import AuthenticatedOnlineFriends from "@/components/home/authenticated-online-friends";
import PageShell from "@/components/layout/page-shell";
import styles from "@/components/home/home.module.css";

export default function HomePage() {
  return (
    <main id="main-content">
      <PageShell>
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

// ! i18n: move all navigation labels, aria-labels, footer links, and footer description into the i18n dictionary.
// ! i18n: keep the brand name "Echoes of Morse" unchanged unless the team decides to translate the product name.