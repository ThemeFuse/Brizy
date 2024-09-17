import {
  Active,
  Eff,
  Enable,
  Type
} from "visual/component/Controls/Transform/types/Patch";
import {
  Effect,
  EffectsWithAnchor,
  EffectValueWithAnchor
} from "visual/component/Controls/Transform/types/Value";

export const active = (active: Effect | undefined): Active => ({
  type: Type.active,
  active
});

export const enable = (
  effect: Effect,
  value: boolean,
  active: boolean
): Enable => ({
  type: Type.enable,
  effect,
  value,
  active
});

export const eff = <E extends EffectsWithAnchor>(
  effect: E,
  value: EffectValueWithAnchor<E>
): Eff<E> => ({
  type: Type.effect,
  effect,
  value
});
