<?php
/**
 * Created by PhpStorm.
 * User: alex
 * Date: 4/18/18
 * Time: 10:46 AM
 */

class Brizy_Editor_Asset_MediaProxyStorage extends Brizy_Editor_Asset_AbstractStorage {

	/**
	 * @var Brizy_Editor_Project
	 */
	private $project;


	/**
	 * @var Brizy_Editor_Post
	 */
	private $post;

	/**
	 * @var array
	 */
	private $config;

	/**
	 * @var Brizy_Editor_UrlBuilder
	 */
	private $url_builder;

	/**
	 * Brizy_Editor_Asset_Storage constructor.
	 *
	 * @param Brizy_Editor_Project $project
	 * @param Brizy_Editor_Post $post
	 */

	public function __construct( $project, $post, $config ) {
		$this->project     = $project;
		$this->post        = $post;
		$this->config      = $config;
		$this->url_builder = new Brizy_Editor_UrlBuilder( $project, $post );
	}

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
		$tmp_asset_url = $this->url_builder->page_asset_path( $sufix_url );
		$new_url       = $this->url_builder->upload_url( $tmp_asset_url );
		$new_path      = $this->url_builder->upload_path( $tmp_asset_url );
		$external_url  = $this->url_builder->external_media_url( $sufix_url );


		if ( $this->store_file( $external_url, $new_path ) ) {
			$asset_url = $new_url;
		}


		return $asset_url;
	}

	public function getAssetPart( $url, $prefix ) {
		return str_replace( $prefix, '', $url );
	}

}