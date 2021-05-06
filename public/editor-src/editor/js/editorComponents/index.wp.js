import nonWP from "./index.js";
// import WPPosts from "./WordPress/WPPosts";
import WPSidebar from "./WordPress/WPSidebar";
import WPCustomShortcode from "./WordPress/WPCustomShortcode";
import WPPostNavigation from "./WordPress/WPPostNavigation";
import WOOProducts from "./WordPress/WOOProducts";
import WOOProductPage from "./WordPress/WOOProductPage";
import WOOCategories from "./WordPress/WOOCategories";
import WOOAddToCart from "./WordPress/WOOAddToCart";
import WOOPages from "./WordPress/WOOPages";
import WPBreadcrumbs from "./WordPress/WPBreadcrumbs";
import WPPostContent from "./WordPress/WPPostContent";
import WPPostInfo from "./WordPress/WPPostInfo";
import WOOSku from "./WordPress/WOOSku";
import WOOStock from "./WordPress/WOOStock";
import WOOPrice from "./WordPress/WOOPrice";
import WOOAttributes from "./WordPress/WOOAttributes";
import WOOProductMeta from "./WordPress/WOOProductMeta";
import WOORating from "./WordPress/WOORating";
import WOOCart from "./WordPress/WOOCart";
import WOOExcerpt from "./WordPress/WOOExcerpt";
import WOOGallery from "./WordPress/WOOGallery";

import Search from "./Search";

import { hasSidebars, pluginActivated } from "visual/utils/wp";

export default {
  ...nonWP,
  ...(hasSidebars() ? { WPSidebar } : {}),
  WPCustomShortcode,
  WPPostNavigation,
  WPBreadcrumbs,
  WPPostContent,
  WPPostInfo,
  Search,
  ...(pluginActivated("woocommerce")
    ? {
        WOOProducts,
        WOOProductPage,
        WOOCategories,
        WOOPages,
        WOOExcerpt,
        WOOGallery,
        WOOAddToCart,
        WOOCart,
        WOOSku,
        WOOStock,
        WOOPrice,
        WOOAttributes,
        WOOProductMeta,
        WOORating
      }
    : {})
};

export { NotFoundComponent } from "./index.js";
