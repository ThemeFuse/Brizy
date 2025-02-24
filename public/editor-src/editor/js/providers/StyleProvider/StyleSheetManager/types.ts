import { ReactNode } from "react";
import { Sheet } from "../Sheet";

export interface Props {
  sheet: Readonly<Sheet>;
  children: ReactNode;
}
