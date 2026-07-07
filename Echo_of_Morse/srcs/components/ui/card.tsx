import type { HTMLAttributes, ReactNode } from "react";
import styles from "./card.module.css";

type CardProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
  as?: "section" | "article" | "div";
  size?: "default" | "narrow";
};

export default function Card({
  children,
  as: Tag = "section",
  size = "default",
  className = "",
  ...props
}: CardProps) {
  const classNames = [
    styles.card,
    styles[size],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Tag className={classNames} {...props}>
      {children}
    </Tag>
  );
}