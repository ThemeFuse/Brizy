import { ElementModel } from "visual/component/Elements/Types";
import { MigrationValues } from "visual/utils/migration";

export interface MigrationRichText {
  version: number;
  cb: ({ v, vd, vs, renderContext }: MigrationValues) => ElementModel;
}
