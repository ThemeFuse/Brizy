import { updateProject } from "../api";
import { OnChange } from "../types/OnChange";

export const onChange = (data: OnChange) => {
  if (data.projectData) {
    updateProject(data.projectData, { is_autosave: 0 });
  }
};
