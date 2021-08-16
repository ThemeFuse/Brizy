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
		return $this->process_external_asset_urls( $content, $context );
	}

	/**
	 * @param string $content
	 * @param Brizy_Content_Context $context
	 *
	 * @return string
	 */
	public function process_external_asset_urls( $content, Brizy_Content_Context $context ) {

		$site_url = str_replace( array( 'http://', 'https://' ), '', home_url() );
		$site_url = str_replace( array( '/', '.' ), array( '\/', '\.' ), $site_url );

		$project  = $context->getProject();

		$endpoint        = Brizy_Editor::prefix( Brizy_Public_CropProxy::ENDPOINT );
		$endpoint_post   = Brizy_Editor::prefix( Brizy_Public_CropProxy::ENDPOINT_POST );
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

			try {
				$mediaCache = new Brizy_Editor_CropCacheMedia( $project );
				$postId     = null;

				if ( ! empty( $params[ $endpoint_post ] ) && $postId = $params[ $endpoint_post ] ) {
					$postId = wp_is_post_revision( $postId ) ? wp_get_post_parent_id( $postId ) : $postId;
				}

				$croppedPath = $mediaCache->tryOptimizedPath( $mediaCache->getOriginalPath( $params[ $endpoint ] ), $params[ $endpoint_filter ], $postId );
				$urlBuilder  = new Brizy_Editor_UrlBuilder( $project );
				$croppedUrl  = str_replace( $urlBuilder->upload_path(), $urlBuilder->upload_url(), $croppedPath );
				$content     = str_replace( $matches[0][ $i ], $croppedUrl, $content );

			} catch (Exception $e) {
				continue;
			}
		}

		return $content;
	}
}