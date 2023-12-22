import { mPipe, parseStrict } from "fp-utilities";
import { pipe } from "../utils/fp/pipe";
import { t } from "../utils/i18n";
import { read as readArray } from "../utils/reader/array";
import { read as readNumber } from "../utils/reader/number";
import { readKey } from "../utils/reader/object";
import { read as readString } from "../utils/reader/string";
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
    mPipe(readKey("layers"), readArray),
    throwOnNullish(t("Invalid Lottie layers"))
  ),
  fr: pipe(
    mPipe(readKey("fr"), readNumber),
    throwOnNullish(t("Invalid Lottie fr"))
  ),
  op: pipe(
    mPipe(readKey("op"), readNumber),
    throwOnNullish(t("Invalid Lottie op"))
  ),
  ip: pipe(
    mPipe(readKey("ip"), readNumber),
    throwOnNullish(t("Invalid Lottie ip"))
  ),
  w: pipe(
    mPipe(readKey("w"), readNumber),
    throwOnNullish(t("Invalid Lottie w"))
  ),
  h: pipe(
    mPipe(readKey("h"), readNumber),
    throwOnNullish(t("Invalid Lottie h"))
  )
});

export const validateLottie = (file: File): Promise<LottieData> =>
  new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = function (e) {
      try {
        const data = JSON.parse(readString(e.target?.result) ?? "{}");
        resolve(lottieDataParser(data));
      } catch (e) {
        reject(e);
      }
    };

    fileReader.readAsText(file);
  });
