export interface IProps {
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
}

export interface IState {
  text: string | number;
  value: number;
  prevPropsValue: number;
}
