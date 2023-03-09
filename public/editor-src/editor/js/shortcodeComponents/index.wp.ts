import Config, { WP } from "visual/global/Config";
import { Shortcodes } from "visual/types/index.js";
import {
  isArchiveTemplate,
  isPost,
  isProductArchiveTemplate,
  isProductPage,
  isProductTemplate,
  isSingleTemplate
} from "visual/utils/env";
import { isStory } from "visual/utils/models";
import { hasSidebars, pluginActivated } from "visual/utils/wp";
import Archive from "./Archive";
import PostExcerpt from "./PostExcerpt";
import PostTitle from "./PostTitle";
import Posts from "./Posts";
import WOOCategories from "./WOOCategories";
import WOOPages from "./WOOPages";
import WPCustomShortcode from "./WPCustomShortcode";
import WPFeaturedImage from "./WPFeaturedImage";
import WPSidebar from "./WPSidebar";
import {
  essentialsCommon,
  essentialsStory,
  grid,
  media,
  mediaStory,
  social,
  content
} from "./index.common";
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

const _config = Config.getAll() as WP;

const hasWoocommerce = pluginActivated("woocommerce");

const essentialsWP = [...essentialsCommon, { component: Search, pro: true }];

const wordpressShortcodes = [
  ...(hasSidebars() ? [{ component: WPSidebar, pro: false }] : []),
  { component: WPCustomShortcode, pro: false }
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
  { component: WPFeaturedImage, pro: true },
  { component: PostTitle, pro: true },
  { component: PostExcerpt, pro: true },
  ...(isSingleTemplate(_config)
    ? [{ component: WPPostContent, pro: true }]
    : []),
  { component: WPPostInfo, pro: true },
  { component: WPBreadcrumbs, pro: true },
  ...(isSingleTemplate(_config) || isPost(_config)
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

  if (isProductTemplate(_config) || isProductPage(_config)) {
    return {
      grid,
      product: productShortcodes,
      woocommerce: woocommerceShortcodes,
      essentials: essentialsWP,
      media,
      content,
      social: social,
      wordpress: wordpressShortcodes
    };
  }

  if (isProductArchiveTemplate(_config)) {
    return {
      grid,
      archive: productArchiveShortcodes,
      woocommerce: woocommerceShortcodes,
      essentials: essentialsWP,
      media,
      content,
      social: social,
      wordpress: wordpressShortcodes
    };
  }

  if (isArchiveTemplate(_config)) {
    return {
      grid,
      archive: postArchiveShortcodes,
      essentials: essentialsWP,
      media,
      content,
      social: social,
      wordpress: wordpressShortcodes,
      woocommerce: woocommerceShortcodes
    };
  }

  if (isSingleTemplate(_config) || isPost(_config)) {
    return {
      grid,
      single: singleShortcodes,
      wordpress: wordpressShortcodes,
      essentials: essentialsWP,
      media,
      content,
      social: social,
      woocommerce: woocommerceShortcodes
    };
  }

  return {
    grid,
    essentials: essentialsWP,
    media,
    content,
    social: social,
    single: singleShortcodes,
    wordpress: wordpressShortcodes,
    woocommerce: woocommerceShortcodes
  };
})();

export default config;
