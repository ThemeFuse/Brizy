import { GlobalBlock } from "./GlobalBlocks";
import { Page } from "./Page";
import { Project } from "./Project";

export interface AutoSave {
  projectData?: Project;
  pageData?: Page;
  globalBlock?: GlobalBlock;
}
