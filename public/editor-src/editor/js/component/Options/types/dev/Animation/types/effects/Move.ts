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
  up = "up",
  down = "down",
  left = "left",
  right = "right",
  hang = "hang",
  bob = "bob"
}

export interface Move extends BaseEffect.BaseEffect<EffectType.Move> {
  direction: Direction;
}

export const directionFromLegacyEffectType = (
  v: LegacyEffectType
): Direction | undefined => {
  switch (v) {
    case LegacyEffectType.brzMoveUp:
      return Direction.up;
    case LegacyEffectType.brzMoveDown:
      return Direction.down;
    case LegacyEffectType.brzMoveLeft:
      return Direction.left;
    case LegacyEffectType.brzMoveRight:
      return Direction.right;
    case LegacyEffectType.brzHang:
      return Direction.hang;
    case LegacyEffectType.brzBob:
      return Direction.bob;
    default:
      return undefined;
  }
};

export const fromLegacyModel = Parse.readWithParser<LegacyModel, Move>({
  type: mPipe(
    prop("name"),
    ET.fromLegacyEffectType,
    pass(isEffect(EffectType.Move))
  ),
  direction: Parse.or([
    mPipe(prop("name"), directionFromLegacyEffectType),
    (): Direction.up => Direction.up
  ]),
  duration: BaseEffect.durationFromLegacyModel,
  delay: BaseEffect.delayFromLegacyModel,
  infiniteAnimation: BaseEffect.infiniteAnimationFromLegacyModel
});

export const toLegacyEffectType = (v: Move): LegacyEffectType => {
  switch (v.direction) {
    case Direction.up:
      return LegacyEffectType.brzMoveUp;
    case Direction.down:
      return LegacyEffectType.brzMoveDown;
    case Direction.left:
      return LegacyEffectType.brzMoveLeft;
    case Direction.right:
      return LegacyEffectType.brzMoveRight;
    case Direction.hang:
      return LegacyEffectType.brzHang;
    case Direction.bob:
      return LegacyEffectType.brzBob;
  }
};

export const toLegacyModel = (v: Move): LegacyModel => ({
  name: toLegacyEffectType(v),
  duration: v.duration,
  delay: v.delay,
  infiniteAnimation: v.infiniteAnimation
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
    case Direction.hang:
      return t("Hang");
    case Direction.bob:
      return t("Bob");
  }
};
