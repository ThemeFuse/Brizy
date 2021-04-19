<?php defined( 'ABSPATH' ) or die();

/** WordPress Import Administration API */
require_once ABSPATH . 'wp-admin/includes/import.php';

class Brizy_Import_Extractors_Xml {

	private $url;
	private $id;

	public function __construct( $url ) {
		$this->url = $url;
	}

	public function getFilePath() {

		$path = get_attached_file( $this->getId() );

		if ( ! $path ) {
			$this->error( null, 'The xml file do not exist.' );
		}

		return $path;
	}

	public function getId() {
		if ( ! $this->id ) {
			$this->id = $this->download();
		}

		return $this->id;
	}

	public function download() {
		$remoteXml = fopen( $this->url, 'r' );

		if ( ! $remoteXml ) {
			$this->error( null, 'Can not open the xml remote file.' );
		}

		$meta    = stream_get_meta_data( $remoteXml );
		$xmlMeta = false;

		if ( $meta && ! empty( $meta['wrapper_data'] ) ) {
			foreach ( $meta['wrapper_data'] as $v ) {
				if ( preg_match( '/Content\-Type: ?((text)\/?(xml))/i', $v, $matches ) ) {
					$xmlMeta = $matches[1];
				}
			}
		}

		// Resource did not provide an xml.
		if ( ! $xmlMeta ) {
			$this->error( null, 'This is not a xml file.' );
		}

		// Simulate uploading a file through $_FILES. We need a temporary file for this.
		$stream_content = stream_get_contents( $remoteXml );
		$tmp            = tmpfile();
		$tmp_path       = stream_get_meta_data( $tmp )['uri'];

		fwrite( $tmp, $stream_content );
		fseek( $tmp, 0 ); // If we don't do this, WordPress thinks the file is empty

		$fake_FILE = [
			'name'     => 'brizy-demo-xml.txt',
			'type'     => 'text/plain',
			'tmp_name' => $tmp_path,
			'error'    => UPLOAD_ERR_OK,
			'size'     => strlen( $stream_content )
		];

		// Trick is_uploaded_file() by adding it to the superglobal
		$_FILES[ basename( $tmp_path ) ] = $fake_FILE;

		// For wp_handle_upload to work:
		if ( ! function_exists( 'wp_handle_upload' ) || ! function_exists( 'wp_generate_attachment_metadata' ) ) {
			include_once ABSPATH . 'wp-admin/includes/media.php';
			include_once ABSPATH . 'wp-admin/includes/file.php';
			include_once ABSPATH . 'wp-admin/includes/image.php';
		}

		$handleUpload = wp_handle_upload( $fake_FILE, [
			'test_form' => false,
			'test_type' => false,
			'action'    => 'local',
		] );

		fclose( $tmp ); // Close tmp file
		@unlink( $tmp_path ); // Delete the tmp file. Closing it should also delete it, so hide any warnings with @
		unset( $_FILES[ basename( $tmp_path ) ] ); // Clean up our $_FILES mess.

		fclose( $remoteXml ); // Close the opened xml resource

		if ( ! empty( $handleUpload['error'] ) ) {
			$this->error( null, $handleUpload['error'] );
		}

		$id = wp_insert_attachment( [
			'post_title'     => 'Demo Import Xml',
			'post_content'   => '',
			'post_status'    => 'publish',
			'post_mime_type' => $handleUpload['type']
		], $handleUpload['file'] );

		$this->error( $id );

		wp_update_attachment_metadata( $id, wp_generate_attachment_metadata( $id, $handleUpload['file'] ) );

		/*
		 * Schedule a cleanup for one day from now in case of failed
		 * import or missing wp_import_cleanup() call.
		 */
		wp_schedule_single_event( time() + DAY_IN_SECONDS, 'importer_scheduled_cleanup', [ $id ] );

		return $id;
	}

	public function cleanup() {

		if ( $this->id ) {
			wp_import_cleanup( $this->id );
		}
	}

	/**
	 * @throws Exception
	 */
	public function error( $wp_error, $error = '' ) {
		if ( is_wp_error( $wp_error ) ) {
			throw new Exception( $wp_error->get_error_message() );
		}

		if ( $error ) {
			throw new Exception( $error );
		}
	}
}
