<?php

class Brizy_Editor_Asset_AssetProxyStorage extends Brizy_Editor_Asset_AbstractStorage {


	/**
	 * Get the asset and store it somewhere in uploads and return the new local url.
	 *
	 * @param $asset_url
	 *
	 * @return mixed
	 */
	public function store( $asset_url ) {

		//$asset_url     = html_entity_decode( $asset_url );
		$new_url = $this->url_builder->page_upload_url( "assets/icons/" . basename( $asset_url ) );
		$new_path = $this->url_builder->page_upload_path( "assets/icons/" . basename( $asset_url ) );
		$external_url  = $this->url_builder->external_asset_url( $asset_url );


		if ( $this->store_file( $external_url, $new_path ) ) {
			$asset_url = $new_url;
		}

		return $asset_url;
	}

}