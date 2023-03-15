import { Effect, EffectValue } from "./Value";

export enum Type {
  active = "active",
  enable = "enable",
  effect = "effect"
}

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

export type Patch = Active | Enable | Eff<Effect>;
