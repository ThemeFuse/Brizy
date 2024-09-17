import { ComponentType } from "react";
import {
  ToolbarConfig,
  ToolbarProps
} from "visual/editorComponents/EditorComponent/types";

export interface ThirdPartyConfig {
  id: string;
  title: string;
  icon?: string;
  options?: (props: ToolbarProps) => Array<ToolbarConfig>;
}

export interface ThirdPartyComponent extends ThirdPartyConfig {
  component: {
    editor: ComponentType;
    view: ComponentType;
  };
  category?: string;
  keywords?: string;
}

export type ThirdPartyComponents = Record<string, ThirdPartyComponent>;

export type ThirdPartyComponentsHosts = Array<{
  name: string;
  host: string;
}>;
