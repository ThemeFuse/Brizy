import { match } from "fp-utilities";
import Config, { Cloud, Config as Conf } from "visual/global/Config";
import { TemplateType } from "visual/global/Config/types/TemplateType";
import {
  isCMS,
  isCloud,
  isCustomer,
  isShopify
} from "visual/global/Config/types/configs/Cloud";
import { isWp } from "visual/global/Config/types/configs/WP";

const config = Config.getAll();

const getTemplate: (config: Conf) => TemplateType | undefined = match(
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
const isTemplate = (config: Conf, type: TemplateType): boolean => {
  const t = getTemplate(config);

  // @ts-expect-error, need to review if template could be actually an empty string
  // maybe we need to make it undefined always?
  return t === "" || t === type;
};

export const isPost = (config: Conf): boolean =>
  isWp(config) && config.wp.postType === "post";

/**
 * @deprecated, use isPro(config)
 */
export const IS_PRO = !!config.pro;

export const isPro = (config: Conf): boolean => !!config.pro;

/**
 * @deprecated, use isWp(config) from visual/global/Config/types/configs/WP
 */
export const IS_WP = isWp(config);

/**
 * @deprecated, use isCloud(config) from visual/global/Config/types/configs/Cloud
 */
export const IS_CLOUD = isCloud(config);

export const isPage = (config: Conf): boolean => config.mode === "page";

export const isCustomerPage = (config: Conf): boolean => {
  return isCloud(config) && isCMS(config) && isCustomer(config);
};

export const isProductPage = (config: Conf): boolean =>
  config.mode === "product";

export const isSingleTemplate = (config: Conf): boolean =>
  isTemplate(config, "single");

export const isArchiveTemplate = (config: Conf): boolean =>
  isTemplate(config, "archive");

export const isProductTemplate = (config: Conf): boolean =>
  isTemplate(config, "product");

export const isProductArchiveTemplate = (config: Conf): boolean =>
  isTemplate(config, "product_archive");

export const isProtectedPage = (config: Conf): boolean => {
  if (isCloud(config) && isCMS(config) && "isProtected" in config.page) {
    return config.page.isProtected;
  }

  return false;
};

export const isUserPage = (config: Conf): boolean =>
  isCloud(config) && config.page.provider === "customers";

export const isResetPassPage = (config: Conf): boolean =>
  isCloud(config) && config.page.isResetPassPage;

export const isCartPage = (config: Cloud): boolean =>
  isCloud(config) && config.page.slug === "cart";

export const isCheckoutPage = (config: Cloud): boolean =>
  isCloud(config) && config.page.slug === "checkout";

export const isMyAccountPage = (config: Cloud): boolean =>
  isCloud(config) && config.page.slug === "my-account";

export const isBlogPage = (config: Cloud): boolean =>
  isCloud(config) && config.page.collectionTypeSlug === "blog";
