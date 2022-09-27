import { match } from "fp-utilities";
import { Dictionary } from "visual/types/utils";
import * as Num from "visual/utils/reader/number";
import * as Obj from "visual/utils/reader/object";
import * as Str from "visual/utils/reader/string";
import { ResponseWithBody } from "./types";

export const parseJSON = <T>(
  response: Response
): Promise<ResponseWithBody<T>> => {
  return response
    .json()
    .then((body) => ({
      status: response.status,
      ok: response.ok,
      data: body || null
    }))
    .catch(() => {
      throw {
        status: 500,
        data: "Server Error"
      };
    });
};

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

const isStrNum = (
  e: StrNum | undefined | Rec | Array<StrNum | Rec>
): e is StrNum => {
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
