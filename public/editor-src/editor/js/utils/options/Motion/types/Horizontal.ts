import { mPipe, or, parseStrict, pass } from "fp-utilities";
import type { ElementModel } from "visual/component/Elements/Types";
import type { FromElementModelGetter } from "visual/component/Options/Type";
import { pipe } from "visual/utils/fp";
import * as Num from "visual/utils/math/number";
import * as Unit from "visual/utils/math/Unit";
import { callGetter } from "visual/utils/options/utils/wrap";
import { prefixKeys } from "../../utils/effects";
import { wrap } from "./utils";
import * as Viewport from "./Viewport";

export interface Horizontal {
  speed: Unit.Unit;
  direction: "left" | "right";
  viewport: Viewport.Viewport;
}

export const isDirection = (v: unknown): v is Horizontal["direction"] =>
  v === "left" || v === "right";

export const fromElementModel = parseStrict<FromElementModelGetter, Horizontal>(
  {
    speed: or(mPipe(callGetter("speed"), Num.read, Unit.fromNumber), () => 0),
    direction: or(
      mPipe(callGetter("direction"), pass(isDirection)),
      () => "left"
    ),
    viewport: pipe(wrap("viewport"), Viewport.fromElementModel)
  }
);

export const toElementModel = ({
  viewport,
  ...v
}: Horizontal): ElementModel => ({
  ...v,
  ...prefixKeys("viewport", Viewport.toElementModel(viewport))
});
