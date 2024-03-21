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
  brzPop = "brzPop",
  brzPush = "brzPush",
  brzBounceIn = "brzBounceIn",
  brzBounceOut = "brzBounceOut",
  brzGrow = "brzGrow",
  brzShrink = "brzShrink"
}

export interface Scale extends BaseEffect.BaseEffect<EffectType.Scale> {
  direction: Direction;
}

export const directionFromLegacyEffectType = (
  v: LegacyEffectType
): Direction | undefined => {
  switch (v) {
    case LegacyEffectType.brzPop:
      return Direction.brzPop;
    case LegacyEffectType.brzPush:
      return Direction.brzPush;

    case LegacyEffectType.brzBounceIn:
      return Direction.brzBounceIn;

    case LegacyEffectType.brzBounceOut:
      return Direction.brzBounceOut;

    case LegacyEffectType.brzGrow:
      return Direction.brzGrow;

    case LegacyEffectType.brzShrink:
      return Direction.brzShrink;
    default:
      return undefined;
  }
};

export const fromLegacyModel = Parse.readWithParser<LegacyModel, Scale>({
  type: mPipe(
    prop("name"),
    ET.fromLegacyEffectType,
    pass(isEffect(EffectType.Scale))
  ),
  direction: Parse.or([
    mPipe(prop("name"), directionFromLegacyEffectType),
    (): Direction.brzPop => Direction.brzPop
  ]),
  duration: BaseEffect.durationFromLegacyModel,
  delay: BaseEffect.delayFromLegacyModel,
  infiniteAnimation: BaseEffect.infiniteAnimationFromLegacyModel
});

export const toLegacyEffectType = (v: Scale): LegacyEffectType => {
  switch (v.direction) {
    case Direction.brzPop:
      return LegacyEffectType.brzPop;
    case Direction.brzPush:
      return LegacyEffectType.brzPush;
    case Direction.brzBounceIn:
      return LegacyEffectType.brzBounceIn;
    case Direction.brzBounceOut:
      return LegacyEffectType.brzBounceOut;
    case Direction.brzGrow:
      return LegacyEffectType.brzGrow;
    case Direction.brzShrink:
      return LegacyEffectType.brzShrink;
  }
};

export const toLegacyModel = (v: Scale): LegacyModel => ({
  name: toLegacyEffectType(v),
  duration: v.duration,
  delay: v.delay,
  infiniteAnimation: v.infiniteAnimation
});

export const getDirectionTitle = (v: Direction): string => {
  switch (v) {
    case Direction.brzPop:
      return t("Pop");
    case Direction.brzPush:
      return t("Push");
    case Direction.brzBounceIn:
      return t("Bounce In");
    case Direction.brzBounceOut:
      return t("Bounce Out");
    case Direction.brzGrow:
      return t("Grow");
    case Direction.brzShrink:
      return t("Shrink");
  }
};
