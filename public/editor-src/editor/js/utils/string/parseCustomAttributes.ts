import { MRead, Reader } from "visual/utils/types/Type";
import { mCompose } from "visual/utils/value";
import * as S from "visual/utils/string/specs";
import { isDynamicContent } from "visual/utils/dynamicContent";

export type Attributes = { [K: string]: string };

export function parseCustomAttributes(attributes: string): Attributes {
  if (isDynamicContent(attributes)) {
    return {
      "data-brz-dcatts": attributes
    };
  }

  const res: Attributes = {};
  const regex = /(\w+)[:=](["'])?(\w+)\2/g;
  let match = regex.exec(attributes);

  while (match) {
    if (match !== null) {
      const [, att, , val] = match;
      res[att] = val;
    }

    match = regex.exec(attributes);
  }

  return res;
}

export const read: Reader<Attributes> = mCompose(parseCustomAttributes, S.read);

export const mRead: MRead<Attributes> = v => read(v) ?? {};
