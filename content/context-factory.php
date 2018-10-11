<?php
/**
 * Created by PhpStorm.
 * User: alex
 * Date: 8/17/18
 * Time: 3:18 PM
 */

class Brizy_Content_ContextFactory {

	/**
	 * @param $project
	 * @param $brizy_post
	 * @param $wp_post
	 * @param $contentHtml
	 *
	 * @return Brizy_Content_Context
	 */
	static public function createContext( $project, $brizy_post, $wp_post, $contentHtml ) {
		$context = new Brizy_Content_Context( $project, $brizy_post, $wp_post, $contentHtml );

		$context = apply_filters( 'brizy_dynamic_content_context_create', $context, $project, $brizy_post, $wp_post, $contentHtml );

		return $context;
	}
}