import { Ref } from "react";
import { AutoCorrectingInput } from "./index";

export interface CommonProps {
  className?: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  onFocus?: VoidFunction;
  onBlur?: VoidFunction;
  onTextChange?: (e: string | number) => void;
  onMouseEnter?: VoidFunction;
  onMouseLeave?: VoidFunction;
  size?: number;
  handleDecrementCb?: () => void;
}

export interface StepperProps extends CommonProps {
  stepperSize: "small" | "medium" | "large" | "auto";
  handleDecrementCb: () => void;
  inputRef: Ref<AutoCorrectingInput>;
}

export interface State {
  text: string | number;
  value: number;
  prevPropsValue: number;
}
