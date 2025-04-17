import { EcwidConfig } from "visual/libs/Ecwid/types/EcwidConfig";
import { onOffToBool } from "visual/utils/boolean";
import { Value } from "./types/Value";

function descriptionPosition(v: "besideImage" | "belowImage"): boolean {
  switch (v) {
    case "besideImage":
      return true;
    case "belowImage":
      return false;
  }
}

export function valueToEciwdConfig(v: Value): EcwidConfig {
  return {
    product_details_show_navigation_arrows: false,
    product_details_show_breadcrumbs: false,
    product_details_show_product_name: onOffToBool(v.nameDisplay),
    product_details_show_product_sku: onOffToBool(v.skuDisplay),
    product_details_show_product_price: onOffToBool(v.priceDisplay),
    product_details_show_subtitle: onOffToBool(v.subtitleDisplay),
    product_details_show_product_options: onOffToBool(v.optionsDisplay),
    product_details_show_in_stock_label: onOffToBool(v.stockLabelDisplay),
    product_details_show_number_of_items_in_stock: onOffToBool(
      v.numberInStockDisplay
    ),
    product_details_show_qty: onOffToBool(v.quantityDisplay),
    product_details_show_wholesale_prices: onOffToBool(
      v.wholesalePricesDisplay
    ),
    product_details_show_attributes: onOffToBool(v.attributesDisplay),
    product_details_show_weight: onOffToBool(v.weightDisplay),
    product_details_show_product_description: onOffToBool(v.descriptionDisplay),
    product_details_show_share_buttons: onOffToBool(v.shareButtonsDisplay),
    show_footer_menu: onOffToBool(v.footerDisplay),
    product_details_two_columns_with_right_sidebar_show_product_description_on_sidebar:
      descriptionPosition(v.descriptionPosition),
    product_details_thumbnails_aspect_ratio: v.thumbnailAspectRatio,
    product_details_gallery_layout: v.thumbStyle,
    product_details_show_product_name_always_first_on_mobile: onOffToBool(
      v.nameFirstMobile
    ),
    product_details_show_product_photo_zoom: onOffToBool(v.galleryHoverZoom),
    product_details_position_product_name: v.positionName,
    product_details_position_product_price: v.positionPrice,
    product_details_position_buy_button: v.positionAddToBag,
    product_details_position_product_description: v.positionDescription,
    product_details_position_save_for_later: v.positionTitle2,
    product_details_position_share_buttons: v.positionShareTitle,
    product_details_layout: v.columns,
    product_details_show_facebook_share_button: onOffToBool(
      v.showFacebookShareBtn
    ),
    product_details_show_pinterest_share_button: onOffToBool(
      v.showPinterestShareBtn
    ),
    product_details_show_twitter_share_button: onOffToBool(
      v.showTwitterShareBtn
    ),
    product_details_show_vk_share_button: onOffToBool(v.showVkShareBtn),
    product_details_image_carousel: onOffToBool(v.carouselImage),
    product_details_cut_product_description_in_sidebar: onOffToBool(
      v.cutProductDescription
    ),
    product_details_additional_images_preview_on_click: onOffToBool(
      v.previewAdditionalImages
    )
  };
}
