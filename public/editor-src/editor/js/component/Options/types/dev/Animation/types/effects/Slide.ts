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
  down = "down",
  right = "right",
  up = "up",
  left = "left"
}

export interface Slide extends BaseEffect.BaseEffect<EffectType.Slide> {
  direction: Direction;
}

export const directionFromLegacyEffectType = (
  v: LegacyEffectType
): Direction | undefined => {
  switch (v) {
    case LegacyEffectType.slideInDown:
      return Direction.down;
    case LegacyEffectType.slideInRight:
      return Direction.right;
    case LegacyEffectType.slideInUp:
      return Direction.up;
    case LegacyEffectType.slideInLeft:
      return Direction.left;
    default:
      return undefined;
  }
};

export const fromLegacyModel = Parse.readWithParser<LegacyModel, Slide>({
  type: mPipe(
    prop("name"),
    ET.fromLegacyEffectType,
    pass(isEffect(EffectType.Slide))
  ),
  direction: Parse.or([
    mPipe(prop("name"), directionFromLegacyEffectType),
    (): Direction.up => Direction.up
  ]),
  duration: BaseEffect.durationFromLegacyModel,
  delay: BaseEffect.delayFromLegacyModel,
  infiniteAnimation: BaseEffect.infiniteAnimationFromLegacyModel
});
export const toLegacyEffectType = (v: Slide): LegacyEffectType => {
  switch (v.direction) {
    case Direction.left:
      return LegacyEffectType.slideInLeft;
    case Direction.down:
      return LegacyEffectType.slideInDown;
    case Direction.right:
      return LegacyEffectType.slideInRight;
    case Direction.up:
      return LegacyEffectType.slideInUp;
  }
};

export const toLegacyModel = (v: Slide): LegacyModel => ({
  name: toLegacyEffectType(v),
  duration: v.duration,
  delay: v.delay,
  infiniteAnimation: v.infiniteAnimation
});

export const getDirectionTitle = (v: Direction): string => {
  switch (v) {
    case Direction.up:
      return t("Up");
    case Direction.right:
      return t("Right");
    case Direction.down:
      return t("Down");
    case Direction.left:
      return t("Left");
  }
};
