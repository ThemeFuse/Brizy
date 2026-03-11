import { ReactNode } from "react";
import { DynamicContent } from "visual/global/Config/types/DynamicContent";
import { ComponentTypes } from "./ComponentTypes";

type DC = DynamicContent<"wp"> | DynamicContent<"cloud">;

export interface Props {
  children: ReactNode;
  pageId: string;
  groups?: DC["groups"];
  componentTypes?: Readonly<ComponentTypes>;
}
