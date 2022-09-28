import { match } from "fp-utilities";
import Config, { Cloud } from "visual/global/Config";
import {
  isEcwidCategory,
  isEcwidProduct
} from "visual/global/Config/types/configs/Base";
import { isCloud } from "visual/global/Config/types/configs/Cloud";
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
import { baseCommon, baseStory, grid, social } from "./index.common";
import Posts from "./Posts";
// uncomment later when logic with context select is done
// import PostTitle from "./PostTitle";
import Login from "./pro/Login";
import ResetPassword from "./pro/ResetPassword";
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

const _config = Config.getAll() as Cloud;

const baseCloud = [...baseCommon, { component: Translation, pro: false }];

const baseWithPosts = [...baseCloud, { component: Posts, pro: false }];

// Without Login
const baseExternalPopup = baseCommon.reduce(
  (acc: Shortcode[], curr: Shortcode) =>
    curr.component !== Login ? [...acc, curr] : acc,
  []
);

const protectedPage = [{ component: ProtectedPage, pro: false }];
const resetPassword = [{ component: ResetPassword, pro: false }];

const cmsSingle = [
  // uncomment later when logic with context select is done
  // { component: PostTitle, pro: false },
  { component: Posts, pro: false }
];

const cmsAssets = [{ component: AssetsPosts, pro: false }];

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
          return [];
        case "ecwid":
          return Ecwid;
      }
    }
  ]
)(Config.getAll());

const EcwidProduct = Ecwid.find((c) => c.component.id === "Product");
const productPageSpecificItems = [
  // uncomment later when logic with context select is done
  // { component: PostTitle, pro: false },
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
      base: baseStory
    };
  }

  if (isUserPage(_config)) {
    return {
      user: user,
      grid,
      base: baseCloud,
      social,
      blog: cmsSingle,
      shop,
      cms: cmsAssets
    };
  }

  if (isProtectedPage(_config)) {
    return {
      systemPages: protectedPage,
      base: baseWithPosts,
      grid,
      social,
      shop
    };
  }

  if (isResetPassPage(_config)) {
    return {
      systemPages: resetPassword,
      base: baseWithPosts,
      grid,
      social,
      shop
    };
  }

  if (isExternalPopup(_config)) {
    return {
      base: baseExternalPopup,
      grid,
      social
    };
  }

  if (isBlogPage(_config)) {
    return {
      blog: cmsSingle,
      grid,
      base: baseCloud,
      social,
      product: productPageSpecificItems,
      shop: productPageShopItems,
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
      productPageSpecificItems,
      shop: productPageShopItems,
      grid,
      base: baseCloud,
      social,
      blog: cmsSingle,
      cms: cmsAssets
    };
  }

  return {
    grid,
    base: baseCloud,
    social,
    blog: cmsSingle,
    cms: cmsAssets
  };
})();

export default config;
