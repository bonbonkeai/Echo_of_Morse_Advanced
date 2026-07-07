"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui";
import { encode } from "@/lib/morse";
import { playMorse } from "@/lib/audio";
import styles from "./MorsePlayer.module.css";

export default function MorsePlayer() {
  const [text, setText] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);

  const morse = useMemo(() => {
    return text.trim() ? encode(text) : "";
  }, [text]);

  async function handlePlay() {
    if (!text.trim()) {
      return;
    }

    try {
      setIsPlaying(true);
      await playMorse(morse);
    } finally {
      setIsPlaying(false);
    }
  }

  const isDisabled = !text.trim() || isPlaying;

  return (
    <section className={styles.panel}>
      <div className={styles.content}>
        <label className={styles.field}>
          <span className={styles.label}>Input Message</span>

          <input
            className={styles.input}
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Enter text"
          />
        </label>

        <div>
          <p className={styles.label}>Encoded Morse</p>

          <div className={styles.output}>
            {morse || "No transmission yet."}
          </div>
        </div>

        <Button
          type="button"
          onClick={handlePlay}
          disabled={isDisabled}
          className={styles.playButton}
        >
          {isPlaying ? "Transmitting..." : "Play Morse"}
        </Button>
      </div>
    </section>
  );
}

// ! i18n: move learning page title, description, input label, placeholder, output empty state, and button states into the i18n dictionary.
// ! i18n: do not translate the generated Morse output itself.