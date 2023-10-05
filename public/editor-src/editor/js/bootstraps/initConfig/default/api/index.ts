import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { mCompose } from "visual/utils/value";
import { getSourceChoices } from "./getSourceChoices";
import { getSourceItems } from "./getSourceItems";
import { searchPage } from "./searchPage";
import { getBlogPostMeta } from "./shopify/getBlogPostMeta";
import { getMetafields } from "./shopify/loadMetafields";

export const addDefault = <C extends ConfigCommon>(c: C): C => {
  const withDefault = mCompose<C, C, C, C, C, C>(
    searchPage,
    getSourceChoices,
    getSourceItems,
    getMetafields,
    getBlogPostMeta
  );
  return withDefault(c) ?? c;
};
