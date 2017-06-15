<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

class BitBlox_WP_View {
	public static function render( $path, array $args = array() ) {
		echo self::get( $path, $args );
	}

	public static function get( $path, array $args = array() ) {
		$file = $path . '.php';

		if ( ! file_exists( $file ) ) {
			return '';
		}

		ob_start();
		extract( $args );
		include_once $file;

		return ob_get_clean();
	}
}
