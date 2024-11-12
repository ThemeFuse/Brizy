import { Effect, EffectsWithAnchor, EffectValueWithAnchor } from "./Value";

export enum Type {
  active = "active",
  enable = "enable",
  effect = "effect",
  multiple = "multiple"
}

export type Active = {
  type: Type.active;
  active: Effect | undefined;
};

export type Enable = {
  type: Type.enable;
  effect: Effect;
  value: boolean;
  active: boolean;
};

export type Eff<E extends EffectsWithAnchor> = {
  type: Type.effect;
  effect: E;
  value: EffectValueWithAnchor<E>;
};

export type Multiple = {
  [key: string]: unknown;
  active: Effect | undefined;
  type: Type.multiple;
};

export type Patch = Active | Enable | Eff<EffectsWithAnchor> | Multiple;
