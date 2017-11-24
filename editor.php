<?php
/**
 * Class Brizy_Editor
 */
class Brizy_Editor {

	private static $is_allowed_for_current_user;

	private static $settings_key = 'post-types';

	private static $instance;

	public static function get() {
		return self::$instance ? self::$instance : self::$instance = new self();
	}

	public static function is_user_allowed() {

		if(is_null(self::$is_allowed_for_current_user))
		{
			$user = wp_get_current_user();

			$excluded_roles = array();

			try {
				$excluded_roles = Brizy_Editor_Storage_Common::instance()->get( 'exclude-roles' );
			} catch ( Exception $e ) {

			}

			self::$is_allowed_for_current_user = count( array_intersect( $excluded_roles, (array) $user->roles ) ) == 0;
		}

		return self::$is_allowed_for_current_user;
	}

	private function __construct() {
		add_filter( 'brizy:post_types', array( $this, '_filter_brizy_supported_port_types' ) );
	}

	public function get_path( $rel = '/' ) {
		$s = DIRECTORY_SEPARATOR;

		return rtrim( plugin_dir_path( dirname( __FILE__ ) . '../' ), $s ) . $s . ltrim( $rel, $s );
	}

	public function get_url( $rel = '' ) {
		return rtrim( plugin_dir_url( 'brizy/brizy.php' ), '/' ) . '/' . ltrim( $rel, '/' );
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
		return apply_filters( 'brizy:post_types', array( 'page' ) );
	}

	public function get_name() {
		return 'Brizy';
	}

	/**
	 * @internal
	 *
	 * @param array $types
	 *
	 * @return array
	 **/
	public function _filter_brizy_supported_port_types( $types ) {

		$saved = $this->get_post_types();

		if ( $saved === null ) {
			return $types;
		}

		return $saved;
	}

	protected function get_post_types() {
		try {
			return Brizy_Editor_Storage_Common::instance()->get( self::$settings_key );
		} catch ( Brizy_Editor_Exceptions_NotFound $exception ) {
			return null;
		}
	}
}