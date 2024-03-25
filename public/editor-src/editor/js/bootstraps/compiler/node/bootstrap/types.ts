import {
  Asset,
  ScriptsFree,
  ScriptsPro,
  StylesFree,
  StylesPro
} from "../../common/transforms/assets";

export interface GlobalBlockStatic extends Output {
  uid: string;
}

export interface Output {
  html: string;
  assets: {
    freeStyles: StylesFree;
    freeScripts: ScriptsFree;
    proStyles?: StylesPro;
    proScripts?: ScriptsPro;
  };
}

export interface ProjectOutput {
  styles: Array<Asset>;
}

export interface Static {
  page: Output;
  project: ProjectOutput;
  globalBlocks?: Array<GlobalBlockStatic>;
}
