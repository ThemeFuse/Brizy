import type { PreviewConfig } from "../models/Config";
import type { Page } from "../models/Page";
import type { Project } from "../models/Project";
import type { ThirdPartyComponents } from "../models/ThirdPartyComponents";
import type { EditorMode } from "./mode";

interface Props {
  mode: EditorMode;
  pageData: Page;
  projectData: Project;
  config?: PreviewConfig;
  thirdPartyComponents?: ThirdPartyComponents;
}

// This is the type definition for the Preview component
// Temporary implementation to have the component type definition
export declare function Preview(props: Props): JSX.Element;
