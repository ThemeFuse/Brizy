import { mPipe, pass } from "fp-utilities";
import * as Vertical from "./Vertical";
import * as Horizontal from "./Horizontal";
import * as Transparency from "./Transparency";
import * as Blur from "./Blur";
import * as Rotate from "./Rotate";
import * as Scale from "./Scale";
import * as MouseTrack from "./MouseTrack";
import * as MouseTilt from "./MouseTilt";
import { optional, parseStrict } from "visual/utils/reader/readWithParser";
import {
  callGetter,
  FromElementModelGetter
} from "visual/component/Options/Type";
import { isEnabled } from "../utils";
import { wrap } from "./utils";
import * as Unit from "visual/utils/math/Unit";
import * as Viewport from "visual/component/Options/types/dev/Motion/types/Viewport";

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

export const defaultValue: Value = {
  active: undefined,
  blur: {
    direction: "in",
    level: Unit.Min,
    viewport: Viewport.unsafe(Unit.Min, Unit.Max)
  },
  horizontal: {
    direction: "left",
    speed: Unit.Min,
    viewport: Viewport.unsafe(Unit.Min, Unit.Max)
  },
  mouseTrack: {
    direction: "direct",
    speed: Unit.Min
  },
  rotate: {
    direction: "left",
    speed: Unit.Min,
    x: "center",
    y: "center",
    viewport: Viewport.unsafe(Unit.Min, Unit.Max)
  },
  scale: {
    direction: "up",
    speed: -10,
    x: "center",
    y: "center",
    viewport: Viewport.unsafe(Unit.Min, Unit.Max)
  },
  mouseTilt: {
    direction: "direct",
    speed: Unit.Min
  },
  transparency: {
    direction: "in",
    level: Unit.Min,
    viewport: Viewport.unsafe(Unit.Min, Unit.Max)
  },
  vertical: {
    direction: "up",
    speed: Unit.Min,
    viewport: Viewport.unsafe(Unit.Min, Unit.Max)
  }
};

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
