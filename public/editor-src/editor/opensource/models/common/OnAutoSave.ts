import { Page } from "../Page";
import { Project } from "../Project";

export interface AutoSaveOutput {
  pageData?: Page;
  projectData?: Project;
}
export type OnAutoSave = (output: AutoSaveOutput) => void;
