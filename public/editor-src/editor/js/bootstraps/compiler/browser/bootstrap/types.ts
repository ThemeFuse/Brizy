import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { GlobalBlock, Page, Project } from "visual/types";
import {
  ScriptsFree,
  ScriptsPro,
  StylesFree,
  StylesPro
} from "../../common/transforms/assets";

export type GlobalBlockRecord = Record<string, GlobalBlock>;

export interface Output {
  html: string;
  assets: {
    freeStyles: StylesFree;
    freeScripts: ScriptsFree;
    proStyles?: StylesPro;
    proScripts?: ScriptsPro;
  };
}

export interface GlobalBlockStatic extends Output {
  uid: string;
}

export interface Static {
  page: Output;
  globalBlocks?: Array<GlobalBlockStatic>;
}

export interface Props {
  config: ConfigCommon;
  page: Page;
  project: Project;
  globalBlocks?: Array<GlobalBlock>;
  needToCompile: {
    page?: Page;
    project?: Project;
    globalBlocks?: Array<GlobalBlock>;
  };
}
