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
    // biome-ignore lint/suspicious/noConsole: migrated from eslint
    console.warn("Could not access localStorage");
  }
};
