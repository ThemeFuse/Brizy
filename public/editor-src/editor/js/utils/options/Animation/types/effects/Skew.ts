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
  brzSkew = "brzSkew",
  brzSkewForward = "brzSkewForward",
  brzSkewBackward = "brzSkewBackward"
}

export interface Skew extends BaseEffect.BaseEffect<EffectType.Skew> {
  direction: Direction;
}

export const directionFromLegacyEffectType = (
  v: LegacyEffectType
): Direction | undefined => {
  switch (v) {
    case LegacyEffectType.brzSkew:
      return Direction.brzSkew;
    case LegacyEffectType.brzSkewForward:
      return Direction.brzSkewForward;
    case LegacyEffectType.brzSkewBackward:
      return Direction.brzSkewBackward;
    default:
      return undefined;
  }
};

export const fromLegacyModel = Parse.readWithParser<LegacyModel, Skew>({
  type: mPipe(
    prop("name"),
    ET.fromLegacyEffectType,
    pass(isEffect(EffectType.Skew))
  ),
  direction: Parse.or([
    mPipe(prop("name"), directionFromLegacyEffectType),
    (): Direction.brzSkew => Direction.brzSkew
  ]),
  duration: BaseEffect.durationFromLegacyModel,
  delay: BaseEffect.delayFromLegacyModel,
  infiniteAnimation: BaseEffect.infiniteAnimationFromLegacyModel
});

export const toLegacyEffectType = (v: Skew): LegacyEffectType => {
  switch (v.direction) {
    case Direction.brzSkew:
      return LegacyEffectType.brzSkew;
    case Direction.brzSkewForward:
      return LegacyEffectType.brzSkewForward;
    case Direction.brzSkewBackward:
      return LegacyEffectType.brzSkewBackward;
  }
};

export const toLegacyModel = (v: Skew): LegacyModel => ({
  name: toLegacyEffectType(v),
  duration: v.duration,
  delay: v.delay,
  infiniteAnimation: v.infiniteAnimation
});

export const getDirectionTitle = (v: Direction): string => {
  switch (v) {
    case Direction.brzSkew:
      return t("Skew");
    case Direction.brzSkewForward:
      return t("Skew Forward");
    case Direction.brzSkewBackward:
      return t("Skew Backward");
  }
};
