import { ReactNode } from "react";
import { RenderType } from "./context";

export interface Props {
  children: ReactNode;
  renderType: RenderType;
}

export interface RenderForProps {
  forView: ReactNode;
  forEdit: ReactNode;
}
