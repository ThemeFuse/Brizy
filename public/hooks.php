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

function _filter_bitblox_wp_public_page_templates( $templates ) {

	$list = wp_get_theme()->get_page_templates();

	foreach ( $list as $key => $title ) {
		$templates[] = array(
			'id'    => $key,
			'title' => $title
		);
	}

	return $templates;
}

function _filter_bitblox_wp_public_register_page_templates( $templates ) {
	return array_merge( $templates,
		array(
			'bitblox-wp-blank-template.php' => __( 'Blank', bitblox_wp()->get_domain() )
		) );
}

foreach ( bitblox_wp()->supported_post_types() as $type ) {
	add_filter( "bitblox_wp:$type:templates", '_filter_bitblox_wp_public_page_templates' );
	add_filter( "theme_{$type}_templates", '_filter_bitblox_wp_public_register_page_templates' );
}