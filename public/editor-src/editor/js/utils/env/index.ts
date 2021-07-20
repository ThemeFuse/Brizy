import Config from "visual/global/Config";
import { isCloud, isCMS } from "visual/global/Config/types/configs/Cloud";
import { TemplateType } from "visual/global/Config/types/TemplateType";
import { isWp } from "visual/global/Config/types/configs/WP";

const config = Config.getAll();

// if array of rules is empty(wasn't added via WP) we should think that all modes are active
const isTemplate = (type: TemplateType): boolean =>
  // @ts-expect-error: config.template_type in some case possible to be empty string
  config.template_type === "" || config.template_type === type;

export const mode = config.mode ?? "page";

export const IS_POST = isWp(config) && config.wp.postType === "post";
export const IS_PRO = !!config.pro;

export const IS_WP = isWp(config);
export const IS_CLOUD = isCloud(config);

export const IS_CMS = isCloud(config) && isCMS(config);

export const IS_PAGE = config.mode === "page";

export const IS_SINGLE = config.mode === "single";

export const IS_ARCHIVE = config.mode === "archive";

export const IS_PRODUCT_PAGE = config.mode === "product";

export const IS_SINGLE_TEMPLATE = isTemplate("single");
export const IS_ARCHIVE_TEMPLATE = isTemplate("archive");
export const IS_PRODUCT_TEMPLATE = isTemplate("product");
export const IS_PRODUCT_ARCHIVE_TEMPLATE = isTemplate("product_archive");

export const dcSupported = IS_WP || IS_CMS;

export const IS_PROTECTED =
  isCloud(config) && isCMS(config) && config.page.isProtected;
