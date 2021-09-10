<?php

class Brizy_Public_AttachmentProxy extends Brizy_Public_AbstractProxy {

	const ENDPOINT = '_attachment';

	/**
	 * @return string
	 */
	protected function get_endpoint_keys() {
		return array( Brizy_Editor::prefix( self::ENDPOINT ) );
	}

	/**
	 * @return mixed|void
	 * @throws Exception
	 */
	public function process_query() {
		global $wp_query;

		$vars = $wp_query->query_vars;
		$ENDPOINT = Brizy_Editor::prefix( self::ENDPOINT );
		if ( isset( $vars[ $ENDPOINT ] ) && is_string( $vars[ $ENDPOINT ] ) && ! empty( $vars[ $ENDPOINT ] ) ) {

			session_write_close();

			try {
				$attachment = $this->getAttachment( $vars[ $ENDPOINT ] );

				if ( ! $attachment ) {
					status_header( 404 );
					global $wp_query;
					$wp_query->set_404();

					return;
				}

				$url = wp_get_attachment_url( $attachment->ID );
				wp_redirect( $url );
				exit;
			} catch ( Exception $e ) {
				Brizy_Logger::instance()->exception( $e );
				status_header( 404 );
				global $wp_query;
				$wp_query->set_404();

				return;
			}
		}
	}

	private function getAttachment( $hash ) {
		$attachment = null;
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