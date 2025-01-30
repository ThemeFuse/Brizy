import { Obj, Str } from "@brizy/readers";
import { V } from "visual/types";
import { GetDynamicContent } from "visual/utils/api/types";
import {
  explodePlaceholder,
  isPlaceholderStart
} from "visual/utils/dynamicContent";
import { DCPlaceholderStartObj } from "visual/utils/dynamicContent/types";
import { camelCase } from "visual/utils/string";
import { MValue } from "visual/utils/value";
import { ECKeyDCInfo } from "../types";

//#region keys

export const isDCKey = (key: string): boolean => key.endsWith("Population");

export const keyToDCKey = (key: string): string =>
  camelCase([key, "population"]);

export const dcKeyToKey = (dcKey: string): string => dcKey.slice(0, -10); // 10 is "Population".length

export const keyToDCAttrKey = (key: string): string =>
  camelCase([key, "populationAttr"]);

export const keyToDCFallback2Key = (key: string): string =>
  camelCase([key, "populationFallback2"]);

export const keyToDCEntityIdKey = (key: string): string =>
  camelCase([key, "populationEntityId"]);

export const keyToDCEntityTypeKey = (key: string): string =>
  camelCase([key, "populationEntityType"]);

export const hasDC = (v: V, key: string): boolean =>
  !!Str.read(v[keyToDCKey(key)]);

export const keyDCInfo = (v: V, key: string): ECKeyDCInfo => {
  const staticValue = v[key];
  const dcValue = Str.read(v[keyToDCKey(key)]) ?? "";
  const entityId = Str.read(v[keyToDCEntityIdKey(key)]);
  const entityType = Str.read(v[keyToDCEntityTypeKey(key)]);
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
    fallback,
    ...(entityType && { entityType }),
    ...(entityId && { entityId })
  };
};

//#endregion

//#region placeholder

export function placeholderObjFromECKeyDCInfo(
  info: ECKeyDCInfo
): MValue<DCPlaceholderStartObj> {
  const placeholder = info.dcValue;

  if (!info.hasDC || !placeholder) {
    return undefined;
  }

  if (info.fallback || info.attr || info.entityId || info.entityType) {
    const entityId = Str.read(info.entityId);
    const entityType = Str.read(info.entityType);

    return {
      name: "placeholder",
      content: placeholder,
      attr: {
        ...info.attr,
        ...(info.fallback ? { _fallback: info.fallback } : {}),
        ...(entityId ? { entityId } : {}),
        ...(entityType ? { entityType } : {})
      }
    };
  }

  return {
    name: "placeholder",
    content: placeholder
  };
}

//#endregion

// Fetcher Exist only for Tests
export const dcApiProxyTestFetcher: GetDynamicContent = ({ placeholders }) => {
  const entries: [string, string[]][] = Object.entries(placeholders).map(
    ([postId, value]) => {
      if (value === undefined) {
        return [postId, [""]];
      }

      return [
        postId,
        value.map((placeholder) => {
          const placeholderObj = explodePlaceholder(placeholder);

          if (
            placeholderObj === undefined ||
            !isPlaceholderStart(placeholderObj)
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

          const { content, attr } = placeholderObj;
          const attrStrArr = Object.entries(attr ?? {}).map(
            ([k, v]) => `${k}='${v}'`
          );

          return [postId, content, ...attrStrArr].join("_");
        })
      ];
    }
  );

  return Promise.resolve(Object.fromEntries(entries));
};
