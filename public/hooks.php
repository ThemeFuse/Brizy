<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

function _action_brizy_delete_scripts_and_styles( $id ) {
	$path = Brizy_Static_Storage::get_path()
	        . DIRECTORY_SEPARATOR
	        . brizy()->get_slug()
	        . "-$id*";
	foreach ( glob( $path ) as $item ) {
		unlink( $item );
	}
}

add_action( 'brizy_delete_post', '_action_brizy_delete_scripts_and_styles' );

function _filter_brizy_public_page_templates( $templates ) {

	$list = wp_get_theme()->get_page_templates();

	foreach ( $list as $key => $title ) {
		$templates[] = array(
			'id'    => $key,
			'title' => $title
		);
	}

	return $templates;
}

function _filter_brizy_public_register_page_templates( $templates ) {
	return array_merge( $templates,
		array(
			'brizy-blank-template.php' => __( 'Blank', brizy()->get_domain() )
		) );
}

foreach ( brizy()->supported_post_types() as $type ) {
	add_filter( "brizy:$type:templates", '_filter_brizy_public_page_templates' );
	add_filter( "theme_{$type}_templates", '_filter_brizy_public_register_page_templates' );
}