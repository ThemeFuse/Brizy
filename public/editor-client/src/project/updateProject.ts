import { APIProject, updateProject as apiUpdateProject } from "../api";
import { Project, UpdateProject } from "../types/Project";
import { t } from "../utils/i18n";

const stringifyProject = (project: Project): APIProject => {
  return { ...project, data: JSON.stringify(project.data) };
};

export const updateProject: UpdateProject = async (
  project,
  res,
  rej,
  extra
) => {
  const apiProject = stringifyProject(project);

  try {
    await apiUpdateProject(apiProject, extra);
    res(project);
  } catch (e) {
    rej(t("Failed to update project"));
  }
};
