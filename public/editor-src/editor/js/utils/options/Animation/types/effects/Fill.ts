import { always, mPipe, pass } from "visual/utils/fp";
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
  brzFade = "brzFade",
  brzBackPulse = "brzBackPulse",
  brzSweepToRight = "brzSweepToRight",
  brzSweepToLeft = "brzSweepToLeft",
  brzSweepToBottom = "brzSweepToBottom",
  brzSweepToTop = "brzSweepToTop",
  brzBounceToRight = "brzBounceToRight",
  brzBounceToLeft = "brzBounceToLeft",
  brzBounceToBottom = "brzBounceToBottom",
  brzBounceToTop = "brzBounceToTop",
  brzRadialIn = "brzRadialIn",
  brzRadialOut = "brzRadialOut",
  brzRectangleIn = "brzRectangleIn",
  brzRectangleOut = "brzRectangleOut",
  brzShutterInHorizontal = "brzShutterInHorizontal",
  brzShutterOutHorizontal = "brzShutterOutHorizontal",
  brzShutterInVertical = "brzShutterInVertical",
  brzShutterOutVertical = "brzShutterOutVertical"
}

export interface Fill extends BaseEffect.BaseEffect<EffectType.Fill> {
  direction: Direction;
}

export const directionFromLegacyEffectType = (
  v: LegacyEffectType
): Direction | undefined => {
  switch (v) {
    case LegacyEffectType.brzFade:
      return Direction.brzFade;
    case LegacyEffectType.brzBackPulse:
      return Direction.brzBackPulse;
    case LegacyEffectType.brzSweepToRight:
      return Direction.brzSweepToRight;
    case LegacyEffectType.brzSweepToLeft:
      return Direction.brzSweepToLeft;
    case LegacyEffectType.brzSweepToBottom:
      return Direction.brzSweepToBottom;
    case LegacyEffectType.brzSweepToTop:
      return Direction.brzSweepToTop;
    case LegacyEffectType.brzBounceToRight:
      return Direction.brzBounceToRight;
    case LegacyEffectType.brzBounceToLeft:
      return Direction.brzBounceToLeft;
    case LegacyEffectType.brzBounceToBottom:
      return Direction.brzBounceToBottom;
    case LegacyEffectType.brzBounceToTop:
      return Direction.brzBounceToTop;
    case LegacyEffectType.brzRadialOut:
      return Direction.brzRadialOut;
    case LegacyEffectType.brzRadialIn:
      return Direction.brzRadialIn;
    case LegacyEffectType.brzRectangleIn:
      return Direction.brzRectangleIn;
    case LegacyEffectType.brzRectangleOut:
      return Direction.brzRectangleOut;
    case LegacyEffectType.brzShutterInHorizontal:
      return Direction.brzShutterInHorizontal;
    case LegacyEffectType.brzShutterOutHorizontal:
      return Direction.brzShutterOutHorizontal;
    case LegacyEffectType.brzShutterInVertical:
      return Direction.brzShutterInVertical;
    case LegacyEffectType.brzShutterOutVertical:
      return Direction.brzShutterOutVertical;
    default:
      return undefined;
  }
};

export const fromLegacyModel = Parse.readWithParser<LegacyModel, Fill>({
  type: mPipe(
    prop("name"),
    ET.fromLegacyEffectType,
    pass(isEffect(EffectType.Fill))
  ),
  direction: Parse.or([
    mPipe(prop("name"), directionFromLegacyEffectType),
    always(Direction.brzFade)
  ]),
  duration: BaseEffect.durationFromLegacyModel,
  delay: BaseEffect.delayFromLegacyModel,
  infiniteAnimation: BaseEffect.infiniteAnimationFromLegacyModel
});

export const toLegacyEffectType = (v: Fill): LegacyEffectType => {
  switch (v.direction) {
    case Direction.brzFade:
      return LegacyEffectType.brzFade;
    case Direction.brzBackPulse:
      return LegacyEffectType.brzBackPulse;
    case Direction.brzSweepToRight:
      return LegacyEffectType.brzSweepToRight;
    case Direction.brzSweepToLeft:
      return LegacyEffectType.brzSweepToLeft;
    case Direction.brzSweepToBottom:
      return LegacyEffectType.brzSweepToBottom;
    case Direction.brzSweepToTop:
      return LegacyEffectType.brzSweepToTop;
    case Direction.brzBounceToRight:
      return LegacyEffectType.brzBounceToRight;
    case Direction.brzBounceToLeft:
      return LegacyEffectType.brzBounceToLeft;
    case Direction.brzBounceToBottom:
      return LegacyEffectType.brzBounceToBottom;
    case Direction.brzBounceToTop:
      return LegacyEffectType.brzBounceToTop;
    case Direction.brzRadialOut:
      return LegacyEffectType.brzRadialOut;
    case Direction.brzRadialIn:
      return LegacyEffectType.brzRadialIn;
    case Direction.brzRectangleIn:
      return LegacyEffectType.brzRectangleIn;
    case Direction.brzRectangleOut:
      return LegacyEffectType.brzRectangleOut;
    case Direction.brzShutterInHorizontal:
      return LegacyEffectType.brzShutterInHorizontal;
    case Direction.brzShutterOutHorizontal:
      return LegacyEffectType.brzShutterOutHorizontal;
    case Direction.brzShutterInVertical:
      return LegacyEffectType.brzShutterInVertical;
    case Direction.brzShutterOutVertical:
      return LegacyEffectType.brzShutterOutVertical;
  }
};

export const toLegacyModel = (v: Fill): LegacyModel => ({
  name: toLegacyEffectType(v),
  duration: v.duration,
  delay: v.delay,
  infiniteAnimation: v.infiniteAnimation
});

export const getDirectionTitle = (v: Direction): string => {
  switch (v) {
    case Direction.brzFade:
      return t("Fade");
    case Direction.brzBackPulse:
      return t("Back Pulse");
    case Direction.brzSweepToRight:
      return t("Sweep To Right");
    case Direction.brzSweepToLeft:
      return t("Sweep To Left");
    case Direction.brzSweepToBottom:
      return t("Sweep To Bottom");
    case Direction.brzSweepToTop:
      return t("Sweep To Top");
    case Direction.brzBounceToRight:
      return t("Bounce To Right");
    case Direction.brzBounceToLeft:
      return t("Bounce To Left");
    case Direction.brzBounceToBottom:
      return t("Bounce To Bottom");
    case Direction.brzBounceToTop:
      return t("Bounce To Top");
    case Direction.brzRadialIn:
      return t("Radial In");
    case Direction.brzRadialOut:
      return t("Radial Out");
    case Direction.brzRectangleIn:
      return t("Rectangle In");
    case Direction.brzRectangleOut:
      return t("Rectangle Out");
    case Direction.brzShutterInHorizontal:
      return t("Shutter In Horizontal");
    case Direction.brzShutterOutHorizontal:
      return t("Shutter Out Horizontal");
    case Direction.brzShutterInVertical:
      return t("Shutter In Vertical");
    case Direction.brzShutterOutVertical:
      return t("Shutter Out Vertical");
  }
};
