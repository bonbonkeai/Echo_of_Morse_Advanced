"use client";

import type { InputHTMLAttributes, ReactNode } from "react";
import { useId, useState } from "react";
import styles from "./input.module.css";

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & {
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  showPasswordToggle?: boolean;
  showPasswordLabel?: string;
  hidePasswordLabel?: string;
};
//showPasswordToggle 是否显示“显示/隐藏密码”的按钮
//showPasswordLabel 密码隐藏时，按钮上显示什么文字，默认可以是 Show
//hidePasswordLabel 密码显示时，按钮上显示什么文字，默认可以是 Hide

export default function Input({
  label,
  hint,
  error,
  id,
  className = "",
  type,
  showPasswordToggle = false,
  showPasswordLabel = "Show",
  hidePasswordLabel = "Hide",
  ...props
}: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const shouldShowPasswordToggle = showPasswordToggle && type === "password";
  const resolvedType =
    shouldShowPasswordToggle && isPasswordVisible ? "text" : type;

  const inputClassNames = [
    styles.input,
    shouldShowPasswordToggle ? styles.inputWithToggle : "",
    error ? styles.inputError : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <label className={styles.field} htmlFor={inputId}>
      {label ? <span className={styles.label}>{label}</span> : null}

      <span className={styles.inputWrapper}>
        <input
          id={inputId}
          className={inputClassNames}
          type={resolvedType}
          {...props}
        />

        {shouldShowPasswordToggle ? (
          <button
            type="button"
            className={styles.passwordToggle}
            onClick={() => setIsPasswordVisible((prev) => !prev)}
            aria-label={
              isPasswordVisible ? hidePasswordLabel : showPasswordLabel
            }
          >
            {isPasswordVisible ? hidePasswordLabel : showPasswordLabel}
          </button>
        ) : null}
      </span>

      {hint ? <small className={styles.hint}>{hint}</small> : null}

      {error ? <small className={styles.error}>{error}</small> : null}
    </label>
  );
}