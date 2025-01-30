import { Config as _Config } from "../models/Config";
import { Page } from "../models/Page";
import { Project } from "../models/Project";
import { ThirdPartyComponents } from "../models/ThirdPartyComponents";
import { HtmlOutputType } from "../models/common";
import { EditorMode } from "./mode";

type Config = Pick<_Config<HtmlOutputType>, "menu" | "integrations">;

interface Props {
  config: Config;
  mode: EditorMode;
  pageData: Page;
  projectData: Project;
  thirdPartyComponents?: ThirdPartyComponents;
}

// This is the type definition for the Preview component
// Temporary implementation to have the component type definition
export declare function Preview(props: Props): JSX.Element;
