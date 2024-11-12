import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { isCloudWithShopModules } from "visual/global/Config/types/Module";
import { isEcwidShop } from "visual/global/Config/types/configs/Base";

export const ECWID_PRODUCT_TYPE = "ecwid-product";
export const ECWID_PRODUCT_CATEGORY_TYPE = "ecwid-product-category";
export const ECWID_CATEGORY_TYPE = "ecwid-category";

export const getDaysLeft = (config: ConfigCommon) =>
  isCloudWithShopModules(config.modules) && isEcwidShop(config.modules.shop)
    ? config.modules.shop.daysLeft
    : 0;
