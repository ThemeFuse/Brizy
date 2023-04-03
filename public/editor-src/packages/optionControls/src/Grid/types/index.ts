import { ReactElement } from "react";

export interface ColumnProps {
  className?: string;
  align: "start" | "center" | "end";
}

export interface GridProps {
  className?: string;
  grid: Array<"auto" | number>;
  showSeparator?: boolean;
  children: ReactElement<ColumnProps>[];
}
