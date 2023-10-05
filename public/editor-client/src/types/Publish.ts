import { Page } from "./Page";
import { Project } from "./Project";
import { Response } from "./Response";

export interface Data {
  // TODO  Currently only projectData and pageData is used
  //  Need to add globalBlocks
  projectData?: Project;
  pageData?: Page;
  // globalBlocks: Array<GlobalBlock>;
}

export interface Publish {
  handler: (res: Response<Data>, rej: Response<string>, args: Data) => void;
}
