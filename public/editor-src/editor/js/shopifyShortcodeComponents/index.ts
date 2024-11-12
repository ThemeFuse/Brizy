import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { Shortcodes } from "visual/types";
import getAddToCart from "./AddToCart";
import getBlogPostExcerpt from "./BlogPostExcerpt";
import getBlogPostList from "./BlogPostList";
import getBlogPostMeta from "./BlogPostMeta";
import getCollectionList from "./CollectionList";
import getDescription from "./Description";
import getImage from "./Image";
import getPrice from "./Price";
import getProductList from "./ProductList";
import getProductMetafield from "./ProductMetafield";
import getQuantity from "./Quantity";
import getTitle from "./Title";
import getVariant from "./Variant";
import getVendor from "./Vendor";

export const getShopifyShortcodeComponents = (
  config: ConfigCommon
): Shortcodes => {
  return {
    base: [
      { component: getTitle(config), pro: false },
      { component: getDescription(config), pro: false },
      { component: getImage(config), pro: false },
      { component: getProductMetafield(config), pro: false }
    ],
    products: [
      { component: getProductList(config), pro: false },
      { component: getAddToCart(config), pro: false },
      { component: getPrice(config), pro: false },
      { component: getQuantity(config), pro: false },
      { component: getVariant(config), pro: false },
      { component: getVendor(config), pro: false }
    ],
    collection: [{ component: getCollectionList(config), pro: false }],
    blog: [
      { component: getBlogPostList(config), pro: false },
      { component: getBlogPostMeta(config), pro: false },
      { component: getBlogPostExcerpt(config), pro: false }
    ]
  };
};
