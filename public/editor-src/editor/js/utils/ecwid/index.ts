import { MouseEvent as ReactMouseEvent } from "react";
import { isCloudWithShopModules } from "visual/global/Config/types/Module";
import { isEcwidShop } from "visual/global/Config/types/configs/Base";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { makePlaceholder } from "visual/utils/dynamicContent";
import { makeAttr } from "visual/utils/i18n/attribute";

export const ECWID_PRODUCT_TYPE = "ecwid-product";
export const ECWID_PRODUCT_CATEGORY_TYPE = "ecwid-product-category";
export const ECWID_CATEGORY_TYPE = "ecwid-category";

export const getDaysLeft = (config: ConfigCommon) =>
  isCloudWithShopModules(config.modules) && isEcwidShop(config.modules.shop)
    ? config.modules.shop.daysLeft
    : 0;

export const getEcwidShopPathPlaceholder = () =>
  makePlaceholder({
    content: "{{shop_path}}"
  });

export const getEcwidShopPathFromAttribute = (
  node: HTMLElement
): string | null => node.getAttribute(makeAttr("shop-path"));

export const containsNode = (
  e: ReactMouseEvent<HTMLDivElement, MouseEvent>,
  selector: string
): boolean => !!(e.target as HTMLElement | null)?.closest(selector);
