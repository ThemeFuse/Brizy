import { mPipe } from "visual/utils/fp";
import * as Num from "visual/utils/math/number";
import * as Positive from "visual/utils/math/Positive";
import { EffectType } from "./EffectType";
import { LegacyModel } from "./LegacyModel";

export interface WithType<T extends EffectType> {
  type: T;
}

export interface BaseEffect<T extends EffectType> extends WithType<T> {
  duration: Positive.Positive;
  delay: Positive.Positive;
  infiniteAnimation: boolean;
}

export const durationFromLegacyModel = mPipe(
  (v: LegacyModel) => v.duration,
  Num.read,
  Positive.fromNumber
);

export const delayFromLegacyModel = mPipe(
  (v: LegacyModel) => v.delay,
  Num.read,
  Positive.fromNumber
);

export const infiniteAnimationFromLegacyModel = mPipe(
  (v: LegacyModel) => v.infiniteAnimation,
  v => Boolean(v)
);
