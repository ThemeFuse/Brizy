import { updateProject } from "../api";
import { AutoSave } from "../types/AutoSave";

export const autoSave = (data: AutoSave) => {
  if (data.projectData) {
    updateProject(data.projectData);
  }
};
