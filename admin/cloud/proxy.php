<?php


class Brizy_Admin_Cloud_Proxy {

	const ACTION = 'brizy_cloud_proxy';

	/**
	 * Brizy_Admin_Cloud_Proxy constructor.
	 */
	public function __construct() {
		add_action( 'wp_ajax_' . self::ACTION, array( $this, 'handleRequest' ) );
	}

	/**
	 * @throws Exception
	 */
	public function handleRequest() {

		$vars = $_GET;

		$project = Brizy_Editor_Project::get();

		// redirect the request
		$token          = $project->getMetaValue( 'brizy-cloud-token' );
		$cloudProjectId = $project->getMetaValue( 'brizy-cloud-project' );

		if ( ! isset( $vars['endpoint'] ) ) {
			wp_send_json_error( null, 400 );
			exit;
		}

		if ( ! $token || ! $cloudProjectId || ! isset( $vars['endpoint'] ) ) {
			wp_send_json_error( null, 401 );
			exit;
		}

		$http     = new WP_Http();
		$url      = Brizy_Config::CLOUD_ENDPOINT . "/api/" . $vars['endpoint'];
		$response = $http->request( $url, array(
			'headers' => array(
				'X-AUTH-APP-TOKEN'  => Brizy_Config::CLOUD_APP_KEY,
				'X-AUTH-USER-TOKEN' => $token
			),
			'body'    => $_REQUEST['request'],
			'method'  => $_SERVER['REQUEST_METHOD'],
		) );

		$status = wp_remote_retrieve_response_code( $response );

		if ( $response instanceof WP_Error ) {
			wp_send_json_error( wp_remote_retrieve_response_message( $response ), $status );
			exit;
		}

		wp_send_json_success( wp_remote_retrieve_body( $response ), $status );
		exit;
	}
}