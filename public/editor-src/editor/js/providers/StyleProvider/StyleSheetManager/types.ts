import type { ReactNode } from "react";
import type { Sheet } from "../Sheet";

export interface Props {
  sheet: Readonly<Sheet>;
  children: ReactNode;
}
