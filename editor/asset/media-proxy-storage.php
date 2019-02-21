<?php


class Brizy_Editor_Asset_MediaProxyStorage extends Brizy_Editor_Asset_AbstractStorage {

	/**
	 * Get the asset and store it somewhere in uploads and return the new local url.
	 *
	 * @param $asset_url
	 *
	 * @return mixed
	 */
	public function store( $asset_url ) {

		$asset_url     = html_entity_decode( $asset_url );
		$sufix_url     = $this->getAssetPart( $asset_url, $this->config['urls']['image'] );
		$new_url = $this->url_builder->page_upload_url( "assets/images/".$sufix_url );
		$new_path = $this->url_builder->page_upload_path( "assets/images/".$sufix_url );
		$external_url  = $this->url_builder->external_media_url( $sufix_url );

		if ( $this->store_file( $external_url, $new_path ) ) {
			$asset_url = $new_url;
		}

		return $asset_url;
	}

	/**
	 * @param $url
	 * @param $prefix
	 *
	 * @return mixed
	 */
	public function getAssetPart( $url, $prefix ) {
		return str_replace( $prefix, '', $url );
	}

}