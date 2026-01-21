import { ElementModel } from "visual/component/Elements/Types";
import { MigrationValues } from "visual/utils/migration";

export interface MigrationImage {
  version: number;
  cb: ({ v, vd, vs }: MigrationValues) => ElementModel;
}
