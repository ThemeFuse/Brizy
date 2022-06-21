import { OnChange } from "visual/component/Options/Type";
import { pipe } from "visual/utils/fp";
import { EffectType } from "./types/EffectType";
import { Value } from "./types/Value";
import { setDirection, WithDirection } from "./types/WithDirection";
import * as Attention from "./types/effects/Attention";
import * as Bounce from "./types/effects/Bounce";
import * as Fade from "./types/effects/Fade";
import * as Rotate from "./types/effects/Rotate";
import * as Slide from "./types/effects/Slide";
import * as Zoom from "./types/effects/Zoom";
import { MValue } from "visual/utils/value";
import { Literal } from "visual/utils/types/Literal";
import { LegacyEffectType } from "./types/LegacyEffectType";

type GetDirection<T extends EffectType> = T extends Value["type"]
  ? T extends WithDirection<never>
    ? T["direction"]
    : never
  : never;

export type Get = (k: string) => MValue<Literal>;
export const call = (k: string) => (get: Get): MValue<Literal> => get(k);

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
      return Object.values(Bounce.Direction).map(k => [
        k as GetDirection<T>,
        Bounce.getDirectionTitle(k)
      ]);
    case EffectType.Fade:
    case EffectType.Fade2:
      return Object.values(Fade.Direction).map(k => [
        k as GetDirection<T>,
        Fade.getDirectionTitle(k)
      ]);
    case EffectType.Rotate:
      return Object.values(Rotate.Direction).map(k => [
        k as GetDirection<T>,
        Rotate.getDirectionTitle(k)
      ]);
    case EffectType.Slide:
      return Object.values(Slide.Direction).map(k => [
        k as GetDirection<T>,
        Slide.getDirectionTitle(k)
      ]);
    case EffectType.Zoom:
      return Object.values(Zoom.Direction).map(k => [
        k as GetDirection<T>,
        Zoom.getDirectionTitle(k)
      ]);
    case EffectType.Zoom2:
      return [Zoom.Direction.none].map(k => [
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
      return types.includes(value.type) ? value.type : EffectType.None;
  }
};

export const getAttentionStyles = (v: EffectType): Attention.Style[] => {
  switch (v) {
    case EffectType.Attention:
      return Attention.styles;
    case EffectType.Attention2:
      return [LegacyEffectType.flash, LegacyEffectType.pulse];
    case EffectType.Slide:
    case EffectType.Rotate:
    case EffectType.None:
    case EffectType.Fade:
    case EffectType.Bounce:
    case EffectType.Fade2:
    case EffectType.Zoom2:
    case EffectType.Zoom:
      return [];
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
