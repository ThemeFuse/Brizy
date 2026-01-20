import { ElementModel } from "visual/component/Elements/Types";
import { RenderType } from "visual/providers/RenderProvider";

export interface MigrationRichText {
  version: number;
  cb: (
    v: ElementModel,
    deps?: unknown,
    renderContext?: RenderType
  ) => ElementModel;
}
