import type { CheerioAPI } from "cheerio";
import { makeAttr, makeDataAttrString } from "visual/utils/i18n/attribute";
import { uuid } from "visual/utils/uuid";

// wee need to change all uid because
// some time users used Menu -> Menu and right now
// we are generated 2 nav with same id
// the first nav is for MMenu plugin, the second is for static views
export const changeMenuUid = ($: CheerioAPI): void => {
  const $menus = $(makeDataAttrString({ name: "mmenu-id" }));

  $menus.each((_, el) => {
    const newUid = uuid();
    const $menu = $(el);
    const $mMenu = $menu.children(".brz-menu__mmenu");

    $menu.attr(makeAttr("mmenu-id"), `#${newUid}`);

    if ($mMenu) {
      $mMenu.attr("id", newUid);
    }
  });
};
