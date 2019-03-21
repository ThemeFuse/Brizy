<?php


class Brizy_Editor_Asset_Storage extends Brizy_Editor_Asset_AbstractStorage {

	private $config;

	/**
	 * Brizy_Editor_Asset_Storage constructor.
	 *
	 * @param $url_builder
	 * @param $config
	 */
	public function __construct( $url_builder, $config ) {
		parent::__construct( $url_builder );
		$this->config = $config;
	}


	/**
	 * Get the asset and store it somewhere in uploads and return the new local url.
	 *
	 * @param $asset_url
	 *
	 * @return mixed
	 */
	public function store( $asset_url ) {

		$asset_url = html_entity_decode( $asset_url );

		if ( $this->isEditorUrl( $asset_url ) ) {
			$sufix_url = $this->getAssetPart( $asset_url, $this->config['urls']['assets'] );
			$new_path  = $this->url_builder->editor_asset_path( $sufix_url );
			$new_url   = $this->url_builder->upload_url( $new_path );

			if ( $this->store_file( $asset_url, $new_path ) ) {
				$asset_url = $new_url;
			}
		}

		if ( $this->isStaticUrl( $asset_url ) ) {
			$sufix_url = $this->getAssetPart( $asset_url, $this->config['urls']['static'] );
			$new_path  = $this->url_builder->page_upload_path( $sufix_url );
			$new_url   = $this->url_builder->page_upload_url( $sufix_url );

			if ( $this->store_file( $asset_url, $new_path ) ) {
				$asset_url = $new_url;
			}
		}

		if ( $this->isMediaUrl( $asset_url ) ) {
			$sufix_url = $this->getAssetPart( $asset_url, $this->config['urls']['image'] );
			$new_path  = $this->url_builder->media_asset_path( $sufix_url );
			$new_url   = $this->url_builder->media_asset_url( $sufix_url );

			if ( $this->store_file( $asset_url, $new_path ) ) {
				$asset_url = $new_url;
			}
		}

		return $asset_url;
	}

	/**
	 * @param $url
	 *
	 * @return bool
	 */
	public function isStaticUrl( $url ) {
		return strpos( $url, $this->config['urls']['static'] ) === 0;
	}

	public function getAssetPart( $url, $prefix ) {
		return str_replace( $prefix, '', $url );
	}

	/**
	 * @param $url
	 *
	 * @return bool
	 */
	public function isEditorUrl( $url ) {
		return strpos( $url, $this->config['urls']['assets'] ) === 0;
	}

	/**
	 * @param $url
	 *
	 * @return bool
	 */
	public function isMediaUrl( $url ) {
		return strpos( $url, $this->config['urls']['image'] ) === 0;
	}

}