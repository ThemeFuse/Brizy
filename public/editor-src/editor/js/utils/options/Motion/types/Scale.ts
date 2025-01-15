import { or, parseStrict } from "fp-utilities";
import { ElementModel } from "visual/component/Elements/Types";
import { FromElementModelGetter } from "visual/component/Options/Type";
import { mPipe, pass } from "visual/utils/fp";
import * as Num from "visual/utils/math/number";
import { callGetter } from "visual/utils/options/utils/wrap";
import { prefixKeys } from "../../utils/effects";
import * as Viewport from "./Viewport";
import { elementModelToViewport } from "./utils";
import * as Speed from "./utils/Speed";

export type Direction = "up" | "down" | "downUp" | "upDown";
const directions: { [k in Direction]: k } = {
  up: "up",
  down: "down",
  downUp: "downUp",
  upDown: "upDown"
};

export type XPosition = "left" | "center" | "right";
const xPosition: { [k in XPosition]: k } = {
  left: "left",
  center: "center",
  right: "right"
};

export type YPosition = "top" | "center" | "bottom";
const yPosition: { [k in YPosition]: k } = {
  center: "center",
  top: "top",
  bottom: "bottom"
};

export interface Scale {
  direction: Direction;
  speed: Speed.Speed;
  x: XPosition;
  y: YPosition;
  viewport: Viewport.Viewport;
}

export const isDirection = (v: unknown): v is Direction =>
  Object.values(directions).includes(v as Direction);

export const isXPosition = (v: unknown): v is XPosition =>
  Object.values(xPosition).includes(v as XPosition);

export const isYPosition = (v: unknown): v is YPosition =>
  Object.values(yPosition).includes(v as YPosition);

export const fromElementModel = parseStrict<FromElementModelGetter, Scale>({
  speed: or(mPipe(callGetter("speed"), Num.read, Speed.fromNumber), () => -10),
  direction: or(mPipe(callGetter("direction"), pass(isDirection)), () => "up"),
  x: or(mPipe(callGetter("x"), pass(isXPosition)), () => "center"),
  y: or(mPipe(callGetter("y"), pass(isYPosition)), () => "center"),
  viewport: elementModelToViewport
});

export const toElementModel = ({ viewport, ...v }: Scale): ElementModel => ({
  ...v,
  ...prefixKeys("viewport", Viewport.toElementModel(viewport))
});
