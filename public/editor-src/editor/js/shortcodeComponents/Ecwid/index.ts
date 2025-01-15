import type { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import type { Shortcode } from "visual/types";
import { getDaysLeft } from "../../utils/ecwid";
import getCart from "./Cart";
import getFavorites from "./Favorites";
import getMyAccount from "./MyAccount";
import getProduct from "./Product";
import getShoppingBag from "./ShoppingBag";

const pro = (c: ConfigCommon): boolean => getDaysLeft(c) <= 0;

function config(): Shortcode[] {
  return [
    { component: getCart(), pro },
    { component: getProduct(), pro },
    // remove later
    // { component: Products, pro: false },
    { component: getShoppingBag(), pro },
    { component: getMyAccount(), pro },
    { component: getFavorites(), pro }
  ];
}
export default config;
