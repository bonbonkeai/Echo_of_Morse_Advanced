import assert from "node:assert/strict";
import test from "node:test";

import { getLearningPreviewItems } from "./learningPreview";

test("returns the new characters for the requested level", () => {
  assert.deepEqual(getLearningPreviewItems(1), [
    { character: "E", morse: "." },
    { character: "T", morse: "-" },
    { character: "I", morse: ".." },
    { character: "A", morse: ".-" },
  ]);
});

test("returns the level 12 characters as preview items", () => {
  assert.deepEqual(getLearningPreviewItems(12), [
    { character: "+", morse: ".-.-." },
    { character: "_", morse: "..--.-" },
    { character: '"', morse: ".-..-." },
    { character: "$", morse: "...-..-" },
    { character: "@", morse: ".--.-." },
  ]);
});
