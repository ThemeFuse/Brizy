<?php
/**
 * Created by PhpStorm.
 * User: alex
 * Date: 4/18/18
 * Time: 10:46 AM
 */

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
	 * @param $content
	 *
	 * @return string
	 */
	public function process( $content ) {

		$content = $this->process_external_asset_urls( $content );

		return $content;
	}

	public function process_external_asset_urls( $content ) {

		$site_url = site_url();
		$site_url = str_replace( array( '/', '.' ), array( '\/', '\.' ), $site_url );

		$project = Brizy_Editor_Project::get();


		preg_match_all( '/' . $site_url . '\/?(\?' . Brizy_Public_CropProxy::ENDPOINT . '=(.[^"\',\s)]*))/im', $content, $matches );

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

			$brizy_post  = Brizy_Editor_Post::get( (int) $params[ Brizy_Public_CropProxy::ENDPOINT_POST ] );
			$media_cache = new Brizy_Editor_CropCacheMedia( $project, $brizy_post );

			$new_url = null;

			$media_path = $this->get_attachment_file_by_uid( $params[ Brizy_Public_CropProxy::ENDPOINT ] );

			if ( ! $media_path ) {

				// there may be cases when there is no attachment with uid due to old version of plugins
				// in this case we try to download the media and attach it to the current post
				try {
					// download media
					$media_cacher = new Brizy_Editor_CropCacheMedia( $project, $brizy_post );
					$media_cacher->download_original_image( $params[ Brizy_Public_CropProxy::ENDPOINT ] );
					$media_path = $this->get_attachment_file_by_uid( $params[ Brizy_Public_CropProxy::ENDPOINT ] );
				} catch ( Exception $e ) {
					continue;
				}

				if ( ! $media_path ) {
					continue;
				}
			}

			try {
				$crop_media_path = $media_cache->crop_media( $media_path, $params[ Brizy_Public_CropProxy::ENDPOINT_FILTER ] );
			} catch ( Exception $e ) {
				continue;
			}

			$urlBuilder      = new Brizy_Editor_UrlBuilder( $project, $brizy_post );
			$local_media_url = str_replace( $urlBuilder->upload_path(), $urlBuilder->upload_url(), $crop_media_path );

			$content = str_replace( $matches[0][ $i ], $local_media_url, $content );
		}

		return $content;
	}

	private function get_attachment_file_by_uid( $uid ) {
		$attachments = get_posts( array(
			'meta_key'   => 'brizy_attachment_uid',
			'meta_value' => $uid,
			'post_type'  => 'attachment',
		) );

		if ( count( $attachments ) == 0 ) {
			return;
		}

		return get_attached_file( $attachments[0]->ID );

	}

}