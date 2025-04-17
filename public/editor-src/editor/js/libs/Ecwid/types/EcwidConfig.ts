export interface RedirectConfig {
  fromFooter: Array<{ route: FooterRoutes; selector: string }>;
  fromContent: Array<{ route: ContentRoutes; selector: string }>;
}

export type FooterRoutes = "/account" | "/account/favorites" | "/cart";

export type ContentRoutes = "/cart" | "/thank-you" | "/account/favorites" | "/";

export interface EcwidConfig {
  baseUrl?: string;
  // Products
  product_list_show_frame?: boolean;
  product_list_image_aspect_ratio?: string;
  product_list_title_behavior?: string;
  product_list_sku_behavior?: string;
  product_list_price_behavior?: string;
  product_list_subtitles_behavior?: string;
  product_list_buybutton_behavior?: string;
  product_list_product_info_layout?: string;
  product_list_show_product_images?: boolean;
  product_list_image_size?: string;
  product_list_image_has_shadow?: boolean;
  product_list_show_additional_image_on_hover?: boolean;
  product_list_image_position?: string;

  // Product
  product_details_show_product_name?: boolean;
  product_details_show_breadcrumbs?: boolean;
  product_details_show_product_sku?: boolean;
  product_details_show_product_price?: boolean;
  product_details_show_sale_price?: boolean;
  product_details_show_price_per_unit?: boolean;
  product_details_show_tax?: boolean;
  product_details_show_product_options?: boolean;
  product_details_hide_price_modifiers?: boolean;
  product_details_show_buy_button?: boolean;
  product_details_show_attributes?: boolean;
  product_details_show_weight?: boolean;
  product_details_show_wholesale_prices?: boolean;
  product_details_show_product_description?: boolean;
  product_details_show_save_for_later?: boolean;
  product_details_show_share_buttons?: boolean;
  product_details_show_facebook_share_button?: boolean;
  product_details_show_pinterest_share_button?: boolean;
  product_details_show_twitter_share_button?: boolean;
  product_details_show_vk_share_button?: boolean;
  product_details_additional_images_has_shadow?: boolean;
  product_details_image_carousel?: boolean;
  product_details_show_qty?: boolean;
  product_details_show_in_stock_label?: boolean;
  product_details_show_number_of_items_in_stock?: boolean;
  show_sku?: boolean;
  product_details_show_subtitle?: boolean;
  product_details_show_navigation_arrows?: boolean;
  product_details_show_product_photo_zoom?: boolean;
  show_footer_menu?: boolean;
  product_details_cut_product_description_in_sidebar?: boolean;
  product_details_additional_images_preview_on_click?: boolean;

  onPageLoaded?: VoidFunction;

  redirect?: RedirectConfig;

  // Cart & Checkout
  shopping_cart_show_qty_inputs?: boolean;
  shopping_cart_show_sku?: boolean;
  shopping_cart_show_weight?: boolean;
  checkout_show_state_input?: boolean;
  checkout_show_address_line_2?: boolean;
  shopping_cart_products_collapsed_on_mobile?: boolean;
  shopping_cart_products_collapsed_on_desktop?: boolean;
  show_breadcrumbs?: boolean;

  // My Account
  show_signin_link?: boolean;
  product_details_two_columns_with_right_sidebar_show_product_description_on_sidebar?: boolean;
  product_details_two_columns_with_left_sidebar_show_product_description_on_sidebar?: boolean;
  product_details_thumbnails_aspect_ratio?: string;
  product_details_gallery_layout?: string;
  product_details_show_product_name_always_first_on_mobile?: boolean;
  product_details_position_product_name?: number;
  product_details_position_breadcrumbs?: number;
  product_details_position_product_sku?: number;
  product_details_position_product_price?: number;
  product_details_position_product_options?: number;
  product_details_position_subtitle?: number;
  product_details_position_buy_button?: number;
  product_details_position_wholesale_prices?: number;
  product_details_position_product_description?: number;
  product_details_position_save_for_later?: number;
  product_details_position_share_buttons?: number;
  product_details_layout?: string;

  prefetchScripts?: boolean;
  onPageLoadCallbacks?: VoidFunction[];
}

export const eq = (a: EcwidConfig, b: EcwidConfig): boolean => {
  for (const k in a) {
    if (a[k as keyof EcwidConfig] !== b[k as keyof EcwidConfig]) {
      return false;
    }
  }

  return true;
};
