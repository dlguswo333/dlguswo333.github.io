const throttleWithLast = (func: () => unknown, interval: number) => {
  let lastTimestamp = 0;
  let curTimeStamp = 0;
  let timer: ReturnType<typeof setTimeout> | number = 0;

  return function () {
    curTimeStamp = Date.now();
    clearTimeout(timer);
    if (curTimeStamp - lastTimestamp >= interval) {
      lastTimestamp = curTimeStamp;
      func();
    } else {
      timer = setTimeout(func, interval);
    }
  };
};

export default throttleWithLast;
