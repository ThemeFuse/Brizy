import { Num, Str } from "@brizy/readers";
import { MouseEvent as ReactMouseEvent } from "react";
import { isCloudWithShopModules } from "visual/global/Config/types/Module";
import { isEcwidShop } from "visual/global/Config/types/configs/Base";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import {
  EcwidProductId,
  EcwidProductIdWithSlug
} from "visual/global/Ecwid/types";
import { makePlaceholder } from "visual/utils/dynamicContent";
import { makeAttr } from "visual/utils/i18n/attribute";
import { Literal } from "visual/utils/types/Literal";
import { MValue } from "visual/utils/value";

export const ECWID_PRODUCT_TYPE = "ecwid-product";
export const ECWID_PRODUCT_CATEGORY_TYPE = "ecwid-product-category";
export const ECWID_CATEGORY_TYPE = "ecwid-category";
export const ECWID_RELATED_PRODUCTS_SLUG = "ecwid_related_products";

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

//#region EcwidProductId

export const isEcwidProductId = (id: unknown): id is EcwidProductId =>
  !!Num.read(id);

export const isEcwidProductIdWithSlug = (
  id: unknown
): id is EcwidProductIdWithSlug => {
  const _id = Str.read(id);

  if (_id === undefined) {
    return false;
  }

  const regex = /ecwid-product\/\d+$/m;

  return regex.test(_id);
};

export const getEcwidProductIdFromSlug = (
  slugWithId: EcwidProductIdWithSlug
): MValue<EcwidProductId> => {
  const id = Num.read(slugWithId.split("/")[1]);

  if (isEcwidProductId(id)) {
    return id;
  }
};

export const getEcwidProductId = (id: Literal): EcwidProductId => {
  if (isEcwidProductIdWithSlug(id)) {
    const idFromSlug = getEcwidProductIdFromSlug(id);

    if (idFromSlug) {
      return idFromSlug;
    }
  }

  return id as EcwidProductId;
};
// endregion
