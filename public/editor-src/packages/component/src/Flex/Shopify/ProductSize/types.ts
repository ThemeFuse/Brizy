export interface Props<T extends string> {
  onChange?: (v: T) => void;
  sizeValue?: Array<{ value: T; available: boolean }>;
  selected?: T;
}
export interface PropsSize {
  disabled?: boolean;
  onClick?: VoidFunction;
  value?: string;
  isActive?: boolean;
}
