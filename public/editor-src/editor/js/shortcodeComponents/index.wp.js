import Config from "visual/global/Config";
import nonWP from "./index.js";
// import WPPosts from "./WordPress/WPPosts";
import WPSidebar from "./WordPress/WPSidebar";
import WPCustomShortcode from "./WordPress/WPCustomShortcode";
import WPNavigation from "./WordPress/WPNavigation";
import WOOProducts from "./WordPress/WOOProducts";
import WOOProductPage from "./WordPress/WOOProductPage";
import WOOCategories from "./WordPress/WOOCategories";
// import WOOAddToCart from "./WordPress/WOOAddToCart";
import WOOPages from "./WordPress/WOOPages";

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
