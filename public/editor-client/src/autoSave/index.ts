import { updatePage, updateProject } from "../api";
import { AutoSave } from "../types/AutoSave";

export const autoSave = (data: AutoSave) => {
  if (data.projectData) {
    updateProject(data.projectData);
  }

  if (data.pageData) {
    updatePage(data.pageData);
  }
};
