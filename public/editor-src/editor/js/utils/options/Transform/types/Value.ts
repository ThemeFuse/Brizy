import * as Rotate from "./Rotate";

export type Effect = Exclude<keyof Value, "active">;

export type EffectValue<E extends Effect> = Exclude<Value[E], undefined>;

export const effects: Effect[] = ["rotate"];

export const isActive = (v: unknown): v is Effect =>
  effects.includes(v as Effect);

export type Value = Partial<{
  active: Effect;
  rotate: Rotate.Rotate;
}>;
