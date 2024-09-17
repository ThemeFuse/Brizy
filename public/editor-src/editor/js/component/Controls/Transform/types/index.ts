import { WithClassName } from "visual/types/attributes";
import {
  Effect,
  EffectsWithAnchor,
  EffectValueWithAnchor,
  Value
} from "./Value";

export interface Props extends WithClassName {
  value: Value;
  label?: JSX.Element;
  disabled: Effect[];
  onClick: (e: Effect) => void;
  onCheck: (e: Effect) => void;
  onOptionChange: (e: EffectValueWithAnchor<EffectsWithAnchor>) => void;
}

export type OnChange<T, M = { isChanging?: boolean }> = (v: T, m?: M) => void;
