import { Shortcodes } from "visual/types";
import ProductTitle from "./ProductTitle";
import AddToCart from "./AddToCart";
import Quantity from "./Quantity";
import Price from "./Price";
import Variations from "./Variations";

const config = ((): Shortcodes => {
  return {
    base: [{ component: ProductTitle, pro: false }],
    products: [
      { component: AddToCart, pro: false },
      { component: Quantity, pro: false },
      { component: Price, pro: false },
      { component: Quantity, pro: false },
      { component: Variations, pro: false }
    ]
  };
})();

export default config;
