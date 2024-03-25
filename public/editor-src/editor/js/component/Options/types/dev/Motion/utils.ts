import { JSXElementConstructor } from "react";
import { EffectProps } from "visual/utils/options/Motion/types/EffectProps";
import { Effect, EffectValue } from "visual/utils/options/Motion/types/Value";
import { Blur } from "./components/Blur";
import { Horizontal } from "./components/Horizontal";
import { MouseTrack } from "./components/MouseTrack";
import { Rotate } from "./components/Rotate";
import { Scale } from "./components/Scale";
import { Tilt } from "./components/Tilt";
import { Transparency } from "./components/Transparency";
import { Vertical } from "./components/Vertical";

export function effectOptions<T extends Effect>(
  e: T
): JSXElementConstructor<EffectProps<EffectValue<T>>>;

export function effectOptions(
  e: Effect
): JSXElementConstructor<EffectProps<EffectValue<Effect>>> {
  type T2 = JSXElementConstructor<EffectProps<EffectValue<Effect>>>;
  switch (e) {
    case "blur":
      return Blur as T2;
    case "horizontal":
      return Horizontal as T2;
    case "mouseTrack":
      return MouseTrack as T2;
    case "rotate":
      return Rotate as T2;
    case "scale":
      return Scale as T2;
    case "mouseTilt":
      return Tilt as T2;
    case "transparency":
      return Transparency as T2;
    case "vertical":
      return Vertical as T2;
  }
}
