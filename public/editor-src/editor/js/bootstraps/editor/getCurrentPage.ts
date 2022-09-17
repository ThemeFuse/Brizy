import { match } from "fp-utilities";
import { Config } from "visual/global/Config/types";
import {
  isCollectionPage,
  isCustomerPage,
  isEcwidCategory,
  isEcwidProduct,
  ShopModules
} from "visual/global/Config/types/configs/Base";
import {
  isCloud,
  isCMS,
  isShopify
} from "visual/global/Config/types/configs/Cloud";
import { Ecwid } from "visual/global/Config/types/configs/modules/shop/Ecwid";
import { isWp } from "visual/global/Config/types/configs/WP";
import { CollectionItemId, Page, PageWP } from "visual/types";
import {
  getCustomerPage,
  getEcwidCategory,
  getEcwidProduct,
  getPage
} from "visual/utils/api";
import {
  itemToPageCollection,
  itemToPageShopify
} from "visual/utils/api/cms/convertors";

export const getCurrentPage: (config: Config) => Promise<Page> = match(
  // @ts-expect-error, We actually call getPage from index-legacy.wp.js, but TS compiler doesn't know that
  [isWp, (c) => getPage(c.wp.page as CollectionItemId) as Promise<PageWP>],
  [
    isCloud,
    match(
      [
        isCMS,
        (c) =>
          match(
            [isCustomerPage, (p) => getCustomerPage(p.id)],
            [isCollectionPage, (p) => getPage(p.id).then(itemToPageCollection)],
            [
              isEcwidProduct,
              (p) =>
                match(
                  [
                    (s: ShopModules): s is undefined => s === undefined,
                    () => Promise.reject()
                  ],
                  [
                    (s: ShopModules): s is Ecwid =>
                      (s as Ecwid)?.type === "ecwid",
                    (s) => getEcwidProduct(p.id, s)
                  ]
                )(c.modules?.shop)
            ],
            [
              isEcwidCategory,
              (p) =>
                match(
                  [
                    (s: ShopModules): s is undefined => s === undefined,
                    () => Promise.reject()
                  ],
                  [
                    (s: ShopModules): s is Ecwid =>
                      (s as Ecwid)?.type === "ecwid",
                    (s) => getEcwidCategory(p.id, s)
                  ]
                )(c.modules?.shop)
            ]
          )(c.page)
      ],
      [isShopify, (c) => getPage(c.page.id).then(itemToPageShopify)]
    )
  ]
);
