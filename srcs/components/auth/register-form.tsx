"use client";

import { FormEvent, useState } from "react";
import type { RegisterFormData } from "@/types/auth";
import { Button, Card, Input } from "@/components/ui";
import styles from "./register-form.module.css";

//----------------- yren -----------------
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n";

export default function RegisterForm() {
	//----------------- yren -----------------
	const router = useRouter();
	const { dictionary } = useI18n();
	const t = dictionary.register;
	//----------------- yren -----------------

  const [formData, setFormData] = useState<RegisterFormData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(field: keyof RegisterFormData, value: string) {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function validateForm() {
    if (!formData.username.trim()) {
      return t.nameRequired;
    }

	const username = formData.username.trim();

	if (username.length > 20) {
		return t.nameTooLong;
	}

    if (!formData.email.trim()) {
      return t.emailRequired;
    }

	//[^\s@]+ ==> str avant @, avoir au moins 1 char, non espace et @
	const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	//test() ==> fonction viens de la regle, pour verifier si correspond avec la regle
	if (!emailPattern.test(formData.email.trim())) {
		return t.emailInvalid;
	}

    if (!formData.password) {
      return t.passwordRequired;
    }
	
    if (formData.password.length < 8) {
      return t.passwordTooShort;
    }

    if (formData.password !== formData.confirmPassword) {
      return t.passwordsDoNotMatch;
    }


    return "";
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setIsSubmitting(true);
	
		//----------------- yren -----------------
		// JSON.stringify --> convertit l'objet JS en JSON
		const response = await fetch("/api/auth/register", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				username: formData.username.trim(),
				email: formData.email.trim().toLowerCase(),
				password: formData.password,
				confirmPassword: formData.confirmPassword,
			}),
			});

			const data = await response.json().catch(() => null);

		if (!response.ok || data?.ok === false) {
			if (data?.errorCode === "USERNAME_OR_EMAIL_IN_USE") {
				setError(t.usernameOrEmailInUse);
				return;
			}

			setError(t.genericError);
			return;
		}

			setSuccess(t.success);

			setTimeout(() => {router.push("/login");}, 1500);
		//----------------- yren -----------------
	
      setFormData({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    } catch (submitError) {
      setError(t.genericError);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card size="narrow">
      <h1 className={styles.title}>{t.title}</h1>

      <p className={styles.description}>
        {t.description}
      </p>

      <form onSubmit={handleSubmit}>
        <div className={styles.fields}>
          <Input
            label={
              <>
                {t.name} <span className={styles.required}>*</span>
              </>
            }
            type="text"
            value={formData.username}
            onChange={(event) => updateField("username", event.target.value)}
            placeholder={t.namePlaceholder}
          />

          <Input
            label={
              <>
                {t.email} <span className={styles.required}>*</span>
              </>
            }
            type="text"
            value={formData.email}
            onChange={(event) => updateField("email", event.target.value)}
            placeholder={t.emailPlaceholder}
          />

          <Input
            label={
              <>
                {t.password} <span className={styles.required}>*</span>
              </>
            }
            type="password"
            showPasswordToggle
			showPasswordLabel={t.showPassword}
			hidePasswordLabel={t.hidePassword}
            value={formData.password}
            onChange={(event) => updateField("password", event.target.value)}
            placeholder={t.passwordPlaceholder}
            hint={t.passwordHint}
          />

          <Input
            label={t.confirmPassword}
            type="password"
            showPasswordToggle
			showPasswordLabel={t.showPassword}
			hidePasswordLabel={t.hidePassword}
            value={formData.confirmPassword}
            onChange={(event) =>
              updateField("confirmPassword", event.target.value)
            }
            placeholder={t.confirmPasswordPlaceholder}
          />
        </div>

        {error ? <p className={styles.error}>{error}</p> : null}

        {success ? <p className={styles.success}>{success}</p> : null}

        <div className={styles.submitArea}>
          <Button type="submit" disabled={isSubmitting} fullWidth>
            {isSubmitting ? t.submitting : t.createAccount}
          </Button>
        </div>
      </form>
    </Card>
  );
}
