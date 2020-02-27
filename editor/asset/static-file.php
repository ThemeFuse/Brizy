<?php

abstract class Brizy_Editor_Asset_StaticFile {

	protected function get_asset_content( $asset_source ) {
		$http        = new WP_Http();
		$wp_response = null;
		if ( is_string( $asset_source ) ) {
			$wp_response = $http->request( $asset_source, array( 'timeout' => 30 ) );
		} else {
			foreach ( $asset_source as $url ) {
				$wp_response = $http->request( $url, array( 'timeout' => 30 ) );

				if ( is_wp_error( $wp_response ) ) {
					Brizy_Logger::instance()->error( 'Unable to get media content', array( 'exception' => $wp_response ) );
					continue;
				}

				break;
			}
		}

		$code = wp_remote_retrieve_response_code( $wp_response );

		if ( is_wp_error( $wp_response ) || ! ( $code >= 200 && $code < 300 ) ) {
			Brizy_Logger::instance()->error( 'Unable to get media content', array( 'exception' => $wp_response ) );

			return false;
		}

		$content = wp_remote_retrieve_body( $wp_response );

		return $content;
	}

	/**
	 * @param $asset_source
	 * @param $asset_relative_path
	 *
	 * @return bool
	 */
	protected function store_file( $asset_source, $asset_relative_path ) {

		$fs = Brizy_Admin_FileSystem::instance();

		if ( $fs->has( $asset_relative_path ) ) {
			return true;
		} elseif ( ( $lfs = Brizy_Admin_FileSystem::localInstance() ) && $lfs->has( $asset_relative_path, true ) ) {
			$urlBuilder = new Brizy_Editor_UrlBuilder( Brizy_Editor_Project::get() );
			$fs->loadFileInKey( $asset_relative_path, $urlBuilder->upload_path( $asset_relative_path ) );
		}

		try {
			$content = $this->get_asset_content( $asset_source );

			return $fs->write( $asset_relative_path, $content ) > 0;
		} catch ( Exception $e ) {
			// clean up
			if ( $asset_relative_path ) {
				$fs->delete( $asset_relative_path );
			}

			return false;
		}

		return true;
	}

	protected function create_attachment( $madia_name, $absolute_asset_path, $relative_asset_path, $post_id = null, $uid = null ) {
		$filetype = wp_check_filetype( $absolute_asset_path );

		$upload_path = Brizy_Admin_UploadDir::getUploadDir();

		$attachment = array(
			'guid'           => $upload_path['baseurl'] . "/" . $relative_asset_path,
			'post_mime_type' => $filetype['type'],
			'post_title'     => basename( $absolute_asset_path ),
			'post_content'   => '',
			'post_status'    => 'inherit'
		);

		$attachment_id = wp_insert_attachment( $attachment, $relative_asset_path, $post_id );

		if ( is_wp_error( $attachment_id ) || $attachment_id === 0 ) {
			return false;
		}

		update_post_meta( $attachment_id, 'brizy_external_media_name', $madia_name );
		update_post_meta( $attachment_id, 'brizy_attachment_uid', $uid ? $uid : md5( $attachment_id . time() ) );

		if ( ! function_exists( 'wp_generate_attachment_metadata' ) ) {
			include_once ABSPATH . "/wp-admin/includes/image.php";
		}

		$attach_data = wp_generate_attachment_metadata( $attachment_id, $relative_asset_path );
		wp_update_attachment_metadata( $attachment_id, $attach_data );

		return $attachment_id;
	}

	/***
	 * @param $attachmentId
	 * @param $post_id
	 * @param $madia_name
	 *
	 * @return bool
	 * @throws Exception
	 */
	public function attach_to_post( $attachmentId, $post_id, $madia_name ) {

		if ( ! $post_id ) {
			return false;
		}
		$bpost = Brizy_Editor_Post::get( $post_id );

		update_post_meta( $attachmentId, 'brizy_post_uid', $bpost->getUid() );

		return $attachmentId;
	}

	/**
	 * @param $filename
	 * @param array $headers
	 *
	 * @throws Exception
	 */
	public function send_file( $filename, $headers = array() ) {

		$fs = Brizy_Admin_FileSystem::instance();

		if ( $fs->has( $filename, true ) ) {
			$this->sendFileContent( $filename, $fs, $headers );
		} else if ( ( $lfs = Brizy_Admin_FileSystem::localInstance() ) && $lfs->has( $filename, true ) ) {
			$this->sendFileContent( $filename, $lfs, $headers );
		} else {
			global $wp_query;
			$wp_query->set_404();

			return;
		}
	}


	/**
	 * @param $filename
	 * @param Brizy_Admin_FileSystem $fs
	 * @param array $headers
	 */
	private function sendFileContent( $filename, $fs, $headers = array() ) {
		$defaultHeaders = array(
			'Content-Type'  => $this->get_mime( $filename, 1 ),
			'Cache-Control' => 'max-age=600'
		);

		$content = $fs->read( $filename );

		// send headers
		$headers = array_merge( $defaultHeaders, $headers );

		foreach ( $headers as $key => $val ) {
			if ( is_array( $val ) ) {
				$val = implode( ', ', $val );
			}

			header( "{$key}: {$val}" );
		}
		// send file content
		echo $content;
		exit;
	}

	/**
	 * @param $filename
	 * @param int $mode
	 *
	 * @return mixed|string
	 */
	protected function get_mime( $filename, $mode = 0 ) {

		// mode 0 = full check
		// mode 1 = extension check only

		$mime_types = array(

			'txt'  => 'text/plain',
			'htm'  => 'text/html',
			'html' => 'text/html',
			'php'  => 'text/html',
			'css'  => 'text/css',
			'js'   => 'application/javascript',
			'json' => 'application/json',
			'xml'  => 'application/xml',
			'swf'  => 'application/x-shockwave-flash',
			'flv'  => 'video/x-flv',

			// images
			'png'  => 'image/png',
			'jpe'  => 'image/jpeg',
			'jpeg' => 'image/jpeg',
			'jpg'  => 'image/jpeg',
			'gif'  => 'image/gif',
			'bmp'  => 'image/bmp',
			'ico'  => 'image/vnd.microsoft.icon',
			'tiff' => 'image/tiff',
			'tif'  => 'image/tiff',
			'svg'  => 'image/svg+xml',
			'svgz' => 'image/svg+xml',

			// archives
			'zip'  => 'application/zip',
			'rar'  => 'application/x-rar-compressed',
			'exe'  => 'application/x-msdownload',
			'msi'  => 'application/x-msdownload',
			'cab'  => 'application/vnd.ms-cab-compressed',

			// audio/video
			'mp3'  => 'audio/mpeg',
			'qt'   => 'video/quicktime',
			'mov'  => 'video/quicktime',

			// adobe
			'pdf'  => 'application/pdf',
			'psd'  => 'image/vnd.adobe.photoshop',
			'ai'   => 'application/postscript',
			'eps'  => 'application/postscript',
			'ps'   => 'application/postscript',

			// ms office
			'doc'  => 'application/msword',
			'rtf'  => 'application/rtf',
			'xls'  => 'application/vnd.ms-excel',
			'ppt'  => 'application/vnd.ms-powerpoint',
			'docx' => 'application/msword',
			'xlsx' => 'application/vnd.ms-excel',
			'pptx' => 'application/vnd.ms-powerpoint',


			// open office
			'odt'  => 'application/vnd.oasis.opendocument.text',
			'ods'  => 'application/vnd.oasis.opendocument.spreadsheet',
		);

		$array = explode( '.', $filename );
		$str   = end( $array );
		$ext   = strtolower( $str );

		if ( function_exists( 'mime_content_type' ) && $mode == 0 ) {
			$mimetype = mime_content_type( $filename );

			return $mimetype;

		} elseif ( function_exists( 'finfo_open' ) && $mode == 0 ) {
			$finfo    = finfo_open( FILEINFO_MIME );
			$mimetype = finfo_file( $finfo, $filename );
			finfo_close( $finfo );

			return $mimetype;
		} elseif ( array_key_exists( $ext, $mime_types ) ) {
			return $mime_types[ $ext ];
		} else {
			return 'application/octet-stream';
		}
	}
}
