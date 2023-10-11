import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { mCompose } from "visual/utils/value";
import { searchPage } from "./searchPage";
import { getBlogPostMeta } from "./shopify/getBlogPostMeta";
import { getMetafields } from "./shopify/loadMetafields";

export const addDefault = <C extends ConfigCommon>(c: C): C => {
  const withDefault = mCompose<C, C, C, C>(
    searchPage,
    getMetafields,
    getBlogPostMeta
  );
  return withDefault(c) ?? c;
};
