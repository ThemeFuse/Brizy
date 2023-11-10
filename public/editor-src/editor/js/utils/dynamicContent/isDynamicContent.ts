import { explodePlaceholder } from "./explodePlaceholder";

export const isDynamicContent = (s: string): boolean => {
  return explodePlaceholder(s) !== undefined;
};
