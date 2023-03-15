import { Post } from "visual/component/Options/types/dev/InternalLink/types/Post";

export const trimTitle = (s: string): string =>
  s.length > 24 ? s.slice(0, 23) + "..." : s;

export const isValuePopulated = (value?: Post): boolean => {
  if (value && value.id && value.title) {
    return true;
  }

  return false;
};
