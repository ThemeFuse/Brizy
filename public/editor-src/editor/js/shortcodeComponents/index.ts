import { match } from "fp-utilities";
import Config, { Cloud } from "visual/global/Config";
import {
  isEcwidCategory,
  isEcwidProduct
} from "visual/global/Config/types/configs/Base";
import { isCloud, isShopify } from "visual/global/Config/types/configs/Cloud";
import { isWp } from "visual/global/Config/types/configs/WP";
import { Shortcode, Shortcodes } from "visual/types";
import {
  isBlogPage,
  isCartPage,
  isCheckoutPage,
  isMyAccountPage,
  isProtectedPage,
  isResetPassPage,
  isUserPage
} from "visual/utils/env";
import { isExternalPopup, isStory } from "visual/utils/models";
import AssetsPosts from "./AssetsPosts";
import Ecwid from "./Ecwid";
import MenuSimple from "./MenuSimple";
import MinistryBrands from "./MinistryBrands";
import PostTitle from "./PostTitle";
import Posts from "./Posts";
import ProtectedPage from "./ProtectedPage";
import ShopCategories from "./ShopCategories";
import ShopPosts from "./ShopPosts";
import Translation from "./Translation";
import UserEmail from "./UserEmail";
import UserFirstName from "./UserFirstName";
import UserLastName from "./UserLastName";
import UserPhoneNumber from "./UserPhoneNumber";
import UserRoles from "./UserRoles";
import UserUsername from "./UserUsername";
import {
  content,
  essentialsCommon,
  essentialsStory,
  grid,
  media,
  mediaStory,
  social
} from "./index.common";
import Login from "./pro/Login";
import Menu from "./pro/Menu";
import ResetPassword from "./pro/ResetPassword";

const _config = Config.getAll() as Cloud;

const essentialsCloud = [
  ...essentialsCommon,
  ...(!isShopify(_config) ? [{ component: Translation, pro: false }] : [])
];

const essentialsWithPosts = [
  ...essentialsCloud,
  { component: Posts, pro: false }
];

// Without Login and Menu
const essentialsExternalPopup = essentialsCommon.reduce(
  (acc: Shortcode[], curr: Shortcode) =>
    curr.component !== Login &&
    curr.component !== Menu &&
    curr.component !== MenuSimple
      ? [...acc, curr]
      : acc,
  []
);

const protectedPage = [{ component: ProtectedPage, pro: false }];
const resetPassword = [{ component: ResetPassword, pro: false }];

const cmsSingle = [
  { component: PostTitle, pro: false },
  { component: Posts, pro: false }
];

const cmsAssets = [
  ...(!isShopify(_config) ? [{ component: AssetsPosts, pro: false }] : [])
];

const user = [
  { component: UserFirstName, pro: false },
  { component: UserLastName, pro: false },
  { component: UserEmail, pro: false },
  { component: UserPhoneNumber, pro: false },
  { component: UserRoles, pro: false },
  { component: UserUsername, pro: false }
];

const shop: Shortcode[] = match(
  [isWp, () => []],
  [
    isCloud,
    (v): Shortcode[] => {
      switch (v.modules?.shop?.type) {
        case undefined:
        case "shopify":
          return [];
        case "ecwid":
          return Ecwid;
      }
    }
  ]
)(Config.getAll());

const ministryBrands: Shortcode[] = match(
  [isWp, () => []],
  [
    isCloud,
    (v): Shortcode[] => {
      if (v.modules?.ekklesia) {
        return MinistryBrands;
      }
      return [];
    }
  ]
)(Config.getAll());

const ministryContent = {
  "Ministry Content": ministryBrands
};

const EcwidProduct = Ecwid.find((c) => c.component.id === "Product");
const productPageSpecificItems = [
  { component: PostTitle, pro: false },
  ...(EcwidProduct ? [EcwidProduct] : [])
];

const productPageShopItems = [
  ...(shop ? shop.filter((c) => c.component.id !== "Product") : []),
  { component: ShopPosts, pro: false },
  { component: ShopCategories, pro: false }
];

const config = ((): Shortcodes => {
  if (isStory(_config)) {
    return {
      essentials: essentialsStory,
      media: mediaStory
    };
  }

  if (isUserPage(_config)) {
    return {
      grid,
      user: user,
      essentials: essentialsCloud,
      media,
      content,
      social,
      blog: cmsSingle,
      shop,
      ...ministryContent,
      cms: cmsAssets
    };
  }

  if (isProtectedPage(_config)) {
    return {
      grid,
      systemPages: protectedPage,
      essentials: essentialsWithPosts,
      media,
      content,
      social,
      shop,
      ...ministryContent
    };
  }

  if (isResetPassPage(_config)) {
    return {
      grid,
      systemPages: resetPassword,
      essentials: essentialsWithPosts,
      media,
      content,
      social,
      shop,
      ...ministryContent
    };
  }

  if (isExternalPopup(_config)) {
    return {
      grid,
      essentials: essentialsExternalPopup,
      media,
      content,
      social
    };
  }

  if (isBlogPage(_config)) {
    return {
      grid,
      blog: cmsSingle,
      essentials: essentialsCloud,
      media,
      content,
      social,
      product: productPageSpecificItems,
      shop: productPageShopItems,
      ...ministryContent,
      cms: cmsAssets
    };
  }

  if (
    isEcwidProduct(_config.page) ||
    isEcwidCategory(_config.page) ||
    isCartPage(_config) ||
    isCheckoutPage(_config) ||
    isMyAccountPage(_config)
  ) {
    return {
      grid,
      productPageSpecificItems,
      shop: productPageShopItems,
      ...ministryContent,
      essentials: essentialsCloud,
      media,
      content,
      social,
      blog: cmsSingle,
      cms: cmsAssets
    };
  }

  if (_config.modules?.ekklesia) {
    return {
      grid,
      essentials: essentialsCloud,
      media,
      content,
      social,
      blog: cmsSingle,
      cms: cmsAssets,
      ...ministryContent
    };
  }

  return {
    grid,
    essentials: essentialsCloud,
    media,
    content,
    social,
    blog: cmsSingle,
    cms: cmsAssets
  };
})();

export default config;
