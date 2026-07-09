import Link from "next/link";
import styles from "./back-link.module.css";

type BackLinkProps = {
  href: string;
  children: string;
  className?: string;
};

export default function BackLink({ href, children, className }: BackLinkProps) {
  return (
    <Link className={`${styles.backLink} ${className ?? ""}`.trim()} href={href}>
      {`← ${children}`}
    </Link>
  );
}
