import { mPipe, parseStrict, pass, or } from "fp-utilities";
import * as Unit from "visual/utils/math/Unit";
import * as Viewport from "./Viewport";
import {
  callGetter,
  FromElementModelGetter
} from "visual/component/Options/Type";
import { prefixKeys } from "../utils";
import { elementModelToSpeed, elementModelToViewport } from "./utils";
import { ElementModel } from "visual/component/Elements/Types";

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
