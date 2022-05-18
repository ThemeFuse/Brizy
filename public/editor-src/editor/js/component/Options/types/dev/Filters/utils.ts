import { mPipe, or, parseStrict } from "fp-utilities";
import {
  FromElementModel,
  ToElementModel
} from "visual/component/Options/Type";
import * as Num from "visual/utils/math/number";
import * as Positive from "visual/utils/math/Positive";
import { always } from "visual/utils/fp";
import { MValue } from "visual/utils/value";
import { Literal } from "visual/utils/types/Literal";
import { Value } from "./types/Value";

type Get = (k: string) => MValue<Literal>;
const call = (k: string) => (get: Get): MValue<Literal> => get(k);

export const fromElementModel: FromElementModel<Value> = parseStrict<
  Get,
  Value
>({
  hue: or(mPipe(call("hue"), Num.read), always(0)),
  brightness: or(
    mPipe(call("brightness"), Num.read, Positive.fromNumber),
    always(0)
  ),
  contrast: or(
    mPipe(call("contrast"), Num.read, Positive.fromNumber),
    always(0)
  ),
  saturation: or(
    mPipe(call("saturation"), Num.read, Positive.fromNumber),
    always(0)
  )
});

export const toElementModel: ToElementModel<Value> = v => ({ ...v });

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const empty = (): void => {};

export const set = <K extends keyof Value>(k: K, value: Value) => (
  v: Value[K]
): Value => ({ ...value, [k]: v });
