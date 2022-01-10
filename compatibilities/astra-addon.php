<?php
/*
 * https://wpastra.com/changelog/astra-pro-addon/
 * */
class Brizy_Compatibilities_AstraAddon {

	public function __construct() {
		add_action( 'brizy_preview_enqueue_scripts', [ $this, 'preview_enqueue_scripts' ] );
	}

	public function preview_enqueue_scripts( Brizy_Editor_Post $editorPost ) {
		global $template;

		if ( is_singular( 'astra-advanced-hook' ) || ! strpos( $template, Brizy_Config::BRIZY_BLANK_TEMPLATE_FILE_NAME ) ) {
			return;
		}

		$postId = $editorPost->getWpPost()->ID;

		if ( ! in_array( get_post_meta( $postId, 'ast-advanced-hook-layout', true ), [ 'header', 'footer' ] ) ) {
			return;
		}

		Brizy_Public_AssetEnqueueManager::_init()->dequeuePost( $editorPost );
	}
}
