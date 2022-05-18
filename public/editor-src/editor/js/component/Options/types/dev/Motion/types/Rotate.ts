import { or, parseStrict, mPipe, pass } from "fp-utilities";
import * as Unit from "visual/utils/math/Unit";
import * as Viewport from "./Viewport";
import {
  callGetter,
  FromElementModelGetter
} from "visual/component/Options/Type";
import { prefixKeys } from "../utils";
import { elementModelToSpeed, elementModelToViewport } from "./utils";
import { ElementModel } from "visual/component/Elements/Types";

export interface Rotate {
  direction: "left" | "right";
  x: "left" | "center" | "right";
  y: "top" | "center" | "bottom";
  speed: Unit.Unit;
  viewport: Viewport.Viewport;
}

export const isDirection = (v: unknown): v is Rotate["direction"] =>
  ["left", "right"].includes(v as Rotate["direction"]);

export const isX = (v: unknown): v is Rotate["x"] =>
  ["left", "center", "right"].includes(v as Rotate["x"]);

export const isY = (v: unknown): v is Rotate["y"] =>
  ["top", "center", "bottom"].includes(v as Rotate["y"]);

export const fromElementModel = parseStrict<FromElementModelGetter, Rotate>({
  speed: elementModelToSpeed,
  direction: or(
    mPipe(callGetter("direction"), pass(isDirection)),
    () => "left"
  ),
  x: or(mPipe(callGetter("x"), pass(isX)), () => "center"),
  y: or(mPipe(callGetter("y"), pass(isY)), () => "center"),
  viewport: elementModelToViewport
});

export const toElementModel = ({ viewport, ...v }: Rotate): ElementModel => ({
  ...v,
  ...prefixKeys("viewport", Viewport.toElementModel(viewport))
});
