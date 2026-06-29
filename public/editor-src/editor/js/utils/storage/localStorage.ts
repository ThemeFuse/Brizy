export const getFromStorage = (key: string): string | null => {
  try {
    return localStorage.getItem(key);
  } catch (_) {
    return null;
  }
};

export const setToStorage = (key: string, value: string): void => {
  try {
    localStorage.setItem(key, value);
  } catch (_) {
    // eslint-disable-next-line no-console
    console.warn("Could not access localStorage");
  }
};
