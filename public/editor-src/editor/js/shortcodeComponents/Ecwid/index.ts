import type { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import type { Shortcode } from "visual/types";
import { getDaysLeft } from "../../utils/ecwid";
import getAddToCart from "./AddToCart";
import getCart from "./Cart";
import getFavorites from "./Favorites";
import getMyAccount from "./MyAccount";
import getPrice from "./Price";
import getProduct from "./Product";
import getShoppingBag from "./ShoppingBag";
import getSearch from "./Search"

const pro = (c: ConfigCommon): boolean => getDaysLeft(c) <= 0;

function config(): Shortcode[] {
  return [
    { component: getCart(), pro },
    { component: getProduct(), pro },
    { component: getSearch(), pro },
    // remove later
    // { component: Products, pro: false },
    { component: getShoppingBag(), pro },
    { component: getMyAccount(), pro },
    { component: getFavorites(), pro },
    { component: getPrice(), pro },
    { component: getAddToCart(), pro }
  ];
}
export default config;
