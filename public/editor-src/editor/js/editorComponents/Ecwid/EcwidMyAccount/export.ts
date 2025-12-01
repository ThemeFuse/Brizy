import { Str } from "@brizy/readers";
import type { EcwidStoreId } from "visual/global/Ecwid/types";
import { EcwidService } from "visual/libs/Ecwid";
import type { EcwidConfig } from "visual/libs/Ecwid/types/EcwidConfig";
import type { ExportFunction } from "visual/types";
import { getEcwidShopPathFromAttribute } from "visual/utils/ecwid";
import { makeAttr } from "visual/utils/i18n/attribute";
import { parseFromString } from "visual/utils/string";

export const fn: ExportFunction = ($node) => {
  $node.find(".brz-ecwid-my-account").each((_, node) => {
    const storeId = node.getAttribute("data-store-id") as EcwidStoreId | null;
    const config = Str.read(node.getAttribute("data-storefront"));
    const cfg = config ? parseFromString<EcwidConfig>(config) : {};
    const baseUrl = getEcwidShopPathFromAttribute(node) ?? "";
    const langLocale = node.getAttribute(makeAttr("lang-locale")) ?? "";

    const onPageLoaded = () => {
      const items = node.querySelectorAll(
        ".ec-cart__body .ec-confirmation .ec-cart__products-inner .ec-cart__item .ec-cart-item__image"
      );

      items.forEach((cartItem) => {
        cartItem.addEventListener(
          "click",
          (e) => {
            e.preventDefault();
            e.stopPropagation();

            const imageWrap = (e.target as HTMLElement | null)?.closest(
              ".ec-cart-item__picture"
            );

            if (imageWrap) {
              const href = imageWrap.getAttribute("href");

              window.location.href = `${baseUrl}${href}`;
            }
          },
          true
        );
      });
    };

    if (storeId) {
      EcwidService.init(storeId, {
        ...cfg,
        onPageLoaded,
        baseUrl,
        langLocale
      }).myAccount(node);
    }
  });
};
