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
  none = "none",
  in = "in",
  down = "down",
  right = "right",
  up = "up",
  left = "left"
}

export interface Bounce extends BaseEffect.BaseEffect<EffectType.Bounce> {
  direction: Direction;
}

export const directionFromLegacyEffectType = (
  v: LegacyEffectType
): Direction | undefined => {
  switch (v) {
    case LegacyEffectType.bounce:
      return Direction.none;
    case LegacyEffectType.bounceIn:
      return Direction.in;
    case LegacyEffectType.bounceInDown:
      return Direction.down;
    case LegacyEffectType.bounceInLeft:
      return Direction.left;
    case LegacyEffectType.bounceInRight:
      return Direction.right;
    case LegacyEffectType.bounceInUp:
      return Direction.up;
    default:
      return undefined;
  }
};

export const fromLegacyModel = Parse.readWithParser<LegacyModel, Bounce>({
  type: mPipe(
    prop("name"),
    ET.fromLegacyEffectType,
    pass(isEffect(EffectType.Bounce))
  ),
  direction: Parse.or<LegacyModel, Direction>([
    mPipe(prop("name"), directionFromLegacyEffectType),
    (): Direction.none => Direction.none
  ]),
  duration: BaseEffect.durationFromLegacyModel,
  delay: BaseEffect.delayFromLegacyModel,
  infiniteAnimation: BaseEffect.infiniteAnimationFromLegacyModel
});

export const toLegacyEffectType = (v: Bounce): LegacyEffectType => {
  switch (v.direction) {
    case Direction.none:
      return LegacyEffectType.bounce;
    case Direction.in:
      return LegacyEffectType.bounceIn;
    case Direction.down:
      return LegacyEffectType.bounceInDown;
    case Direction.right:
      return LegacyEffectType.bounceInRight;
    case Direction.up:
      return LegacyEffectType.bounceInUp;
    case Direction.left:
      return LegacyEffectType.bounceInLeft;
  }
};

export const toLegacyModel = (v: Bounce): LegacyModel => ({
  name: toLegacyEffectType(v),
  duration: v.duration,
  delay: v.delay,
  infiniteAnimation: v.infiniteAnimation
});

export const getDirectionTitle = (v: Direction): string => {
  switch (v) {
    case Direction.none:
      return t("None");
    case Direction.in:
      return t("In");
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
