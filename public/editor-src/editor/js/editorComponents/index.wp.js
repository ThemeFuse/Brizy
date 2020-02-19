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
import Posts from "./Posts";
import WPBreadcrumbs from "./WordPress/WPBreadcrumbs";
import WPPostsTitle from "./WordPress/WPPostsTitle";
import WPPostExcerpt from "./WordPress/WPPostExcerpt";
import WPPostContent from "./WordPress/WPPostContent";
import WPPostInfo from "./WordPress/WPPostInfo";
// import WOOSku from "./WordPress/WOOSku";
// import WOOStock from "./WordPress/WOOStock";
// import WOOPrice from "./WordPress/WOOPrice";
// import WOOAdditional from "./WordPress/WOOAdditional";
import Search from "./Search";

import { hasSidebars, pluginActivated } from "visual/utils/wp";

export default {
  ...nonWP,
  Posts,
  ...(hasSidebars() ? { WPSidebar } : {}),
  WPCustomShortcode,
  WPNavigation,
  WPBreadcrumbs,
  WPPostsTitle,
  WPPostExcerpt,
  WPPostContent,
  WPPostInfo,
  Search,
  ...(pluginActivated("woocommerce")
    ? {
        WOOProducts,
        WOOProductPage,
        WOOCategories,
        WOOPages
        // WOOSku,
        // WOOStock,
        // WOOPrice,
        // WOOAdditional
      }
    : {})
};

export { NotFoundComponent } from "./index.js";
