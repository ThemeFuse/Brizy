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
  brzWobbleHorizontal = "brzWobbleHorizontal",
  brzWobbleVertical = "brzWobbleVertical",
  brzWobbleToBottomRight = "brzWobbleToBottomRight",
  brzWobbleToTopRight = "brzWobbleToTopRight",
  brzWobbleTop = "brzWobbleTop",
  brzWobbleBottom = "brzWobbleBottom",
  brzWobbleSkew = "brzWobbleSkew"
}

export interface Wobble extends BaseEffect.BaseEffect<EffectType.Wobble> {
  direction: Direction;
}

export const directionFromLegacyEffectType = (
  v: LegacyEffectType
): Direction | undefined => {
  switch (v) {
    case LegacyEffectType.brzWobbleHorizontal:
      return Direction.brzWobbleHorizontal;
    case LegacyEffectType.brzWobbleVertical:
      return Direction.brzWobbleVertical;
    case LegacyEffectType.brzWobbleToBottomRight:
      return Direction.brzWobbleToBottomRight;
    case LegacyEffectType.brzWobbleToTopRight:
      return Direction.brzWobbleToTopRight;
    case LegacyEffectType.brzWobbleTop:
      return Direction.brzWobbleTop;
    case LegacyEffectType.brzWobbleBottom:
      return Direction.brzWobbleBottom;
    case LegacyEffectType.brzWobbleSkew:
      return Direction.brzWobbleSkew;
    default:
      return undefined;
  }
};

export const fromLegacyModel = Parse.readWithParser<LegacyModel, Wobble>({
  type: mPipe(
    prop("name"),
    ET.fromLegacyEffectType,
    pass(isEffect(EffectType.Wobble))
  ),
  direction: Parse.or([
    mPipe(prop("name"), directionFromLegacyEffectType),
    (): Direction.brzWobbleHorizontal => Direction.brzWobbleHorizontal
  ]),
  duration: BaseEffect.durationFromLegacyModel,
  delay: BaseEffect.delayFromLegacyModel,
  infiniteAnimation: BaseEffect.infiniteAnimationFromLegacyModel
});

export const toLegacyEffectType = (v: Wobble): LegacyEffectType => {
  switch (v.direction) {
    case Direction.brzWobbleHorizontal:
      return LegacyEffectType.brzWobbleHorizontal;
    case Direction.brzWobbleVertical:
      return LegacyEffectType.brzWobbleVertical;
    case Direction.brzWobbleToBottomRight:
      return LegacyEffectType.brzWobbleToBottomRight;
    case Direction.brzWobbleToTopRight:
      return LegacyEffectType.brzWobbleToTopRight;
    case Direction.brzWobbleTop:
      return LegacyEffectType.brzWobbleTop;
    case Direction.brzWobbleBottom:
      return LegacyEffectType.brzWobbleBottom;
    case Direction.brzWobbleSkew:
      return LegacyEffectType.brzWobbleSkew;
  }
};

export const toLegacyModel = (v: Wobble): LegacyModel => ({
  name: toLegacyEffectType(v),
  duration: v.duration,
  delay: v.delay,
  infiniteAnimation: v.infiniteAnimation
});

export const getDirectionTitle = (v: Direction): string => {
  switch (v) {
    case Direction.brzWobbleHorizontal:
      return t("Horizontal");
    case Direction.brzWobbleVertical:
      return t("Vertical");
    case Direction.brzWobbleToBottomRight:
      return t("Bottom Right");
    case Direction.brzWobbleToTopRight:
      return t("Top Right");
    case Direction.brzWobbleTop:
      return t("Top");
    case Direction.brzWobbleBottom:
      return t("Bottom");
    case Direction.brzWobbleSkew:
      return t("Skew");
  }
};
