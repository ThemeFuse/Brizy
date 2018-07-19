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
	 * Brizy_Editor_BlockScreenshot constructor.
	 *
	 * @param $project
	 * @param $post
	 */
	public function __construct( $project, $post ) {

		$this->project    = $project;
		$this->post       = $post;
		$this->urlBuilder = new Brizy_Editor_UrlBuilder( $project, $post );
		$this->blockTypes = array( self::BLOCK_TYPE_NORMAL, self::BLOCK_TYPE_GLOBAL, self::BLOCK_TYPE_SAVED );
		$this->initialize();
	}


	private function initialize() {

		if ( ! Brizy_Editor::is_user_allowed() ) {
			return;
		}

		if ( ! ( isset( $_REQUEST['hash'] ) && wp_verify_nonce( $_REQUEST['hash'], Brizy_Editor_API::nonce ) ) ) {
			return;
		}

		add_action( 'wp_ajax_' . self::AJAX_SAVE_BLOCK_SCREENSHOT, array( $this, 'saveBlockScreenShot' ) );
	}

	public function saveBlockScreenShot() {

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
		switch ( $type ) {
			case self::BLOCK_TYPE_NORMAL:
				return $this->storeNormalBlockThumbnail( $blockFileName, $content );
			case self::BLOCK_TYPE_GLOBAL:
				return $this->storeGlobalBlockThumbnail( $blockFileName, $content );
			case self::BLOCK_TYPE_SAVED:
				return $this->storeSaveBlockThumbnail( $blockFileName, $content );
		}
	}

	/**
	 * @param $blockId
	 * @param $blockFileName
	 * @param $content
	 *
	 * @return bool
	 */
	private function storeNormalBlockThumbnail( $blockFileName, $content ) {
		$path = $this->urlBuilder->page_upload_path( 'blockThumbnails' );

		return $this->storeFile( $content, $path, $blockFileName );
	}

	/**
	 * @param $blockId
	 * @param $blockFileName
	 * @param $content
	 *
	 * @return bool
	 */
	private function storeGlobalBlockThumbnail( $blockFileName, $content ) {
		$path = $this->urlBuilder->brizy_upload_path( 'blockThumbnails' . DIRECTORY_SEPARATOR . 'global' );

		return $this->storeFile( $content, $path, $blockFileName );
	}

	/**
	 * @param $blockId
	 * @param $blockFileName
	 * @param $content
	 *
	 * @return bool
	 */
	private function storeSaveBlockThumbnail( $blockFileName, $content ) {
		$path = $this->urlBuilder->brizy_upload_path( 'blockThumbnails' . DIRECTORY_SEPARATOR . 'saved' );

		return $this->storeFile( $content, $path, $blockFileName );
	}

	/**
	 * @param $content
	 * @param $path
	 * @param $blockFileName
	 *
	 * @return bool
	 */
	private function storeFile( $content, $path, $blockFileName ) {
		$thumbnailFullPath = $path . DIRECTORY_SEPARATOR . $blockFileName;

		if ( ! file_exists( $path ) ) {
			if ( ! @mkdir( $path, 0755, true ) ) {
				return false;
			}
		}

		return file_put_contents( $thumbnailFullPath, $content ) !== false;
	}

//	public function load_block_screenshot() {
//
//		if ( empty( $_GET['block_id'] ) || empty( $_GET['block_type'] ) || in_array( $_GET['block_type'], self::BLOCK_TYPES ) ) {
//			wp_send_json( array(
//				'success' => false,
//				'message' => esc_html__( 'There are no all required GET variables', 'brizy' )
//			) );
//		}
//
//		$path = $this->get_dir( $_GET ) . sanitize_file_name( "{$_GET['block_id']}.jpg" );
//
//		if ( ! file_exists( $path ) ) {
//			wp_send_json( array(
//				'success' => false,
//				'message' => esc_html__( 'The screenshot of the block does not exist.', 'brizy' )
//			) );
//		}
//
//		wp_send_json( array( 'success' => true, 'path' => $path, 'block_id' => $_GET['block_id'] ) );
//	}
//
//	private function get_dir( $arr ) {
//		$block_type = $arr['block_type'];
//
//		if ( in_array( $block_type, self::BLOCK_TYPES ) ) {
//			$dir = "{$block_type}-blocks";
//		} else {
//			if ( empty( $arr['post_id'] ) || ! is_numeric( $arr['post_id'] ) ) {
//				wp_send_json( array(
//					'success' => false,
//					'message' => esc_html__( 'Wrong ID of the post.', 'brizy' )
//				) );
//			}
//
//			$dir = $arr['post_id'];
//		}
//
//		return Brizy_Editor_UploadsDir::get_path() . implode( DIRECTORY_SEPARATOR, array(
//				$dir,
//				'assets',
//				'thumbnails'
//			) ) . DIRECTORY_SEPARATOR;
//	}
}