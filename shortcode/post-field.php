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

		return $this->filterData( $property, $post );
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

	protected function filterData( $property, $post ) {
		switch ( $property ) {
			case 'post_title':
				return get_the_title( $post );
			case 'post_excerpt':
				return BrizyPro_Content_Placeholders_Excerpt::wp_trim_excerpt( $post->post_excerpt, $post );
			case 'post_content':
				return get_the_content( null, null, $post );
			case 'post_password':
				return '';
			default:
				return $post->{$property};
		}
	}


}