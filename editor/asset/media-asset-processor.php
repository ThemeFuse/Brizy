<?php


class Brizy_Editor_Asset_MediaAssetProcessor implements Brizy_Editor_Content_ProcessorInterface {

	/**
	 * @var Brizy_Editor_Asset_Storage
	 */
	private $storage;

	/**
	 * Brizy_Editor_Asset_HtmlAssetProcessor constructor.
	 *
	 * @param Brizy_Editor_Asset_AbstractStorage $storage
	 */
	public function __construct( $storage ) {
		$this->storage = $storage;
	}

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

		$project  = $context->getProject();

		$endpoint = Brizy_Editor::prefix( Brizy_Public_CropProxy::ENDPOINT );
		$endpoint_post = Brizy_Editor::prefix( Brizy_Public_CropProxy::ENDPOINT_POST );
		$endpoint_filter = Brizy_Editor::prefix( Brizy_Public_CropProxy::ENDPOINT_FILTER );

		preg_match_all( '/(http|https):\/\/' . $site_url . '\/?(\?' . $endpoint . '=(.[^"\',\s)]*))/im', $content, $matches );

		if ( ! isset( $matches[0] ) || count( $matches[0] ) == 0 ) {
			return $content;
		}

		foreach ( $matches[0] as $i => $url ) {

			$parsed_url = parse_url( html_entity_decode( $matches[0][ $i ] ) );

			if ( ! isset( $parsed_url['query'] ) ) {
				continue;
			}

			parse_str( $parsed_url['query'], $params );


			if ( ! isset( $params[ $endpoint ] ) ) {
				continue;
			}

			$post_id = wp_is_post_revision( (int) $params[ $endpoint_post ] ) ? wp_get_post_parent_id( (int) $params[ $endpoint_post ] ) : (int) $params[ $endpoint_post ];
			$media_cache           = new Brizy_Editor_CropCacheMedia( $project, $post_id );

			$new_url = null;

			$media_path = $this->get_attachment_file_by_uid( $params[ $endpoint ] );

			if ( ! $media_path ) {
				continue;
			}

			try {

				$crop_media_path = $media_cache->crop_media( $media_path, $params[ $endpoint_filter ], false );

				$urlBuilder      = new Brizy_Editor_UrlBuilder( $project, $post_id );
				$local_media_url = str_replace( $urlBuilder->upload_path(), $urlBuilder->upload_url(), $crop_media_path );

				$content = str_replace( $matches[0][ $i ], $local_media_url, $content );

			} catch ( Exception $e ) {
				continue;
			}


		}

		return $content;
	}

	private function get_attachment_file_by_uid( $attachment ) {


		if ( ! is_numeric( $attachment ) ) {
			global $wpdb;

			$pt = $wpdb->posts;
			$mt  = $wpdb->postmeta;
			$attachment  = $wpdb->get_var( $wpdb->prepare(
				"SELECT 
						{$pt}.ID
					FROM {$pt}
						INNER JOIN {$mt} ON ( {$pt}.ID = {$mt}.post_id )
					WHERE 
						( {$mt}.meta_key = 'brizy_attachment_uid' 
						AND {$mt}.meta_value = %s )
						AND {$pt}.post_type = 'attachment'
						AND {$pt}.post_status = 'inherit'
					GROUP BY {$pt}.ID
					ORDER BY {$pt}.post_date DESC",
				$attachment
			) );


			if ( ! $attachment ) {
				return;
			}
		}

		return get_attached_file( $attachment );
	}
}