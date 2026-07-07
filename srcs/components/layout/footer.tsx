"use client";
import { useI18n } from "@/lib/i18n";
import Link from "next/link";
import styles from "./footer.module.css";

export default function Footer() {
	const { dictionary } = useI18n();
	const t = dictionary.layout;

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div>
          <p className={styles.brand}>{t.brand}</p>

          <p className={styles.description}>
            {t.footerDescription}
          </p>
        </div>

        <nav className={styles.nav} aria-label={t.footerNavigation}>
          <Link href="/privacy-policy" className={styles.link}>
            {t.privacyPolicy}
          </Link>

          <Link href="/terms-of-service" className={styles.link}>
            {t.termsOfService}
          </Link>

          <Link href="/login" className={styles.link}>
            {t.login}
          </Link>
        </nav>
      </div>

      <p className={styles.copyright}>{t.copyright}</p>
    </footer>
  );
}
