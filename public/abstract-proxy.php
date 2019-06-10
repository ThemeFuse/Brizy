<?php

abstract class Brizy_Public_AbstractProxy extends Brizy_Editor_Asset_StaticFile {

	/**
	 * @var Brizy_Editor_UrlBuilder
	 */
	protected $urlBuilder;


	/**
	 * @var array
	 */
	protected $config;


	/**
	 * Brizy_Public_AssetProxy constructor.
	 *
	 * @param Brizy_Editor_UrlBuilder $url_builder
	 * @param $config
	 */
	public function __construct( $url_builder, $config ) {
		$this->urlBuilder = $url_builder;
		$this->config     = $config;

		add_action( 'wp', array( $this, 'process_query' ), - 1 );
		add_filter( 'query_vars', array( $this, 'query_vars' ) );
	}

	/**
	 * @param $vars
	 *
	 * @return array
	 */
	public function query_vars( $vars ) {
		$endpoint_keys = $this->get_endpoint_keys();

		if ( ! is_array( $endpoint_keys ) ) {
			$endpoint_keys = array();
		}

		$vars = array_merge( $vars, $endpoint_keys );

		return $vars;
	}

	/**
	 * @return mixed
	 */
	abstract public function process_query();

	/**
	 * @return string
	 */
	abstract protected function get_endpoint_keys();


}