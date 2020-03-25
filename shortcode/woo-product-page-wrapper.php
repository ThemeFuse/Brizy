<?php

class Brizy_Shortcode_WooProductPageWrapper extends Brizy_Shortcode_AbstractShortcode {

	/**
	 * Get shortcode name
	 *
	 * @return string
	 */
	public function getName() {
		return 'product_page';
	}

	/**
	 * Ex: [brizy_product_page id="12"]
	 * Ex: [brizy_product_page]
	 *
	 * @param $atts
	 * @param null $content
	 *
	 * @return mixed|string
	 * @throws Twig_Error_Loader
	 * @throws Twig_Error_Runtime
	 * @throws Twig_Error_Syntax
	 */
	public function render( $atts, $content = null ) {
		$postId = $this->getProductId( $atts );

		return do_shortcode( '[product_page id="' . $postId . '"]' );
	}

	/**
	 * @param $atts
	 *
	 * @return array|WP_Post|null
	 */
	protected function getProductId( $atts ) {
		global $wpdb;

		if ( isset( $atts['id'] ) && (int)$atts['id'] > 0 ) {
			return (int) $atts['id'];
		} elseif ( $product = get_post() ) {
			return $product->ID;
		} else {
			$productID = $wpdb->get_var( "SELECT ID 
												FROM {$wpdb->posts} 
												WHERE post_type='product' and post_status='publish' LIMIT 1" );

			return $productID;
		}
	}
}