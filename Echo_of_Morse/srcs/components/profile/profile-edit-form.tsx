"use client";

import type { ChangeEvent, FormEvent } from "react";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button, Card, Input } from "@/components/ui";
import styles from "./profile-form.module.css";
import { useI18n } from "@/lib/i18n";

export default function ProfileEditForm() {
	const { dictionary } = useI18n();
	const t = dictionary.profile;
	const { data: session, status } = useSession();
	const router = useRouter();
	 //verifer que session.user est un type avec un id, puis recuperer id
	const userId = (session?.user as { id?: string } | undefined)?.id;

	type ProfileUser = {
		id: string;
		username: string;
		email: string | null;
		image: string | null;
		bio: string | null;
		isOnline: boolean;
	};

	const [formData, setFormData] = useState({
		username: "",
		image: "",
		bio: "",
	});
	const [error, setError] = useState("");
	const [isLoadingProfile, setIsLoadingProfile] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [avatarFile, setAvatarFile] = useState<File | null>(null);

	// ========================================== Charger le profil réel ========================================== 
	// quand la page s'ouvre, on utilise session.user.id pour récupérer le profil à jour.
	//pour les info dans input
	useEffect(() => {

		if (status !== "authenticated" || !userId) {
			return;
		}

		async function loadProfile() {
			try {
					// vide les msg d'erreur et affiche le message de chargement
					setError("");
					setIsLoadingProfile(true);

					//recuperer les données
					const response = await fetch(`/api/users/${userId}`);
					const data = (await response.json()) as ProfileUser | { error?: string };

					if (!response.ok) {
						setError(t.failedToLoadProfile);
						return;
					}

					const user = data as ProfileUser;

					setFormData({
						username: user.username ?? "",
						image: user.image ?? "",
						bio: user.bio ?? "",
					});
			} catch {
				setError(t.loadProfileError);
			// finally = peu importe le résultat du try/catch, on arrête le message de chargement
			} finally {
				setIsLoadingProfile(false);
		}
		}
			loadProfile();

	}, [status, userId]);

	// -------------- cas: en cours de charge --------------
	if (status === "loading") {
		return (
		<Card>
			<p>{t.loading}</p>
		</Card>
		);
	}
	// -------------- cas: non authentifié --------------
	if (status === "unauthenticated") {
		return (
		<Card>
			<p>{t.editLoginRequired}</p>
		</Card>
		);
	}

	// ==========================================  modification  ==========================================

	//  -------------- Modifier les champs  --------------
	//quand l'utilisateur écrit, on modifie seulement le champ correspondant
		// (oldFormData) => ({ ...oldFormData, [field]: value }) est une fonction anonyme, ici => signifie return
		//1. (oldFormData) = un parametre qui contient les valeurs anciennes: 
			// lorsque on met une fonction dans setFormData, React lui passe automatiquement les valeurs anciennes
			// car on envoie setFormData au setState
		//2. { ...oldFormData, [field]: value,}): 
			// ...oldFormData = on copie toutes les valeurs anciennes, et on modifie seulement celle qui a changé
			// [field]: value = on modifie seulement le champ qui a changé, on met [] car field est une variable
			// comme js lit de gauche à droite, il va d'abord copier les anciennes valeurs, puis écraser la valeur du champ modifié
	function updateField(field: "username" | "image" | "bio", value: string) {
		setFormData((oldFormData) => ({ ...oldFormData, [field]: value,}));
	}

  // --------------  Modifier l'avatar  -------------- 
  //après le choix d'une image locale, FileReader la transforme en base64 pour l'afficher
  	//<HTMLInputElement> = element vient de input html
	//ChangeEvent = événement de react
	function handleAvatarChange(event: ChangeEvent<HTMLInputElement>) {
		// event.target.files est une liste de fichiers sélectionnés, on prend le premier [0]
		const file = event.target.files?.[0];

		if (!file) {
			return;
		}
		//vérifier que c'est un fichier image
		//file.type = un string, on vefifie que ça commence par "image/"
		if (!file.type.startsWith("image/")) {
			setError(t.chooseImageFile);
			return;
		}

		if (file.size > 500_000) {
			setError(t.imageTooLarge);
			return;
		}

		setAvatarFile(file);

		//FileReader = outil qui permet de lire le contenu d'un fichier
		const reader = new FileReader();

		//reader.onload = lorsque on a reussi a lire ce fichier
		//() => {...} on appelle la fonction quand l'événement se déclenche
		reader.onload = () => {
			//string() = convertir en string
			//reader.result = le contenu du fichier, qui est une string en base64
			updateField("image", String(reader.result));
		};

		//reader.onerror = lorsque on a une erreur pendant la lecture du fichier
		reader.onerror = () => {
			setError(t.readImageError);
		};

		//lire le fichier en base64, et déclencher les événements onload ou onerror
		reader.readAsDataURL(file);
	}

	// ========================================== Enregistrer le profil ==========================================
	//au clic sur save, on envoie username et image à l'API PUT.
	async function handleSubmit(event:  FormEvent<HTMLFormElement>) {
		// empêcher le comportement(recharger la page) par défaut du navigateur
		event.preventDefault();
		setError("");

		if (!userId) {
			setError(t.missingUserId);
			return;
		}

		const username = formData.username.trim();
		const bio = formData.bio.trim();

		if (!username) {
			setError(t.usernameRequired);
			return;
		}

		if (username.length > 20) {
			setError(t.usernameTooLong);
			return;
		}

		if (bio.length > 120) {
			setError(t.bioTooLong);
			return;
		}

		try {
			setIsSubmitting(true);
			const body = new FormData();
			body.set("username", username);
			body.set("bio", bio);

			if (avatarFile) {
				body.set("image", avatarFile);
			}

			const response = await fetch(`/api/users/${userId}`, {
				method: "PUT",
				body,
		});

		const data = (await response.json().catch(() => null)) as {
			error?: string;
		} | null;

		if (!response.ok) {
			setError(data?.error ?? t.failedToUpdateProfile);
			return;
		}

		router.push("/profile");
		router.refresh();
	} catch {
		setError(t.updateProfileError);
	} finally {
		setIsSubmitting(false);
	}
}

  return (
    <section className={styles.profileHeader}>
      <Card className={styles.profileCard}>
        <form className={styles.editForm} onSubmit={handleSubmit}>
          {/* ========================================== avatar / avatar ========================================== */}
          <div className={styles.heroHeader}>
            <div className={styles.avatarBlock}>
              <div className={styles.avatar}>
                {formData.image ? (
                  <img
                    src={formData.image}
                    alt=""
                    className={styles.avatarImage}
                  />
                ) : (
                  formData.username.charAt(0) || "U"
                )}
              </div>

              <label className={styles.fileButton}>
                {t.changeAvatar}
                <input
                  type="file"
                  accept="image/*"
                  className={styles.fileInput}
                  onChange={handleAvatarChange}
                />
              </label>
            </div>

            {/* ========================================== informations éditables ========================================== */}
            <div className={styles.identity}>
 				<div className={styles.editFields}>
					<Input
						label={t.username}
						type="text"
						value={formData.username}
						onChange={(event) => updateField("username", event.target.value)}
						placeholder={t.usernamePlaceholder}
					/>
					<Input
						label={t.bio}
						type="text"
						value={formData.bio}
						onChange={(event) => updateField("bio", event.target.value)}
						placeholder={t.bioPlaceholder}
					/>
			  </div>
            </div>
          </div>

          {/* ========================================== informations non éditables ========================================== */}

          {isLoadingProfile ? <p>{t.loadingCurrentProfile}</p> : null}
          {error ? <p className={styles.errorText}>{error}</p> : null}

          {/* ========================================== bouton sauvegarder ========================================== */}
          <div className={styles.saveActions}>
            <Button type="submit" disabled={isSubmitting || isLoadingProfile}>
              {isSubmitting ? t.saving : t.saveChanges}
            </Button>
          </div>
        </form>
      </Card>
    </section>
  );
}
