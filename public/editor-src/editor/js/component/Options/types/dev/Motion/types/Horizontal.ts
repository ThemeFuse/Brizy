import { or, parseStrict, mPipe, pass } from "fp-utilities";
import * as Unit from "visual/utils/math/Unit";
import * as Viewport from "./Viewport";
import {
  callGetter,
  FromElementModelGetter
} from "visual/component/Options/Type";
import { pipe } from "visual/utils/fp";
import * as Num from "visual/utils/math/number";
import { prefixKeys } from "../utils";
import { wrap } from "./utils";
import { ElementModel } from "visual/component/Elements/Types";

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
