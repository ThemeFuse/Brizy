import { String } from "visual/utils/string/specs";
import { IsEqual } from "visual/utils/types/Eq";
import { Reader } from "visual/utils/types/Type";
import { ChoiceWithPermalink } from ".";

export const read: Reader<ChoiceWithPermalink> = (v) => {
  if (typeof v !== "object") {
    return undefined;
  }

  const title = String.read((v as ChoiceWithPermalink)?.title);
  const value = String.read((v as ChoiceWithPermalink)?.value);

  return title !== undefined && value !== undefined
    ? { title, value }
    : undefined;
};

export const eq: IsEqual<ChoiceWithPermalink> = (a, b) => a.value === b.value;
