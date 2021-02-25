import Config from "visual/global/Config";

// if array of rules is empty(wasn't added via WP) we should think that all modes are active
const isTemplate = type =>
  Config.get("template_type") === type || Config.get("template_type") === "";

export const mode = Config.get("mode") ?? "page";

export const IS_POST = Config.get("wp")?.post_type === "post";
export const IS_PRO = !!Config.get("pro");

export const IS_WP = TARGET === "WP";

export const IS_CMS =
  (TARGET === "Cloud" || TARGET === "Cloud-localhost") &&
  Config.get("project")?.apiVersion === 2;

export const IS_PAGE = mode === "page";

export const IS_SINGLE = mode === "single";

export const IS_ARCHIVE = mode === "archive";

export const IS_PRODUCT_PAGE = mode === "product";

export const IS_SINGLE_TEMPLATE = isTemplate("single");
export const IS_ARCHIVE_TEMPLATE = isTemplate("archive");
export const IS_PRODUCT_TEMPLATE = isTemplate("product");
export const IS_PRODUCT_ARCHIVE_TEMPLATE = isTemplate("product_archive");
