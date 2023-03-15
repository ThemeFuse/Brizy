import {
  callGetter,
  FromElementModel,
  FromElementModelGetter,
  ToElementModel
} from "visual/component/Options/Type";
import { Value } from "visual/component/Options/types/dev/Filters/types/Value";
import { mPipe, or, parseStrict } from "fp-utilities";
import * as Num from "visual/utils/math/number";
import { always } from "visual/utils/fp";
import * as Positive from "visual/utils/math/Positive";

export const defaultValue: Value = {
  hue: 0,
  saturation: 0,
  contrast: 0,
  brightness: 0
};

export const fromElementModel: FromElementModel<"filters-dev"> = parseStrict<
  FromElementModelGetter,
  Value
>({
  hue: or(mPipe(callGetter("hue"), Num.read), always(0)),
  brightness: or(
    mPipe(callGetter("brightness"), Num.read, Positive.fromNumber),
    always(0)
  ),
  contrast: or(
    mPipe(callGetter("contrast"), Num.read, Positive.fromNumber),
    always(0)
  ),
  saturation: or(
    mPipe(callGetter("saturation"), Num.read, Positive.fromNumber),
    always(0)
  )
});

export const toElementModel: ToElementModel<"filters-dev"> = v => ({ ...v });
