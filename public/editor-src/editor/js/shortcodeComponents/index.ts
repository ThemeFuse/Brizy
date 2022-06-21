import Config from "visual/global/Config";
import { baseCommon, baseStory, social, grid } from "./index.common";
import Ecwid from "./Ecwid";
import { IS_PROTECTED, IS_RESET_PASS, IS_USER_PAGE } from "visual/utils/env";
import { IS_STORY, IS_EXTERNAL_POPUP } from "visual/utils/models";
import { Shortcode, Shortcodes } from "visual/types";

import ProtectedPage from "./ProtectedPage";
import Translation from "./Translation";

import ResetPassword from "./pro/ResetPassword";

import PostTitle from "./PostTitle";
import Posts from "./Posts";

import UserFirstName from "./UserFirstName";
import UserLastName from "./UserLastName";
import UserEmail from "./UserEmail";
import UserPhoneNumber from "./UserPhoneNumber";
import UserRoles from "./UserRoles";
import UserUsername from "./UserUsername";

import Login from "./pro/Login";
import { match } from "fp-utilities";
import { isWp } from "visual/global/Config/types/configs/WP";
import { isCloud } from "visual/global/Config/types/configs/Cloud";

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
  { component: PostTitle, pro: false },
  { component: Posts, pro: false }
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
          return [];
        case "ecwid":
          return Ecwid;
      }
    }
  ]
)(Config.getAll());

const config = ((): Shortcodes => {
  if (IS_STORY) {
    return {
      base: baseStory
    };
  }

  if (IS_USER_PAGE) {
    return {
      user: user,
      base: baseWithPosts,
      grid,
      social,
      shop
    };
  }

  if (IS_PROTECTED) {
    return {
      systemPages: protectedPage,
      base: baseWithPosts,
      grid,
      social,
      shop
    };
  }

  if (IS_RESET_PASS) {
    return {
      systemPages: resetPassword,
      base: baseWithPosts,
      grid,
      social,
      shop
    };
  }

  if (IS_EXTERNAL_POPUP) {
    return {
      base: baseExternalPopup,
      grid,
      social
    };
  }

  return {
    grid,
    dynamic: cmsSingle,
    base: baseCloud,
    social,
    shop
  };
})();

export default config;
