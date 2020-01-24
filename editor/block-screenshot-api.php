<?php

class Brizy_Editor_BlockScreenshotApi extends Brizy_Admin_AbstractApi {

	const nonce = 'brizy-api';

	const AJAX_CREATE_BLOCK_SCREENSHOT = 'brizy_create_block_screenshot';
	const AJAX_UPDATE_BLOCK_SCREENSHOT = 'brizy_update_block_screenshot';


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
		$this->blockTypes = array(
			Brizy_Editor_Screenshot_Manager::BLOCK_TYPE_NORMAL,
			Brizy_Editor_Screenshot_Manager::BLOCK_TYPE_GLOBAL,
			Brizy_Editor_Screenshot_Manager::BLOCK_TYPE_SAVED
		);
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
		$brizyPost    = isset( $_REQUEST['post'] ) ? $_REQUEST['post'] : null;
		$base64       = $_REQUEST['ibsf'];
		$imageContent = base64_decode( $base64 );

		if ( isset( $_REQUEST['id'] ) ) {
			$screenId = $_REQUEST['id'];
		} else {
			$screenId = \Brizy\Utils\UUId::uuid();
		}

		if ( false === $imageContent ) {
			wp_send_json_error( array(
				'success' => false,
				'message' => esc_html__( 'Invalid image content', 'brizy' )
			), 400 );
		}

		$manager = new Brizy_Editor_Screenshot_Manager( new Brizy_Editor_UrlBuilder( $brizyPost ) );
		$result  = $manager->saveScreenshot( $screenId, $_REQUEST['block_type'], $imageContent, $_REQUEST['brizy_post'] );

		if ( $result ) {
			$screenPath = $manager->getScreenshot( $screenId,  $brizyPost );
			wp_send_json_success( array( 'id' => $screenId, 'file_name' => $screenPath ) );
		}
	}

}
