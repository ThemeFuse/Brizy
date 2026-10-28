import { or, parseStrict } from "fp-utilities";
import type { Flip } from "visual/component/Controls/Transform/types/Flip";
import type { FromElementModelGetter } from "visual/component/Options/Type";
import { fromUnknown } from "visual/utils/bool";
import { always, mPipe } from "visual/utils/fp";
import { callGetter } from "visual/utils/options/utils/wrap";

export const fromElementModel = parseStrict<FromElementModelGetter, Flip>({
  flipHorizontal: or(
    mPipe(callGetter("flipHorizontal"), fromUnknown),
    always(false)
  ),
  flipVertical: or(
    mPipe(callGetter("flipVertical"), fromUnknown),
    always(false)
  )
});
