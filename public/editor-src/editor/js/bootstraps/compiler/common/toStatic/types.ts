import {
  ScriptsFree,
  ScriptsPro,
  StylesFree,
  StylesPro
} from "../transforms/assets";

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
