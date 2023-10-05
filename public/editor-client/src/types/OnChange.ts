import { Page } from "./Page";
import { Project } from "./Project";

export interface OnChange {
  // TODO  Currently only projectData and pageData is used
  //  Need to add globalBlocks
  projectData: Project;
  pageData: Page;
  // globalBlocks: Array<GlobalBlock>;
}
