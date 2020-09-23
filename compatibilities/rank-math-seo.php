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
			$post = Brizy_Editor_Post::get( $_GET['post'] );

			if ( ! $post->uses_editor() ) {
				return;
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
