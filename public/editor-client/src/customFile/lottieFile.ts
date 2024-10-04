import { Arr, Num, Obj, Str } from "@brizy/readers";
import { mPipe, parseStrict } from "fp-utilities";
import { pipe } from "../utils/fp/pipe";
import { t } from "../utils/i18n";

import { throwOnNullish } from "../utils/throwOnNullish";

export interface LottieData extends Record<string, unknown> {
  fr: number;
  ip: number;
  op: number;
  w: number;
  h: number;
  layers: unknown[];
}

const lottieDataParser = parseStrict<Record<string, unknown>, LottieData>({
  layers: pipe(
    mPipe(Obj.readKey("layers"), Arr.read),
    throwOnNullish(t("Invalid Lottie layers"))
  ),
  fr: pipe(
    mPipe(Obj.readKey("fr"), Num.read),
    throwOnNullish(t("Invalid Lottie fr"))
  ),
  op: pipe(
    mPipe(Obj.readKey("op"), Num.read),
    throwOnNullish(t("Invalid Lottie op"))
  ),
  ip: pipe(
    mPipe(Obj.readKey("ip"), Num.read),
    throwOnNullish(t("Invalid Lottie ip"))
  ),
  w: pipe(
    mPipe(Obj.readKey("w"), Num.read),
    throwOnNullish(t("Invalid Lottie w"))
  ),
  h: pipe(
    mPipe(Obj.readKey("h"), Num.read),
    throwOnNullish(t("Invalid Lottie h"))
  )
});

export const validateLottie = (file: File): Promise<LottieData> =>
  new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = function (e) {
      try {
        const data = JSON.parse(Str.read(e.target?.result) ?? "{}");
        resolve(lottieDataParser(data));
      } catch (e) {
        reject(e);
      }
    };

    fileReader.readAsText(file);
  });

export const isLottieFile = (file: string): boolean => /\.lottie$/i.test(file);
