import { Page } from "./Page";
import { Project } from "./Project";
import { Response } from "./Response";
import { ClassSymbol } from "./Symbols";

export interface Data {
  // TODO  Currently only projectData and pageData is used
  //  Need to add globalBlocks
  projectData?: Project;
  pageData?: Page;
  symbols: ClassSymbol[];
  // globalBlocks: Array<GlobalBlock>;
}

export interface Publish {
  handler: (res: Response<Data>, rej: Response<string>, args: Data) => void;
}
