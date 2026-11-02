import { mPipe, or, parseStrict, pass } from "fp-utilities";
import type { ElementModel } from "visual/component/Elements/Types";
import type { FromElementModelGetter } from "visual/component/Options/Type";
import type * as Unit from "visual/utils/math/Unit";
import { callGetter } from "visual/utils/options/utils/wrap";
import { prefixKeys } from "../../utils/effects";
import { elementModelToLevel, elementModelToViewport } from "./utils";
import * as Viewport from "./Viewport";

export type Direction = "in" | "out" | "outIn" | "inOut";

export interface Transparency {
  direction: Direction;
  level: Unit.Unit;
  viewport: Viewport.Viewport;
}

export const isDirection = (v: unknown): v is Transparency["direction"] =>
  v === "in" || v === "out";

export const fromElementModel = parseStrict<
  FromElementModelGetter,
  Transparency
>({
  level: elementModelToLevel,
  direction: or(mPipe(callGetter("direction"), pass(isDirection)), () => "in"),
  viewport: elementModelToViewport
});

export const toElementModel = ({
  viewport,
  ...v
}: Transparency): ElementModel => ({
  ...v,
  ...prefixKeys("viewport", Viewport.toElementModel(viewport))
});
