<?php


class Brizy_Editor_Asset_MediaProcessor implements Brizy_Editor_Content_ProcessorInterface {

	/**
	 * Find and cache all assets and replace the urls with new local ones.
	 *
	 * @param string $content
	 * @param Brizy_Content_Context $context
	 *
	 * @return mixed|string
	 */
	public function process( $content, Brizy_Content_Context $context ) {

		$content = $this->process_external_asset_urls( $content, $context );

		return $content;
	}

	/**
	 * @param string $content
	 * @param Brizy_Content_Context $context
	 *
	 * @return mixed
	 */
	public function process_external_asset_urls( $content, Brizy_Content_Context $context ) {

		$site_url = str_replace( array( 'http://', 'https://' ), '', home_url() );
		$site_url = str_replace( array( '/', '.' ), array( '\/', '\.' ), $site_url );

		//preg_match_all( '/' . $site_url . '\/?(\?' . Brizy_Public_CropProxy::ENDPOINT . '=(.[^"\',\s)]*))/im', $content, $matches );
		$brizy_attachment = Brizy_Editor::prefix('_attachment');
		preg_match_all( '/(http|https):\/\/' . $site_url . '\/?(\?'.$brizy_attachment.'=(.[^"\',\s)]*))/im', $content, $matches );

		if ( ! isset( $matches[0] ) || count( $matches[0] ) == 0 ) {
			return $content;
		}

		foreach ( $matches[0] as $i => $url ) {

			$parsed_url = parse_url( html_entity_decode( $matches[0][ $i ] ) );

			if ( ! isset( $parsed_url['query'] ) ) {
				continue;
			}

			parse_str( $parsed_url['query'], $params );

			if ( ! isset( $params[$brizy_attachment] ) ) {
				continue;
			}

			$mediaUrl = $this->get_attachment_file_by_uid( $params[$brizy_attachment] );

			if ( ! $mediaUrl ) {
				continue;
			}

			$content = str_replace( $matches[0][ $i ], $mediaUrl, $content );
		}

		return $content;
	}

	private function get_attachment_file_by_uid( $attachmentUId ) {
		if ( ! is_numeric( $attachmentUId ) ) {
			global $wpdb;

			$posts_table = $wpdb->posts;
			$meta_table  = $wpdb->postmeta;
			$attachment  = $wpdb->get_var( $wpdb->prepare(
				"SELECT 
						{$posts_table}.ID
					FROM {$posts_table}
						INNER JOIN {$meta_table} ON ( {$posts_table}.ID = {$meta_table}.post_id )
					WHERE 
						{$meta_table}.meta_key = 'brizy_attachment_uid' 
						AND {$meta_table}.meta_value = %s 
						AND {$posts_table}.post_type = 'attachment'
					GROUP BY {$posts_table}.ID
					ORDER BY {$posts_table}.post_date DESC",
				$attachmentUId
			) );


			if ( ! $attachment ) {
				return;
			}
		}

		return wp_get_attachment_url( (int)$attachment );
	}
}