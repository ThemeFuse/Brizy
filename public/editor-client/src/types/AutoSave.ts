import { Project } from "./Project";

export interface AutoSave {
  // TODO  Currently only projectData is used
  //  Need to add pageData and globalBlocks
  projectData: Project;
  // pageData: PageCommon;
  // globalBlocks: Array<GlobalBlock>;
}
