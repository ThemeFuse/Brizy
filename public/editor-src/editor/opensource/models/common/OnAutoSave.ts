import { HtmlOutputType } from ".";
import { PageData, ProjectData } from "./Output";

export interface AutoSaveOutput<T extends HtmlOutputType> {
  pageData?: PageData<T>;
  projectData?: ProjectData<T>;
}
export type OnAutoSave<T extends HtmlOutputType> = (
  output: AutoSaveOutput<T>
) => void;
