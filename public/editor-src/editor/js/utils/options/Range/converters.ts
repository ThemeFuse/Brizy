import { mPipe, or, parseStrict } from "fp-utilities";
import {
  FromElementModel,
  FromElementModelGetter,
  ToElementModel
} from "visual/component/Options/Type";
import { Value } from "visual/component/Options/types/dev/Range/types/Value";
import { always } from "visual/utils/fp";
import * as Num from "visual/utils/math/number";
import { callGetter } from "visual/utils/options/utils/wrap";

export const defaultValue: Value = {
  from: 0,
  to: 100
};

export const fromElementModel: FromElementModel<"range"> = parseStrict<
  FromElementModelGetter,
  Value
>({
  from: or(mPipe(callGetter("from"), Num.read), always(defaultValue.from)),
  to: or(mPipe(callGetter("to"), Num.read), always(defaultValue.to))
});

export const toElementModel: ToElementModel<"range"> = (v) => ({ ...v });
