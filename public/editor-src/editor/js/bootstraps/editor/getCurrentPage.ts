import { Config } from "visual/global/Config/types";
import { getCustomerPage, getEcwidProduct, getPage } from "visual/utils/api";
import { CollectionItemId, Page, PageWP } from "visual/types";
import { isWp } from "visual/global/Config/types/configs/WP";
import {
  isCMS,
  isCloud,
  isShopify
} from "visual/global/Config/types/configs/Cloud";
import { match } from "fp-utilities";
import {
  isCollectionPage,
  isCustomerPage,
  isEcwidProduct,
  ShopModules
} from "visual/global/Config/types/configs/Base";
import {
  itemToPageCollection,
  itemToPageShopify
} from "visual/utils/api/cms/convertors";
import { Ecwid } from "visual/global/Config/types/configs/modules/shop/Ecwid";

export const getCurrentPage: (config: Config) => Promise<Page> = match(
  // @ts-expect-error, We actually call getPage from index-legacy.wp.js, but TS compiler doesn't know that
  [isWp, c => getPage(c.wp.page as CollectionItemId) as Promise<PageWP>],
  [
    isCloud,
    match(
      [
        isCMS,
        c =>
          match(
            [isCustomerPage, p => getCustomerPage(p.id)],
            [isCollectionPage, p => getPage(p.id).then(itemToPageCollection)],
            [
              isEcwidProduct,
              p =>
                match(
                  [
                    (s: ShopModules): s is undefined => s === undefined,
                    () => Promise.reject()
                  ],
                  [
                    (s: ShopModules): s is Ecwid =>
                      (s as Ecwid)?.type === "ecwid",
                    s => getEcwidProduct(p.id, s)
                  ]
                )(c.modules?.shop)
            ]
          )(c.page)
      ],
      [isShopify, c => getPage(c.page.id).then(itemToPageShopify)]
    )
  ]
);
