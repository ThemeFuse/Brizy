import { mPipe } from "fp-utilities";
import { Base64 } from "js-base64";
import type { Dictionary } from "visual/types/utils";
import * as Str from "visual/utils/reader/string";
import type { MValue } from "visual/utils/value";
import { isPlaceholderName } from "./common";
import type { DCPlaceholderObj } from "./types";

const _unescape = mPipe(Str.read, unescape);

export function placeholderObjFromStr(
  placeholder: string
): MValue<DCPlaceholderObj> {
  const r1 = /^{{\s*(placeholder)(?:\s(content='.*?')?\s*(.*?))?\s*}}$/;
  const nameAndAttr = r1.exec(placeholder);

  if (!nameAndAttr) {
    return undefined;
  }

  const [, name, _content, attrStr] = nameAndAttr;

  const r2 = /^content='(.+)'$/g;
  const [, contentEncoded] = r2.exec(_content) ?? [];

  if (!isPlaceholderName(name) || !contentEncoded) {
    return undefined;
  }

  const content = Base64.decode(contentEncoded);

  if (attrStr === "") {
    return { name, content };
  }

  let attr: Dictionary<string> | undefined;
  let match: RegExpExecArray | null;

  const r3 = /(\w+)=("|'|&quot;|&apos;)(.*?)\2/g;
  // biome-ignore lint/suspicious/noAssignInExpressions: regex exec iteration idiom - matchAll would work here but the rewrite is kept out of this lint PR
  while ((match = r3.exec(attrStr.trim()))) {
    attr = attr ?? {};
    attr[match[1]] = _unescape(match[3]);
  }

  return attr ? { name, content, attr } : { name, content };
}

export const explodePlaceholder = (
  placeholder: string
): MValue<DCPlaceholderObj> => {
  return placeholderObjFromStr(placeholder);
};
