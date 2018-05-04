<?php
/**
 * Created by PhpStorm.
 * User: alex
 * Date: 4/18/18
 * Time: 10:46 AM
 */

abstract class Brizy_Editor_Asset_AbstractStorage  extends  Brizy_Editor_Asset_StaticFile {

	/**
	 * @var Brizy_Editor_Project
	 */
	protected $project;


	/**
	 * @var Brizy_Editor_Post
	 */
	protected $post;

	/**
	 * @var array
	 */
	protected $config;

	/**
	 * @var Brizy_Editor_UrlBuilder
	 */
	protected $url_builder;

	/**
	 * Brizy_Editor_Asset_AbstractStorage constructor.
	 *
	 * @param $project
	 * @param $post
	 * @param $config
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
	abstract public function store( $asset_url );

}