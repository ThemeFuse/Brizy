import WPSidebar from "./WPSidebar";
import WPCustomShortcode from "./WPCustomShortcode";
import WPFeaturedImage from "./WPFeaturedImage";
import WOOCategories from "./WOOCategories";
import WOOPages from "./WOOPages";

import Posts from "./Posts";
import Archive from "./Archive";
import WPBreadcrumbs from "./pro/WPBreadcrumbs";
import PostTitle from "./PostTitle";
import PostExcerpt from "./PostExcerpt";
import WPPostContent from "./pro/WPPostContent";
import WPPostInfo from "./pro/WPPostInfo";
import WPPostNavigation from "./pro/WPPostNavigation";
import Search from "./pro/Search";

import Products from "./pro/Products";
import WOOProductTitle from "./pro/WOOProductTitle";
import WOOExcerpt from "./pro/WOOExcerpt";
import WOOSku from "./pro/WOOSku";
import WOOStock from "./pro/WOOStock";
import WOOPrice from "./pro/WOOPrice";
import WOOAttributes from "./pro/WOOAttributes";
import WOOProductMeta from "./pro/WOOProductMeta";
import WOORating from "./pro/WOORating";
import WOOCart from "./pro/WOOCart";
import WOOGallery from "./pro/WOOGallery";
import WOOAddToCart from "./pro/WOOAddToCart";
import WOOProductContent from "./pro/WOOProductContent.js";
import WOOUpsell from "./pro/WOOUpsell.js";
import WOOBreadcrumbs from "./pro/WOOBreadcrumbs.js";
import WOOArchives from "./pro/WOOArchives";
import Review from "./pro/Review.js";
import Login from "./pro/Login";

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import nonWP, { base } from "./index.ts";

import { hasSidebars, pluginActivated } from "visual/utils/wp";
import { IS_STORY } from "visual/utils/models";

import {
  IS_POST,
  IS_PAGE,
  IS_SINGLE_TEMPLATE,
  IS_PRODUCT_TEMPLATE,
  IS_PRODUCT_PAGE,
  IS_PRODUCT_ARCHIVE_TEMPLATE,
  IS_ARCHIVE_TEMPLATE
} from "visual/utils/env";
import { Shortcodes } from "visual/types/index.js";

const hasWoocommerce = pluginActivated("woocommerce");

const featuredImage = { component: WPFeaturedImage, pro: true };

const baseWP = [
  ...base,
  { component: Search, pro: true },
  { component: Login, pro: true }
];

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
  { component: WPPostNavigation, pro: true },
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
  ? [{ component: WOOArchives, pro: true }]
  : [];

const postArchiveShortcodes = [{ component: Archive, pro: true }];

const config = ((): Shortcodes => {
  if (IS_STORY) {
    return nonWP;
  }

  if (IS_PRODUCT_TEMPLATE || IS_PRODUCT_PAGE) {
    return {
      product: productShortcodes,
      woocommerce: woocommerceShortcodes,
      ...nonWP,
      base: baseWP,
      wordpress: wordpressShortcodes
    };
  }

  if (IS_PRODUCT_ARCHIVE_TEMPLATE) {
    return {
      archive: productArchiveShortcodes,
      woocommerce: woocommerceShortcodes,
      ...nonWP,
      base: baseWP,
      wordpress: wordpressShortcodes
    };
  }

  if (IS_ARCHIVE_TEMPLATE) {
    return {
      archive: postArchiveShortcodes,
      ...nonWP,
      base: baseWP,
      wordpress: wordpressShortcodes,
      woocommerce: woocommerceShortcodes
    };
  }

  if (IS_SINGLE_TEMPLATE || IS_POST) {
    return {
      single: singleShortcodes,
      wordpress: wordpressShortcodes,
      ...nonWP,
      base: baseWP,
      woocommerce: woocommerceShortcodes
    };
  }

  return {
    ...nonWP,
    base: baseWP,
    single: singleShortcodes,
    wordpress: wordpressShortcodes,
    woocommerce: woocommerceShortcodes
  };
})();

export default config;
