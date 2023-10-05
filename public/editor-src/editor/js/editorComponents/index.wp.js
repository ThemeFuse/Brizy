import { hasSidebars, pluginActivated } from "visual/utils/wp";
import Search from "./Search";
import WOOAddToCart from "./WordPress/WOOAddToCart";
import WOOAttributes from "./WordPress/WOOAttributes";
import WOOCart from "./WordPress/WOOCart";
import WOOCategories from "./WordPress/WOOCategories";
import WOOExcerpt from "./WordPress/WOOExcerpt";
import WOOGallery from "./WordPress/WOOGallery";
import WOOPages from "./WordPress/WOOPages";
import WOOPrice from "./WordPress/WOOPrice";
import WOOProductMeta from "./WordPress/WOOProductMeta";
import WOOProductPage from "./WordPress/WOOProductPage";
import WOOProducts from "./WordPress/WOOProducts";
import WOORating from "./WordPress/WOORating";
import WOOSku from "./WordPress/WOOSku";
import WOOStock from "./WordPress/WOOStock";
import WPBreadcrumbs from "./WordPress/WPBreadcrumbs";
import WPCustomShortcode from "./WordPress/WPCustomShortcode";
import WPPostInfo from "./WordPress/WPPostInfo";
import WPPostNavigation from "./WordPress/WPPostNavigation";
// import WPPosts from "./WordPress/WPPosts";
import WPSidebar from "./WordPress/WPSidebar";
import nonWP from "./index.js";

export default {
  ...nonWP,
  ...(hasSidebars() ? { WPSidebar } : {}),
  WPCustomShortcode,
  WPPostNavigation,
  WPBreadcrumbs,

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
