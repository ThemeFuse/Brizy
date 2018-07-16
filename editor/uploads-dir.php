<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

class Brizy_Editor_UploadsDir {

	public static function get_uri( $rel = null ) {
		return implode(
			'/',
			array( self::get_uploads_url(), brizy()->get_slug(), (string) $rel )
		);
	}

	public static function get_path( $rel = null ) {
		return implode(
			DIRECTORY_SEPARATOR,
			array( self::get_uploads_path(), brizy()->get_slug(), (string) $rel )
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
			$uploads = Brizy_Admin_UploadDir::getUploadDir();
			$uri     = $uploads['baseurl'];
		}

		return $uri;
	}

	private static function get_uploads_path() {
		static $uri;

		if ( ! $uri ) {
			$uploads = Brizy_Admin_UploadDir::getUploadDir();
			$uri     = $uploads['basedir'];
		}

		return $uri;
	}

	private static function create_dir( $base, $rel ) {

		$path = $base;

		if($rel)
		{
			$path .=  $rel;
		}

		if ( ! file_exists( $path ) && ! mkdir( $path ) ) {
			throw new Brizy_Editor_Exceptions_AccessDenied(
				'Cannot create static directory. Please check permissions'
			);
		}

		return $path;
	}
}
