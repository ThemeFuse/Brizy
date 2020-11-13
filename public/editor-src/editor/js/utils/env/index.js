import Config from "visual/global/Config";

const template_type = Config.get("template_type");
const mode = Config.get("mode");

// if array of rules is empty(wasn't added via WP) we should think that all modes are active
const checkTemplate = type => template_type === type || template_type === "";

export const IS_SINGLE_TEMPLATE = checkTemplate("single");
export const IS_ARCHIVE_TEMPLATE = checkTemplate("archive");
export const IS_PRODUCT_TEMPLATE = checkTemplate("product");
export const IS_PRODUCT_ARCHIVE_TEMPLATE = checkTemplate("product_archive");

export const IS_PRODUCT_PAGE = mode === "product";
