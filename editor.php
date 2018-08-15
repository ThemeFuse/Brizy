<?php

/**
 * Class Brizy_Editor
 */
class Brizy_Editor {

	private static $is_allowed_for_current_user;

	private static $settings_key = 'post-types';

	private static $instance;

	private function __construct() {
		//add_filter( 'brizy:post_types', array( $this, '_filter_brizy_supported_port_types' ) );
	}

	public static function get() {
		return self::$instance ? self::$instance : self::$instance = new self();
	}

	public static function is_administrator() {

		if ( ! is_user_logged_in() ) {
			return false;
		}

		$user = wp_get_current_user();

		return in_array( 'administrator', (array) $user->roles );
	}

	public static function is_subscriber() {

		if ( ! is_user_logged_in() ) {
			return false;
		}

		$user = wp_get_current_user();

		return in_array( 'subscriber', (array) $user->roles );
	}


	public static function is_user_allowed() {

		if ( ! is_user_logged_in() ) {
			return false;
		}

		if ( is_null( self::$is_allowed_for_current_user ) ) {

			self::$is_allowed_for_current_user =
				!self::is_subscriber() &&
				( current_user_can( Brizy_Admin_Capabilities::CAP_EDIT_WHOLE_PAGE ) ||
				  current_user_can( Brizy_Admin_Capabilities::CAP_EDIT_CONTENT_ONLY )
				  || self::is_administrator()
				);
		}

		return self::$is_allowed_for_current_user;
	}

	public function get_path( $rel = '/' ) {

		return BRIZY_PLUGIN_PATH . DIRECTORY_SEPARATOR . ltrim( $rel, DIRECTORY_SEPARATOR );
	}

	public function get_url( $rel = '' ) {
		return BRIZY_PLUGIN_URL . "/" . ltrim( $rel, "/" );
	}

	public function get_domain() {
		return 'brizy';
	}

	public function get_version() {
		return BRIZY_VERSION;
	}

	public function get_slug() {
		return 'brizy';
	}

	public function supported_post_types() {
		$types = $this->get_post_types();

		return apply_filters( 'brizy_supported_post_types', apply_filters( 'brizy:post_types', $types ) );
	}

	public function default_supported_post_types() {
		return array( 'page', 'post' );
	}

	public function get_name() {
		return 'Brizy';
	}

	protected function get_post_types() {
		try {
			return Brizy_Editor_Storage_Common::instance()->get( self::$settings_key );
		} catch ( Brizy_Editor_Exceptions_NotFound $exception ) {
			Brizy_Editor_Storage_Common::instance()->set( self::$settings_key, $this->default_supported_post_types() );

			return $this->default_supported_post_types();
		}
	}

}