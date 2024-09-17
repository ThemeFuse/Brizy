export const getPlaceholders = (pattern: string): string[] => {
  const placeholderRegex = /\[([^\]]+)]/g;

  return pattern.match(placeholderRegex) || [];
};
