import { EditorMode } from "../../types/mode";
import { Api } from "../Api";
import { Elements } from "../Elements";
import { Extension } from "../Extension";
import { Integrations } from "../Integrations";
import { Menu } from "../Menu";
import { Page } from "../Page";
import { Project } from "../Project";
import { HtmlOutputType } from "../common";
import { OnAutoSave } from "../common/OnAutoSave";
import { OnSave } from "../common/OnSave";

export interface Config<T extends HtmlOutputType> {
  //#region Base

  mode: EditorMode;
  projectData: Project;
  pageData: Page;
  htmlOutputType: T;

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

  //#region Events

  onSave?: OnSave<T>;
  onAutoSave?: OnAutoSave<T>;
  onLoad?: VoidFunction;

  //#endregion
}
