import * as S from "visual/utils/string/specs";
import * as L from "visual/utils/types/Literal";
import { Reader } from "visual/utils/types/Type";

export type Choice = {
  title?: string;
  icon: string;
  value: L.Literal;
};

export const read: Reader<Choice> = v => {
  if (typeof v !== "object") {
    return undefined;
  }

  const icon = S.read((v as Choice).icon);
  const title = S.read((v as Choice).title) ?? "";
  const value = L.read((v as Choice).value);

  if (icon && value !== undefined) {
    return { icon, value, title };
  }

  return undefined;
};
