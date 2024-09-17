import { or, parseStrict } from "fp-utilities";
import { Scale } from "visual/component/Controls/Transform/types/Scale";
import { FromElementModelGetter } from "visual/component/Options/Type";
import { mPipe } from "visual/utils/fp";
import * as Num from "visual/utils/math/number";
import * as Unit from "visual/utils/math/Unit";
import { callGetter } from "visual/utils/options/utils/wrap";
import * as Bool from "visual/utils/reader/bool";

export const elementModelToScaleX = or(
  mPipe(callGetter("scaleX"), Num.read, Unit.fromNumber),
  (): Unit.Unit => 0
);

export const elementModelToScaleY = or(
  mPipe(callGetter("scaleY"), Num.read, Unit.fromNumber),
  (): Unit.Unit => 0
);

export const elementModelToScaleXY = or(
  mPipe(callGetter("scaleXY"), Num.read, Unit.fromNumber),
  (): Unit.Unit => 0
);

export const elementModelToScalePreserveSize = or(
  mPipe(callGetter("scalePreserveSize"), Bool.read),
  (): boolean => false
);

export const fromElementModel = parseStrict<FromElementModelGetter, Scale>({
  scaleX: elementModelToScaleX,
  scaleY: elementModelToScaleY,
  scalePreserveSize: elementModelToScalePreserveSize,
  scaleXY: elementModelToScaleXY
});
