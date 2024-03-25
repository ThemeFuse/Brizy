import { mPipe, pass } from "visual/utils/fp";
import { readWithParser } from "visual/utils/reader/readWithParser";
import { BaseEffect } from "../BaseEffect";
import * as ET from "../EffectType";
import { EffectType, isEffect } from "../EffectType";
import { LegacyEffectType } from "../LegacyEffectType";
import { LegacyModel } from "../LegacyModel";

export type None = BaseEffect<EffectType.None>;

export const fromLegacyModel = readWithParser<LegacyModel, None>({
  type: mPipe(
    (v: LegacyModel) => v.name,
    ET.fromLegacyEffectType,
    pass(isEffect(EffectType.None))
  ),
  duration: v => v.duration,
  delay: v => v.delay,
  infiniteAnimation: v => v.infiniteAnimation
});

export const toLegacyModel = (v: None): LegacyModel => ({
  name: LegacyEffectType.none,
  duration: v.duration,
  delay: v.delay,
  infiniteAnimation: v.infiniteAnimation
});
