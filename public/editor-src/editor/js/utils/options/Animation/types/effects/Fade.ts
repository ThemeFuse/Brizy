import { mPipe, pass } from "visual/utils/fp";
import { t } from "visual/utils/i18n";
import { prop } from "visual/utils/object/get";
import * as Parse from "visual/utils/reader/readWithParser";
import * as BaseEffect from "../BaseEffect";
import * as ET from "../EffectType";
import { EffectType, isEffect } from "../EffectType";
import {
  LegacyEffectType,
  LegacyFadeType,
  fadeFromEffect
} from "../LegacyEffectType";
import { LegacyModel } from "../LegacyModel";

export enum Direction {
  none = "none",
  down = "down",
  right = "right",
  up = "up",
  left = "left"
}

export interface Fade extends BaseEffect.BaseEffect<EffectType.Fade> {
  direction: Direction;
  big: boolean;
}

export const directionFromLegacyEffectType = (v: LegacyFadeType): Direction => {
  switch (v) {
    case LegacyEffectType.fadeIn:
      return Direction.none;
    case LegacyEffectType.fadeInDown:
    case LegacyEffectType.fadeInDownBig:
      return Direction.down;

    case LegacyEffectType.fadeInRight:
    case LegacyEffectType.fadeInRightBig:
      return Direction.right;

    case LegacyEffectType.fadeInUp:
    case LegacyEffectType.fadeInUpBig:
      return Direction.up;

    case LegacyEffectType.fadeInLeft:
    case LegacyEffectType.fadeInLeftBig:
      return Direction.left;
  }
};

export const bigFromLegacyEffectType = (v: LegacyFadeType): boolean => {
  switch (v) {
    case LegacyEffectType.fadeIn:
    case LegacyEffectType.fadeInDown:
    case LegacyEffectType.fadeInRight:
    case LegacyEffectType.fadeInUp:
    case LegacyEffectType.fadeInLeft:
      return false;
    case LegacyEffectType.fadeInDownBig:
    case LegacyEffectType.fadeInRightBig:
    case LegacyEffectType.fadeInUpBig:
    case LegacyEffectType.fadeInLeftBig:
      return true;
  }
};

export const fromLegacyModel = Parse.readWithParser<LegacyModel, Fade>({
  type: mPipe(
    prop("name"),
    ET.fromLegacyEffectType,
    pass(isEffect(EffectType.Fade))
  ),
  direction: Parse.or([
    mPipe(prop("name"), fadeFromEffect, directionFromLegacyEffectType),
    (): Direction.none => Direction.none
  ]),
  big: mPipe(prop("name"), fadeFromEffect, bigFromLegacyEffectType),
  duration: BaseEffect.durationFromLegacyModel,
  delay: BaseEffect.delayFromLegacyModel,
  infiniteAnimation: BaseEffect.infiniteAnimationFromLegacyModel
});

export const toLegacyEffectType = (v: Fade): LegacyEffectType => {
  switch (v.direction) {
    case Direction.none:
      return LegacyEffectType.fadeIn;
    case Direction.down: {
      switch (v.big) {
        case true:
          return LegacyEffectType.fadeInDownBig;
        case false:
          return LegacyEffectType.fadeInDown;
      }
    }
    // eslint-disable-next-line no-fallthrough
    case Direction.right: {
      switch (v.big) {
        case true:
          return LegacyEffectType.fadeInRightBig;
        case false:
          return LegacyEffectType.fadeInRight;
      }
    }
    // eslint-disable-next-line no-fallthrough
    case Direction.up: {
      switch (v.big) {
        case true:
          return LegacyEffectType.fadeInUpBig;
        case false:
          return LegacyEffectType.fadeInUp;
      }
    }
    // eslint-disable-next-line no-fallthrough
    case Direction.left: {
      switch (v.big) {
        case true:
          return LegacyEffectType.fadeInLeftBig;
        case false:
          return LegacyEffectType.fadeInLeft;
      }
    }
  }
};

export const toLegacyModel = (v: Fade): LegacyModel => ({
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
