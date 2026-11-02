import { mPipe, or, parseStrict, pass } from "fp-utilities";
import type { ElementModel } from "visual/component/Elements/Types";
import type { FromElementModelGetter } from "visual/component/Options/Type";
import type * as Unit from "visual/utils/math/Unit";
import { callGetter } from "visual/utils/options/utils/wrap";
import { prefixKeys } from "../../utils/effects";
import { elementModelToSpeed, elementModelToViewport } from "./utils";
import * as Viewport from "./Viewport";

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
