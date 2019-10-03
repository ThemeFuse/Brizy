<?php

class Brizy_Shortcode_PostField extends Brizy_Shortcode_AbstractShortcode {

	/**
	 * Get shortcode name
	 *
	 * @return string
	 */
	public function getName() {
		return 'post_field';
	}

	/**
	 * Ex: [brizy_post_field post="12" property="post_excerpt"]
	 * Ex: [brizy_post_field property="post_excerpt"]
	 *
	 * @param $atts
	 * @param null $content
	 *
	 * @return mixed|string
	 */
	public function render( $atts, $content = null ) {

		$post = $this->getPost( $atts );

		if ( ! $post || ! isset( $atts['property'] ) ) {
			return '';
		}

		$property = $atts['property'];

		return $post->{$property};
	}

	/**
	 * @param $atts
	 *
	 * @return array|WP_Post|null
	 */
	protected function getPost( $atts ) {

		if ( isset( $atts['post'] ) ) {
			return get_post( (int) $atts['post'] );
		} else {
			return get_post();
		}
	}


}