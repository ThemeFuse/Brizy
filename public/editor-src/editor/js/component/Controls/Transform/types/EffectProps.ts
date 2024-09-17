import { OnChange } from "./index";
import {
  Effect,
  EffectsWithAnchor,
  EffectValue,
  EffectValueWithAnchor
} from "./Value";

export interface EffectProps<E extends EffectValue<Effect>> {
  value: E;
  onChange: OnChange<E>;
}

export interface EffectPropsWithAnchor<
  E extends EffectValueWithAnchor<EffectsWithAnchor>
> {
  value: E;
  onChange: OnChange<E>;
}
