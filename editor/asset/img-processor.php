<?php


class Brizy_Editor_Asset_ImgProcessor implements Brizy_Editor_Content_ProcessorInterface {

	/**
	 * @var string
	 */
	private $uidKey;

	/**
	 * @var string
	 */
	private $sizeKey;

	public function __construct() {
		$this->uidKey  = Brizy_Editor::prefix( Brizy_Public_CropProxy::ENDPOINT );
		$this->sizeKey = Brizy_Editor::prefix( Brizy_Public_CropProxy::ENDPOINT_FILTER );
	}

	/**
	 * Find and cache all assets and replace the urls with new local ones.
	 *
	 * @param string $content
	 * @param Brizy_Content_Context $context
	 *
	 * @return string
	 */
	public function process( $content, Brizy_Content_Context $context ) {
		$site_url = str_replace( array( 'http://', 'https://' ), '', home_url() );
		$site_url = str_replace( array( '/', '.' ), array( '\/', '\.' ), $site_url );

		preg_match_all( '/(http|https):\/\/' . $site_url . '\/?(\?' . $this->uidKey . '=(.[^"\',\s)]*))/im', $content, $matches );

		if ( empty( $matches[0] ) ) {
			return $content;
		}

		$imgs = [];

		foreach ( $matches[0] as $url ) {

			$parsedUrl = parse_url( html_entity_decode( $url ) );

			if ( empty( $parsedUrl['query'] ) ) {
				continue;
			}

			parse_str( $parsedUrl['query'], $vars );

			if ( empty( $vars[ $this->uidKey ] ) ) {
				continue;
			}

			if ( empty( $vars[ $this->sizeKey ] ) ) {
				$args[ $this->sizeKey ] = 'full';
			}

			$imgs[] = [
				'url'  => $url,
				'uid'  => $vars[ $this->uidKey ],
				'size' => $vars[ $this->sizeKey ],
			];
		}

		$mediaCache = new Brizy_Editor_CropCacheMedia( $context->getProject() );

		$mediaCache->cacheImgs( wp_list_pluck( $imgs, 'uid' ) );

		foreach ( $imgs as $img ) {
			try {
				$croppedUrl = $mediaCache->getImgUrl( $img['uid'], $img['size'] );
				$content    = str_replace( $img['url'], $croppedUrl, $content );
			} catch ( Exception $e ) {
				continue;
			}
		}

		return $content;
	}
}