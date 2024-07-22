import { Effect, EffectValue } from "./Value";
import { OnChange } from "visual/component/Options/Type";

export type EffectProps<E extends EffectValue<Effect>> = {
  value: E;
  onChange: OnChange<E>;
};
