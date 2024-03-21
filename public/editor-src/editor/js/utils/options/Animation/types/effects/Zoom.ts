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
  down = "down",
  right = "right",
  up = "up",
  left = "left"
}

export interface Zoom extends BaseEffect.BaseEffect<EffectType.Zoom> {
  direction: Direction;
}

export const directionFromLegacyEffectType = (
  v: LegacyEffectType
): Direction | undefined => {
  switch (v) {
    case LegacyEffectType.zoomIn:
      return Direction.none;
    case LegacyEffectType.zoomInDown:
      return Direction.down;
    case LegacyEffectType.zoomInRight:
      return Direction.right;
    case LegacyEffectType.zoomInUp:
      return Direction.up;
    case LegacyEffectType.zoomInLeft:
      return Direction.left;
    default:
      return undefined;
  }
};

export const fromLegacyModel = Parse.readWithParser<LegacyModel, Zoom>({
  type: mPipe(
    prop("name"),
    ET.fromLegacyEffectType,
    pass(isEffect(EffectType.Zoom))
  ),
  direction: Parse.or([
    mPipe(prop("name"), directionFromLegacyEffectType),
    (): Direction.none => Direction.none
  ]),
  duration: BaseEffect.durationFromLegacyModel,
  delay: BaseEffect.delayFromLegacyModel,
  infiniteAnimation: BaseEffect.infiniteAnimationFromLegacyModel
});

export const toLegacyEffectType = (v: Zoom): LegacyEffectType => {
  switch (v.direction) {
    case Direction.none:
      return LegacyEffectType.zoomIn;
    case Direction.left:
      return LegacyEffectType.zoomInLeft;
    case Direction.down:
      return LegacyEffectType.zoomInDown;
    case Direction.right:
      return LegacyEffectType.zoomInRight;
    case Direction.up:
      return LegacyEffectType.zoomInUp;
  }
};

export const toLegacyModel = (v: Zoom): LegacyModel => ({
  name: toLegacyEffectType(v),
  duration: v.duration,
  delay: v.delay,
  infiniteAnimation: v.infiniteAnimation
});

export const getDirectionTitle = (v: Direction): string => {
  switch (v) {
    case Direction.none:
      return t("None");
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
