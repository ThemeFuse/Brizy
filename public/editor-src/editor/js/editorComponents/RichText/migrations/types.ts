import { ElementModel } from "visual/component/Elements/Types";

export interface MigrationRichText {
  version: number;
  cb: (v: ElementModel) => ElementModel;
}
