import { ReactElement } from "react";

export interface Props {
  className?: string;
  text: ReactElement;
  showText: boolean;
  showPercentage: boolean;
  percentage: number;
}
