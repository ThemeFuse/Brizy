import * as Parse from "visual/utils/reader/readWithParser";
import { EffectType } from "./EffectType";
import { LegacyEffectType } from "./LegacyEffectType";
import { LegacyModel } from "./LegacyModel";
import * as Attention from "./effects/Attention";
import * as Bounce from "./effects/Bounce";
import * as Buzz from "./effects/Buzz";
import * as Fade from "./effects/Fade";
import * as Move from "./effects/Move";
import * as None from "./effects/None";
import * as Pulse from "./effects/Pulse";
import * as Rotate from "./effects/Rotate";
import * as Rotate2 from "./effects/Rotate2";
import * as Scale from "./effects/Scale";
import * as Skew from "./effects/Skew";
import * as Slide from "./effects/Slide";
import * as Wobble from "./effects/Wobble";
import * as Zoom from "./effects/Zoom";

export type Value =
  | Attention.Attention
  | None.None
  | Bounce.Bounce
  | Fade.Fade
  | Rotate.Rotate
  | Slide.Slide
  | Zoom.Zoom
  | Pulse.Pulse
  | Wobble.Wobble
  | Buzz.Buzz
  | Scale.Scale
  | Skew.Skew
  | Move.Move
  | Rotate2.Rotate2;

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
  Zoom.fromLegacyModel,
  Pulse.fromLegacyModel,
  Wobble.fromLegacyModel,
  Buzz.fromLegacyModel,
  Scale.fromLegacyModel,
  Skew.fromLegacyModel,
  Move.fromLegacyModel,
  Rotate2.fromLegacyModel
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
    case EffectType.Pulse:
      return Pulse.toLegacyModel(v);
    case EffectType.Wobble:
      return Wobble.toLegacyModel(v);
    case EffectType.Buzz:
      return Buzz.toLegacyModel(v);
    case EffectType.Scale:
      return Scale.toLegacyModel(v);
    case EffectType.Skew:
      return Skew.toLegacyModel(v);
    case EffectType.Move:
      return Move.toLegacyModel(v);
    case EffectType.Rotate2:
      return Rotate2.toLegacyModel(v);
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
    case EffectType.Pulse: {
      return {
        type: EffectType.Pulse,
        direction: Pulse.Direction.brzPulse,
        duration: v.duration,
        delay: v.delay,
        infiniteAnimation: v.infiniteAnimation
      };
    }
    case EffectType.Wobble: {
      return {
        type: EffectType.Wobble,
        direction: Wobble.Direction.brzWobbleBottom,
        duration: v.duration,
        delay: v.delay,
        infiniteAnimation: v.infiniteAnimation
      };
    }
    case EffectType.Skew: {
      return {
        type: EffectType.Skew,
        direction: Skew.Direction.brzSkew,
        duration: v.duration,
        delay: v.delay,
        infiniteAnimation: v.infiniteAnimation
      };
    }
    case EffectType.Move: {
      return {
        type: EffectType.Move,
        direction: Move.Direction.up,
        duration: v.duration,
        delay: v.delay,
        infiniteAnimation: v.infiniteAnimation
      };
    }
    case EffectType.Buzz: {
      return {
        type: EffectType.Buzz,
        direction: Buzz.Direction.brzBuzz,
        duration: v.duration,
        delay: v.delay,
        infiniteAnimation: v.infiniteAnimation
      };
    }
    case EffectType.Scale: {
      return {
        type: EffectType.Scale,
        direction: Scale.Direction.brzBounceIn,
        duration: v.duration,
        delay: v.delay,
        infiniteAnimation: v.infiniteAnimation
      };
    }
    case EffectType.Rotate2: {
      return {
        type: EffectType.Rotate2,
        direction: Rotate2.Direction.brzRotate,
        duration: v.duration,
        delay: v.delay,
        infiniteAnimation: v.infiniteAnimation
      };
    }
  }
}
