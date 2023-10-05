import { match } from "fp-utilities";
import { ActiveItemTypes } from "visual/component/LeftSidebar/components/Cms/types/ActiveItem";
import { Locale } from "visual/component/LeftSidebar/components/Cms/types/Locale";
import * as ShopModule from "visual/component/LeftSidebar/components/Cms/types/Modules/Shop";
import { fromNumber } from "visual/component/LeftSidebar/components/Cms/types/ProjectId";
import { getWhiteLabel } from "visual/component/LeftSidebar/components/Cms/types/WhiteLabel";
import {
  ShopModules,
  isCollectionPage,
  isCustomerPage,
  isEcwidCategory,
  isEcwidProduct,
  isEcwidShop,
  isShopifyShop
} from "visual/global/Config/types/configs/Base";
import {
  CMS,
  Cloud as CloudConfig,
  Shopify as ShopifyConf,
  isCMS,
  isShopify
} from "visual/global/Config/types/configs/Cloud";
import { Cloud, Context, Shopify } from "./types/List";

const createCloneLinkApiUri = (uri: string) => uri.slice(0, uri.length - 3);

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
    mediaUrl: config.api?.media?.mediaResizeUrl ?? "",
    settingsUrl: config.urls.projectSettings,
    protectedPagePassword: config.project.protectedPagePassword,
    whiteLabel: getWhiteLabel(config),
    cloneLink: `${config.urls.projectCloneLink}/`,
    cloneLinkApi: xAuthUserToken
      ? {
          __type: "withToken",
          token: xAuthUserToken,
          uri: createCloneLinkApiUri(config.urls.api)
        }
      : {
          __type: "withOutToken",
          uri: createCloneLinkApiUri(config.urls.api)
        },
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
      __type: match(
        [isCollectionPage, () => ActiveItemTypes.CollectionItem],
        [isCustomerPage, () => ActiveItemTypes.Customer],
        [isEcwidProduct, () => ActiveItemTypes.EcwidProduct],
        [isEcwidCategory, () => ActiveItemTypes.EcwidCategory]
      )(config.page)
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
        [isShopifyShop, (): ShopModule.Disabled => ({ disabled: true })],
        [
          isEcwidShop,
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
    locale: "default" as Locale,
    isAvailablePreviewBadge: config.cms.isAvailablePreviewBadge
  };
};

const shopify = (config: ShopifyConf): Shopify => {
  const token = config.tokenV2?.access_token;
  return {
    __type: "shopify",
    development: process.env.NODE_ENV === "development",
    previewUrl: config.cms.collectionPreviewUrl,
    mediaUrl: config.api?.media?.mediaResizeUrl ?? "",
    customerPreviewUrl: config.cms.customerPreviewUrl,
    subscription: config.subscription,
    user: { isPro: !!config.pro },
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
    siteUrl: config.urls.site,
    supportLinks: config.cms.supportLinks,
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
