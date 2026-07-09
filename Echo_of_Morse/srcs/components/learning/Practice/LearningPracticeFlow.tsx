"use client";

import { useRef, useState } from "react";

import { useI18n } from "@/lib/i18n";
import { playMorse } from "@/lib/audio";
import PracticeSession from "./practiceSession";
import { getLearningPreviewItems } from "./learningPreview";
import BackLink from "@/components/ui/back-link";
import styles from "@/components/learning/css/Learning.module.css";

type LearningPracticeFlowProps = {
  levelId: number;
};

function renderMorse(code: string) {
  return <span className={styles.learningPreviewMorseText}>{code}</span>;
}

export default function LearningPracticeFlow({ levelId }: LearningPracticeFlowProps) {
  const { dictionary } = useI18n();
  const t = dictionary.learningPractice;
  const previewItems = getLearningPreviewItems(levelId);
  const [isPracticeStarted, setIsPracticeStarted] = useState(false);
  const [revealedIndexes, setRevealedIndexes] = useState<number[]>([]);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const [bulbState, setBulbState] = useState<{ index: number | null; on: boolean }>({
    index: null,
    on: false,
  });
  const lightSequenceRef = useRef(0);

  if (isPracticeStarted) {
    return <PracticeSession levelId={levelId} />;
  }

  function toggleCard(index: number) {
    const isCurrentlyRevealed = revealedIndexes.includes(index);

    if (isCurrentlyRevealed) {
      setRevealedIndexes((current) => current.filter((item) => item !== index));
      return;
    }

    setRevealedIndexes((current) => [...current, index]);
  }

  async function playCombinedMorse(index: number, code: string) {
    if (playingIndex !== null) {
      return;
    }

    setPlayingIndex(index);

    try {
      await Promise.all([playMorse(code), playLightMorse(index, code)]);
    } finally {
      setPlayingIndex(null);
    }
  }

  async function playLightMorse(index: number, code: string) {
    const sequenceId = lightSequenceRef.current + 1;
    lightSequenceRef.current = sequenceId;
    setPlayingIndex(index);

    setBulbState({ index, on: false });

    try {
      for (let symbolIndex = 0; symbolIndex < code.length; symbolIndex += 1) {
        if (lightSequenceRef.current !== sequenceId) {
          return;
        }

        const symbol = code[symbolIndex];
        const duration = symbol === "." ? 100 : 300;

        setBulbState({ index, on: true });
        await new Promise((resolve) => window.setTimeout(resolve, duration));

        if (lightSequenceRef.current !== sequenceId) {
          return;
        }

        setBulbState({ index, on: false });

        if (symbolIndex < code.length - 1) {
          await new Promise((resolve) => window.setTimeout(resolve, 100));
        }
      }
    } finally {
      if (lightSequenceRef.current === sequenceId) {
        setBulbState({ index: null, on: false });
        setPlayingIndex((current) => (current === index ? null : current));
      }
    }
  }

  return (
    <section className={styles.learningIntro} aria-labelledby="learning-intro-title">
      <div className={styles.learningIntroHeader}>
        <BackLink href="/learning/levels">{t.backToLevels}</BackLink>
      </div>

      <div className={styles.learningIntroFrame}>
        <h1 id="learning-intro-title" className={styles.title}>
          {t.previewLevelTitle.replace("{level}", String(levelId))}
        </h1>

        <p className={styles.description}>{t.previewDescription}</p>
      </div>

      <div className={styles.learningPreviewGrid} aria-label={t.previewLevelTitle.replace("{level}", String(levelId))}>
        {previewItems.map((item, index) => {
          const isRevealed = revealedIndexes.includes(index);
          const isPlaying = playingIndex === index;
          const isBulbOn = bulbState.index === index && bulbState.on;
          const codeClassName = isRevealed
            ? styles.learningPreviewCodeVisible
            : styles.learningPreviewCodeHidden;

          return (
            <article
              key={item.character}
              className={`${styles.learningPreviewCard} ${isRevealed ? styles.learningPreviewCardRevealed : ""}`}
              onClick={() => toggleCard(index)}
            >
              <div className={styles.learningPreviewCardBody}>
                <span className={styles.learningPreviewCharacter}>{item.character}</span>
                <span className={styles.learningPreviewHint}>
                  {isRevealed ? t.tapToHide : t.tapToReveal}
                </span>
                <button
                  type="button"
                  className={styles.learningPreviewBulbButton}
                  onClick={(event) => {
                    event.stopPropagation();
                    void playCombinedMorse(index, item.morse);
                  }}
                  aria-label={t.bulbPlayLabel}
                  disabled={isPlaying}
                >
                  <span
                    className={`${styles.learningPreviewBulb} ${isBulbOn ? styles.learningPreviewBulbOn : ""}`}
                    aria-hidden="true"
                  />
                </button>
                <span className={`${styles.learningPreviewCode} ${codeClassName}`}>
                  {isRevealed ? renderMorse(item.morse) : <span className={styles.learningPreviewMorseHidden}>{t.hiddenMorse}</span>}
                </span>
              </div>

              <div className={styles.learningPreviewPlayRow}>
                <button
                  type="button"
                  className={styles.learningPreviewPlayButton}
                  onClick={(event) => {
                    event.stopPropagation();
                    void playCombinedMorse(index, item.morse);
                  }}
                  disabled={isPlaying}
                >
                  {t.audio}
                </button>
              </div>
            </article>
          );
        })}
      </div>

      <div className={styles.learningIntroActions}>
        <button
          type="button"
          className={styles.primaryButton}
          onClick={() => setIsPracticeStarted(true)}
        >
          {t.startPractice}
        </button>
      </div>
    </section>
  );
}
