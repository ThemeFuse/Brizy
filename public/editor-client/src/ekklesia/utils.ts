import { Obj, Str } from "@brizy/readers";
import { request } from "api/index";
import { makeUrl } from "api/utils";
import { ChoicesSync } from "types/Choices";
import {
  EkklesiaChoiceParamsWithSubKey,
  EkklesiaExtra,
  EkklesiaFields,
  EkklesiaParams,
  EkklesiaParentsChilds,
  EkklesiaResponse
} from "types/Ekklesia";
import { t } from "utils/i18n";
import { Literal } from "utils/types";

export const requestFields = (url: string): Promise<EkklesiaResponse> => {
  return request(url).then((res) => res.json());
};

export const fieldHaveParentsChildsKeys = (
  keys: Record<string, Literal> | EkklesiaParentsChilds
): keys is EkklesiaParentsChilds => "childs" in keys && "parents" in keys;

export const keysHaveSubkey = (
  keys: EkklesiaParams
): keys is EkklesiaChoiceParamsWithSubKey => "subKey" in keys;

export const getOption = (
  obj: Record<string, Literal> | undefined
): ChoicesSync =>
  Obj.isObject(obj)
    ? [
        { title: t("None"), value: "" },
        ...Object.entries(obj).map(([key, value]) => {
          return {
            title: Str.read(value) ?? "",
            value: key
          };
        })
      ]
    : [];

export const getFields = async <
  T extends keyof EkklesiaFields = keyof EkklesiaFields
>(
  _url: string,
  keys: EkklesiaParams<T>,
  extra?: EkklesiaExtra
): Promise<ChoicesSync> => {
  const { key } = keys;

  const url = makeUrl(_url, { module: key, ...extra });

  const { data = {} } = await requestFields(url);
  const field = data[key];

  if (field && fieldHaveParentsChildsKeys(field)) {
    if (keysHaveSubkey(keys)) {
      return getOption(field[keys.subKey]);
    }
    return [{ value: "", title: t("None") }];
  } else {
    return getOption(field);
  }
};
