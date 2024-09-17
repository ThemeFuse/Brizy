import * as AnchorPoint from "./AnchorPoint";
import * as Flip from "./Flip";
import * as Offset from "./Offset";
import * as Rotate from "./Rotate";
import * as Scale from "./Scale";
import * as Skew from "./Skew";

export type EffectsWithAnchor = Exclude<keyof Value, "active">;

export type EffectValue<E extends EffectsWithAnchor> = Exclude<
  Value[E],
  undefined
>;

export type EffectValueWithAnchor<E extends EffectsWithAnchor> = Exclude<
  Value[E],
  undefined
>;

export type Effect = Exclude<keyof Value, "active" | "anchorPoint">;

export type ValuePartial = Partial<{
  active: Effect;
  rotate: Rotate.Rotate;
  offset: Offset.Offset;
  skew: Skew.Skew;
  scale: Scale.Scale;
  flip: Flip.Flip;
}>;

export interface Value extends ValuePartial {
  anchorPoint: AnchorPoint.AnchorPoint;
}
