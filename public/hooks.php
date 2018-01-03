<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

function _action_brizy_delete_scripts_and_styles( $id ) {
	$path = Brizy_Editor_Resources_StaticStorage::get_path()
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
			'brizy-blank-template.php' => __( 'Brizy Template', 'brizy' )
		) );
}

function _catch_templates( $template ) {

	global $post;

	$template_path = get_post_meta( $post->ID, '_wp_page_template', true );

	if ( basename($template_path)=='brizy-blank-template.php' ) {
		return Brizy_Editor::get()->get_path( '/public/views/templates/brizy-blank-template.php' );
	}

	return $template;
}

function initialize_front_end_Brizy_Public_Main() {

	try {
		$pid = brizy_get_current_post_id();

		if ( ! $pid ) {
			throw new Exception();
		}

		$project = Brizy_Editor_Project::get();
		$post    = Brizy_Editor_Post::get( $pid );

		if ( ! $post->uses_editor() ) {
			throw new Exception();
		}

		$main = new Brizy_Public_Main( $project, $post );
		$main->initialize_front_end();

	} catch ( Exception $e ) {

	}
}

function initialize_admin_edit_Brizy_Public_Main() {

	$pid = brizy_get_current_post_id();

	try {

		if ( ! $pid ) {
			throw new Exception();
		}

		$project = Brizy_Editor_Project::get();
		$post    = Brizy_Editor_Post::get( $pid );

		if ( ! $post->uses_editor() ) {
			throw new Exception();
		}

		$main = new Brizy_Public_Main( $project, $post );
		$main->initialize_wordpress_editor();

	} catch ( Exception $e ) {
	}
}

add_action( 'wp', 'initialize_front_end_Brizy_Public_Main' );
add_action( 'wp_loaded', 'initialize_admin_edit_Brizy_Public_Main' );

foreach ( brizy()->supported_post_types() as $type ) {
	add_filter( "brizy:$type:templates", '_filter_brizy_public_page_templates' );
	add_filter( "theme_{$type}_templates", '_filter_brizy_public_register_page_templates' );
	add_filter( "{$type}_template", '_catch_templates' );
}