import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { GlobalBlock, Page, Project } from "visual/types";
import { Asset } from "../common/transforms/assets";
import { Output as CompilerOutput } from "./bootstrap/types";

//#region GetCompileHTML

export interface Data {
  config: ConfigCommon;
  project: Project;
  page: Page;
  globalBlocks?: Array<GlobalBlock>;
  needToCompile: {
    project?: Project;
    page?: Page;
    globalBlocks?: Array<GlobalBlock>;
  };
}

export type JsonOutput = CompilerOutput;

export interface HtmlOutput {
  html: string;
  styles: Array<string>;
  scripts: Array<string>;
}

export type Output = JsonOutput | HtmlOutput;

export type GlobalBlockOutput = Output & {
  uid: string;
};

interface ProjectHtmlOutput {
  styles: Array<string>;
}

interface ProjectJsonOutput {
  styles: Array<Asset>;
}

export type ProjectOutput = ProjectHtmlOutput | ProjectJsonOutput;

export interface Compile {
  page: Output;
  globalBlocks?: Array<GlobalBlockOutput>;
  project?: ProjectOutput;
}

//#endregion
