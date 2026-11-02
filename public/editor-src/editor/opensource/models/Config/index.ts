import type { EditorMode } from "../../types/mode";
import type { Api } from "../Api";
import type { OnAutoSave } from "../common/OnAutoSave";
import type { OnSave } from "../common/OnSave";
import type { Elements } from "../Elements";
import type { Extension } from "../Extension";
import type { Integrations } from "../Integrations";
import type { Menu } from "../Menu";
import type { Page } from "../Page";
import type { Project } from "../Project";
import type { UI } from "../UI";

export interface EditorConfig {
  //#region Base

  mode: EditorMode;
  projectData: Project;
  pageData: Page;

  pagePreview?: string;
  autoSaveInterval?: number;

  //#endregion

  //#region Extensions

  extensions?: Array<Extension>;

  //#endregion

  //#region Menu

  menu?: Menu;

  //#endregion

  //#region Integrations

  integrations?: Integrations;

  //#endregion

  //#region l10n

  l10n?: Record<string, string>;

  //#endregion

  //#region elements

  elements?: Elements;

  //#endregion

  //#region API

  api?: Api;

  //#endregion

  //#region UI

  ui?: UI;

  //#endregion

  //#region Events

  onSave?: OnSave;
  onAutoSave?: OnAutoSave;
  onLoad?: VoidFunction;

  //#endregion
}

export interface PreviewConfig {
  //#region Menu

  menu?: Menu;

  //#endregion

  //#region Integrations

  integrations?: Integrations;

  //#endregion

  //#region API

  api?: Pick<Api, "media">;

  //#endregion
}
