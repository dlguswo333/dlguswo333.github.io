const throttleWithLast = <T extends unknown[]>(func: (...args: T) => unknown, interval: number) => {
  let lastTimestamp = 0;
  let lastTimer: ReturnType<typeof setTimeout> | number = 0;

  return (...args: T) => {
    const curTimeStamp = Date.now();
    const curTimer = setTimeout(() => {
      func(...args);
    }, interval);
    if (curTimeStamp - lastTimestamp <= interval) {
      // It might be the last call.
      // Cancel the last timer which was expected to be the last call,
      // and register it as the last call.
      clearTimeout(lastTimer);
      lastTimer = curTimer;
      return;
    }
    // Refresh the last timestamp on the first call within each interval only.
    lastTimestamp = curTimeStamp;
  };
};

export default throttleWithLast;
