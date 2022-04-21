<?php defined( 'ABSPATH' ) or die();

class Brizy_Import_Extractor {

	private $url;
	/**
	 * @var WP_Filesystem_Direct
	 */
	private $fileSystem;

	public function __construct( $url ) {
		global $wp_filesystem;

		if ( ! $wp_filesystem ) {
			if ( ! function_exists( 'WP_Filesystem' ) ) {
				require_once wp_normalize_path( ABSPATH . '/wp-admin/includes/file.php' );
			}

			WP_Filesystem();
		}

		$this->fileSystem = $wp_filesystem;
		$this->url        = $url;
	}

	/**
	 * @throws Exception
	 */
	public function getFiles() {
		if ( ! function_exists( 'download_url' ) ) {
			require_once ABSPATH . 'wp-admin/includes/file.php';
		}

		$tmpfname = download_url( $this->url );

		if ( is_wp_error( $tmpfname ) ) {
			throw new Exception( $tmpfname->get_error_message() );
		}

		$to = $this->getPath();

		if ( $this->fileSystem->is_dir( $to ) ) {
			$this->fileSystem->delete( $to, true );
		}

		if ( ! $this->fileSystem->mkdir( $to ) ) {
			unlink( $tmpfname );
			throw new Exception( 'Could not create the path: ' . $to );
		}

		$unzip = unzip_file( $tmpfname, $to );

		unlink( $tmpfname );

		if ( is_wp_error( $unzip ) ) {
			$this->fileSystem->delete( $to, true );

			throw new Exception( $unzip->get_error_message() );
		}

		return true;
	}

	public function getPath( $path = '' ) {
		return $this->fileSystem->wp_content_dir() . 'demo' . DIRECTORY_SEPARATOR . $path;
	}

	public function cleanup() {
		$this->fileSystem->delete( $this->getPath(), true );
	}
}
