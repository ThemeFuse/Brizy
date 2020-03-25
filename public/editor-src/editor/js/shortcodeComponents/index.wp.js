import Config from "visual/global/Config";
import nonWP from "./index.js";
// import WPPosts from "./WordPress/WPPosts";
import WPSidebar from "./WPSidebar";
import WPCustomShortcode from "./WPCustomShortcode";
import WPNavigation from "./WPNavigation";
import WOOProducts from "./WOOProducts";
import WOOProductPage from "./WOOProductPage";
import WOOCategories from "./WOOCategories";
// import WOOAddToCart from "./WOOAddToCart";
import WOOPages from "./WOOPages";

import { hasSidebars, pluginActivated } from "visual/utils/wp";

const IS_PRO = Config.get("pro");

export default {
  ...nonWP,
  social: [],
  wordpress: [
    ...(hasSidebars() ? [WPSidebar] : []),
    WPCustomShortcode,
    ...(!IS_PRO ? [WPNavigation] : [])
  ],
  woocommerce: [
    ...(pluginActivated("woocommerce")
      ? [WOOProducts, WOOProductPage, WOOCategories, WOOPages]
      : [])
  ]
};
