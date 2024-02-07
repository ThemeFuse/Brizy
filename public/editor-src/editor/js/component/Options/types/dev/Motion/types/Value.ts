import { mPipe, parseStrict, pass } from "fp-utilities";
import {
  FromElementModelGetter,
  callGetter
} from "visual/component/Options/Type";
import { optional } from "visual/utils/reader/readWithParser";
import { isEnabled } from "../utils";
import * as Blur from "./Blur";
import * as Horizontal from "./Horizontal";
import * as MouseTilt from "./MouseTilt";
import * as MouseTrack from "./MouseTrack";
import * as Rotate from "./Rotate";
import * as Scale from "./Scale";
import * as Transparency from "./Transparency";
import * as Vertical from "./Vertical";
import { wrap } from "./utils";

export type Effect = Exclude<keyof Value, "active">;

export type EffectValue<E extends Effect> = Exclude<Value[E], undefined>;

export const effects = [
  "vertical",
  "horizontal",
  "transparency",
  "blur",
  "rotate",
  "scale",
  "mouseTrack",
  "mouseTilt"
] as Effect[];

export const isActive = (v: unknown): v is Effect =>
  effects.includes(v as Effect);

export type Value = Partial<{
  active: Effect;
  vertical: Vertical.Vertical;
  horizontal: Horizontal.Horizontal;
  transparency: Transparency.Transparency;
  blur: Blur.Blur;
  rotate: Rotate.Rotate;
  scale: Scale.Scale;
  mouseTrack: MouseTrack.MouseTrack;
  mouseTilt: MouseTilt.MouseTilt;
}>;

export const fromElementModel = parseStrict<FromElementModelGetter, Value>({
  active: optional(mPipe(callGetter("active"), pass(isActive))),
  vertical: optional(
    mPipe(wrap("vertical"), pass(isEnabled), Vertical.fromElementModel)
  ),
  horizontal: optional(
    mPipe(wrap("horizontal"), pass(isEnabled), Horizontal.fromElementModel)
  ),
  transparency: optional(
    mPipe(wrap("transparency"), pass(isEnabled), Transparency.fromElementModel)
  ),
  blur: optional(mPipe(wrap("blur"), pass(isEnabled), Blur.fromElementModel)),
  rotate: optional(
    mPipe(wrap("rotate"), pass(isEnabled), Rotate.fromElementModel)
  ),
  scale: optional(
    mPipe(wrap("scale"), pass(isEnabled), Scale.fromElementModel)
  ),
  mouseTrack: optional(
    mPipe(wrap("mouseTrack"), pass(isEnabled), MouseTrack.fromElementModel)
  ),
  mouseTilt: optional(
    mPipe(wrap("mouseTilt"), pass(isEnabled), MouseTilt.fromElementModel)
  )
});
