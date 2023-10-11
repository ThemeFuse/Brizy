import { ChoiceWithPermalink } from "visual/component/Options/types/dev/InternalLink/types";

export const trimTitle = (s: string): string =>
  s.length > 24 ? s.slice(0, 23) + "..." : s;

export const isValuePopulated = (value?: ChoiceWithPermalink): boolean => {
  if (value && value.id && value.title && value.permalink) {
    return true;
  }

  return false;
};
