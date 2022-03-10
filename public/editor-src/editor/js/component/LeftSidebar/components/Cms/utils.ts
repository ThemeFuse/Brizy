import {
  CMS,
  isCMS,
  isShopify,
  Shopify as ShopifyConf
} from "visual/global/Config/types/configs/Cloud";
import { Cloud, Shopify } from "./types/List";
import { getWhiteLabel } from "visual/component/LeftSidebar/components/Cms/types/WhiteLabel";
import { fromNumber } from "visual/component/LeftSidebar/components/Cms/types/ProjectId";
import { match } from "fp-utilities";
import { ActiveItemTypes } from "visual/component/LeftSidebar/components/Cms/types/ActiveItem";

const cloud = (config: CMS): Cloud => {
  const token = config.tokenV2?.access_token;
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
      ? { __type: "withToken", token, uri: config.cms.apiUrl }
      : { __type: "withOutToken", uri: config.cms.apiUrl },
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
      users: {
        disabled: config.cms.modules?.users?.disabled ?? false
      }
    }
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
    builderVersion: config.editorVersion
  };
};

export const getContext = match([isCMS, cloud], [isShopify, shopify]);
