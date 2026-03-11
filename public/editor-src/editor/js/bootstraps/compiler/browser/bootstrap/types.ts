import type { Config } from "visual/global/Config";
import { EditorMode } from "visual/providers/EditorModeProvider";
import { GlobalBlock } from "visual/types/GlobalBlock";
import { Page } from "visual/types/Page";
import { Project } from "visual/types/Project";
import { Output } from "../../common/toStatic/types";
import { Asset } from "../../common/transforms/assets";

export type GlobalBlockRecord = Record<string, GlobalBlock>;

export type { Output };

export interface GlobalBlockStatic extends Output {
  uid: string;
}

export interface ProjectOutput {
  styles: Array<Asset>;
}

export interface Static {
  blocks: Array<{ id: string; block: Output }>;
  project?: ProjectOutput;
}

export interface Props {
  config: Config;
  page: Page;
  project: Project;
  editorMode: EditorMode;
}
