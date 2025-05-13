import { Str } from "@brizy/readers";
import type { EcwidStoreId } from "visual/global/Ecwid/types";
import { EcwidService } from "visual/libs/Ecwid";
import type { EcwidConfig } from "visual/libs/Ecwid/types/EcwidConfig";
import type { ExportFunction } from "visual/types";
import { getEcwidShopPathFromAttribute } from "visual/utils/ecwid";
import { parseFromString } from "visual/utils/string";

const observerCallback = (mutations: MutationRecord[]): void => {
  for (const mutation of mutations) {
    const node = mutation.target as HTMLElement;

    const products = node.querySelectorAll<HTMLDivElement>(
      ".ec-filters__products .grid-product"
    );

    products.forEach((product) => {
      product.addEventListener(
        "click",
        (e) => {
          e.stopPropagation();
          e.preventDefault();

          const link = (e.target as HTMLElement | null)?.closest(
            ".grid-product__image"
          );

          if (link) {
            const href = link.getAttribute("href");

            if (href) {
              window.open(href, "_blank");
            }
          }
        },
        true
      );

      product.classList.add("brz-enabled");
    });
  }
};

const observer = new MutationObserver(observerCallback);

export const fn: ExportFunction = ($node) => {
  const root = $node.get(0);

  if (!root) {
    return;
  }

  root.querySelectorAll<HTMLDivElement>(".brz-ecwid-search").forEach((node) => {
    const storeId = node.getAttribute("data-store-id") as EcwidStoreId | null;
    const config = Str.read(node.getAttribute("data-storefront"));
    const cfg = config ? parseFromString<EcwidConfig>(config) : {};
    const baseUrl = getEcwidShopPathFromAttribute(node) ?? "";

    if (storeId) {
      observer.observe(node, { childList: true, subtree: true });

      EcwidService.init(storeId, {
        ...cfg,
        baseUrl
      }).search(node);
    }
  });
};
