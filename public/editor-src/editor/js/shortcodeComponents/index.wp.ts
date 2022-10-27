import Config, { WP } from "visual/global/Config";
import { Shortcodes } from "visual/types/index.js";
import {
  IS_ARCHIVE_TEMPLATE,
  IS_PAGE,
  IS_POST,
  IS_PRODUCT_ARCHIVE_TEMPLATE,
  IS_PRODUCT_PAGE,
  IS_PRODUCT_TEMPLATE,
  IS_SINGLE_TEMPLATE
} from "visual/utils/env";
import { isStory } from "visual/utils/models";
import { hasSidebars, pluginActivated } from "visual/utils/wp";
import Archive from "./Archive";
import {
  essentialsCommon,
  essentialsStory,
  grid,
  media,
  mediaStory,
  social
} from "./index.common";
import PostExcerpt from "./PostExcerpt";
import Posts from "./Posts";
import PostTitle from "./PostTitle";
import Products from "./pro/Products";
import Review from "./pro/Review.js";
import Search from "./pro/Search";
import WOOAddToCart from "./pro/WOOAddToCart";
import WOOArchives from "./pro/WOOArchives";
import WOOAttributes from "./pro/WOOAttributes";
import WOOBreadcrumbs from "./pro/WOOBreadcrumbs.js";
import WOOCart from "./pro/WOOCart";
import WOOExcerpt from "./pro/WOOExcerpt";
import WOOGallery from "./pro/WOOGallery";
import WOOPrice from "./pro/WOOPrice";
import WOOProductContent from "./pro/WOOProductContent.js";
import WOOProductMeta from "./pro/WOOProductMeta";
import WOOProductTitle from "./pro/WOOProductTitle";
import WOORating from "./pro/WOORating";
import WOOSku from "./pro/WOOSku";
import WOOStock from "./pro/WOOStock";
import WOOUpsell from "./pro/WOOUpsell.js";
import WPBreadcrumbs from "./pro/WPBreadcrumbs";
import WPPostContent from "./pro/WPPostContent";
import WPPostInfo from "./pro/WPPostInfo";
import WPPostNavigation from "./pro/WPPostNavigation";
import WOOCategories from "./WOOCategories";
import WOOPages from "./WOOPages";
import WPCustomShortcode from "./WPCustomShortcode";
import WPFeaturedImage from "./WPFeaturedImage";
import WPSidebar from "./WPSidebar";

const _config = Config.getAll() as WP;

const hasWoocommerce = pluginActivated("woocommerce");

const featuredImage = { component: WPFeaturedImage, pro: true };

const essentialsWP = [...essentialsCommon, { component: Search, pro: true }];

const wordpressShortcodes = [
  ...(hasSidebars() ? [{ component: WPSidebar, pro: false }] : []),
  { component: WPCustomShortcode, pro: false },
  ...(IS_SINGLE_TEMPLATE || IS_POST || IS_PAGE ? [] : [featuredImage])
];

const woocommerceShortcodes = hasWoocommerce
  ? [
      { component: WOOCategories, pro: false },
      { component: WOOPages, pro: false },

      { component: Products, pro: true },
      { component: WOOCart, pro: true }
    ]
  : [];

const singleShortcodes = [
  featuredImage,

  { component: PostTitle, pro: true },
  { component: PostExcerpt, pro: true },
  ...(IS_SINGLE_TEMPLATE ? [{ component: WPPostContent, pro: true }] : []),
  { component: WPPostInfo, pro: true },
  { component: WPBreadcrumbs, pro: true },
  ...(IS_SINGLE_TEMPLATE || IS_POST
    ? [{ component: WPPostNavigation, pro: true }]
    : []),
  { component: Posts, pro: true }
];

const productShortcodes = hasWoocommerce
  ? [
      { component: WOOProductTitle, pro: true },
      { component: WOOExcerpt, pro: true },
      { component: WOOProductContent, pro: true },
      { component: WOOPrice, pro: true },
      { component: WOOGallery, pro: true },
      { component: WOOAddToCart, pro: true },
      { component: WOOStock, pro: true },
      { component: WOOSku, pro: true },
      { component: WOOProductMeta, pro: true },
      { component: WOORating, pro: true },
      { component: WOOAttributes, pro: true },
      { component: WOOUpsell, pro: true },
      { component: WOOBreadcrumbs, pro: true },
      { component: Review, pro: true }
    ]
  : [];

const productArchiveShortcodes = hasWoocommerce
  ? [
      { component: WOOArchives, pro: true },
      { component: PostTitle, pro: true },
      { component: PostExcerpt, pro: true },
      { component: Posts, pro: true }
    ]
  : [];

const postArchiveShortcodes = [
  { component: Archive, pro: true },
  { component: PostTitle, pro: true },
  { component: PostExcerpt, pro: true },
  { component: Posts, pro: true }
];

const config = ((): Shortcodes => {
  if (isStory(_config)) {
    return { essentials: essentialsStory, media: mediaStory };
  }

  if (IS_PRODUCT_TEMPLATE || IS_PRODUCT_PAGE) {
    return {
      grid,
      product: productShortcodes,
      woocommerce: woocommerceShortcodes,
      essentials: essentialsWP,
      media,
      social: social,
      wordpress: wordpressShortcodes
    };
  }

  if (IS_PRODUCT_ARCHIVE_TEMPLATE) {
    return {
      grid,
      archive: productArchiveShortcodes,
      woocommerce: woocommerceShortcodes,
      essentials: essentialsWP,
      media,
      social: social,
      wordpress: wordpressShortcodes
    };
  }

  if (IS_ARCHIVE_TEMPLATE) {
    return {
      grid,
      archive: postArchiveShortcodes,
      essentials: essentialsWP,
      media,
      social: social,
      wordpress: wordpressShortcodes,
      woocommerce: woocommerceShortcodes
    };
  }

  if (IS_SINGLE_TEMPLATE || IS_POST) {
    return {
      grid,
      single: singleShortcodes,
      wordpress: wordpressShortcodes,
      essentials: essentialsWP,
      media,
      social: social,
      woocommerce: woocommerceShortcodes
    };
  }

  return {
    grid,
    essentials: essentialsWP,
    media,
    social: social,
    single: singleShortcodes,
    wordpress: wordpressShortcodes,
    woocommerce: woocommerceShortcodes
  };
})();

export default config;
