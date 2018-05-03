<?php
/**
 * Created by PhpStorm.
 * User: alex
 * Date: 1/24/18
 * Time: 5:14 PM
 */

class Brizy_Shortcode_Navigation extends Brizy_Shortcode_AbstractShortcode {

	/**
	 * Get shortcode name
	 *
	 * @return string
	 */
	public function getName() {
		return 'navigation';
	}

	/**
	 * @param $atts
	 * @param null $content
	 *
	 * @return mixed|string
	 */
	public function render( $atts, $content=null ) {
		extract(shortcode_atts(array( 'name' => null, ), $atts));

		if($name)
			return wp_nav_menu( array( 'menu' => $name, 'echo' => false ) );

		return '';
	}

}