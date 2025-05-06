import { Response } from "../common";
import { Output, PageDataOutput, ProjectDataOutput } from "../common/Output";

export interface PublishData {
  projectData?: ProjectDataOutput;
  pageData?: PageDataOutput;
  error?: string;
}

export interface Publish {
  handler: (
    res: Response<PublishData>,
    rej: Response<string>,
    extra: Output
  ) => void;
}
