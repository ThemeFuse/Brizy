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
  downLeft = "downLeft",
  downRight = "downRight",
  upLeft = "upLeft",
  upRight = "upRight"
}

export interface Rotate extends BaseEffect.BaseEffect<EffectType.Rotate> {
  direction: Direction;
}

export const directionFromLegacyEffectType = (
  v: LegacyEffectType
): Direction | undefined => {
  switch (v) {
    case LegacyEffectType.rotateIn:
      return Direction.none;
    case LegacyEffectType.rotateInDownLeft:
      return Direction.downLeft;
    case LegacyEffectType.rotateInDownRight:
      return Direction.downRight;
    case LegacyEffectType.rotateInUpLeft:
      return Direction.upLeft;
    case LegacyEffectType.rotateInUpRight:
      return Direction.upRight;
    default:
      return undefined;
  }
};

export const fromLegacyModel = Parse.readWithParser<LegacyModel, Rotate>({
  type: mPipe(
    prop("name"),
    ET.fromLegacyEffectType,
    pass(isEffect(EffectType.Rotate))
  ),
  direction: Parse.or([
    mPipe(prop("name"), directionFromLegacyEffectType),
    (): Direction.none => Direction.none
  ]),
  duration: BaseEffect.durationFromLegacyModel,
  delay: BaseEffect.delayFromLegacyModel,
  infiniteAnimation: BaseEffect.infiniteAnimationFromLegacyModel
});

export const toLegacyEffectType = (v: Rotate): LegacyEffectType => {
  switch (v.direction) {
    case Direction.none:
      return LegacyEffectType.rotateIn;
    case Direction.downLeft:
      return LegacyEffectType.rotateInDownLeft;
    case Direction.downRight:
      return LegacyEffectType.rotateInDownRight;
    case Direction.upLeft:
      return LegacyEffectType.rotateInUpLeft;
    case Direction.upRight:
      return LegacyEffectType.rotateInUpRight;
  }
};

export const toLegacyModel = (v: Rotate): LegacyModel => ({
  name: toLegacyEffectType(v),
  duration: v.duration,
  delay: v.delay,
  infiniteAnimation: v.infiniteAnimation
});

export const getDirectionTitle = (v: Direction): string => {
  switch (v) {
    case Direction.none:
      return t("None");
    case Direction.upRight:
      return t("UpRight");
    case Direction.upLeft:
      return t("UpLeft");
    case Direction.downLeft:
      return t("DownLeft");
    case Direction.downRight:
      return t("DownRight");
  }
};
