import type { ChoiceWithPermalink } from "visual/component/Options/types/dev/InternalLink/types";
import { StringSpec } from "visual/utils/string/specs";
import type { Reader } from "visual/utils/types/Type";

export const read: Reader<ChoiceWithPermalink> = (v) => {
  if (typeof v !== "object") {
    return undefined;
  }

  const title = StringSpec.read((v as ChoiceWithPermalink)?.title);
  const value = StringSpec.read((v as ChoiceWithPermalink)?.value);
  const source = StringSpec.read((v as ChoiceWithPermalink)?.source);

  return title !== undefined && value !== undefined && source !== undefined
    ? { title, value, source }
    : undefined;
};
