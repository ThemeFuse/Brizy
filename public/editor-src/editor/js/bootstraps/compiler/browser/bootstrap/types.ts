import type { Config } from "visual/global/Config";
import type { EditorMode } from "visual/providers/EditorModeProvider";
import type { GlobalBlock } from "visual/types/GlobalBlock";
import type { Page } from "visual/types/Page";
import type { Project } from "visual/types/Project";
import type { Output } from "../../common/toStatic/types";
import type { Asset } from "../../common/transforms/assets";

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
