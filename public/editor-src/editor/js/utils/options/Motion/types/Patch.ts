import { ElementModel } from "visual/component/Elements/Types";
import { Type } from "../../utils/effects";
import { Effect, EffectValue } from "./Value";

export type Active = {
  type: Type.active;
  active: Effect | undefined;
};

export const active = (active: Effect | undefined): Active => ({
  type: Type.active,
  active
});

export type Enable = {
  type: Type.enable;
  effect: Effect;
  value: boolean;
  active: boolean;
};

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

export type Eff<E extends Effect> = {
  type: Type.effect;
  effect: E;
  value: EffectValue<E>;
};

export const eff = <E extends Effect>(
  effect: E,
  value: EffectValue<E>
): Eff<E> => ({
  type: Type.effect,
  effect,
  value
});

export type Multiple = {
  value: Record<Effect, EffectValue<Effect>>;
  active: Effect | undefined;
  type: Type.multiple;
};

export type Patch = Active | Enable | Eff<Effect> | Multiple;

export const isMouseEffect = (e: Effect): e is "mouseTrack" | "mouseTilt" =>
  e === "mouseTilt" || e === "mouseTrack";

export const disableEffects = (e: Effect): ElementModel => {
  return isMouseEffect(e)
    ? {
        verticalEnabled: false,
        horizontalEnabled: false,
        transparencyEnabled: false,
        blurEnabled: false,
        rotateEnabled: false,
        scaleEnabled: false
      }
    : {
        mouseTrackEnabled: false,
        mouseTiltEnabled: false
      };
};
