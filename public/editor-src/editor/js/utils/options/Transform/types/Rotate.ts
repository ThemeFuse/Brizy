import { or, parseStrict } from "fp-utilities";
import * as Degree from "visual/component/Controls/Transform/Degree";
import { Rotate } from "visual/component/Controls/Transform/types/Rotate";
import { FromElementModelGetter } from "visual/component/Options/Type";
import { always, mPipe } from "visual/utils/fp";
import * as Num from "visual/utils/math/number";
import { callGetter } from "visual/utils/options/utils/wrap";
import { read as readBool } from "visual/utils/reader/bool";

export const fromElementModel = parseStrict<FromElementModelGetter, Rotate>({
  rotate: or(
    mPipe(callGetter("rotate"), Num.read, Degree.fromNumber),
    always(0)
  ),
  rotate3D: or(mPipe(callGetter("rotate3D"), readBool), always(false)),
  rotateX: or(
    mPipe(callGetter("rotateX"), Num.read, Degree.fromNumber),
    always(0)
  ),
  rotateY: or(
    mPipe(callGetter("rotateY"), Num.read, Degree.fromNumber),
    always(0)
  ),
  rotatePerspective: or(
    mPipe(callGetter("rotatePerspective"), Num.read),
    always(0)
  )
});
