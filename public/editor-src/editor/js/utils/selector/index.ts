export const isValidSelector = (s: string): boolean => {
  try {
    document.createDocumentFragment().querySelector(s);
  } catch {
    return false;
  }

  return true;
};
