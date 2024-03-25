import { mPipe, pass } from "visual/utils/fp";
import { isEffect } from "../EffectType";
import * as ET from "../EffectType";
import { EffectType } from "../EffectType";
import { LegacyEffectType } from "../LegacyEffectType";
import * as BaseEffect from "../BaseEffect";
import * as Parse from "visual/utils/reader/readWithParser";
import { LegacyModel } from "../LegacyModel";
import { prop } from "visual/utils/object/get";
import { t } from "visual/utils/i18n";

export enum Direction {
  brzRotate = "brzRotate",
  brzGrowRotate = "brzGrowRotate"
}

export interface Rotate2 extends BaseEffect.BaseEffect<EffectType.Rotate2> {
  direction: Direction;
}

export const directionFromLegacyEffectType = (
  v: LegacyEffectType
): Direction | undefined => {
  switch (v) {
    case LegacyEffectType.brzRotate:
      return Direction.brzRotate;
    case LegacyEffectType.brzGrowRotate:
      return Direction.brzGrowRotate;
    default:
      return undefined;
  }
};

export const fromLegacyModel = Parse.readWithParser<LegacyModel, Rotate2>({
  type: mPipe(
    prop("name"),
    ET.fromLegacyEffectType,
    pass(isEffect(EffectType.Rotate2))
  ),
  direction: Parse.or([
    mPipe(prop("name"), directionFromLegacyEffectType),
    (): Direction.brzRotate => Direction.brzRotate
  ]),
  duration: BaseEffect.durationFromLegacyModel,
  delay: BaseEffect.delayFromLegacyModel,
  infiniteAnimation: BaseEffect.infiniteAnimationFromLegacyModel
});

export const toLegacyEffectType = (v: Rotate2): LegacyEffectType => {
  switch (v.direction) {
    case Direction.brzRotate:
      return LegacyEffectType.brzRotate;
    case Direction.brzGrowRotate:
      return LegacyEffectType.brzGrowRotate;
  }
};

export const toLegacyModel = (v: Rotate2): LegacyModel => ({
  name: toLegacyEffectType(v),
  duration: v.duration,
  delay: v.delay,
  infiniteAnimation: v.infiniteAnimation
});

export const getDirectionTitle = (v: Direction): string => {
  switch (v) {
    case Direction.brzRotate:
      return t("Rotate");
    case Direction.brzGrowRotate:
      return t("Grow Rotate");
  }
};
