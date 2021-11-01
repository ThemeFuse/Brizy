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

		$uidKey    = Brizy_Editor::prefix( Brizy_Public_CropProxy::ENDPOINT );
		$postIdKey = Brizy_Editor::prefix( Brizy_Public_CropProxy::ENDPOINT_POST );
		$sizeKey   = Brizy_Editor::prefix( Brizy_Public_CropProxy::ENDPOINT_FILTER );

		preg_match_all( '/(http|https):\/\/' . $site_url . '\/?(\?' . $uidKey . '=(.[^"\',\s)]*))/im', $content, $matches );

		if ( empty( $matches[0] ) ) {
			return $content;
		}

		$uids = [];

		foreach ( $matches[0] as $url ) {
			try {
				$args = $this->getQueryArgs( $url );
				$uid  = $args[ $uidKey ];

				if ( ! is_numeric( $uid ) && ! in_array( $uid, $uids ) ) {
					$uids[] = $uid;
				}
			} catch ( Exception $e ) {
				continue;
			}
		}

		$mediaCache = new Brizy_Editor_CropCacheMedia( $project );

		$mediaCache->cacheImgs( $uids );

		foreach ( $matches[0] as $url ) {

			try {
				$args   = $this->getQueryArgs( $url );
				$postId = null;

				if ( ! empty( $args[ $postIdKey ] ) && $postId = $args[ $postIdKey ] ) {
					$postId = wp_is_post_revision( $postId ) ? wp_get_post_parent_id( $postId ) : $postId;
				}

				$croppedUrl = $mediaCache->tryOptimizedPath( $args[ $uidKey ], $args[ $sizeKey ], $postId );
				$content    = str_replace( $url, $croppedUrl, $content );
			} catch ( Exception $e ) {
				continue;
			}
		}

		return $content;
	}

	/**
	 * @throws Exception
	 */
	private function getQueryArgs( $url ) {
		$endpoint  = Brizy_Editor::prefix( Brizy_Public_CropProxy::ENDPOINT );
		$parsedUrl = parse_url( html_entity_decode( $url ) );

		if ( empty( $parsedUrl['query'] ) ) {
			throw new Exception( 'The query does not exists.' );
		}

		parse_str( $parsedUrl['query'], $args );

		if ( empty( $args[ $endpoint ] ) ) {
			throw new Exception( 'Invalid query.' );
		}

		return $args;
	}
}