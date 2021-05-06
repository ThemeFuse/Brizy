import nonWP from "./index.js";
// import WPPosts from "./WordPress/WPPosts";
import WPSidebar from "./WPSidebar";
import WPCustomShortcode from "./WPCustomShortcode";
import WPFeaturedImage from "./WPFeaturedImage";
// import WOOProducts from "./WOOProducts";
// import WOOProductPage from "./WOOProductPage";
import WOOCategories from "./WOOCategories";
// import WOOAddToCart from "./WOOAddToCart";
import WOOPages from "./WOOPages";
// import WOOCategories2 from "./WOOCategories2";

import { hasSidebars, pluginActivated } from "visual/utils/wp";
import { IS_STORY } from "visual/utils/models";

import {
  IS_POST,
  IS_PAGE,
  IS_SINGLE_TEMPLATE,
  IS_PRODUCT_TEMPLATE,
  IS_PRODUCT_PAGE
} from "visual/utils/env";

const wordpressShortcodes = IS_STORY
  ? []
  : [
      ...(hasSidebars() ? [WPSidebar] : []),
      WPCustomShortcode,
      ...(IS_SINGLE_TEMPLATE || IS_POST || IS_PAGE ? [] : [WPFeaturedImage])
    ];

const woocommerceShortcodes =
  !IS_STORY && pluginActivated("woocommerce") ? [WOOCategories, WOOPages] : [];

const singleShortcodes =
  !IS_STORY || IS_SINGLE_TEMPLATE || IS_POST || IS_PAGE
    ? [WPFeaturedImage]
    : [];

export default {
  product: [],
  ...((IS_PRODUCT_TEMPLATE || IS_PRODUCT_PAGE) && {
    woocommerce: woocommerceShortcodes
  }),
  archive: [],
  single: singleShortcodes,
  ...nonWP,
  ...(!(IS_PRODUCT_TEMPLATE || IS_PRODUCT_PAGE) && {
    woocommerce: woocommerceShortcodes
  }),
  wordpress: wordpressShortcodes
};
