import { Shortcode } from "visual/types";
import Product from "./Product";
import Products from "./Products";
import Cart from "./Cart";
import MyAccount from "./MyAccount";
import ShoppingBag from "./ShoppingBag";

const config: Shortcode[] = [
  { component: Cart, pro: false },
  { component: Product, pro: false },
  { component: Products, pro: false },
  { component: ShoppingBag, pro: false },
  { component: MyAccount, pro: false }
];

export default config;
