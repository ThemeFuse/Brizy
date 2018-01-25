<?php
/**
 * Created by PhpStorm.
 * User: alex
 * Date: 1/24/18
 * Time: 5:14 PM
 */

class Brizy_Shortcode_Sidebar extends Brizy_Shortcode_AbstractShortcode {

	/**
	 * Get shortcode name
	 *
	 * @return string
	 */
	public function getName() {
		return 'sidebar';
	}

	/**
	 * @param array $atts
	 *
	 * @return string
	 */
	public function render( $atts ) {
		$id = isset( $atts['id'] ) ? $atts['id'] : null;

		if ( $id ) {
			ob_start();
			dynamic_sidebar( $id );

			return ob_get_clean();
		}

		return '';
	}

}