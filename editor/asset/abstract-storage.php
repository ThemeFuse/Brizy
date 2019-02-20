<?php


abstract class Brizy_Editor_Asset_AbstractStorage extends Brizy_Editor_Asset_StaticFile {

	/**
	 * @var Brizy_Editor_UrlBuilder
	 */
	protected $url_builder;

	/**
	 * Brizy_Editor_Asset_AbstractStorage constructor.
	 *
	 * @param $url_builder
	 */
	public function __construct( $url_builder ) {
		$this->url_builder = $url_builder;
	}

	/**
	 * Get the asset and store it somewhere in uploads and return the new local url.
	 *
	 * @param $asset_url
	 *
	 * @return mixed
	 */
	abstract public function store( $asset_url );

}