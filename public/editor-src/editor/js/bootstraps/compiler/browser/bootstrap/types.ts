import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { EditorMode } from "visual/providers/EditorModeProvider";
import { GlobalBlock } from "visual/types/GlobalBlock";
import { Page } from "visual/types/Page";
import { Project } from "visual/types/Project";
import {
  Asset,
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

export interface ProjectOutput {
  styles: Array<Asset>;
}

export interface Static {
  page: Output;
  globalBlocks?: Array<GlobalBlockStatic>;
  project?: ProjectOutput;
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
  editorMode: EditorMode;
}
