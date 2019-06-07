<?php
/**
 * Created by PhpStorm.
 * User: alex
 * Date: 7/18/18
 * Time: 10:48 AM
 */


class Brizy_Admin_Fonts_Api extends Brizy_Admin_AbstractApi {

	const nonce = 'brizy-api';

	const AJAX_CREATE_FONT_ACTION = 'brizy-create-font';

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


	protected function getRequestNonce() {
		return $this->param( 'hash' );
	}

	protected function initializeApiActions() {
		add_action( 'wp_ajax_' . self::AJAX_CREATE_FONT_ACTION, array( $this, 'actionCreateFont' ) );
	}

	/**
	 *
	 */
	public function actionCreateFont() {
		try {

			if ( ! ( $family = $this->param( 'family' ) ) ) {
				$this->error( 400, 'Invalid font family' );
			}

			if ( ! isset( $_FILES['fonts'] ) ) {
				$this->error( 400, 'Invalid font files' );
			}


			// create font post
			$fontId = wp_insert_post( [
				'post_title'  => $family,
				'post_name'   => $family,
				'post_type'   => Brizy_Admin_Fonts_Main::CP_FONT,
				'post_status' => 'publish',

			] );

			if ( ! $fontId ) {
				$this->error( 400, 'Unable to create font' );
			}

			$uid = md5( $fontId . time() );
			update_post_meta( $fontId, 'brizy_post_uid', $uid );

			// create font attachments
			foreach ( $_FILES['fonts']['name'] as $weight => $attachments ) {
				foreach ( $attachments as $type => $file ) {
					$file = array(
						'name'     => $_FILES['fonts']['name'][ $weight ][ $type ],
						'type'     => $_FILES['fonts']['type'][ $weight ][ $type ],
						'tmp_name' => $_FILES['fonts']['tmp_name'][ $weight ][ $type ],
						'error'    => $_FILES['fonts']['error'][ $weight ][ $type ],
						'size'     => $_FILES['fonts']['size'][ $weight ][ $type ]
					);

					$result = wp_handle_upload( $file );
					wp_insert_attachment( $attachment, $filename, $parent_post_id );

				}
			}


			$this->success( [ 'uid' => $uid, 'postId' => $fontId, 'family' => $family ] );

		} catch ( Exception $exception ) {
			$this->error( 400, $exception->getMessage() );
		}
	}
}