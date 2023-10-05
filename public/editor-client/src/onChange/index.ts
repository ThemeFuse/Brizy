import { updatePage, updateProject } from "../api";
import { OnChange } from "../types/OnChange";

export const onChange = (data: OnChange) => {
  if (data.projectData) {
    updateProject(data.projectData, { is_autosave: 0 });
  }

  if (data.pageData) {
    updatePage(data.pageData, { is_autosave: 0 });
  }
};
