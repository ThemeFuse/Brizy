<?php


class Brizy_Editor_Asset_MediaAssetProcessor implements Brizy_Editor_Content_ProcessorInterface {

	/**
	 * @var Brizy_Editor_Asset_Storage
	 */
	private $storage;

	static private $attachment_file_cache;

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

		$project = $context->getProject();

		$site_url = str_replace( array( 'http://', 'https://' ), '', home_url() );
		$site_url = str_replace( array( '/', '.' ), array( '\/', '\.' ), $site_url );

		$endpoint        = Brizy_Editor::prefix( Brizy_Public_CropProxy::ENDPOINT );
		$endpoint_post   = Brizy_Editor::prefix( Brizy_Public_CropProxy::ENDPOINT_POST );
		$endpoint_filter = Brizy_Editor::prefix( Brizy_Public_CropProxy::ENDPOINT_FILTER );

		$str = "/(http|https):\/\/{$site_url}\/?(\?{$endpoint}=(.[^\"',\s)]*))/im";
		preg_match_all( $str, $content, $matches );

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

			$urlBuilder = new Brizy_Editor_UrlBuilder( $project, $post_id );
			$media_path = $this->get_attachment_file_by_uid( $params[ $endpoint ] );
			$fs         = Brizy_Admin_FileSystem::instance();
			$lfs        = Brizy_Admin_FileSystem::localInstance();

			try {
				$resized_page_asset_path   = $urlBuilder->page_upload_relative_path( "/assets/images/" . $params[ $endpoint_filter ] );
				$resized_image_path        = $resized_page_asset_path . '/' . basename( $media_path );
				$optimized_image_full_path = $resized_page_asset_path . '/' . 'optimized' . '/' . basename( $resized_image_path );

				// if there is an optimized image then return it
				if ( $fs->has( $optimized_image_full_path ) ) {
					$local_media_url = $fs->getUrl( $optimized_image_full_path );
					$content         = str_replace( $matches[0][ $i ], $local_media_url, $content );
					continue;
				} elseif ( $lfs->has( $optimized_image_full_path , true) ) { // try to write if localy the file is found
					$fs->loadFileInKey( $optimized_image_full_path, $urlBuilder->upload_path( $optimized_image_full_path ) );
					$url     = $fs->getUrl( $optimized_image_full_path );
					$content = str_replace( $matches[0][ $i ], $url, $content );
					continue;
				}

				if ( $fs->has( $resized_image_path ) ) {
					$local_media_url = $fs->getUrl( $resized_image_path );
					$content         = str_replace( $matches[0][ $i ], $local_media_url, $content );
					continue;
				} elseif ( $lfs->has( $resized_image_path, true ) ) { // try to write if localy the file is found
					$fs->loadFileInKey( $resized_image_path, $urlBuilder->upload_path( $resized_image_path ) );
					$url     = $fs->getUrl( $resized_image_path );
					$content = str_replace( $matches[0][ $i ], $url, $content );
					continue;
				}

			} catch ( Exception $e ) {
				continue;
			}
		}

		return $content;
	}

	private function get_attachment_file_by_uid( $attachment ) {

		if ( isset( self::$attachment_file_cache[ $attachment ] ) ) {
			return self::$attachment_file_cache[ $attachment ];
		}

		if ( ! is_numeric( $attachment ) ) {
			global $wpdb;

			$pt           = $wpdb->posts;
			$mt           = $wpdb->postmeta;
			$attachmentId = $wpdb->get_var( $wpdb->prepare(
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
		} else {
			$attachmentId = $attachment;
		}

		return self::$attachment_file_cache[ $attachment ] = get_attached_file( $attachmentId );
	}
}
