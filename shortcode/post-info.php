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

		$date = new DateTime( $post->post_date );

		$params             = array();
		$params['author']   = get_the_author_meta( 'nickname', $post->post_author );
		$params['date']     = $date->format( 'd/m/Y' );
		$params['time']     = $date->format( 'H:s' );
		$params['comments'] = get_comment_count( $post->ID );

		return $twig->render( 'post-info.html.twig', $params );
	}

}