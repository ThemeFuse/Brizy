import { mPipe } from "fp-utilities";
import { MValue } from "src/utils/types";
import { DCPlaceholderObj, Dictionary } from "../types/DynamicContent";
import * as Str from "../utils/reader/string";

const _escape = mPipe(Str.read, encodeURI);
export const getPlaceholder = (placeholderObj: DCPlaceholderObj): string => {
  const { name, attr } = placeholderObj;

  const attrStr = attr
    ? Object.keys(attr)
        .sort()
        .flatMap((k: string) => {
          const v = _escape(attr[k] as string);
          return v !== undefined ? `${k}='${v}'` : [];
        })
        .join(" ")
    : "";

  return attrStr.length > 0 ? `{{${name} ${attrStr}}}` : `{{${name}}}`;
};

const _unescape = mPipe(Str.read, decodeURI);
export const getPlaceholderObj = (
  placeholder: string
): MValue<DCPlaceholderObj> => {
  const r1 = /^{{\s*([\w-]+)(.*?)\s*}}$/;
  const nameAndAttr = r1.exec(placeholder);

  if (!nameAndAttr) {
    return undefined;
  }

  const [, name, attrStr] = nameAndAttr;

  if (attrStr === "") {
    return { name };
  }

  const r2 = /(\w+)=("|'|&quot;|&apos;)(.*?)\2/g;
  let attr: Dictionary<string> | undefined = undefined;
  let match;

  while ((match = r2.exec(attrStr.trim()))) {
    attr = attr ?? {};
    attr[match[1]] = _unescape(match[3]);
  }

  return attr ? { name, attr } : { name };
};
