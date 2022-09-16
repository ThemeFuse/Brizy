import * as Parse from "visual/utils/reader/readWithParser";
import * as Attention from "./effects/Attention";
import * as Bounce from "./effects/Bounce";
import * as Fade from "./effects/Fade";
import * as None from "./effects/None";
import * as Rotate from "./effects/Rotate";
import * as Slide from "./effects/Slide";
import * as Zoom from "./effects/Zoom";
import { EffectType } from "./EffectType";
import { LegacyEffectType } from "./LegacyEffectType";
import { LegacyModel } from "./LegacyModel";

export type Value =
  | Attention.Attention
  | None.None
  | Bounce.Bounce
  | Fade.Fade
  | Rotate.Rotate
  | Slide.Slide
  | Zoom.Zoom;

export const isNone = (v: Value): v is None.None => v.type === EffectType.None;

export const isEffect = (v: Value): v is Exclude<Value, None.None> =>
  !isNone(v);

export const fromLegacyModel = Parse.or<LegacyModel, Value>([
  Attention.fromLegacyModel,
  None.fromLegacyModel,
  Bounce.fromLegacyModel,
  Fade.fromLegacyModel,
  Rotate.fromLegacyModel,
  Slide.fromLegacyModel,
  Zoom.fromLegacyModel
]);

export const toLegacyModel = (v: Value): LegacyModel => {
  switch (v.type) {
    case EffectType.Attention:
      return Attention.toLegacyModel(v);
    case EffectType.None:
      return None.toLegacyModel(v);
    case EffectType.Bounce:
      return Bounce.toLegacyModel(v);
    case EffectType.Fade:
      return Fade.toLegacyModel(v);
    case EffectType.Rotate:
      return Rotate.toLegacyModel(v);
    case EffectType.Slide:
      return Slide.toLegacyModel(v);
    case EffectType.Zoom:
      return Zoom.toLegacyModel(v);
  }
};

export function setType<T extends EffectType>(
  type: T,
  v: Value
): Extract<Value, { type: T }>;
export function setType(type: EffectType, v: Value): Value {
  if (type === v.type) {
    return v;
  }

  switch (type) {
    case EffectType.Attention:
    case EffectType.Attention2:
      return {
        type: EffectType.Attention,
        style: LegacyEffectType.flash,
        duration: v.duration,
        delay: v.delay,
        infiniteAnimation: v.infiniteAnimation
      };
    case EffectType.Bounce:
      return {
        type: EffectType.Bounce,
        direction: Bounce.Direction.none,
        duration: v.duration,
        delay: v.delay,
        infiniteAnimation: v.infiniteAnimation
      };
    case EffectType.Fade:
    case EffectType.Fade2:
      return {
        type: EffectType.Fade,
        direction: Fade.Direction.none,
        big: false,
        duration: v.duration,
        delay: v.delay,
        infiniteAnimation: v.infiniteAnimation
      };
    case EffectType.None:
      return {
        type: EffectType.None,
        duration: v.duration,
        delay: v.delay,
        infiniteAnimation: v.infiniteAnimation
      };
    case EffectType.Rotate:
      return {
        type: EffectType.Rotate,
        direction: Rotate.Direction.none,
        duration: v.duration,
        delay: v.delay,
        infiniteAnimation: v.infiniteAnimation
      };
    case EffectType.Slide:
      return {
        type: EffectType.Slide,
        direction: Slide.Direction.up,
        duration: v.duration,
        delay: v.delay,
        infiniteAnimation: v.infiniteAnimation
      };
    case EffectType.Zoom:
    case EffectType.Zoom2:
      return {
        type: EffectType.Zoom,
        direction: Zoom.Direction.none,
        duration: v.duration,
        delay: v.delay,
        infiniteAnimation: v.infiniteAnimation
      };
  }
}
