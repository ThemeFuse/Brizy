import nonWP from "./index.js";
// import WPPosts from "./WordPress/WPPosts";
import WPSidebar from "./WPSidebar";
import WPCustomShortcode from "./WPCustomShortcode";
// import WOOProducts from "./WOOProducts";
// import WOOProductPage from "./WOOProductPage";
import WOOCategories from "./WOOCategories";
// import WOOAddToCart from "./WOOAddToCart";
import WOOPages from "./WOOPages";
import WOOProducts2 from "./WOOProducts2";
// import WOOCategories2 from "./WOOCategories2";

import { hasSidebars, pluginActivated } from "visual/utils/wp";
import { IS_STORY } from "visual/utils/models";

import { IS_SINGLE_TEMPLATE } from "visual/utils/env";

const wordpressShortcodes = [
  ...(hasSidebars() ? [WPSidebar] : []),
  WPCustomShortcode
];

export default {
  product: [],
  archive: [],
  ...(!IS_STORY && IS_SINGLE_TEMPLATE ? { wordpress: wordpressShortcodes } : {}),
  ...nonWP,
  ...(IS_STORY || IS_SINGLE_TEMPLATE ? {} : { wordpress: wordpressShortcodes }),
  woocommerce: IS_STORY
    ? []
    : [
        ...(pluginActivated("woocommerce")
          ? [
              // WOOProducts,
              WOOProducts2,
              // WOOProductPage,
              WOOCategories,
              // WOOCategories2,
              WOOPages
            ]
          : [])
      ]
};
