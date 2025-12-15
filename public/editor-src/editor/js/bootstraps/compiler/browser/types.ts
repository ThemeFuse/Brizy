import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { Store } from "visual/redux/store";
import { BlockHtml } from "visual/types/Block";
import { GlobalBlock } from "visual/types/GlobalBlock";
import { Page } from "visual/types/Page";
import { Project } from "visual/types/Project";
import {
  Asset,
  ScriptsFree,
  ScriptsPro,
  StylesFree,
  StylesPro
} from "../common/transforms/assets";

//#region GetCompileHTML

export interface Data {
  config: ConfigCommon;
  store: Store;
  project?: Project;
  page?: Page;
  globalBlocks?: Array<GlobalBlock>;
  blocksHtml?: Record<string, BlockHtml>;
}

export type JsonOutput = {
  html: string;
  assets: {
    freeStyles: StylesFree;
    freeScripts: ScriptsFree;
    proStyles?: StylesPro;
    proScripts?: ScriptsPro;
  };
};

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
  fonts?: Array<string>;
}

interface ProjectJsonOutput {
  styles: Array<Asset>;
  fonts?: Array<Asset>;
}

export type ProjectOutput = ProjectHtmlOutput | ProjectJsonOutput;

export interface Compile {
  page: Output;
  globalBlocks?: Array<GlobalBlockOutput>;
  project?: ProjectOutput;
}

//#endregion
