import { Response } from "./Response";

//#region Project

export interface Project {
  id: string;
  data: Record<string, unknown>;
  dataVersion: number;
}

interface ProjectExtra {
  is_autosave: 1 | 0;
}

export type UpdateProject = (
  project: Project,
  res: Response<Project>,
  rej: Response<string>,
  extra: ProjectExtra
) => void;

//#endregion
