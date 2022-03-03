import { Shortcodes } from "visual/types";
import AddToCart from "./AddToCart";
import Quantity from "./Quantity";
import Price from "./Price";
import Variations from "./Variations";

const config = ((): Shortcodes => {
  return {
    base: [
      { component: AddToCart, pro: false },
      { component: Quantity, pro: false },
      { component: Price, pro: false },
      { component: Variations, pro: false }
    ],
    blog: [],
    collection: []
  };
})();

export default config;
