import { ComponentType } from "react";
import {
  ToolbarConfig,
  ToolbarProps
} from "visual/editorComponents/EditorComponent/types";

interface Hydrate {
  type: "hydrate";
}
interface Vanilla {
  type: "vanilla";
  assetsURL: string;
}

export type Preview = Hydrate | Vanilla;

export interface ThirdPartyConfig {
  id: string;
  title: string;
  preview: Preview;
  icon?: string;
  options?: (props: ToolbarProps) => Array<ToolbarConfig>;
}

export interface ThirdPartyComponent extends ThirdPartyConfig {
  component: ComponentType;
  category?: string;
  keywords?: string;
}

export type ThirdPartyComponents = Record<string, ThirdPartyComponent>;
