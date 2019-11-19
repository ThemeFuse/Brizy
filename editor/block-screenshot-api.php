<?php

class Brizy_Editor_BlockScreenshotApi extends Brizy_Admin_AbstractApi {

	const nonce = 'brizy-api';

	const AJAX_CREATE_BLOCK_SCREENSHOT = 'brizy_create_block_screenshot';
	const AJAX_UPDATE_BLOCK_SCREENSHOT = 'brizy_update_block_screenshot';

	const BLOCK_TYPE_NORMAL = 'normal';
	const BLOCK_TYPE_GLOBAL = 'global';
	const BLOCK_TYPE_SAVED = 'saved';

	//const BLOCK_TYPES = array( 'global', 'saved' );

	/**
	 * @var Brizy_Editor_Project
	 */
	private $project;

	/**
	 * @var Brizy_Editor_Post
	 */
	private $post;

	/**
	 * @var Brizy_Editor_UrlBuilder
	 */
	private $urlBuilder;

	/**
	 * @var array
	 */
	private $blockTypes;

	/**
	 * Brizy_Editor_BlockScreenshotApi constructor.
	 *
	 * @param $post
	 *
	 * @throws Exception
	 */
	public function __construct( $post ) {
		$this->post       = $post;
		$this->blockTypes = array( self::BLOCK_TYPE_NORMAL, self::BLOCK_TYPE_GLOBAL, self::BLOCK_TYPE_SAVED );
		parent::__construct();
	}

	protected function getRequestNonce() {
		return self::nonce;
	}


	protected function initializeApiActions() {
		add_action( 'wp_ajax_' . self::AJAX_CREATE_BLOCK_SCREENSHOT, array( $this, 'saveBlockScreenShot' ) );
		add_action( 'wp_ajax_nopriv_' . self::AJAX_CREATE_BLOCK_SCREENSHOT, array( $this, 'saveBlockScreenShot' ) );
		add_action( 'wp_ajax_' . self::AJAX_UPDATE_BLOCK_SCREENSHOT, array( $this, 'saveBlockScreenShot' ) );
		add_action( 'wp_ajax_nopriv_' . self::AJAX_UPDATE_BLOCK_SCREENSHOT, array( $this, 'saveBlockScreenShot' ) );
	}

	public function saveBlockScreenShot() {

		$this->verifyNonce( self::nonce );

		session_write_close();

		if ( empty( $_REQUEST['block_type'] ) || ! in_array( $_REQUEST['block_type'], $this->blockTypes ) || empty( $_REQUEST['ibsf'] ) ) {
			wp_send_json_error( array(
				'success' => false,
				'message' => esc_html__( 'Bad request', 'brizy' )
			), 400 );
		}

		// obtain the image content from POST
		$imageContent = null;
		$fileName     = null;
		$screenId     = null;


		$base64       = $_REQUEST['ibsf'];
		$imageContent = base64_decode( $base64 );


		if ( false === $imageContent ) {
			wp_send_json_error( array(
				'success' => false,
				'message' => esc_html__( 'Invalid image content', 'brizy' )
			), 400 );
		}

		$img_type = $this->getFileExtensionByContent( $imageContent );

		if ( ! in_array( $img_type, array( 'jpg', 'jpeg', 'gif', 'png' ) ) ) {
			wp_send_json_error( array(
				'message' => esc_html__( 'Invalid image format', 'brizy' )
			) );
		}

		if ( isset( $_REQUEST['id'] ) ) {
			$screenId = $_REQUEST['id'];
		} else {
			$screenId = \Brizy\Utils\UUId::uuid();
		}

		$fileName = $screenId . '.' . $img_type;

		if ( ! $this->saveScreenshot( $_REQUEST['block_type'], $fileName, $imageContent ) ) {
			wp_send_json_error( array(
				'message' => esc_html__( 'Unable to store the block thumbnail', 'brizy' )
			), 500 );
		}

		wp_send_json_success( array( 'id' => $screenId, 'file_name' => $fileName ) );
	}

	protected function getFileExtensionByContent( $content ) {
		$tmpfname = tempnam( sys_get_temp_dir(), "blockScreenShot" );

		$handle = fopen( $tmpfname, "w" );
		fwrite( $handle, $content );
		fclose( $handle );

		$mimeType = wp_get_image_mime( $tmpfname );

		return $this->getExtentsionByMime( $mimeType );
	}

	/**
	 * @param $filename
	 * @param int $mode
	 *
	 * @return mixed|string
	 */
	protected function getExtentsionByMime( $mimeType ) {

		$extensions = array(
			'image/png'  => 'png',
			'image/jpeg' => 'jpeg',
			'image/jpg'  => 'jpg',
			'image/gif'  => 'gif',
		);

		if ( isset( $extensions[ $mimeType ] ) ) {
			return $extensions[ $mimeType ];
		}

		return null;
	}

	/**
	 * @param $type
	 * @param $blockFileName
	 * @param $content
	 *
	 * @return bool
	 */
	private function saveScreenshot( $type, $blockFileName, $content ) {
		try {
			$urlBuilder = new Brizy_Editor_UrlBuilder( Brizy_Editor_Project::get(), $this->post ? $this->post->get_parent_id() : null );

			switch ( $type ) {
				case self::BLOCK_TYPE_NORMAL:
					return $this->storeThumbnail( $content, $urlBuilder->page_upload_path( 'blockThumbnails' . DIRECTORY_SEPARATOR . $blockFileName ) );
				case self::BLOCK_TYPE_GLOBAL:
					return $this->storeThumbnail( $content, $urlBuilder->brizy_upload_path( 'blockThumbnails' . DIRECTORY_SEPARATOR . 'global' . DIRECTORY_SEPARATOR . $blockFileName ) );
				case self::BLOCK_TYPE_SAVED:
					return $this->storeThumbnail( $content, $urlBuilder->brizy_upload_path( 'blockThumbnails' . DIRECTORY_SEPARATOR . 'saved' . DIRECTORY_SEPARATOR . $blockFileName ) );
			}
		} catch ( Exception $e ) {
			return false;
		}
	}

	/**
	 * @param $content
	 * @param $filePath
	 *
	 * @return bool
	 */
	private function storeThumbnail( $content, $filePath ) {
		$store_file = $this->storeFile( $content, $filePath );

		if ( $store_file ) {
			$store_file = $this->resizeImage( $filePath );
		}

		return $store_file;
	}

	/**
	 * @param $content
	 * @param $thumbnailFullPath
	 *
	 * @return bool
	 */
	private function storeFile( $content, $thumbnailFullPath ) {
		$path = dirname( $thumbnailFullPath );

		if ( ! file_exists( $path ) ) {
			if ( ! @mkdir( $path, 0755, true ) ) {
				return false;
			}
		}

		return file_put_contents( $thumbnailFullPath, $content ) !== false;
	}


	/**
	 * @param $thumbnailFullPath
	 *
	 * @return bool
	 */
	private function resizeImage( $thumbnailFullPath ) {
		try {
			$imageEditor = wp_get_image_editor( $thumbnailFullPath );

			if ( $imageEditor instanceof WP_Error ) {
				throw new Exception( $imageEditor->get_error_message() );
			}

			$imageEditor->resize( 600, 600 );
			$result = $imageEditor->save( $thumbnailFullPath );

			return is_array( $result );
		} catch ( Exception $e ) {
			return false;
		}
	}


}