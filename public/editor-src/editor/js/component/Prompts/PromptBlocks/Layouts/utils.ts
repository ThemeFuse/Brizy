import { Arr, Obj } from "@brizy/readers";
import { mPipe } from "fp-utilities";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { CustomTemplatePage } from "visual/global/Config/types/configs/blocks/PredefinedBlocks";
import { Filter, LayoutData } from "./types";

export const getPageId = (data: LayoutData) =>
  mPipe(
    Obj.readKey("pages"),
    Arr.read,
    (r) => (r[0] as CustomTemplatePage).id
  )(data);

export const getDefaultFilter = (config: ConfigCommon): Filter => ({
  category: config.ui?.prompts?.blockAdder?.category || "*",
  search: ""
});
