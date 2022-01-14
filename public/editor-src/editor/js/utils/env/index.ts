import { match } from "fp-utilities";
import Config, { Cloud, Config as Conf } from "visual/global/Config";
import {
  isCloud,
  isCMS,
  isCollection,
  isCustomer,
  isShopify
} from "visual/global/Config/types/configs/Cloud";
import { TemplateType } from "visual/global/Config/types/TemplateType";
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

export const mode = config.mode ?? "page";

export const IS_POST = isWp(config) && config.wp.postType === "post";
export const IS_PRO = !!config.pro;

export const IS_WP = isWp(config);
export const IS_CLOUD = isCloud(config);

export const IS_CMS = isCloud(config) && isCMS(config);

export const IS_PAGE = config.mode === "page";

export const IS_CUSTOMER_PAGE =
  isCloud(config) && isCMS(config) && isCustomer(config);

export const IS_COLLECTION_PAGE =
  isCloud(config) && isCMS(config) && isCollection(config);

export const IS_SINGLE = config.mode === "single";

export const IS_ARCHIVE = config.mode === "archive";

export const IS_PRODUCT_PAGE = config.mode === "product";

export const IS_SINGLE_TEMPLATE = isTemplate(config, "single");
export const IS_ARCHIVE_TEMPLATE = isTemplate(config, "archive");
export const IS_PRODUCT_TEMPLATE = isTemplate(config, "product");
export const IS_PRODUCT_ARCHIVE_TEMPLATE = isTemplate(
  config,
  "product_archive"
);

const isProtected = (c: Cloud): boolean => {
  if ("isProtected" in c.page) {
    return c.page.isProtected;
  }

  return false;
};

export const IS_PROTECTED =
  isCloud(config) && isCMS(config) && isProtected(config);

export const IS_USER_PAGE =
  isCloud(config) && config.page.provider === "customers";

export const IS_RESET_PASS = isCloud(config) && config.page.isResetPassPage;
