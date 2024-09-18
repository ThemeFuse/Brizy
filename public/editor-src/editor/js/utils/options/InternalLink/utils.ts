import { ChoiceWithPermalink } from "visual/component/Options/types/dev/InternalLink/types";
import { String } from "visual/utils/string/specs";
import { Reader } from "visual/utils/types/Type";

export const read: Reader<ChoiceWithPermalink> = (v) => {
  if (typeof v !== "object") {
    return undefined;
  }

  const title = String.read((v as ChoiceWithPermalink)?.title);
  const value = String.read((v as ChoiceWithPermalink)?.value);
  const source = String.read((v as ChoiceWithPermalink)?.source);

  return title !== undefined && value !== undefined && source !== undefined
    ? { title, value, source }
    : undefined;
};
