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
  up = "up",
  down = "down",
  left = "left",
  right = "right"
}

export enum Timing {
  ease = "ease",
  easeFast = "ease-fast",
  easeSlow = "ease-slow",
  easeIn = "ease-in",
  easeInFast = "ease-in-fast",
  easeInSlow = "ease-in-slow",
  easeOut = "ease-out",
  easeOutFast = "ease-out-fast",
  easeOutSlow = "ease-out-slow",
  easeInOut = "ease-in-out",
  easeInOutFast = "ease-in-out-fast",
  easeInOutSlow = "ease-in-out-slow",
  linear = "linear"
}

export interface Reveal extends BaseEffect.BaseEffect<EffectType.Reveal> {
  direction: Direction;
  timing: Timing;
}

export const directionFromLegacyEffectType = (
  v: LegacyEffectType
): Direction | undefined => {
  switch (v) {
    case LegacyEffectType.brzRevealUp:
      return Direction.up;
    case LegacyEffectType.brzRevealDown:
      return Direction.down;
    case LegacyEffectType.brzRevealLeft:
      return Direction.left;
    case LegacyEffectType.brzRevealRight:
      return Direction.right;
    default:
      return undefined;
  }
};

const timingFromString = (v: unknown): Timing | undefined => {
  if (
    v === Timing.ease ||
    v === Timing.easeFast ||
    v === Timing.easeSlow ||
    v === Timing.easeIn ||
    v === Timing.easeInFast ||
    v === Timing.easeInSlow ||
    v === Timing.easeOut ||
    v === Timing.easeOutFast ||
    v === Timing.easeOutSlow ||
    v === Timing.easeInOut ||
    v === Timing.easeInOutFast ||
    v === Timing.easeInOutSlow ||
    v === Timing.linear
  ) {
    return v;
  }
  return undefined;
};

export const fromLegacyModel = Parse.readWithParser<LegacyModel, Reveal>({
  type: mPipe(
    prop("name"),
    ET.fromLegacyEffectType,
    pass(isEffect(EffectType.Reveal))
  ),
  direction: Parse.or([
    mPipe(prop("name"), directionFromLegacyEffectType),
    (): Direction.up => Direction.up
  ]),
  timing: Parse.or([
    mPipe((m: LegacyModel) => m.timing, timingFromString),
    (): Timing.easeInOut => Timing.easeInOut
  ]),
  duration: BaseEffect.durationFromLegacyModel,
  delay: BaseEffect.delayFromLegacyModel,
  infiniteAnimation: BaseEffect.infiniteAnimationFromLegacyModel
});

export const toLegacyEffectType = (v: Reveal): LegacyEffectType => {
  switch (v.direction) {
    case Direction.up:
      return LegacyEffectType.brzRevealUp;
    case Direction.down:
      return LegacyEffectType.brzRevealDown;
    case Direction.left:
      return LegacyEffectType.brzRevealLeft;
    case Direction.right:
      return LegacyEffectType.brzRevealRight;
  }
};

export const toLegacyModel = (v: Reveal): LegacyModel => ({
  name: toLegacyEffectType(v),
  duration: v.duration,
  delay: v.delay,
  infiniteAnimation: v.infiniteAnimation,
  timing: v.timing
});

export const getDirectionTitle = (v: Direction): string => {
  switch (v) {
    case Direction.up:
      return t("Up");
    case Direction.down:
      return t("Down");
    case Direction.left:
      return t("Left");
    case Direction.right:
      return t("Right");
  }
};

export const getTimingTitle = (v: Timing): string => {
  switch (v) {
    case Timing.ease:
      return t("Ease");
    case Timing.easeFast:
      return t("Ease Fast");
    case Timing.easeSlow:
      return t("Ease Slow");
    case Timing.easeIn:
      return t("Ease In");
    case Timing.easeInFast:
      return t("Ease In Fast");
    case Timing.easeInSlow:
      return t("Ease In Slow");
    case Timing.easeOut:
      return t("Ease Out");
    case Timing.easeOutFast:
      return t("Ease Out Fast");
    case Timing.easeOutSlow:
      return t("Ease Out Slow");
    case Timing.easeInOut:
      return t("Ease In Out");
    case Timing.easeInOutFast:
      return t("Ease In Out Fast");
    case Timing.easeInOutSlow:
      return t("Ease In Out Slow");
    case Timing.linear:
      return t("Linear");
  }
};

export const setTiming = (timing: Timing, v: Reveal): Reveal => ({
  ...v,
  timing
});
