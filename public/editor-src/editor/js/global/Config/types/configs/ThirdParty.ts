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

// These keys are populated by `@brizy/core`,
// and are used inside the `editorComponents/ThirdParty` class
// to render the components.
export type ThirdPartyComponents = Record<string, ThirdPartyComponent>;

// These keys are populated by Backend (Cloud, WP),
// and are used by `@brizy/core` to obtain the host of each widget,
// determining the public host where it is stored.
export type ThirdPartyComponentsHosts = Array<{
  name: string;
  host: string;
}>;

// These keys are populated by Backend (Cloud, WP),
// and are used by Worker(compiler/browser/index.ts)
// when try to compile the Components to HTML
export type ThirdPartyUrls = Array<{
  scriptUrl: string;
  styleUrl?: string;
}>;
