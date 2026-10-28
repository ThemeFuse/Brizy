import type { Page } from "../Page";
import type { Project } from "../Project";

export interface AutoSaveOutput {
  pageData?: Page;
  projectData?: Project;
}
export type OnAutoSave = (output: AutoSaveOutput) => void;
