import { or, parseStrict } from "fp-utilities";
import * as Degree from "visual/component/Controls/Transform/Degree";
import { Skew } from "visual/component/Controls/Transform/types/Skew";
import { FromElementModelGetter } from "visual/component/Options/Type";
import { always, mPipe } from "visual/utils/fp";
import * as Num from "visual/utils/math/number";
import { callGetter } from "visual/utils/options/utils/wrap";

export const fromElementModel = parseStrict<FromElementModelGetter, Skew>({
  skewX: or(mPipe(callGetter("skewX"), Num.read, Degree.fromNumber), always(0)),
  skewY: or(mPipe(callGetter("skewY"), Num.read, Degree.fromNumber), always(0))
});
