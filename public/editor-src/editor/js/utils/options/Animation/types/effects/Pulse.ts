import { mPipe, pass } from "visual/utils/fp";
import { t } from "visual/utils/i18n";
import { prop } from "visual/utils/object/get";
import * as Parse from "visual/utils/reader/readWithParser";
import * as BaseEffect from "../BaseEffect";
import * as ET from "../EffectType";
import { EffectType, isEffect } from "../EffectType";
import { LegacyEffectType } from "../LegacyEffectType";
import { LegacyModel } from "../LegacyModel";

export enum Direction {
  brzPulse = "brzPulse",
  brzPulseGrow = "brzPulseGrow",
  brzPulseShrink = "brzPulseShrink"
}

export interface Pulse extends BaseEffect.BaseEffect<EffectType.Pulse> {
  direction: Direction;
}

export const directionFromLegacyEffectType = (
  v: LegacyEffectType
): Direction | undefined => {
  switch (v) {
    case LegacyEffectType.brzPulse:
      return Direction.brzPulse;
    case LegacyEffectType.brzPulseGrow:
      return Direction.brzPulseGrow;
    case LegacyEffectType.brzPulseShrink:
      return Direction.brzPulseShrink;
    default:
      return undefined;
  }
};

export const fromLegacyModel = Parse.readWithParser<LegacyModel, Pulse>({
  type: mPipe(
    prop("name"),
    ET.fromLegacyEffectType,
    pass(isEffect(EffectType.Pulse))
  ),
  direction: Parse.or([
    mPipe(prop("name"), directionFromLegacyEffectType),
    (): Direction.brzPulse => Direction.brzPulse
  ]),
  duration: BaseEffect.durationFromLegacyModel,
  delay: BaseEffect.delayFromLegacyModel,
  infiniteAnimation: BaseEffect.infiniteAnimationFromLegacyModel
});

export const toLegacyEffectType = (v: Pulse): LegacyEffectType => {
  switch (v.direction) {
    case Direction.brzPulse:
      return LegacyEffectType.brzPulse;
    case Direction.brzPulseGrow:
      return LegacyEffectType.brzPulseGrow;
    case Direction.brzPulseShrink:
      return LegacyEffectType.brzPulseShrink;
  }
};

export const toLegacyModel = (v: Pulse): LegacyModel => ({
  name: toLegacyEffectType(v),
  duration: v.duration,
  delay: v.delay,
  infiniteAnimation: v.infiniteAnimation
});

export const getDirectionTitle = (v: Direction): string => {
  switch (v) {
    case Direction.brzPulse:
      return t("Pulse");
    case Direction.brzPulseGrow:
      return t("Pulse Grow");
    case Direction.brzPulseShrink:
      return t("Pulse Shrink");
  }
};
