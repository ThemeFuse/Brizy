import { GlobalBlock } from "./GlobalBlocks";
import { Page } from "./Page";
import { Project } from "./Project";

export interface OnChange {
  projectData?: Project;
  pageData?: Page;
  globalBlocks?: Array<GlobalBlock>;
}
