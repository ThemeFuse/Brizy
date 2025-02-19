import {
  FromElementModelGetterValue,
  OnChange
} from "visual/component/Options/Type";
import { pipe } from "visual/utils/fp";
import { EffectType } from "./types/EffectType";
import { LegacyEffectType } from "./types/LegacyEffectType";
import { Value } from "./types/Value";
import { WithDirection, setDirection } from "./types/WithDirection";
import * as Bounce from "./types/effects/Bounce";
import * as Buzz from "./types/effects/Buzz";
import * as Fade from "./types/effects/Fade";
import * as Fill from "./types/effects/Fill";
import * as Move from "./types/effects/Move";
import * as Pulse from "./types/effects/Pulse";
import * as Rotate from "./types/effects/Rotate";
import * as Rotate2 from "./types/effects/Rotate2";
import * as Scale from "./types/effects/Scale";
import * as Skew from "./types/effects/Skew";
import * as Slide from "./types/effects/Slide";
import * as Wobble from "./types/effects/Wobble";
import * as Zoom from "./types/effects/Zoom";

type GetDirection<T extends EffectType> = T extends Value["type"]
  ? T extends WithDirection<never>
    ? T["direction"]
    : never
  : never;

export type Get = (k: string) => FromElementModelGetterValue;
export const call =
  (k: string) =>
  (get: Get): FromElementModelGetterValue =>
    get(k);

export const onChangeDirection = <V extends WithDirection<unknown>>(
  v: V,
  onChange: OnChange<V>
): OnChange<V["direction"]> =>
  pipe((d: V["direction"]) => setDirection(d, v), onChange);

export function getDirections<T extends EffectType>(
  type: T
): Array<[GetDirection<T>, string]> {
  switch (type as EffectType) {
    case EffectType.Bounce:
      return Object.values(Bounce.Direction).map((k) => [
        k as GetDirection<T>,
        Bounce.getDirectionTitle(k)
      ]);
    case EffectType.Fill: {
      return Object.values(Fill.Direction).map((k) => [
        k as GetDirection<T>,
        Fill.getDirectionTitle(k)
      ]);
    }
    case EffectType.Fade:
    case EffectType.Fade2:
      return Object.values(Fade.Direction).map((k) => [
        k as GetDirection<T>,
        Fade.getDirectionTitle(k)
      ]);
    case EffectType.Rotate:
      return Object.values(Rotate.Direction).map((k) => [
        k as GetDirection<T>,
        Rotate.getDirectionTitle(k)
      ]);
    case EffectType.Slide:
      return Object.values(Slide.Direction).map((k) => [
        k as GetDirection<T>,
        Slide.getDirectionTitle(k)
      ]);
    case EffectType.Zoom:
      return Object.values(Zoom.Direction).map((k) => [
        k as GetDirection<T>,
        Zoom.getDirectionTitle(k)
      ]);
    case EffectType.Buzz:
      return Object.values(Buzz.Direction).map((k) => [
        k as GetDirection<T>,
        Buzz.getDirectionTitle(k)
      ]);
    case EffectType.Pulse:
      return Object.values(Pulse.Direction).map((k) => [
        k as GetDirection<T>,
        Pulse.getDirectionTitle(k)
      ]);
    case EffectType.Scale:
      return Object.values(Scale.Direction).map((k) => [
        k as GetDirection<T>,
        Scale.getDirectionTitle(k)
      ]);
    case EffectType.Wobble:
      return Object.values(Wobble.Direction).map((k) => [
        k as GetDirection<T>,
        Wobble.getDirectionTitle(k)
      ]);
    case EffectType.Move:
      return Object.values(Move.Direction).map((k) => [
        k as GetDirection<T>,
        Move.getDirectionTitle(k)
      ]);
    case EffectType.Skew:
      return Object.values(Skew.Direction).map((k) => [
        k as GetDirection<T>,
        Skew.getDirectionTitle(k)
      ]);
    case EffectType.Rotate2:
      return Object.values(Rotate2.Direction).map((k) => [
        k as GetDirection<T>,
        Rotate2.getDirectionTitle(k)
      ]);
    case EffectType.Zoom2:
      return [Zoom.Direction.none].map((k) => [
        k as GetDirection<T>,
        Zoom.getDirectionTitle(k)
      ]);
    case EffectType.None:
    case EffectType.Attention:
    case EffectType.Attention2:
      return [];
  }
}

export const valueToType = (types: EffectType[], value: Value): EffectType => {
  switch (value.type) {
    case EffectType.Attention:
      return types.includes(EffectType.Attention)
        ? EffectType.Attention
        : types.includes(EffectType.Attention2)
          ? EffectType.Attention2
          : EffectType.None;
    case EffectType.Fade:
      return types.includes(EffectType.Fade)
        ? EffectType.Fade
        : types.includes(EffectType.Fade2)
          ? EffectType.Fade2
          : EffectType.None;
    case EffectType.Zoom:
      return types.includes(EffectType.Zoom)
        ? EffectType.Zoom
        : types.includes(EffectType.Zoom2)
          ? EffectType.Zoom2
          : EffectType.None;
    case EffectType.None:
    case EffectType.Rotate:
    case EffectType.Slide:
    case EffectType.Bounce:
    case EffectType.Buzz:
    case EffectType.Pulse:
    case EffectType.Skew:
    case EffectType.Fill:
    case EffectType.Scale:
    case EffectType.Rotate2:
    case EffectType.Move:
    case EffectType.Wobble:
      return types.includes(value.type) ? value.type : EffectType.None;
  }
};

export const defaultEffects: EffectType[] = [
  EffectType.Bounce,
  EffectType.Fade,
  EffectType.Rotate,
  EffectType.Slide,
  EffectType.Zoom,
  EffectType.Attention
];

export const tabEffects: EffectType[] = [
  EffectType.Fade2,
  EffectType.Zoom2,
  EffectType.Attention2
];

export const hoverEffects: EffectType[] = [
  EffectType.Wobble,
  EffectType.Pulse,
  EffectType.Buzz,
  EffectType.Skew,
  EffectType.Scale,
  EffectType.Move,
  EffectType.Rotate2
];

export const buttonHoverEffects: EffectType[] = [
  ...hoverEffects,
  EffectType.Fill
];

export const buttonHoverAnimations: string[] = [
  LegacyEffectType.brzFade,
  LegacyEffectType.brzBackPulse,
  LegacyEffectType.brzSweepToRight,
  LegacyEffectType.brzSweepToLeft,
  LegacyEffectType.brzSweepToBottom,
  LegacyEffectType.brzSweepToTop,
  LegacyEffectType.brzBounceToRight,
  LegacyEffectType.brzBounceToLeft,
  LegacyEffectType.brzBounceToBottom,
  LegacyEffectType.brzBounceToTop,
  LegacyEffectType.brzRadialOut,
  LegacyEffectType.brzRadialIn,
  LegacyEffectType.brzRectangleIn,
  LegacyEffectType.brzRectangleOut,
  LegacyEffectType.brzShutterInHorizontal,
  LegacyEffectType.brzShutterOutHorizontal,
  LegacyEffectType.brzShutterInVertical,
  LegacyEffectType.brzShutterOutVertical
];

export const buttonHoverInAnimations: string[] = [
  LegacyEffectType.brzRadialIn,
  LegacyEffectType.brzRectangleIn,
  LegacyEffectType.brzShutterInHorizontal,
  LegacyEffectType.brzShutterInVertical
];
