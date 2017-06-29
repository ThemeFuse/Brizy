<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

class BitBlox_WP_Uploads_Dir {

	public static function get_uri( $rel = null ) {
		return implode(
			'/',
			array( self::get_uploads_url(), bitblox_wp()->get_slug(), (string) $rel )
		);
	}

	public static function get_path( $rel = null ) {
		return implode(
			DIRECTORY_SEPARATOR,
			array( self::get_uploads_path(), bitblox_wp()->get_slug(), (string) $rel )
		);
	}

	public static function add_dir( $rel = null ) {
		$rel  = explode( DIRECTORY_SEPARATOR, (string) $rel );
		$rel  = array_map( 'trim', $rel );
		$dirs = array_merge( array( '' ), $rel );

		return array_reduce( $dirs, array( __CLASS__, 'create_dir' ), self::get_path() );
	}

	private static function get_uploads_url() {
		static $uri;

		if ( ! $uri ) {
			$uploads = wp_upload_dir();
			$uri     = $uploads['baseurl'];
		}

		return $uri;
	}

	private static function get_uploads_path() {
		static $uri;

		if ( ! $uri ) {
			$uploads = wp_upload_dir();
			$uri     = $uploads['basedir'];
		}

		return $uri;
	}

	private static function create_dir( $base, $rel ) {
		$path = implode( DIRECTORY_SEPARATOR, array( $base, $rel ) );
		if ( ! file_exists( $path ) && ! mkdir( $path ) ) {
			throw new BitBlox_WP_Exception_Access_Denied(
				'Cannot create static directory. Please check permissions'
			);
		}

		return $path;
	}
}
