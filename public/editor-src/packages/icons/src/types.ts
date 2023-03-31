import { CSSProperties as CSSValues, MouseEvent } from "react";

export type Props = {
  className?: string;
  style?: CSSValues;
  onClick?: (e: MouseEvent<SVGElement>) => void;
};
