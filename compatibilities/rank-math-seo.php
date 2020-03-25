<?php

class Brizy_Compatibilities_RankMathSeo {

	public function __construct() {
		add_action( 'rest_api_init', [ $this, 'init_rest_api' ] );
	}

	/**
	 * Load the REST API endpoints.
	 */
	public function init_rest_api() {
		register_rest_route( 'rankmath/v1', '/briz_post_content', array(
			'methods' => 'GET',
			[
				'methods'  => WP_REST_Server::ALLMETHODS,
				'callback' => [ $this, 'get_post_content' ],
				'args'     => [
					'postId' => [
						'type'     => 'string',
						'required' => true,
					]
				],
			]
		) );
	}

	/**
	 * @param WP_REST_Request $request
	 *
	 * @return mixed|void
	 */
	public function get_post_content( WP_REST_Request $request ) {
		try {
			$post = Brizy_Editor_Post::get( $request->get_param( 'postId' ) );
			if ( $post->uses_editor() ) {
				return wp_send_json_success( [ 'content' => apply_filters( 'brizy_content', $post->get_compiled_page()->get_body(), Brizy_Editor_Project::get(), $post->getWpPost() ) ] );
			} else {
				wp_send_json_error( 'This post does not use Brizy.', 204 );
			}
		} catch ( Exception $e ) {
			Brizy_Logger::instance()->critical( 'Failed to process REST request', [ $e ] );
			wp_send_json_error( 'Failed to process the request', 500 );
		}
	}
}
