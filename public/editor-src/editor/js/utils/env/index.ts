import { match } from "fp-utilities";
import Config from "visual/global/Config";
import { TemplateType } from "visual/global/Config/types/TemplateType";
import {
  isCMS,
  isCloud,
  isShopify
} from "visual/global/Config/types/configs/Cloud";
import { isWp } from "visual/global/Config/types/configs/WP";
import * as Str from "visual/utils/reader/string";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";

const config = Config.getAll();

// @ts-expect-error: Temporary
const getTemplate: (config: ConfigCommon) => TemplateType | undefined = match(
  [isWp, (c): TemplateType | undefined => c.template_type],
  [
    isCloud,
    match(
      [isCMS, (c): TemplateType | undefined => c.templateType],
      [isShopify, (): undefined => undefined]
    )
  ]
);

// if array of rules is empty(wasn't added via WP) we should think that all modes are active
const isTemplate = (config: ConfigCommon, type: TemplateType): boolean => {
  const t = getTemplate(config);

  // @ts-expect-error, need to review if template could be actually an empty string
  // maybe we need to make it undefined always?
  return t === "" || t === type;
};

export const isPost = (config: ConfigCommon): boolean =>
  isWp(config) && config.wp.postType === "post";

/**
 * @deprecated, use isPro(config)
 */
export const IS_PRO = !!config.pro;

export const isPro = (config: ConfigCommon): boolean => !!config.pro;

export const isPage = (config: ConfigCommon): boolean => config.mode === "page";

export const isProductPage = (config: ConfigCommon): boolean =>
  config.mode === "product";

export const isSingleTemplate = (config: ConfigCommon): boolean =>
  isTemplate(config, "single");

export const isArchiveTemplate = (config: ConfigCommon): boolean =>
  isTemplate(config, "archive");

export const isProductTemplate = (config: ConfigCommon): boolean =>
  isTemplate(config, "product");

export const isProductArchiveTemplate = (config: ConfigCommon): boolean =>
  isTemplate(config, "product_archive");

export const isProtectedPage = (config: ConfigCommon): boolean => {
  if (isCloud(config) && isCMS(config) && "isProtected" in config.page) {
    return config.page.isProtected;
  }

  return false;
};

export const isUserPage = (config: ConfigCommon): boolean =>
  isCloud(config) && config.page.provider === "customers";

export const isResetPassPage = (config: ConfigCommon): boolean =>
  isCloud(config) && config.page.isResetPassPage;

export const isCartPage = (config: ConfigCommon): boolean =>
  isCloud(config) && config.page.slug === "cart";

export const isCheckoutPage = (config: ConfigCommon): boolean =>
  isCloud(config) && config.page.slug === "checkout";

export const isMyAccountPage = (config: ConfigCommon): boolean =>
  isCloud(config) && config.page.slug === "my-account";

export const isBlogPage = (config: ConfigCommon): boolean =>
  isCloud(config) && config.page.collectionTypeSlug === "blog";

//#region Page

export const getCurrentPageId = (): string => {
  const config = Config.getAll();

  if (isWp(config)) {
    return Str.read(config.wp.page) ?? "";
  }

  return Str.read(config.page?.id) ?? "";
};

//#endregion
