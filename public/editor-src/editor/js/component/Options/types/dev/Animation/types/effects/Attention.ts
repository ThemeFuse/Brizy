import { mPipe, pass } from "visual/utils/fp";
import { t } from "visual/utils/i18n";
import { prop } from "visual/utils/object/get";
import * as Parse from "visual/utils/reader/readWithParser";
import * as BaseEffect from "../BaseEffect";
import * as ET from "../EffectType";
import { EffectType, isEffect } from "../EffectType";
import { LegacyEffectType } from "../LegacyEffectType";
import { LegacyModel } from "../LegacyModel";

export type Style =
  | LegacyEffectType.flash
  | LegacyEffectType.jackInTheBox
  | LegacyEffectType.jello
  | LegacyEffectType.lightSpeedIn
  | LegacyEffectType.pulse
  | LegacyEffectType.rollIn
  | LegacyEffectType.rubberBand
  | LegacyEffectType.tada
  | LegacyEffectType.shake
  | LegacyEffectType.swing
  | LegacyEffectType.wobble;

export const styles: Style[] = [
  LegacyEffectType.flash,
  LegacyEffectType.jackInTheBox,
  LegacyEffectType.jello,
  LegacyEffectType.lightSpeedIn,
  LegacyEffectType.pulse,
  LegacyEffectType.rollIn,
  LegacyEffectType.rubberBand,
  LegacyEffectType.tada,
  LegacyEffectType.shake,
  LegacyEffectType.swing,
  LegacyEffectType.wobble
];

export interface Attention extends BaseEffect.BaseEffect<EffectType.Attention> {
  style: Style;
}

export const styleFromLegacyEffectType = (
  v: LegacyEffectType
): Style | undefined => {
  switch (v) {
    case LegacyEffectType.flash:
    case LegacyEffectType.jackInTheBox:
    case LegacyEffectType.jello:
    case LegacyEffectType.lightSpeedIn:
    case LegacyEffectType.pulse:
    case LegacyEffectType.rollIn:
    case LegacyEffectType.rubberBand:
    case LegacyEffectType.tada:
    case LegacyEffectType.shake:
    case LegacyEffectType.swing:
    case LegacyEffectType.wobble:
      return v;
    default:
      return undefined;
  }
};

export const fromLegacyModel = Parse.readWithParser<LegacyModel, Attention>({
  type: mPipe(
    prop("name"),
    ET.fromLegacyEffectType,
    pass(isEffect(EffectType.Attention))
  ),
  style: Parse.or<LegacyModel, Style>([
    mPipe(prop("name"), styleFromLegacyEffectType),
    (): LegacyEffectType.flash => LegacyEffectType.flash
  ]),
  duration: BaseEffect.durationFromLegacyModel,
  delay: BaseEffect.delayFromLegacyModel,
  infiniteAnimation: BaseEffect.infiniteAnimationFromLegacyModel
});

export const toLegacyEffectType = (v: Attention): LegacyEffectType => v.style;

export const toLegacyModel = (v: Attention): LegacyModel => ({
  name: toLegacyEffectType(v),
  duration: v.duration,
  delay: v.delay,
  infiniteAnimation: v.infiniteAnimation
});

export const styleTitle = (v: Style): string => {
  switch (v) {
    case LegacyEffectType.flash:
      return t("Flash");
    case LegacyEffectType.jackInTheBox:
      return t("JackInTheBox");
    case LegacyEffectType.jello:
      return t("Jello");
    case LegacyEffectType.lightSpeedIn:
      return t("LightSpeedIn");
    case LegacyEffectType.pulse:
      return t("Pulse");
    case LegacyEffectType.rollIn:
      return t("RollIn");
    case LegacyEffectType.rubberBand:
      return t("RubberBand");
    case LegacyEffectType.shake:
      return t("Shake");
    case LegacyEffectType.swing:
      return t("Swing");
    case LegacyEffectType.tada:
      return t("Tada");
    case LegacyEffectType.wobble:
      return t("Wobble");
  }
};

export const setStyle = (style: Style, v: Attention): Attention =>
  v.style === style ? v : { ...v, style };
