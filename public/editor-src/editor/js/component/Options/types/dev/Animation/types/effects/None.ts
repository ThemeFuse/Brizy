import { readWithParser } from "visual/utils/reader/readWithParser";
import { mPipe, pass } from "visual/utils/fp";
import * as ET from "../EffectType";
import { EffectType } from "../EffectType";
import { LegacyEffectType } from "../LegacyEffectType";
import { BaseEffect } from "../BaseEffect";
import { isEffect } from "../EffectType";
import { LegacyModel } from "../LegacyModel";

export type None = BaseEffect<EffectType.None>;

export const fromLegacyModel = readWithParser<LegacyModel, None>({
  type: mPipe(
    (v: LegacyModel) => v.name,
    ET.fromLegacyEffectType,
    pass(isEffect(EffectType.None))
  ),
  duration: v => v.duration,
  delay: v => v.delay
});

export const toLegacyModel = (v: None): LegacyModel => ({
  name: LegacyEffectType.none,
  duration: v.duration,
  delay: v.delay
});
