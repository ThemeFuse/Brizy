import type { OnChange } from "visual/component/Options/Type";
import type { Effect, EffectValue } from "./Value";

export type EffectProps<E extends EffectValue<Effect>> = {
  value: E;
  onChange: OnChange<E>;
};
