<?php
/**
 * Created by PhpStorm.
 * User: alex
 * Date: 1/24/18
 * Time: 5:14 PM
 */

class Brizy_Shortcode_Posts extends Brizy_Shortcode_AbstractShortcode {

	/**
	 * Get shortcode name
	 *
	 * @return string
	 */
	public function getName() {
		return 'posts';
	}

	/**
	 * @param array $atts
	 *
	 * @return string
	 */
	public function render( $atts ) {
		ob_start();

		var_dump($atts);
		var_dump( get_posts( $atts ) );

		return ob_get_clean();
	}

}