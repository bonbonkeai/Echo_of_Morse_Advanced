//! With static test data in the page.
//! mock data deleted
"use client";

import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui";
import type { RadioId } from "@/types/competition";
import styles from "./css/radio-wave-picker-modal.module.css";

type RadioConfig = {
  id: RadioId;
  name: string;
  wpm: number;
  description: string;
};

type RadioWavePickerModalProps = {
  isOpen: boolean;
  targetDisplayName: string;
  onClose: () => void;
  onSelectRadio: (radioId: RadioId) => void;
};

export default function RadioWavePickerModal({
  isOpen,
  targetDisplayName,
  onClose,
  onSelectRadio,
}: RadioWavePickerModalProps) {
	const { dictionary } = useI18n();
	const t = dictionary.competitionRadio;

	const radioConfigs: RadioConfig[] = [
		{
			id: "01",
			name: t.radioWave01,
			wpm: 5,
			description: t.radioWave01Description,
		},
		{
			id: "02",
			name: t.radioWave02,
			wpm: 10,
			description: t.radioWave02Description,
		},
		{
			id: "03",
			name: t.radioWave03,
			wpm: 15,
			description: t.radioWave03Description,
		},
	];

  if (!isOpen) return null;

  return (
    <div className={styles.backdrop} role="presentation" onClick={onClose}>
      <section
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="radio-invite-title"
        onClick={(event) => event.stopPropagation()}
      >
        <header className={styles.header}>
          <div>
            <h2 id="radio-invite-title" className={styles.title}>
              {t.chooseRadioWave}
            </h2>

            <p className={styles.description}>
              {t.inviteToRadioLobby.replace("{displayName}", targetDisplayName)}
            </p>
          </div>

          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label={t.closeRadioSelection}
          >
            ×
          </button>
        </header>

        <div className={styles.radioList}>
          {radioConfigs.map((radio: RadioConfig) => (
            <button
              key={radio.id}
              type="button"
              className={styles.radioOption}
              onClick={() => onSelectRadio(radio.id)}
            >
              <span className={styles.radioName}>{radio.name}</span>
              <span className={styles.radioMeta}>{radio.wpm} WPM</span>
              <span className={styles.radioDescription}>
                {radio.description}
              </span>
            </button>
          ))}
        </div>

        <footer className={styles.footer}>
          <Button type="button" variant="secondary" onClick={onClose}>
            {t.cancel}
          </Button>
        </footer>
      </section>
    </div>
  );
}
