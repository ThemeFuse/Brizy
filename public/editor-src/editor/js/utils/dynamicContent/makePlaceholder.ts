import { escape } from "es-toolkit";
import { mPipe } from "fp-utilities";
import { Base64 } from "js-base64";
import * as Str from "visual/utils/reader/string";
import { isPlaceholderStart } from "./common";
import {
  DCPlaceholderEndObj,
  DCPlaceholderObj,
  DCPlaceholderStartObj,
  placeholderEndName,
  placeholderName
} from "./types";

const _escape = mPipe(Str.read, escape);
export function placeholderObjToStr(placeholderObj: DCPlaceholderObj): string {
  const { name, content } = placeholderObj;
  const base64 = Base64.encode(content);

  if (isPlaceholderStart(placeholderObj)) {
    const { attr, attrStr } = placeholderObj;
    const attrs = attr
      ? Object.keys(attr)
          .sort()
          .flatMap((k) => {
            const v = _escape(attr[k]);
            return v !== undefined ? `${k}='${v}'` : [];
          })
      : [];

    if (attrStr) {
      attrs.push(attrStr);
    }
    const attrToStr = attrs.join(" ");

    return attrToStr.length > 0
      ? `{{${name} content='${base64}' ${attrToStr}}}`
      : `{{${name} content='${base64}'}}`;
  }

  return `{{${name} content='${base64}'}}`;
}

// {{ placeholder content='Base64.encode("{{ featured_image }}")' someAttr1='1' someAttr2='2' }}
export const makePlaceholder = (
  placeholderObj: Omit<DCPlaceholderStartObj, "name">
): string => {
  return placeholderObjToStr({ ...placeholderObj, name: placeholderName });
};

// {{ placeholder content='Base64.encode("{{ post_loop }}")' someAttr1='1' someAttr2='2' }}
// <div>Text</div>
// {{ placeholder content='Base64.encode("{{ end_post_loop }}")'}}
export const makeStartPlaceholder = makePlaceholder;

export const makeEndPlaceholder = (
  placeholderObj: Omit<DCPlaceholderEndObj, "name">
): string => {
  return placeholderObjToStr({
    name: placeholderEndName,
    content: placeholderObj.content
  });
};
