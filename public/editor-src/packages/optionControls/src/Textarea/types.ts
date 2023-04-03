type Size = "short" | "medium" | "large" | "auto";
export interface Props {
  className?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
  size?: Size;
}
