<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

class Brizy_Editor_Asset_MediaUpload {
	const DIR = 'media';

	public static function upload( $url, $replace = false ) {
		$name = md5( $url ) . '.' . pathinfo( $url, PATHINFO_EXTENSION );

		$media = new Brizy_Editor_Asset_Media(
			self::get_url() . '/' . $name,
			self::get_path() . '/' . $name
		);

		if ( ! $replace && file_exists( $media->get_path() ) ) {
			return $media;
		}

		$content = file_get_contents( $url );

		self::upload_file( $name, $content );

		return $media;
	}

	public static function get_url() {
		return Brizy_Editor_UploadsDir::get_uri( self::DIR );
	}

	public static function get_path() {
		return Brizy_Editor_UploadsDir::get_path( self::DIR );
	}

	private static function upload_file( $name, $content ) {
		static $checked = false;

		if ( ! $checked ) {
			Brizy_Editor_UploadsDir::add_dir( self::DIR );
			$checked = true;
		}

		if ( ! file_put_contents( self::get_path() . DIRECTORY_SEPARATOR . $name, $content ) ) {
			throw new Brizy_Editor_Exceptions_AccessDenied(
				'Cannot write file. Please check permissions'
			);
		}

		return true;
	}
}