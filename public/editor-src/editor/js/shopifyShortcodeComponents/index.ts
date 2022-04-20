import { Shortcodes } from "visual/types";
import AddToCart from "./AddToCart";
import Quantity from "./Quantity";
import Price from "./Price";
import Variations from "./Variations";
import ProductTitle from "./ProductTitle";
import CollectionTitle from "./CollectionTitle";
import BlogTitle from "./BlogTitle";
import ProductReview from "./ProductReview";

const config = ((): Shortcodes => {
  return {
    base: [
      { component: ProductTitle, pro: false },
      { component: AddToCart, pro: false },
      { component: Quantity, pro: false },
      { component: Price, pro: false },
      { component: ProductReview, pro: false },
      { component: Variations, pro: false }
    ],
    blog: [{ component: BlogTitle, pro: false }],
    collection: [{ component: CollectionTitle, pro: false }]
  };
})();

export default config;
