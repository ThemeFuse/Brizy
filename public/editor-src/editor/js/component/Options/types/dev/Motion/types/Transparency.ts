import { or, parseStrict, mPipe, pass } from "fp-utilities";
import * as Unit from "visual/utils/math/Unit";
import * as Viewport from "./Viewport";
import {
  callGetter,
  FromElementModelGetter
} from "visual/component/Options/Type";
import { prefixKeys } from "../utils";
import { elementModelToLevel, elementModelToViewport } from "./utils";
import { ElementModel } from "visual/component/Elements/Types";

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
