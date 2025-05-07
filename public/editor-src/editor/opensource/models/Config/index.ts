import { EditorMode } from "../../types/mode";
import { Api } from "../Api";
import { Elements } from "../Elements";
import { Extension } from "../Extension";
import { Integrations } from "../Integrations";
import { Menu } from "../Menu";
import { Page } from "../Page";
import { Project } from "../Project";
import { UI } from "../UI";
import { OnAutoSave } from "../common/OnAutoSave";
import { OnSave } from "../common/OnSave";

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
