export function createDebounceById<T extends unknown[], R>(
  fn: (...args: T) => R,
  wait: number
) {
  const timeouts: Record<string, NodeJS.Timeout> = {};

  const cancel = (id: string): void => {
    if (timeouts[id]) {
      clearTimeout(timeouts[id]);
      delete timeouts[id];
    }
  };

  const set = (id: string, ...args: T): Promise<R | void> => {
    return new Promise((resolve) => {
      cancel(id);

      timeouts[id] = setTimeout(() => {
        delete timeouts[id];
        const result = fn(...args);
        resolve(result);
      }, wait);
    });
  };

  return { set, cancel };
}
