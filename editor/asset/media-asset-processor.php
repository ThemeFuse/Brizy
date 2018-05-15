<?php
/**
 * Created by PhpStorm.
 * User: alex
 * Date: 4/18/18
 * Time: 10:46 AM
 */

class Brizy_Editor_Asset_MediaAssetProcessor implements Brizy_Editor_Asset_ProcessorInterface {

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
	 * @param $content
	 *
	 * @return string
	 */
	public function process( $content ) {

		$content = $this->process_external_asset_urls( $content );

		return $content;
	}

	public function process_external_asset_urls( $content ) {
		$regex = Brizy_Config::MEDIA_IMAGE_URL_REGEX;
		preg_match_all( "/{$regex}/im", $content, $matches );

		foreach ( $matches[0] as $asset_url ) {
			$new_url = $this->storage->store( $asset_url );
			$content = str_replace( $asset_url, $new_url, $content );
		}

		return $content;
	}
}