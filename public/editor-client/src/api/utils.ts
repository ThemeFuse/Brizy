import { Num, Obj, Str } from "@brizy/readers";
import { match } from "fp-utilities";
import { Dictionary } from "../types/utils";
import { MValue } from "../utils/types";
import { ErrorResponse } from "./types";

export const makeUrl = (
  baseUrl: string,
  params: Record<string, string> = {}
): string => {
  const url = new URL(baseUrl);

  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });

  return url.toString();
};

type StrNum = string | number;

type Rec = Dictionary<StrNum>;

const isStrNum = (e: unknown): e is StrNum => {
  return Str.read(e) !== undefined || Num.read(e) !== undefined;
};

const isRec = (e: StrNum | Rec): e is Rec => {
  return Obj.isObject(e);
};

export type Entries = StrNum | Array<StrNum | Rec> | undefined;

export const makeFormEncode = (
  res: Record<string, Entries>
): Record<string, string> => {
  const r: Record<string, string> = {};

  Object.entries(res).forEach(([key, value]) => {
    if (isStrNum(value)) {
      r[key] = `${value}`;
    }

    if (Array.isArray(value)) {
      value.forEach((v, i) => {
        match(
          [
            isStrNum,
            (v) => {
              r[`${key}[${i}]`] = `${v}`;
            }
          ],
          [
            isRec,
            (v) => {
              Object.entries(v).forEach(([key1, value1]) => {
                if (isStrNum(value1)) {
                  r[`${key}[${i}][${key1}]`] = `${value1}`;
                }
              });
            }
          ]
        )(v);
      });
    }
  });

  return r;
};

export const getErrorMessage = (e: unknown): MValue<ErrorResponse> => {
  if (Obj.isObject(e) && "data" in e) {
    return e as unknown as ErrorResponse;
  }
  return undefined;
};

export const getResponseData = async (res: Response) => {
  const jsonData = await res.json();

  if (jsonData.success) {
    return jsonData;
  }

  const { data } = jsonData;

  return {
    ...data,
    status: data.code ?? res.status
  };
};

export function objectToQueryString(
  obj: Record<string, string | number | boolean>
): string {
  if (!obj) {
    return "";
  }

  return Object.entries<string | number | boolean>(obj)
    .map((item) => {
      return item[0] + "=" + encodeURIComponent(item[1]);
    })
    .join("&");
}

export const urlContainsQueryString = (url: string): boolean =>
  url.includes("?");
