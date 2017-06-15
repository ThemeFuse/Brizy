<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

try {
	$post   = new BitBlox_WP_Post( get_the_ID() );
	$editor = new BitBlox_WP_Editor( $post->get_id(), $post->get_project()->get_id() );
	$editor->load();
	BitBlox_WP_Public::render( 'editor' );
} catch ( Exception $exception ) {
	$message = __(
		'Unable to load editor. Please check out your internet connection.',
		bitblox_wp()->get_domain()
	);

	BitBlox_WP_Public::render( 'error', array( 'message' => $message ) );
}