<?php

class Brizy_Shortcode_PostInfo extends Brizy_Shortcode_PostField {

	/**
	 * Get shortcode name
	 *
	 * @return string
	 */
	public function getName() {
		return 'post_info';
	}

	/**
	 * Ex: [post_info post="12"]
	 * Ex: [post_info]
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

		$twig = Brizy_TwigEngine::instance( BRIZY_PLUGIN_PATH . '/shortcode/views' );

		$post = $this->getPost( $atts );

		$params             = array();
		$params['author']   = get_the_author_meta( 'nickname', $post->post_author );
		$params['date']     = get_the_date( '', $post );
		$params['time']     = get_the_time( '', $post );
		$params['comments'] = get_comment_count( $post->ID );

		return $twig->render( 'post-info.html.twig', $params );
	}

	/**
	 * @param $atts
	 *
	 * @return array|WP_Post|null
	 */
	protected function getPost( $atts ) {

		if ( wp_doing_ajax() ) {

			$post = get_pages( [ 'number' => 1 ] );

			return isset( $post[0] ) ? $post[0] : null;
		}

		$post = get_post();

		return $post ?: null;
	}

}