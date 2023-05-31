import { ChangeEventHandler } from "react";

export interface Props {
  className?: string;
  max?: number;
  min?: number;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  step?: number;
  value?: number;
  attr?: Record<string, string>;
}
