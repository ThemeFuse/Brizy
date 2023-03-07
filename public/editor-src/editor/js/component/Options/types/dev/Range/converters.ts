import {
  callGetter,
  FromElementModel,
  FromElementModelGetter,
  ToElementModel
} from "visual/component/Options/Type";
import { mPipe, or, parseStrict } from "fp-utilities";
import * as Num from "visual/utils/math/number";
import { always } from "visual/utils/fp";
import { Value } from "./types/Value";

export const defaultValue: Value = {
  from: 0,
  to: 100
};

export const fromElementModel: FromElementModel<"range-dev"> = parseStrict<
  FromElementModelGetter,
  Value
>({
  from: or(mPipe(callGetter("from"), Num.read), always(defaultValue.from)),
  to: or(mPipe(callGetter("to"), Num.read), always(defaultValue.to))
});

export const toElementModel: ToElementModel<"range-dev"> = v => ({ ...v });
