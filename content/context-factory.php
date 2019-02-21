<?php


class Brizy_Content_ContextFactory {

	/**
	 * @param $project
	 * @param $brizy_post
	 * @param $wp_post
	 * @param $contentHtml
	 *
	 * @return Brizy_Content_Context
	 */
	static public function createContext(  $project, $brizy_post, $wp_post, $contentHtml, $isLoop = false ) {
		$context = self::getContext( $project, $wp_post );

		if ( $isLoop ) {
			return apply_filters( 'brizy_loop_context_create', $context, $wp_post );
		}

		return apply_filters( 'brizy_context_create', $context, $wp_post );
	}

	/**
	 * @param $project
	 * @param $wp_post
	 *
	 * @return Brizy_Content_Context
	 */
	private static function getContext( $project, $wp_post ) {
		$context = new Brizy_Content_Context( $project, null, $wp_post,null );

		if ( $wp_post ) {
			$context->setAuthor( $wp_post->post_author );
		}

		return $context;
	}
}