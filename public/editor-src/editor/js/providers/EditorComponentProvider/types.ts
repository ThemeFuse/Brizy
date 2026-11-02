import type { ReactNode } from "react";
import type { DynamicContent } from "visual/global/Config/types/DynamicContent";
import type { ComponentTypes } from "./ComponentTypes";

type DC = DynamicContent<"wp"> | DynamicContent<"cloud">;

export interface Props {
  children: ReactNode;
  pageId: string;
  groups?: DC["groups"];
  componentTypes?: Readonly<ComponentTypes>;
}
