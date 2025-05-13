import { PreviewConfig } from "../models/Config";
import { Page } from "../models/Page";
import { Project } from "../models/Project";
import { ThirdPartyComponents } from "../models/ThirdPartyComponents";
import { EditorMode } from "./mode";

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
