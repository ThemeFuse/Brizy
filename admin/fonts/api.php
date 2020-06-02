<?php
/**
 * Created by PhpStorm.
 * User: alex
 * Date: 7/18/18
 * Time: 10:48 AM
 */


class Brizy_Admin_Fonts_Api extends Brizy_Admin_AbstractApi {

	const nonce = 'brizy-api';

	const AJAX_CREATE_FONT_ACTION = '-create-font';
	const AJAX_DELETE_FONT_ACTION = '-delete-font';
	const AJAX_GET_FONTS_ACTION = '-get-fonts';

	/**
	 * @var Brizy_Admin_Fonts_Manager
	 */
	private $fontManager;

	/**
	 * @return Brizy_Admin_Fonts_Api
	 */
	public static function _init() {
		static $instance;

		if ( ! $instance ) {
			$instance = new self();
		}

		return $instance;
	}

	/**
	 * Brizy_Admin_Fonts_Api constructor.
	 */
	public function __construct() {

		$this->fontManager = new Brizy_Admin_Fonts_Manager();
		parent::__construct();
	}

	/**
	 * @return null
	 */
	protected function getRequestNonce() {
        return $this->param( 'hash' );
	}

	protected function initializeApiActions() {
		$pref = 'wp_ajax_' . Brizy_Editor::prefix();
		add_action( $pref . self::AJAX_CREATE_FONT_ACTION, array( $this, 'actionCreateFont' ) );
		add_action( $pref . self::AJAX_DELETE_FONT_ACTION, array( $this, 'actionDeleteFont' ) );
		add_action( $pref . self::AJAX_GET_FONTS_ACTION, array( $this, 'actionGetFonts' ) );
	}

	public function actionGetFonts() {

		$this->verifyNonce( self::nonce );

		$manager = new Brizy_Admin_Fonts_Manager();

		$this->success( $manager->getAllFonts() );
	}

	public function actionCreateFont() {
		try {

			$this->verifyNonce( self::nonce );

			if ( ! ( $fontUidId = $this->param( 'id' ) ) ) {
				$this->error( 400, 'Invalid font uid' );
			}

			if ( ! ( $family = $this->param( 'family' ) ) ) {
				$this->error( 400, 'Invalid font family' );
			}

			if ( ! ( $fontType = $this->param( 'type' ) ) ) {
				$fontType = 'uploaded';
			}

			if ( ! isset( $_FILES['fonts'] ) ) {
				$this->error( 400, 'Invalid font files' );
			}

			$existingFont = $this->fontManager->getFontByFamily( $fontUidId, $family, $fontType );

			if ( $existingFont ) {
				$this->error( 400, 'This font family already exists.' );
			}

			try {

				$files = array();
				// create font attachments
				foreach ( $_FILES['fonts']['name'] as $weight => $attachments ) {
					foreach ( $attachments as $type => $file ) {
						$files[ $weight ][ $type ] = array(
							'name'     => $_FILES['fonts']['name'][ $weight ][ $type ],
							'type'     => $_FILES['fonts']['type'][ $weight ][ $type ],
							'tmp_name' => $_FILES['fonts']['tmp_name'][ $weight ][ $type ],
							'error'    => $_FILES['fonts']['error'][ $weight ][ $type ],
							'size'     => $_FILES['fonts']['size'][ $weight ][ $type ]
						);
					}
				}

				$fontPostId = $this->fontManager->createFont( $fontUidId, $family, $files, $fontType );
			} catch ( Exception $e ) {
				Brizy_Logger::instance()->debug( 'Create font ERROR', [ $e ] );
				$this->error( 400, $e->getMessage() );
			}

			$fontUidId = get_post_meta( $fontPostId, 'brizy_post_uid', true );

			$font = $this->fontManager->getFont( $fontUidId );

			$this->success( $font );

		} catch ( Exception $exception ) {
			Brizy_Logger::instance()->critical( $exception->getMessage(), [ $exception ] );
			$this->error( 400, $exception->getMessage() );
		}
	}

	public function actionDeleteFont() {

		$this->verifyNonce( self::nonce );

		if ( ! ( $fontId = $this->param( 'id' ) ) ) {
			$this->error( 400, 'Invalid font id' );
		}

		$manager = new Brizy_Admin_Fonts_Manager();

		try {
			$manager->deleteFont( $fontId );
		} catch ( Exception $exception ) {
			Brizy_Logger::instance()->critical( $exception->getMessage(), [ $exception ] );
			$this->error( $exception->getCode(), $exception->getMessage() );
		}

		$this->success( [] );
	}
}