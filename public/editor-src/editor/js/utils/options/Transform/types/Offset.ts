import { or, parseStrict } from "fp-utilities";
import { Offset } from "visual/component/Controls/Transform/types/Offset";
import { FromElementModelGetter } from "visual/component/Options/Type";
import { always, mPipe } from "visual/utils/fp";
import * as Num from "visual/utils/math/number";
import { callGetter } from "visual/utils/options/utils/wrap";

export const fromElementModel = parseStrict<FromElementModelGetter, Offset>({
  offsetX: or(mPipe(callGetter("offsetX"), Num.read), always(0)),
  offsetY: or(mPipe(callGetter("offsetY"), Num.read), always(0))
});
