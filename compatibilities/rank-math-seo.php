<?php

class Brizy_Compatibilities_RankMathSeo {

	public function __construct() {
		add_filter( 'admin_init', array( $this, 'compile_post' ) );
	}

	public function compile_post() {
		global $pagenow;

		if ( 'post.php' !== $pagenow ) {
			return;
		}

		try {

			if ( Brizy_Editor_Entity::isBrizyEnabled( $request->get_param( 'postId' ) ) ) {
				$post = Brizy_Editor_Post::get( $request->get_param( 'postId' ) );
				return wp_send_json_success( [ 'content' => apply_filters( 'brizy_content', $post->get_compiled_page()->get_body(), Brizy_Editor_Project::get(), $post->getWpPost() ) ] );
			} else {
				wp_send_json_error( 'This post does not use Brizy.', 204 );
			}

			$needs_compile = ! $post->isCompiledWithCurrentVersion() || $post->get_needs_compile();

			if ( $needs_compile ) {
				$post->compile_page();
				$post->saveStorage();
				$post->savePost();
			}

		} catch ( Exception $e ) {
		}
	}
}
