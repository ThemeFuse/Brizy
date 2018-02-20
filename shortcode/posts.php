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
	 * @param $atts
	 * @param null $content
	 *
	 * @return mixed|string
	 */
	public function render( $atts, $content=null ) {
		ob_start();

		echo "To be implemented";

		return ob_get_clean();
	}

}