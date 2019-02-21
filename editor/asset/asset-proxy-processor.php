<?php


class Brizy_Editor_Asset_AssetProxyProcessor implements Brizy_Editor_Content_ProcessorInterface {

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
	 * @param string $content
	 * @param Brizy_Content_Context $context
	 *
	 * @return mixed|string
	 */
	public function process( $content, Brizy_Content_Context $context ) {

		preg_match_all( '/"(.[^"]*(?:\?|&|&amp;)brizy=(.[^"]*))"/im', $content, $matches );

		if ( ! isset( $matches[2] ) ) {
			return $content;
		}

		foreach ( $matches[2] as $i => $url ) {
			$url = urldecode($url);
			$hash_matches = array();
			preg_match( "/^.[^#]*(#.*)$/", $url, $hash_matches );

			$url = preg_replace( "/^(.[^#]*)#.*$/", '$1', $url );

			if ( $url ) {
				// store and replace $url
				$new_url = $this->storage->store( $url );

				if ( $new_url == $url ) {
					continue;
				}

				if ( isset( $hash_matches[1] ) && $hash_matches[1] != '' ) {
					$new_url .= $hash_matches[1];
				}

				$content = str_replace( $matches[1][ $i ], $new_url, $content );
			}
		}

		return $content;
	}


}