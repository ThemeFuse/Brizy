<?php

class Brizy_Admin_Cloud {

	/**
	 * @var Brizy_Editor_Project
	 */
	private $project;

	/**
	 * @var Brizy_Admin_Cloud_Client
	 */
	private $cloudClient;


	/**
	 * @return Brizy_Admin_Cloud
	 * @throws Exception
	 */
	public static function _init() {

		static $instance;

		return $instance ? $instance : $instance = new self( Brizy_Editor_Project::get() );
	}

	/**
	 * Brizy_Admin_Cloud constructor.
	 *
	 * @param Brizy_Editor_Project $project
	 *
	 * @throws Exception
	 */
	private function __construct( Brizy_Editor_Project $project ) {

		$this->project     = $project;
		$this->cloudClient = Brizy_Admin_Cloud_Client::instance( $project, new WP_Http() );

		add_action( 'wp_loaded', array( $this, 'initializeActions' ) );
	}

	public function initializeActions() {
		Brizy_Admin_Cloud_Api::_init( $this->project );
	}
}
