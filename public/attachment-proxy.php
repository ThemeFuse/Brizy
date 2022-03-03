<?php

class Brizy_Public_AttachmentProxy extends Brizy_Public_AbstractProxy {

	const ENDPOINT = '_attachment';

	/**
	 * @return array
	 */
	protected function get_endpoint_keys() {
		return array( Brizy_Editor::prefix( self::ENDPOINT ) );
	}

	/**
	 * @return void
	 * @throws Exception
	 */
	public function process_query() {
		global $wp_query;

		$vars     = $wp_query->query_vars;
		$ENDPOINT = Brizy_Editor::prefix( self::ENDPOINT );

		if ( isset( $vars[ $ENDPOINT ] ) && is_string( $vars[ $ENDPOINT ] ) && ! empty( $vars[ $ENDPOINT ] ) ) {

			session_write_close();

			try {
				$uid        = $vars[ $ENDPOINT ];
				$attachment = $this->getAttachment( $uid );

				if ( ! $attachment ) {
					if ( substr( $uid, 0, 3 ) !== 'wp-' ) {
						$mediaCache = new Brizy_Editor_CropCacheMedia( Brizy_Editor_Project::get() );
						$attachment = get_post( $mediaCache->download_original_image( $uid ) );
					} else {
						throw new Exception( 'File can not be found by uid: ' . $uid );
					}
				}

				$url = wp_get_attachment_url( $attachment->ID );
				wp_redirect( $url );
				exit;
			} catch ( Exception $e ) {
				Brizy_Logger::instance()->exception( $e );
				status_header( $e->getMessage() );
				global $wp_query;
				$wp_query->set_404();

				return;
			}
		}
	}

	private function getAttachment( $hash ) {

		if ( is_numeric( $hash ) ) {
			$attachment = get_post( (int) $hash );
		} else {
			$attachment = $this->getAttachmentByPostId( $hash );

			if ( ! $attachment ) {
				$attachment = $this->getAttachmentByAttachmentUId( $hash );
			}
		}

		return $attachment;
	}


	/**
	 * @param $hash
	 *
	 * @return int|WP_Post|null
	 */
	private function getAttachmentByPostId( $hash ) {
		$attachments = get_posts( array(
			'meta_key'   => 'brizy_post_uid',
			'meta_value' => $hash,
			'post_type'  => 'attachment',
		) );

		if ( isset( $attachments[0] ) ) {
			return $attachments[0];
		}

		return null;
	}

	/**
	 * @param $hash
	 *
	 * @return int|WP_Post|null
	 */
	private function getAttachmentByAttachmentUId( $hash ) {
		$attachments = get_posts( array(
			'meta_key'   => 'brizy_attachment_uid',
			'meta_value' => $hash,
			'post_type'  => 'attachment',
		) );

		if ( isset( $attachments[0] ) ) {
			return $attachments[0];
		}

		return null;
	}
}