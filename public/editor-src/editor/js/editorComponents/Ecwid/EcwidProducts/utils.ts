import { EcwidConfig } from "visual/libs/Ecwid/types/EcwidConfig";
import { Value } from "./types/Value";
import { onOffToBool } from "visual/utils/boolean";

export function valueToEciwdConfigProducts(v: Value): EcwidConfig {
  return {
    product_list_image_aspect_ratio: v.ratio,
    product_list_title_behavior: v.productName,
    product_list_sku_behavior: v.productSKU,
    product_list_price_behavior: v.productPrice,
    product_list_subtitles_behavior: v.productSubtitle,
    product_list_buybutton_behavior: v.buyNowButton,
    product_list_show_frame: onOffToBool(v.productCardFrame),
    product_list_product_info_layout: v.horizontalAlign,
    product_list_show_product_images: onOffToBool(v.mainProductImage),
    product_list_image_size: v.galleryWidth,
    product_list_image_has_shadow: onOffToBool(v.darkenImage),
    product_list_show_additional_image_on_hover: onOffToBool(v.additionalImage),
    product_list_image_position: v.displayMode,
    show_footer_menu: onOffToBool(v.footerDisplay)
  };
}
