import { Shortcode } from "visual/types";
import Cart from "./Cart";
import MyAccount from "./MyAccount";
import Product from "./Product";
import { getDaysLeft } from "../../utils/ecwid";
import ShoppingBag from "./ShoppingBag";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";

const config: Shortcode[] = [
  {
    component: Cart,
    pro: (c: ConfigCommon): boolean => getDaysLeft(c) <= 0
  },
  {
    component: Product,
    pro: (c: ConfigCommon): boolean => getDaysLeft(c) <= 0
  },
  // remove later
  // { component: Products, pro: false },
  {
    component: ShoppingBag,
    pro: (c: ConfigCommon): boolean => getDaysLeft(c) <= 0
  },
  {
    component: MyAccount,
    pro: (c: ConfigCommon): boolean => getDaysLeft(c) <= 0
  }
];

export default config;
