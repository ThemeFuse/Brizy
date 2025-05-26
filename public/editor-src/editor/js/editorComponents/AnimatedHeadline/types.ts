import {
  AnimationStyle,
  SvgEffectTypes,
  TextEffectTypes
} from "visual/component/AnimatedHeadline/types";
import { ElementModel } from "visual/component/Elements/Types";

export interface Value extends ElementModel {
  textBefore: string;
  textAnimated: string;
  svgTextAnimated: string;
  textAfter: string;
  loop: "on" | "off";
  duration: number;
  animationStyle: AnimationStyle;
  svgEffectType: SvgEffectTypes;
  textEffectType: TextEffectTypes;
  delay: number;
  customCSS: string;
}
