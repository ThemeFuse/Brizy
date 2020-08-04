<?php

/**
 * Class Brizy_Admin_Cloud_AbstractUploader
 */
abstract class Brizy_Admin_Cloud_AbstractBridge implements Brizy_Admin_Cloud_BridgeInterface {

	/**
	 * @var Brizy_Admin_Cloud_Client
	 */
	protected $client;

	/**
	 * Brizy_Admin_Cloud_AbstractUploader constructor.
	 *
	 * @param Brizy_Admin_Cloud_Client $client
	 */
	public function __construct( $client ) {
		$this->client = $client;
	}

	public function getCurrentCloudAccountId() {
		return $this->client->getBrizyProject()->getCloudAccountId();
	}
}
