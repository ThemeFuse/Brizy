import { isDynamicContent } from "visual/utils/dynamicContent";
import { makeDataAttr } from "visual/utils/i18n/attribute";
import * as S from "visual/utils/string/specs";
import { MRead, Reader } from "visual/utils/types/Type";
import { mCompose } from "visual/utils/value";

export type Attributes = { [K: string]: string | unknown };

export type SupportSSREvents =
  | "data-brz-onclick-event"
  | "data-brz-onsubmit-event";

export const isSSREvent = (t: unknown): t is SupportSSREvents => {
  return t === "data-brz-onclick-event" || t === "data-brz-onsubmit-event";
};

export function parseCustomAttributes(attributes: string): Attributes {
  if (isDynamicContent(attributes)) {
    return makeDataAttr({ name: "dcatts", value: attributes });
  }

  const res: Attributes = {};
  // const regex = /([\w_-]+)[:=]\s*?(?:(["'])([^\n]+)\2|([^\s'"]+))/g;
  const regex = /(?:\s*([\w_-]+)[:=]\s*((?<!\\)["'])(.*?)(?<!\\)\2\s*)/gms;
  let match = regex.exec(attributes);

  while (match) {
    if (match !== null) {
      // eslint-disable-next-line prefer-const
      let [, att, , val1] = match;
      const _att = att.toLowerCase();

      // events like onclick, onsubmit by default it doesn't work in react like as normal attributes
      // need to convert onclick to some custom attribute and in ssr added this events like
      // a simple attribute
      switch (_att) {
        case "onclick": {
          att = "data-brz-onclick-event";
          break;
        }
        case "onsubmit": {
          att = "data-brz-onsubmit-event";
          break;
        }
      }

      res[att] = val1;
    }

    match = regex.exec(attributes);
  }

  return res;
}

export const read: Reader<Attributes> = mCompose(parseCustomAttributes, S.read);

export const mRead: MRead<Attributes> = (v) => read(v) ?? {};
