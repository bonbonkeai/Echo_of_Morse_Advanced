import assert from "node:assert/strict";
import test from "node:test";

import { createLobbyLeaveScheduler } from "./lobby-leave-scheduler";

test("cancels a simulated development cleanup when the lobby remounts", () => {
  let scheduledCallback: (() => void) | null = null;
  let leaveCount = 0;

  const scheduler = createLobbyLeaveScheduler(
    () => {
      leaveCount += 1;
    },
    {
      schedule(callback: () => void) {
        scheduledCallback = callback;
        return 1;
      },
      cancel() {
        scheduledCallback = null;
      },
    }
  );

  scheduler.scheduleLeave();
  scheduler.cancelLeave();
  (scheduledCallback as (() => void) | null)?.();

  assert.equal(leaveCount, 0);
});

test("leaves the lobby when an actual unmount is not cancelled", () => {
  let scheduledCallback: (() => void) | null = null;
  let leaveCount = 0;

  const scheduler = createLobbyLeaveScheduler(
    () => {
      leaveCount += 1;
    },
    {
      schedule(callback: () => void) {
        scheduledCallback = callback;
        return 1;
      },
      cancel() {
        scheduledCallback = null;
      },
    }
  );

  scheduler.scheduleLeave();
  (scheduledCallback as (() => void) | null)?.();

  assert.equal(leaveCount, 1);
});
