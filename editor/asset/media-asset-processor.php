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

		preg_match_all( '/' . $site_url . '\/?(\?' . Brizy_Public_CropProxy::ENDPOINT . '=(.[^"\',\s)]*))/im', $content, $matches );
		preg_match_all( '/(http|https):\/\/' . $site_url . '\/?(\?' . Brizy_Public_CropProxy::ENDPOINT . '=(.[^"\',\s)]*))/im', $content, $matches );

		if ( ! isset( $matches[0] ) || count( $matches[0] ) == 0 ) {
			return $content;
		}

		foreach ( $matches[0] as $i => $url ) {

			$parsed_url = parse_url( html_entity_decode( $matches[0][ $i ] ) );

			if ( ! isset( $parsed_url['query'] ) ) {
				continue;
			}

			parse_str( $parsed_url['query'], $params );


			if ( ! isset( $params[ Brizy_Public_CropProxy::ENDPOINT ] ) ) {
				continue;
			}

			$post_id     = (int) $params[ Brizy_Public_CropProxy::ENDPOINT_POST ];
			$media_cache = new Brizy_Editor_CropCacheMedia( $project, $post_id );

			$new_url = null;

			$media_path = $this->get_attachment_file_by_uid( $params[ Brizy_Public_CropProxy::ENDPOINT ] );

			if ( ! $media_path ) {
				return $content;
			}

//			if ( ! $media_path ) {
//
//				// there may be cases when there is no attachment with uid due to old version of plugins
//				// in this case we try to download the media and attach it to the current post
//				try {
//					// download media
//					$media_cacher = new Brizy_Editor_CropCacheMedia( $project, $post_id );
//					$media_cacher->download_original_image( $params[ Brizy_Public_CropProxy::ENDPOINT ] );
//					$media_path = $this->get_attachment_file_by_uid( $params[ Brizy_Public_CropProxy::ENDPOINT ] );
//				} catch ( Exception $e ) {
//					continue;
//				}
//
//				if ( ! $media_path ) {
//					continue;
//				}
//			}

			try {

				//if($media_cache->hasCroptMedia($media_path, $params[ Brizy_Public_CropProxy::ENDPOINT_FILTER ])

				$crop_media_path = $media_cache->crop_media( $media_path, $params[ Brizy_Public_CropProxy::ENDPOINT_FILTER ], false );

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

			$posts_table = $wpdb->posts;
			$meta_table  = $wpdb->postmeta;
			$attachment  = $wpdb->get_var( $wpdb->prepare(
				"SELECT 
						{$posts_table}.ID
					FROM {$posts_table}
						INNER JOIN {$meta_table} ON ( {$posts_table}.ID = {$meta_table}.post_id )
					WHERE 
						( {$meta_table}.meta_key = 'brizy_attachment_uid' 
						AND {$meta_table}.meta_value = %s )
						AND {$posts_table}.post_type = 'attachment'
						AND {$posts_table}.post_status = 'inherit'
					GROUP BY {$posts_table}.ID
					ORDER BY {$posts_table}.post_date DESC",
				$attachment
			) );


			if ( ! $attachment ) {
				return;
			}
		}

		return get_attached_file( $attachment );
	}
}