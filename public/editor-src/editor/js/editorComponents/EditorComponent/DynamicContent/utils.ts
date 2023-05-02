import { mPipe } from "fp-utilities";
import { V } from "visual/types";
import { Dictionary } from "visual/types/utils";
import { GetDynamicContent } from "visual/utils/api/types";
import * as Obj from "visual/utils/reader/object";
import * as Str from "visual/utils/reader/string";
import { camelCase } from "visual/utils/string";
import { MValue } from "visual/utils/value";
import { ECKeyDCInfo } from "../types";
import { DCPlaceholderObj } from "./types";

//#region keys

export const isDCKey = (key: string): boolean => key.endsWith("Population");

export const keyToDCKey = (key: string): string =>
  camelCase([key, "population"]);

export const dcKeyToKey = (dcKey: string): string => dcKey.slice(0, -10); // 10 is "Population".length

export const keyToDCAttrKey = (key: string): string =>
  camelCase([key, "populationAttr"]);

export const keyToDCFallback2Key = (key: string): string =>
  camelCase([key, "populationFallback2"]);

export const hasDC = (v: V, key: string): boolean =>
  !!Str.read(v[keyToDCKey(key)]);

export const keyDCInfo = (v: V, key: string): ECKeyDCInfo => {
  const staticValue = v[key];
  const dcValue = Str.read(v[keyToDCKey(key)]) ?? "";
  const fallback = v[keyToDCFallback2Key(key)];
  const attr_ = Obj.read(v[keyToDCAttrKey(key)]);
  const attr = attr_
    ? Object.fromEntries(
        Object.entries(attr_).map(([k, vKey]) => [k, v[vKey as string]])
      )
    : {};

  return {
    key,
    hasDC: dcValue !== "",
    staticValue,
    dcValue,
    attr,
    fallback
  };
};

//#endregion

//#region placeholder

const _unescape = mPipe(Str.read, unescape);
export function placeholderObjFromStr(
  placeholder: string,
  useCustomPlaceholder: boolean
): MValue<DCPlaceholderObj> {
  if (useCustomPlaceholder) {
    return { name: placeholder };
  }

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
}

export function placeholderObjFromECKeyDCInfo(
  info: ECKeyDCInfo,
  useCustomPlaceholder: boolean
): MValue<DCPlaceholderObj> {
  if (!info.hasDC) {
    return undefined;
  }

  const placeholderObj = placeholderObjFromStr(
    info.dcValue,
    useCustomPlaceholder
  );

  if (!placeholderObj) {
    return undefined;
  }

  if (info.fallback || info.attr) {
    placeholderObj.attr = {
      ...placeholderObj.attr,
      ...info.attr,
      ...(info.fallback ? { _fallback: info.fallback } : {})
    };
  }

  return placeholderObj;
}

const _escape = mPipe(Str.read, escape);
export function placeholderObjToStr(
  placeholderObj: DCPlaceholderObj,
  useCustomPlaceholder: boolean
): string {
  const { name, attr } = placeholderObj;

  if (useCustomPlaceholder) {
    return name;
  }

  const attrStr = attr
    ? Object.keys(attr)
        .sort()
        .flatMap((k) => {
          const v = _escape(attr[k]);
          return v !== undefined ? `${k}='${v}'` : [];
        })
        .join(" ")
    : "";

  return attrStr.length > 0 ? `{{${name} ${attrStr}}}` : `{{${name}}}`;
}

export function isPlaceholderStr(
  str: string,
  useCustomPlaceholder: boolean
): boolean {
  return placeholderObjFromStr(str, useCustomPlaceholder) !== undefined;
}

//#endregion

export const dcApiProxyTestFetcher: GetDynamicContent = ({
  placeholders,
  useCustomPlaceholder
}) => {
  const entries: [string, string[]][] = Object.entries(placeholders).map(
    ([postId, value]) => {
      if (value === undefined) {
        return [postId, [""]];
      }

      return [
        postId,
        value.map((placeholder) => {
          const placeholderObj = placeholderObjFromStr(
            placeholder,
            useCustomPlaceholder
          );

          if (
            placeholderObj === undefined ||
            placeholderObj.name === "_empty_"
          ) {
            return "";
          }

          if (
            placeholderObj.attr?.["_fallback"] &&
            placeholderObj.attr?.["_useFallback"]
          ) {
            return [postId, placeholderObj.attr["_fallback"]].join("_");
          }

          delete placeholderObj.attr?._fallback;

          const { name, attr } = placeholderObj;
          const attrStrArr = Object.entries(attr ?? {}).map(
            ([k, v]) => `${k}='${v}'`
          );

          return [postId, name, ...attrStrArr].join("_");
        })
      ];
    }
  );

  return Promise.resolve(Object.fromEntries(entries));
};
