//#region Project

export interface Project {
  id: string;
  data: Record<string, unknown>;
  dataVersion: number;
  compiled?: Record<string, unknown>;
}

//#endregion
