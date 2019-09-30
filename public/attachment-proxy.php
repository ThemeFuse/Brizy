<?php

class Brizy_Public_AttachmentProxy extends Brizy_Public_AbstractProxy {

	const ENDPOINT = 'brizy_attachment';

	/**
	 * @return string
	 */
	protected function get_endpoint_keys() {
		return array( self::ENDPOINT );
	}

	/**
	 * @return mixed|void
	 * @throws Exception
	 */
	public function process_query() {
		global $wp_query;

		$vars = $wp_query->query_vars;

		if ( isset( $vars[ self::ENDPOINT ] ) && is_string( $vars[ self::ENDPOINT ] ) && ! empty( $vars[ self::ENDPOINT ] ) ) {

			session_write_close();

			try {
				// Set artificially high because GD uses uncompressed images in memory.
				$attachment = $this->getAttachment( $vars[ self::ENDPOINT ] );

				if ( ! $attachment ) {
					status_header( 404 );
					global $wp_query;
					$wp_query->set_404();

					return;
				}

				$url = wp_get_attachment_url( $attachment->ID );
				wp_redirect( $url );
				exit;
			}
			catch (Exception $e ) {
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
			$attachments = get_posts( array(
				'meta_key'   => 'brizy_post_uid',
				'meta_value' => $hash,
				'post_type'  => 'attachment',
			) );

			if ( isset( $attachments[0] ) ) {
				$attachment = $attachments[0];
			}
		}

		return $attachment;
	}
}