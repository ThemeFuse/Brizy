import type { ReactNode } from "react";
import type { RenderType } from "./context";

export interface Props {
  children: ReactNode;
  renderType: RenderType;
}

export interface RenderForProps {
  forView: ReactNode;
  forEdit: ReactNode;
}
