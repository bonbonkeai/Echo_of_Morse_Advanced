"use client";
import type { LoginFormData } from "@/types/auth";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { Button, Card, Input } from "@/components/ui";
import styles from "./login-form.module.css";

//----------------- yren -----------------
import { useI18n } from "@/lib/i18n";
import { signIn } from "next-auth/react";		//Les outils client React fournis par NextAuth
import { useRouter } from "next/navigation";
//----------------- yren -----------------

export default function LoginForm() {
	//----------------- yren -----------------
	const router = useRouter(); //useRouter() = outil de next.js pour sauter à une autre page
	const { dictionary } = useI18n();
	const t = dictionary.login;
	//----------------- yren -----------------

  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(field: keyof LoginFormData, value: string) {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function validateForm() {
    if (!formData.email.trim()) {
      return t.emailRequired;
    }

    if (!formData.password) {
      return t.passwordRequired;
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
	const credentialsResponse = await fetch("/api/auth/verify-credentials", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			email: formData.email.trim().toLowerCase(),
			password: formData.password,
		}),
	});
	const credentials = (await credentialsResponse.json().catch(() => null)) as {
		ok?: boolean;
	} | null;

	if (!credentials?.ok) {
		setError(t.invalidCredentials);
		return;
	}

	//envoyer au auth API route pour vérifier les credentials
	const result = await signIn("credentials", {
		email: formData.email.trim().toLowerCase(),
		password: formData.password,
		redirect: false, //change pas lorsque login réussi
	});
	
	if (result?.error) {
		setError(t.invalidCredentials);
		return;
	}
	
	//redirection après login réussi
	setSuccess(t.success);
	router.push("/"); //redirection vers dashboard après login réussi
	router.refresh();
	//----------------- yren -----------------

    } catch {
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

     <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.fields}>
          <Input
            label={t.email}
            type="email"
            value={formData.email}
            onChange={(event) => updateField("email", event.target.value)}
            placeholder={t.emailPlaceholder}
          />

          <Input
            label={t.password}
            type="password"
            showPasswordToggle
			showPasswordLabel={t.showPassword}
			hidePasswordLabel={t.hidePassword}
            value={formData.password}
            onChange={(event) => updateField("password", event.target.value)}
            placeholder={t.passwordPlaceholder}
          />
        </div>

        {error ? <p className={styles.error}>{error}</p> : null}

        {success ? <p className={styles.success}>{success}</p> : null}

        <Button type="submit" disabled={isSubmitting} fullWidth>
          {isSubmitting ? t.submitting : t.loginButton}
        </Button>

        <Button
			type="button"
			variant="secondary"
			onClick={() => signIn("google", { callbackUrl: "/" },  { prompt: "select_account" })}
		>
			{t.loginWithGoogle}
		</Button>

        <Button
			type="button"
			variant="secondary"
			onClick={() => signIn("42-school", { callbackUrl: "/" })}
		>
			{t.loginWithFortyTwo}
		</Button>
      </form>

      <p className={styles.registerText}>
        {t.noAccount}{" "}
        <Link className={styles.registerLink} href="/register">
          {t.registerHere}
        </Link>
      </p>
    </Card>
  );
}
