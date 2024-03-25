import { JSXElementConstructor } from "react";
import { EffectProps } from "visual/utils/options/Transform/types/EffectProps";
import {
  Effect,
  EffectValue
} from "visual/utils/options/Transform/types/Value";
import { Rotate } from "./components/Rotate";

export function effectOptions<T extends Effect>(
  e: T
): JSXElementConstructor<EffectProps<EffectValue<T>>>;
export function effectOptions(
  e: Effect
): JSXElementConstructor<EffectProps<EffectValue<Effect>>> {
  type T2 = JSXElementConstructor<EffectProps<EffectValue<Effect>>>;
  switch (e) {
    case "rotate":
      return Rotate as T2;
  }
}
