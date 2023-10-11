import { ElementModel } from "visual/component/Elements/Types";

export interface MigrationImage {
  version: number;
  cb: (v: ElementModel) => ElementModel;
}
