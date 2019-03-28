<?php

class Brizy_Editor_BlockScreenshotApi {

	const AJAX_SAVE_BLOCK_SCREENSHOT = 'brizy_save_block_screenshot';

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
		$this->initialize();
	}


	private function initialize() {
		add_action( 'wp_ajax_' . self::AJAX_SAVE_BLOCK_SCREENSHOT, array( $this, 'saveBlockScreenShot' ) );
		add_action( 'wp_ajax_nopriv_' . self::AJAX_SAVE_BLOCK_SCREENSHOT, array( $this, 'saveBlockScreenShot' ) );
	}

	public function saveBlockScreenShot() {

		session_write_close();

		if ( empty( $_POST['block_type'] ) || ! in_array( $_POST['block_type'], $this->blockTypes ) || empty( $_POST['img'] ) || empty( $_POST['block_id'] ) ) {
			wp_send_json( array(
				'success' => false,
				'message' => esc_html__( 'Bad request', 'brizy' )
			), 400 );
		}

		// obtain the image content from POST
		$imageContent = null;
		$fileName     = null;

		if ( preg_match( '/^data:image\/(\w+);base64,/', $_POST['img'], $img_type ) ) {
			$base64     = $_POST['img'];
			$img_base64 = substr( $base64, strpos( $base64, ',' ) + 1 );
			$img_type   = strtolower( $img_type[1] ); // jpg, png, gif
			$fileName   = sanitize_file_name( $_POST['block_id'] . ".{$img_type}" );

			if ( ! in_array( $img_type, array( 'jpg', 'jpeg', 'gif', 'png' ) ) ) {
				wp_send_json( array(
					'success' => false,
					'message' => esc_html__( 'Invalid image format', 'brizy' )
				) );
			}

			$imageContent = base64_decode( $img_base64 );

			if ( false === $base64 ) {
				wp_send_json( array(
					'success' => false,
					'message' => esc_html__( 'Invalid image content', 'brizy' )
				), 400 );
			}

			if ( ! $this->saveScreenshot( $_POST['block_type'], $fileName, $imageContent ) ) {
				wp_send_json( array(
					'success' => false,
					'message' => esc_html__( 'Unable to store the block thumbnail', 'brizy' )
				), 500 );
			}

		} else {
			wp_send_json( array(
				'success' => false,
				'message' => esc_html__( 'Invalid image parameter format', 'brizy' )
			), 400 );
		}

		wp_send_json( array( 'success' => true ) );
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
			
			if($imageEditor instanceof WP_Error)
				throw new Exception($imageEditor->get_error_message());

			$imageEditor->resize( 600, 600 );
			$result = $imageEditor->save( $thumbnailFullPath );

			return is_array( $result );
		} catch ( Exception $e ) {
			return false;
		}
	}


}