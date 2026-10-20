import { mPipe, or, parseStrict, pass } from "fp-utilities";
import type { ElementModel } from "visual/component/Elements/Types";
import type { FromElementModelGetter } from "visual/component/Options/Type";
import * as Num from "visual/utils/math/number";
import * as Unit from "visual/utils/math/Unit";
import { callGetter } from "visual/utils/options/utils/wrap";
import { prefixKeys } from "../../utils/effects";
import { elementModelToViewport } from "./utils";
import * as Viewport from "./Viewport";

export interface Blur {
  direction: "in" | "out" | "outIn" | "inOut";
  level: Unit.Unit;
  viewport: Viewport.Viewport;
}

export const isDirection = (v: unknown): v is Blur["direction"] =>
  ["in", "out", "outIn", "inOut"].includes(v as Blur["direction"]);

export const fromElementModel = parseStrict<FromElementModelGetter, Blur>({
  level: or(mPipe(callGetter("level"), Num.read, Unit.fromNumber), () => 0),
  direction: or(mPipe(callGetter("direction"), pass(isDirection)), () => "in"),
  viewport: elementModelToViewport
});

export const toElementModel = ({ viewport, ...v }: Blur): ElementModel => ({
  ...v,
  ...prefixKeys("viewport", Viewport.toElementModel(viewport))
});
