<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

function _action_bitblox_delete_scripts_and_styles( $id ) {
	$path = BitBlox_WP_Static_Storage::get_path()
	        . DIRECTORY_SEPARATOR
	        . bitblox_wp()->get_slug()
	        . "-$id*";
	foreach ( glob( $path ) as $item ) {
		unlink( $item );
	}
}

add_action( 'bitblox_wp_delete_post', '_action_bitblox_delete_scripts_and_styles' );
add_action( 'bitblox_wp_post_before_update', '_action_bitblox_delete_scripts_and_styles' );