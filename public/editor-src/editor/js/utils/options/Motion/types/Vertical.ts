import { mPipe, or, parseStrict, pass } from "fp-utilities";
import { ElementModel } from "visual/component/Elements/Types";
import { FromElementModelGetter } from "visual/component/Options/Type";
import * as Unit from "visual/utils/math/Unit";
import { callGetter } from "visual/utils/options/utils/wrap";
import { prefixKeys } from "../../utils/effects";
import * as Viewport from "./Viewport";
import { elementModelToSpeed, elementModelToViewport } from "./utils";

export interface Vertical {
  speed: Unit.Unit;
  direction: "up" | "down";
  viewport: Viewport.Viewport;
}

export const isDirection = (v: unknown): v is Vertical["direction"] =>
  v === "up" || v === "down";

export const fromElementModel = parseStrict<FromElementModelGetter, Vertical>({
  speed: elementModelToSpeed,
  direction: or(mPipe(callGetter("direction"), pass(isDirection)), () => "up"),
  viewport: elementModelToViewport
});

export const toElementModel = ({ viewport, ...v }: Vertical): ElementModel => ({
  ...v,
  ...prefixKeys("viewport", Viewport.toElementModel(viewport))
});
