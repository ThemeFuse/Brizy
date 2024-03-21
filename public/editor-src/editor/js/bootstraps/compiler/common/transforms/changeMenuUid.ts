// @ts-expect-error, Don't really know why we get this error
import * as cheerio from "cheerio";
import { makeAttr, makeDataAttrString } from "visual/utils/i18n/attribute";
import { uuid } from "visual/utils/uuid";

// wee need to change all uid because
// some time users used Menu -> Menu and right now
// we are generated 2 nav with same id
// the first nav is for MMenu plugin, the second is for static views
export const changeMenuUid = ($: cheerio.Root): void => {
  const $menus = $(makeDataAttrString({ name: "mmenu-id" }));

  $menus.each(function (this: cheerio.Element) {
    const newUid = uuid();
    const $menu = $(this);
    const $mMenu = $menu.children(".brz-menu__mmenu");

    $menu.attr(makeAttr("mmenu-id"), `#${newUid}`);

    if ($mMenu) {
      $mMenu.attr("id", newUid);
    }
  });
};
