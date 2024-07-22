import { mPipe } from "fp-utilities";
import { Arr, Obj } from "@brizy/readers";
import { CustomTemplatePage } from "visual/global/Config/types/configs/blocks/PredefinedBlocks";
import { LayoutData } from "visual/component/Prompts/PromptBlocks/Layouts/types";

export const getPageId = (data: LayoutData) =>
  mPipe(
    Obj.readKey("pages"),
    Arr.read,
    (r) => (r[0] as CustomTemplatePage).id
  )(data);
