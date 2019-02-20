<?php


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
	 * @param $atts
	 * @param null $content
	 *
	 * @return mixed|string
	 */
	public function render( $atts, $content = null ) {
		$id = isset( $atts['id'] ) ? $atts['id'] : null;

		if ( $id ) {
			ob_start();

			dynamic_sidebar( $id );

			return ob_get_clean();
		}

		return '';
	}

}