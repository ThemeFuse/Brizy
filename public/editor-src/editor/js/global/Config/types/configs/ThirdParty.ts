import { ComponentType } from "react";
import type { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";

interface Hydrate {
  type: "hydrate";
}
interface Vanilla {
  type: "vanilla";
  assetsURL: string;
}

export type Preview = Hydrate | Vanilla;

export interface ThirdPartyComponentData {
  id: string;
  title: string;
  component: ComponentType;
  preview: Preview;
  icon?: string;
  options?: Array<ToolbarItemType>;
}

export type ThirdPartyComponents = Record<string, ThirdPartyComponentData>;
