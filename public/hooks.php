<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

function brizy_initialize_front_end_Brizy_Public_Main() {
	try {
		$pid = brizy_get_current_post_id();

		if ( ! $pid ) {
			return;
		}

		$project = Brizy_Editor_Project::get();
		$post    = Brizy_Editor_Post::get( $pid );

		if ( ! $post->uses_editor() ) {
			throw new Exception();
		}

		$main = new Brizy_Public_Main( $project, $post );
		$main->initialize_front_end();

	} catch ( Exception $e ) {
		Brizy_Logger::instance()->exception( $e );
	}
}


function brizy_initialize_admin_edit_Brizy_Public_Main() {

	if ( ! is_user_logged_in() ) {
		return;
	}

	try {

		$pid = brizy_get_current_post_id();

		if ( ! $pid ) {
			return;
		}

		$project = Brizy_Editor_Project::get();
		$post    = Brizy_Editor_Post::get( $pid );

		if ( ! $post->uses_editor() ) {
			throw new Exception();
		}

		$main = new Brizy_Public_Main( $project, $post );
		$main->initialize_wordpress_editor();

	} catch ( Exception $e ) {
		Brizy_Logger::instance()->exception( $e );
	}
}


function brizy_filter_public_page_templates( $templates ) {

	$list = wp_get_theme()->get_page_templates();

	foreach ( $list as $key => $title ) {
		$templates[] = array(
			'id'    => $key,
			'title' => $title
		);
	}

	return $templates;
}

function brizy_filter_public_register_page_templates( $templates ) {
	return array_merge( $templates,
		array(
			Brizy_Config::BRIZY_BLANK_TEMPLATE_FILE_NAME => __( 'Brizy Template', 'brizy' )
		) );
}


/**
 * @throws Exception
 */
function brizy_initialize_asset_loader() {
	try {
		$project     = Brizy_Editor_Project::get();
		$url_builder = new Brizy_Editor_UrlBuilder( $project );

		$config    = null;
		$proxy     = new Brizy_Public_AssetProxy( $url_builder, $config );
		$crop_roxy = new Brizy_Public_CropProxy( $url_builder, $config );
	} catch ( Exception $e ) {
		Brizy_Logger::instance()->exception( $e );
	}
}

add_action( 'wp', 'brizy_initialize_front_end_Brizy_Public_Main' );
add_action( 'wp_loaded', 'brizy_initialize_admin_edit_Brizy_Public_Main' );
add_action( 'init', 'brizy_initialize_asset_loader', 1000 );

add_filter( "brizy:templates", 'brizy_filter_public_page_templates' );

$supported_post_types   = brizy()->supported_post_types();
$supported_post_types[] = Brizy_Admin_Templates::CP_TEMPLATE;

foreach ( $supported_post_types as $type ) {
	add_filter( "theme_{$type}_templates", 'brizy_filter_public_register_page_templates' );
}