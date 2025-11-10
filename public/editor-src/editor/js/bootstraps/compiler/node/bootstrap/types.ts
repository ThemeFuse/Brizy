import type {
  Asset,
  ScriptsFree,
  ScriptsPro,
  StylesFree,
  StylesPro
} from "../../common/transforms/assets";
import type { SymbolAsset } from "../../common/transforms/assets/makeSymbols";

export interface Output {
  id: string;
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

export interface GlobalBlockStatic {
  uid: string;
  blocks: Array<Output>;
}

export interface Static {
  page: {
    rootClassNames?: Array<string>;
    rootAttributes?: Record<string, string | boolean>;
    blocks: Array<Output>;
  };
  project: ProjectOutput;
  globalBlocks?: Array<GlobalBlockStatic>;
  symbols: SymbolAsset[];
}
