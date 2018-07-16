<?php
/**
 * Created by PhpStorm.
 * User: alex
 * Date: 4/19/18
 * Time: 3:48 PM
 */

abstract class Brizy_Public_AbstractProxy extends Brizy_Editor_Asset_StaticFile {

	/**
	 * @var Brizy_Editor_UrlBuilder
	 */
	protected $url_builder;


	/**
	 * @var array
	 */
	protected $config;


	/**
	 * Brizy_Public_AssetProxy constructor.
	 *
	 * @param $url_builder
	 * @param $config
	 */
	public function __construct( $url_builder, $config ) {
		$this->url_builder = $url_builder;
		$this->config      = $config;

		add_action( 'wp', array( $this, 'process_query' ), - 1 );
		add_filter( 'query_vars', array( $this, 'query_vars' ) );

	}

	/**
	 * @param $vars
	 *
	 * @return array
	 */
	public function query_vars( $vars ) {
		$vars[] = $this->get_endpoint_key();

		return $vars;
	}

	/**
	 * @return mixed
	 */
	abstract public function process_query();

	/**
	 * @return string
	 */
	abstract protected function get_endpoint_key();


}