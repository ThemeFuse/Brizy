export interface Props {
  value: number;
  onChange: (value: number) => void;
  className?: string;
  min?: number;
  max?: number;
  step?: number;
}

export interface ComponentRef {
  increment: () => void;
  decrement: () => void;
}
