"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import styles from "./home.module.css";

export default function HomeHero() {
  const { dictionary } = useI18n();
  const t = dictionary.home;
  const layoutT = dictionary.layout;
  const signalTape = [
    "-",
    "-",
    " ",
    "-",
    " ",
    "-",
    "-",
    " ",
    ".",
    "-",
    " ",
    "-",
    ".",
    " ",
    ".",
    ".",
    ".",
    " ",
    ".",
  ];

  return (
    <section className={styles.hero} aria-labelledby="home-hero-title">
      <div className={styles.heroIntro}>
        <span className={styles.eyebrow}>{t.heroEyebrow}</span>

        <h1 id="home-hero-title" className={styles.title}>
          {layoutT.brand}
        </h1>

        <p className={styles.signature} aria-hidden="true">
          -- --- .-. ... . / MORSE
        </p>

        <p className={styles.lead}>{t.heroLead}</p>

        <div className={styles.heroActions}>
          <Link
            href="/learning"
            className={`${styles.heroLink} ${styles.heroLinkPrimary}`}
          >
            {t.heroPrimaryAction}
          </Link>

          <Link href="/competition" className={styles.heroLink}>
            {t.heroSecondaryAction}
          </Link>
        </div>
      </div>

      <div className={styles.heroAside}>
        <div className={styles.signalPanel} aria-label={t.signalPreviewLabel}>
          <p className={styles.signalLabel}>{t.signalPreviewLabel}</p>

          <div className={styles.signalTape} aria-hidden="true">
            <div className={styles.signalTicks}>
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>

            <div className={styles.signalStrip}>
              {signalTape.map((token, index) => {
                if (token === " ") {
                  return <span key={`gap-${index}`} className={styles.signalGap} />;
                }

                return token === "." ? (
                  <span key={`dot-${index}`} className={`${styles.signalSymbol} ${styles.signalDot}`}>
                    .
                  </span>
                ) : (
                  <span key={`dash-${index}`} className={`${styles.signalSymbol} ${styles.signalDash}`}>
                    -
                  </span>
                );
              })}
            </div>

            <div className={styles.signalStatus}>
              <span>CH 01</span>
              <span>18 WPM</span>
              <span>RX READY</span>
            </div>
          </div>

          <div className={styles.signalMeta}>
            <strong>{t.signalPreviewTitle}</strong>
            <span>{t.signalPreviewDescription}</span>
          </div>
        </div>

        <div className={styles.pillRow} aria-label={t.signalPreviewLabel}>
          <span className={styles.pill}>{t.heroPillOne}</span>
          <span className={styles.pill}>{t.heroPillTwo}</span>
          <span className={styles.pill}>{t.heroPillThree}</span>
          <span className={styles.pill}>{t.heroPillFour}</span>
        </div>
      </div>
    </section>
  );
}
