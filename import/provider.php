<?php defined( 'ABSPATH' ) or die();

class Brizy_Import_Provider {

    const DEMO_URL = 'https://websitebuilder-demo.net/wp-json/demos/v1/';

	private $mainSite;

	public function __construct() {

		if ( class_exists( 'BrizyPro_Admin_WhiteLabel' ) && BrizyPro_Admin_WhiteLabel::_init()->getEnabled() ) {
			$this->mainSite = __bt( 'starter-templates-url', self::DEMO_URL );
		} else {
			$this->mainSite = self::DEMO_URL;
		}
	}

	/**
	 * @throws Exception
	 * @return array
	 */
	public function getAllDemos() {
		$request = wp_remote_get( $this->mainSite . 'demos', [
			'headers' => [
				'content-type' => 'application/json'
			],
		] );

		if ( is_wp_error( $request ) ) {
			throw new Exception( $request->get_error_message() );
		}

		if ( 200 !== wp_remote_retrieve_response_code( $request ) ) {
			throw new Exception( ( empty( $request['response']['message'] ) ? 'Invalid response code returned by server demo provider' : $request['response']['message'] ) );
		}

		$demos = json_decode( wp_remote_retrieve_body( $request ), true );

		if ( json_last_error() ) {
			throw new Exception( 'Json Decode Error: ' . json_last_error() );
		}

		if ( empty( $demos ) ) {
			throw new Exception( 'No templates found' );
		}

		return $demos;
	}

	public function getExportUrl( $demo, $key ) {
		return add_query_arg( [ 'id' => $demo, 'key' => $key ], $this->mainSite . 'export' );
	}
}
