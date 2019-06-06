<?php
/**
 * Created by PhpStorm.
 * User: alex
 * Date: 7/18/18
 * Time: 10:48 AM
 */


class Brizy_Admin_Fonts_Api extends Brizy_Admin_AbstractApi {

	const nonce = 'brizy-api';

	const CREATE_FONT_ACTION = 'brizy-create-font';

	/**
	 * @return Brizy_Admin_Fonts_Api
	 */
	public static function _init() {
		static $instance;

		if ( ! $instance ) {
			$instance = new self( new Brizy_Admin_Rules_Manager() );
		}

		return $instance;
	}


	protected function getRequestNonce() {
		return $this->param( 'hash' );
	}

	protected function initializeApiActions() {
		add_action( 'wp_ajax_' . self::CREATE_FONT_ACTION, array( $this, 'actionCreateFont' ) );

	}

	/**
	 *
	 */
	public function actionCreateFont() {
		$this->verifyNonce( self::nonce );

		try {
			$font = null;
			$this->success( $font );

		} catch ( Exception $exception ) {
			$this->error( 400, $exception->getMessage() );
		}
	}
}