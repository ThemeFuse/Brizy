import { ChangeEventHandler } from "react";

export interface Props {
  className?: string;
  max?: number;
  min?: number;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onDecrease?: VoidFunction;
  onIncrease?: VoidFunction;
  step?: number;
  value?: number;
}
