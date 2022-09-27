import { match } from "fp-utilities";
import { ActiveItemTypes } from "visual/component/LeftSidebar/components/Cms/types/ActiveItem";
import { Locale } from "visual/component/LeftSidebar/components/Cms/types/Locale";
import * as ShopModule from "visual/component/LeftSidebar/components/Cms/types/Modules/Shop";
import { fromNumber } from "visual/component/LeftSidebar/components/Cms/types/ProjectId";
import { getWhiteLabel } from "visual/component/LeftSidebar/components/Cms/types/WhiteLabel";
import { ShopModules } from "visual/global/Config/types/configs/Base";
import {
  Cloud as CloudConfig,
  CMS,
  isCMS,
  isShopify,
  Shopify as ShopifyConf
} from "visual/global/Config/types/configs/Cloud";
import { Ecwid } from "visual/global/Config/types/configs/modules/shop/Ecwid";
import { Cloud, Context, Shopify } from "./types/List";

const cloud = (config: CMS): Cloud => {
  const token = config.tokenV2?.access_token;
  const xAuthUserToken = config.x_auth_user_token;
  return {
    __type: "cloud",
    projectApi: token
      ? { __type: "withToken", token, uri: config.cms.apiUrl }
      : { __type: "withOutToken", uri: config.cms.apiUrl },
    user: { isPro: !!config.pro },
    previewUrl: config.cms.collectionPreviewUrl,
    domainUrl: config.urls.preview,
    mediaUrl: config.urls.image,
    settingsUrl: config.urls.projectSettings,
    protectedPagePassword: config.project.protectedPagePassword,
    whiteLabel: getWhiteLabel(config),
    userApi: token
      ? { __type: "withToken", token, uri: config.cms.apiUrl }
      : { __type: "withOutToken", uri: config.cms.apiUrl },
    shop: token
      ? { __type: "withToken", token, uri: config.cms.apiUrl }
      : { __type: "withOutToken", uri: config.cms.apiUrl },
    development: process.env.NODE_ENV === "development",
    translationApi: token
      ? { __type: "withToken", token, uri: config.cms.translationsApiUrl }
      : { __type: "withOutToken", uri: config.cms.translationsApiUrl },
    appointmentsApi: token
      ? { __type: "withToken", token, uri: config.cms.apiUrl }
      : { __type: "withOutToken", uri: config.cms.apiUrl },
    projectId: fromNumber(config.project.id),
    shopChannel: "shopChannel",
    taxesInfoUrl: "taxesInfoUrl",
    taxesMainCategoryId: "taxesMainCategoryId",
    notificationApi: token
      ? { __type: "withToken", token, uri: config.cms.notificationsApiUrl }
      : { __type: "withOutToken", uri: config.cms.notificationsApiUrl },
    supportLinks: config.cms.supportLinks,
    customersEditorUrl: config.cms.customerEditorUrl,
    customerPreviewUrl: config.cms.customerPreviewUrl,
    activeItem: {
      id: config.page.id,
      __type: ActiveItemTypes.CollectionItem
    },
    shopify: token
      ? { __type: "withToken", token, uri: config.cms.apiUrl }
      : { __type: "withOutToken", uri: config.cms.apiUrl },
    square: token
      ? { __type: "withToken", token, uri: config.cms.apiUrl }
      : { __type: "withOutToken", uri: config.cms.apiUrl },
    customersSlug: "customers",
    categoriesSlug: "categories",
    productsSlug: "products",
    modules: {
      shop: match(
        [
          (v: ShopModules): v is undefined => v == undefined,
          (): ShopModule.Disabled => ({ disabled: true })
        ],
        [
          (v: ShopModules): v is Ecwid => v?.type === "ecwid",
          (v): ShopModule.Ecwid => ({
            disabled: false,
            type: "ecwid",
            storeId: v.storeId,
            subscriptionType: v.subscriptionType,
            daysLeft: v.daysLeft,
            categoryCollectionTypeSlug: v.categoryCollectionTypeSlug,
            productCollectionTypeSlug: v.productCollectionTypeSlug,
            authorize: xAuthUserToken
              ? { __type: "withToken", uri: v.apiUrl, token: xAuthUserToken }
              : { __type: "withOutToken", uri: v.apiUrl },
            adminPanelUrl: `${v.userSessionUrl}${
              config.x_auth_user_token
                ? `?X-AUTH-USER-TOKEN=${config.x_auth_user_token}`
                : ""
            }`
          })
        ]
      )(config.modules?.shop),
      users: {
        disabled: config.cms.modules?.users?.disabled ?? false
      }
    },
    locale: "default" as Locale
  };
};

const shopify = (config: ShopifyConf): Shopify => {
  const token = config.tokenV2?.access_token;
  return {
    __type: "shopify",
    development: process.env.NODE_ENV === "development",
    previewUrl: config.cms.collectionPreviewUrl,
    mediaUrl: config.urls.image,
    customerPreviewUrl: config.cms.customerPreviewUrl,
    subscription: config.subscription,
    api: token
      ? { __type: "withToken", token, uri: config.cms.apiUrl }
      : { __type: "withOutToken", uri: config.cms.apiUrl },
    appointmentsApi: token
      ? { __type: "withToken", token, uri: config.cms.apiUrl }
      : { __type: "withOutToken", uri: config.cms.apiUrl },
    translationApi: token
      ? { __type: "withToken", token, uri: config.cms.translationsApiUrl }
      : { __type: "withOutToken", uri: config.cms.translationsApiUrl },
    customersEditorUrl: config.cms.customerEditorUrl,
    updateEditorApi: token
      ? {
          __type: "withToken",
          token,
          uri: `${config.urls.api}/${config.platform}/projects/${config.project.id}/delete`
        }
      : {
          __type: "withOutToken",
          uri: `${config.urls.api}/${config.platform}/projects/${config.project.id}/delete`
        },
    projectId: fromNumber(config.project.id),
    activeItem: {
      id: config.page.id,
      __type: ActiveItemTypes.CollectionItem
    },
    userApi: token
      ? { __type: "withToken", token, uri: config.cms.apiUrl }
      : { __type: "withOutToken", uri: config.cms.apiUrl },
    builderVersion: config.editorVersion,
    locale: "default" as Locale
  };
};

export const getContext: (v: CloudConfig) => Context = match(
  [isCMS, cloud],
  [isShopify, shopify]
);
