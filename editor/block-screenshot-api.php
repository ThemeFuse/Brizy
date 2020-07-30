<?php

class Brizy_Editor_BlockScreenshotApi extends Brizy_Admin_AbstractApi {

	const nonce = 'brizy-api';

	const AJAX_CREATE_BLOCK_SCREENSHOT = '_create_block_screenshot';
	const AJAX_UPDATE_BLOCK_SCREENSHOT = '_update_block_screenshot';

	/**
	 * @var Brizy_Editor_Post
	 */
	private $post;

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
			Brizy_Editor_Screenshot_Manager::BLOCK_TYPE_SAVED,
			Brizy_Editor_Screenshot_Manager::BLOCK_TYPE_LAYOUT
		);
		parent::__construct();
	}

	protected function getRequestNonce() {
        return $this->param( 'hash' );
	}


	protected function initializeApiActions() {
		$pref        = 'wp_ajax_' . Brizy_Editor::prefix();
		$pref_nopriv = 'wp_ajax_nopriv_' . Brizy_Editor::prefix();
		add_action( $pref . self::AJAX_CREATE_BLOCK_SCREENSHOT, array( $this, 'saveBlockScreenShot' ) );
		add_action( $pref . self::AJAX_UPDATE_BLOCK_SCREENSHOT, array( $this, 'saveBlockScreenShot' ) );
		add_action( $pref_nopriv . self::AJAX_CREATE_BLOCK_SCREENSHOT, array( $this, 'saveBlockScreenShot' ) );
		add_action( $pref_nopriv . self::AJAX_UPDATE_BLOCK_SCREENSHOT, array( $this, 'saveBlockScreenShot' ) );
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
		$result  = $manager->saveScreenshot( $screenId, $_REQUEST['block_type'], $imageContent, $brizyPost );

		if ( $result ) {
			$screenPath = $manager->getScreenshot( $screenId,  $brizyPost );
			wp_send_json_success( array( 'id' => $screenId, 'file_name' => $screenPath ) );
		}
	}

}
