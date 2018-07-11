<?php
/**
 * Created by PhpStorm.
 * User: alex
 * Date: 4/18/18
 * Time: 10:46 AM
 */

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
		$tmp_asset_url = $this->url_builder->page_asset_path( "icons/" . basename( $asset_url ) );
		$new_url       = $this->url_builder->upload_url( $tmp_asset_url );
		$new_path      = $this->url_builder->upload_path( $tmp_asset_url );
		$external_url  = $this->url_builder->external_asset_url( $asset_url );


		if ( $this->store_file( $external_url, $new_path ) ) {
			$asset_url = $new_url;
		}

		return $asset_url;
	}

}