import { Shortcode } from "visual/types";
import Cart from "./Cart";
import MyAccount from "./MyAccount";
import Product from "./Product";
import ShoppingBag from "./ShoppingBag";

const config: Shortcode[] = [
  { component: Cart, pro: false },
  { component: Product, pro: false },
  // remove later
  // { component: Products, pro: false },
  { component: ShoppingBag, pro: false },
  { component: MyAccount, pro: false }
];

export default config;
