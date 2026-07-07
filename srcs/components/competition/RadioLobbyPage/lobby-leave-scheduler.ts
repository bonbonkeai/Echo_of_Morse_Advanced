type LeaveTimerDriver = {
  schedule(callback: () => void): unknown;
  cancel(handle: unknown): void;
};

const browserTimerDriver: LeaveTimerDriver = {
  schedule(callback) {
    return window.setTimeout(callback, 250);
  },
  cancel(handle) {
    window.clearTimeout(handle as number);
  },
};

export function createLobbyLeaveScheduler(
  leaveLobby: () => void,
  timerDriver: LeaveTimerDriver = browserTimerDriver
) {
  let pendingHandle: unknown | null = null;

  return {
    scheduleLeave() {
      if (pendingHandle !== null) {
        timerDriver.cancel(pendingHandle);
      }

      pendingHandle = timerDriver.schedule(() => {
        pendingHandle = null;
        leaveLobby();
      });
    },
    cancelLeave() {
      if (pendingHandle === null) {
        return;
      }

      timerDriver.cancel(pendingHandle);
      pendingHandle = null;
    },
  };
}
