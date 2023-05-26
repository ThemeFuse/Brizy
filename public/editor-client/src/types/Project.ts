//#region Project

export interface Project {
  id: string;
  data: Record<string, unknown>;
  dataVersion: number;
}

export interface PublishData {
  // TODO  Currently only projectData is used
  //  Need to add pageData and globalBlocks
  projectData?: Project;
  is_autosave: 1 | 0;
  // pageData: PageCommon;
  // globalBlocks: Array<GlobalBlock>;
}

//#endregion
