import {
  AnimationStyle,
  Settings
} from "visual/component/AnimatedHeadline/types";
import { Value } from "./types";

export const getAnimationOptions = (v: Value): Settings => {
  const {
    duration,
    loop,
    delay,
    textBefore,
    textAfter,
    animationStyle,
    textAnimated,
    svgTextAnimated,
    svgEffectType,
    textEffectType
  } = v;

  const baseOptions: Settings = {
    animationStyle: AnimationStyle.text,
    duration,
    effectType: textEffectType,
    text: textAnimated,
    loop: loop === "on",
    textBefore,
    textAfter
  };

  if (animationStyle === AnimationStyle.svg) {
    return {
      ...baseOptions,
      animationStyle: AnimationStyle.svg,
      text: svgTextAnimated,
      effectType: svgEffectType,
      delay
    };
  }
  return baseOptions;
};
