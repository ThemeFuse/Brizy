<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

class Brizy_Editor_View {
	public static function render( $path, array $args = array() ) {
		$file = $path . '.php';

		if ( ! file_exists( $file ) ) {
			return;
		}

		extract( $args );
		include $file;
	}

	public static function get( $path, array $args = array() ) {
		ob_start();
			self::render( $path, $args );
		return ob_get_clean();
	}
}
