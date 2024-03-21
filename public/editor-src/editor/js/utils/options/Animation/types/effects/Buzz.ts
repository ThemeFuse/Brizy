import { mPipe, pass } from "visual/utils/fp";
import { t } from "visual/utils/i18n";
import { prop } from "visual/utils/object/get";
import * as Parse from "visual/utils/reader/readWithParser";
import * as BaseEffect from "../BaseEffect";
import { isEffect } from "../EffectType";
import * as ET from "../EffectType";
import { EffectType } from "../EffectType";
import { LegacyEffectType } from "../LegacyEffectType";
import { LegacyModel } from "../LegacyModel";

export enum Direction {
  brzBuzz = "brzBuzz",
  brzBuzzOut = "brzBuzzOut"
}

export interface Buzz extends BaseEffect.BaseEffect<EffectType.Buzz> {
  direction: Direction;
}

export const directionFromLegacyEffectType = (
  v: LegacyEffectType
): Direction | undefined => {
  switch (v) {
    case LegacyEffectType.brzBuzz:
      return Direction.brzBuzz;
    case LegacyEffectType.brzBuzzOut:
      return Direction.brzBuzzOut;
    default:
      return undefined;
  }
};

export const fromLegacyModel = Parse.readWithParser<LegacyModel, Buzz>({
  type: mPipe(
    prop("name"),
    ET.fromLegacyEffectType,
    pass(isEffect(EffectType.Buzz))
  ),
  direction: Parse.or([
    mPipe(prop("name"), directionFromLegacyEffectType),
    (): Direction.brzBuzz => Direction.brzBuzz
  ]),
  duration: BaseEffect.durationFromLegacyModel,
  delay: BaseEffect.delayFromLegacyModel,
  infiniteAnimation: BaseEffect.infiniteAnimationFromLegacyModel
});

export const toLegacyEffectType = (v: Buzz): LegacyEffectType => {
  switch (v.direction) {
    case Direction.brzBuzz:
      return LegacyEffectType.brzBuzz;
    case Direction.brzBuzzOut:
      return LegacyEffectType.brzBuzzOut;
  }
};

export const toLegacyModel = (v: Buzz): LegacyModel => ({
  name: toLegacyEffectType(v),
  duration: v.duration,
  delay: v.delay,
  infiniteAnimation: v.infiniteAnimation
});

export const getDirectionTitle = (v: Direction): string => {
  switch (v) {
    case Direction.brzBuzz:
      return t("Buzz");
    case Direction.brzBuzzOut:
      return t("Buzz Out");
  }
};
