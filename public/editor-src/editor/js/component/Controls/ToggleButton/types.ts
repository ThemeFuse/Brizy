type Type = "square" | "default";

type Align = "left" | "center" | "right";

export interface ButtonStyle {
  type: Type;
  value: boolean;
  reverseTheme: boolean;
}

export interface Props {
  value: boolean;
  title?: string;
  icon?: string;
  label?: string;
  type?: Type;
  reverseTheme?: boolean;
  align?: Align;
  className?: string;
  onClick?: VoidFunction;
}
