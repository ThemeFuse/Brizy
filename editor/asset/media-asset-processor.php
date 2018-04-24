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

		//$content = $this->process_script_urls( $content );
		$content = $this->process_image_urls( $content );
		$content = $this->process_inline_css( $content );

		return $content;
	}

	/**
	 * @param string $content
	 *
	 * @return string
	 */
//	private function process_script_urls( $content ) {
//
//		preg_match_all( '/<script(.*?)<\/script>/im', $content, $matches );
//
//		foreach ( $matches[1] as $attributes ) {
//			preg_match_all( "/src=(?:\"(.[^\"]*)\")/", $attributes, $res );
//			$t = 0;
//
//			if ( isset( $res[1] ) && isset( $res[1][0] ) ) {
//				$url = $res[1][0];
//				// store and replace $url
//				$new_url = $this->storage->store( $url );
//				$content = str_replace( $url, $new_url, $content );
//			}
//		}
//
//		return $content;
//	}

	/**
	 * @param string $content
	 *
	 * @return string
	 */
	private function process_image_urls( $content ) {

		preg_match_all( '/<img(.*?)\/?>/im', $content, $matches );

		foreach ( $matches[1] as $attributes ) {
			preg_match_all( "/src=(?:\"(.[^\"]*)\")/", $attributes, $res );

			if ( isset( $res[1] ) && isset( $res[1][0] ) && strpos( $res[1][0], Brizy_Config::MEDIA_IMAGE_URL ) === 0 ) {
				$url = $res[1][0];

				// ignore inline images
				if ( preg_match( "/^data:/i", $url ) ) {
					continue;
				}

				// store and replace $url
				$new_url = $this->storage->store( $url );

				$content = str_replace( $url, $new_url, $content );
			}
		}

		return $content;
	}


	/**
	 * @param string $content
	 *
	 * @return string
	 */
	private function process_inline_css( $content ) {

		preg_match_all( '/<style(.[^<]*)<\/style>/im', $content, $matches );

		foreach ( $matches[1] as $attributes ) {
			preg_match_all( "/url\(\"?(.[^\"\)]*)\)/im", $attributes, $res );

			if ( isset( $res[1] ) && isset( $res[1][0] ) && strpos( $res[1][0], Brizy_Config::MEDIA_IMAGE_URL ) === 0 ) {
				$url = $res[1][0];

				// ignore inline images
				if ( preg_match( "/^data:/i", $url ) ) {
					continue;
				}

				// store and replace $url
				$new_url = $this->storage->store( $url );
				$content = str_replace( $url, $new_url, $content );
			}
		}

		return $content;
	}


}