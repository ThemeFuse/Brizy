import { ChangeEventHandler } from "react";

export interface Props {
  className?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  colors?: { color: string }[];
  color?: string;
}
