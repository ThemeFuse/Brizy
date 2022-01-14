import { Shortcodes } from "visual/types";
import ProductTitle from "./ProductTitle";

const config = ((): Shortcodes => {
  return {
    base: [{ component: ProductTitle, pro: false }]
  };
})();

export default config;
