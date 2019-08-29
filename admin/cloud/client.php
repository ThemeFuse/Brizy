<?php


class Brizy_Admin_Cloud_Client extends WP_Http {

	use Brizy_Editor_Asset_AttachmentAware;

	/**
	 * @var Brizy_Editor_Project
	 */
	private $brizyProject;

	/**
	 * @var WP_Http
	 */
	private $http;


	/**
	 * @var Brizy_Admin_Cloud_Client
	 */
	private static $instance;


	/**
	 * @return Brizy_Editor_Project
	 */
	public function getBrizyProject() {
		return $this->brizyProject;
	}

	/**
	 * @param Brizy_Editor_Project $brizyProject
	 *
	 * @return Brizy_Admin_Cloud_Client
	 */
	public function setBrizyProject( $brizyProject ) {
		$this->brizyProject = $brizyProject;

		return $this;
	}

	/**
	 * @return WP_Http
	 */
	public function getHttp() {
		return $this->http;
	}

	/**
	 * @param WP_Http $http
	 *
	 * @return Brizy_Admin_Cloud_Client
	 */
	public function setHttp( $http ) {
		$this->http = $http;

		return $this;
	}

	/**
	 * Brizy_Admin_Cloud_Client constructor.
	 *
	 * @param Brizy_Editor_Project $project
	 * @param WP_Http $http
	 */
	public function __construct( Brizy_Editor_Project $project, WP_Http $http ) {
		$this->brizyProject = $project;
		$this->http         = $http;
	}


	private function getHeaders( $aditional = null ) {
		return array_merge( array(
			'X-AUTH-APP-TOKEN'  => Brizy_Config::CLOUD_APP_KEY,
			'X-AUTH-USER-TOKEN' => $this->brizyProject->getMetaValue( 'brizy-cloud-token' )
		), is_array( $aditional ) ? $aditional : array() );
	}

	public function getLibraries() {
		$response = $this->http->get( Brizy_Config::CLOUD_ENDPOINT . Brizy_Config::CLOUD_LIBRARY, array( 'headers' => $this->getHeaders() ) );

		$code = wp_remote_retrieve_response_code( $response );

		if ( $code == 200 ) {

			$body = wp_remote_retrieve_body( $response );

			$libraries = json_decode( $body );

			if ( count( $libraries ) == 0 ) {
				throw new Exception( 'No libraries provided' );
			}


			return $libraries;
		}

		return null;
	}

	/**
	 * @param $email
	 * @param $password
	 *
	 * @return array|bool|WP_Error
	 */
	public function signIn( $email, $password ) {

		$response = $this->http->post( Brizy_Config::CLOUD_ENDPOINT . Brizy_Config::CLOUD_SIGNIN, array(
			'headers' => $this->getHeaders( array(
				'Content-type' => 'application/x-www-form-urlencoded'
			) ),
			'body'    => array(
				'email'    => $email,
				'password' => $password
			)
		) );

		$code = wp_remote_retrieve_response_code( $response );

		if ( $code == 200 ) {

			$jsonResponse = json_decode( $response['body'] );

			return $jsonResponse->token;
		}

		return false;
	}


	/**
	 * @param string $firstName
	 * @param string $lastName
	 * @param string $email
	 * @param string $password
	 * @param string $confirmPassword
	 *
	 * @return bool
	 */
	public function signUp( $firstName, $lastName, $email, $password, $confirmPassword ) {

		$response = $this->http->post( Brizy_Config::CLOUD_ENDPOINT . Brizy_Config::CLOUD_SIGNUP, array(
			'headers' => $this->getHeaders( array(
				'Content-type' => 'application/x-www-form-urlencoded'
			) ),
			'body'    => array(
				'first_name'       => $firstName,
				'last_name'        => $lastName,
				'email'            => $email,
				'new_password'     => $password,
				'confirm_password' => $confirmPassword,
			)
		) );

		$code = wp_remote_retrieve_response_code( $response );

		if ( $code == 200 ) {

			$jsonResponse = json_decode( $response['body'] );

			return $jsonResponse->token;
		}

		return false;
	}

	/**
	 * @param $email
	 *
	 * @return bool
	 */
	public function resetPassword( $email ) {

		$response = $this->http->post( Brizy_Config::CLOUD_ENDPOINT . Brizy_Config::CLOUD_RESET_PASSWORD, array(
			'headers' => $this->getHeaders( array(
				'Content-type' => 'application/x-www-form-urlencoded'
			) ),
			'body'    => array(
				'email' => $email,
			)
		) );

		$code = wp_remote_retrieve_response_code( $response );

		if ( $code == 204 ) {

			$jsonResponse = json_decode( $response['body'] );

			return $jsonResponse->token;
		}

		return false;
	}

	public function getContainers() {
		$response = $this->http->get( Brizy_Config::CLOUD_ENDPOINT . Brizy_Config::CLOUD_CONTAINERS, array( 'headers' => $this->getHeaders() ) );

		return json_decode( $response['body'] );
	}

	public function getProjects( $filters ) {

		$url      = Brizy_Config::CLOUD_ENDPOINT . Brizy_Config::CLOUD_PROJECTS;
		$url      = $url . '?' . http_build_query( $filters );
		$response = $this->http->get( $url, array( 'headers' => $this->getHeaders() ) );

		$code = wp_remote_retrieve_response_code( $response );
		if ( $code == 200 ) {
			return json_decode( $response['body'] );
		}

		return null;

	}

	public function getProject( $id ) {

		$url      = sprintf( Brizy_Config::CLOUD_ENDPOINT . Brizy_Config::CLOUD_PROJECTS . "/%d", (int) $id );
		$response = $this->http->get( $url, array( 'headers' => $this->getHeaders() ) );

		$code = wp_remote_retrieve_response_code( $response );
		if ( $code == 200 ) {
			return json_decode( $response['body'] );
		}

		return null;
	}

	public function createProject( $container, $name ) {

		$response = $this->http->post( Brizy_Config::CLOUD_ENDPOINT . Brizy_Config::CLOUD_PROJECTS, array(
			'headers' => $this->getHeaders(),
			'body'    => array(
				'name'      => $name,
				'container' => $container,
				'globals'   => null,
				'site_id'   => null
			)
		) );

		$code = wp_remote_retrieve_response_code( $response );
		if ( $code == 200 ) {
			return json_decode( $response['body'] );
		}

		return false;
	}


	/**
	 * @param Brizy_Editor_Block $block
	 *
	 * @return bool
	 * @throws Exception
	 */
	public function createOrUpdateBlock( Brizy_Editor_Block $block ) {

		$libraries = $this->getLibraries();

		if ( ! isset( $libraries[0] ) ) {
			throw new Exception( 'No libraries returned' );
		}

		$cloudBlockData = array(
			'library'     => $libraries[0]->id,
			'meta'        => array(),
			'data'        => $block->get_editor_data(),
			'is_autosave' => 0,
			'uid'         => $block->get_uid()
		);

		$url = Brizy_Config::CLOUD_ENDPOINT . Brizy_Config::CLOUD_SAVEDBLOCKS;

		if ( $block->getCloudId() ) {
			$response = $this->http->request( $url, array(
				'method'  => 'PUT',
				'body'    => $cloudBlockData,
				'headers' => $this->getHeaders()
			) );
		} else {
			$response = $this->http->post( $url, array( 'body' => $cloudBlockData, 'headers' => $this->getHeaders() ) );
		}

		$code = wp_remote_retrieve_response_code( $response );

		if ( $code >= 400 ) {
			throw new Exception( 'Invalid code return by cloud api' );
		}

		return $code == 200;
	}

	/**
	 * @param $blockId
	 *
	 * @return bool
	 * @throws Exception
	 */
	public function deleteBlock( $blockId ) {
		$url      = Brizy_Config::CLOUD_ENDPOINT . Brizy_Config::CLOUD_SAVEDBLOCKS . "/" . $blockId;
		$response = $this->http->request( $url, array( 'method' => 'DELETE', 'headers' => $this->getHeaders() ) );
		$code     = wp_remote_retrieve_response_code( $response );

		if ( $code >= 400 ) {
			throw new Exception( 'Invalid code return by cloud api' );
		}

		return $code == 200;
	}

	/**
	 * @param $uid
	 *
	 * @return bool
	 * @throws Exception
	 */
	public function isMediaUploaded( $uid ) {
		$response = $this->http->get( Brizy_Config::CLOUD_ENDPOINT . Brizy_Config::CLOUD_MEDIA . '?name=' . $uid, array( 'headers' => $this->getHeaders() ) );

		$code = wp_remote_retrieve_response_code( $response );

		if ( $code >= 400 ) {
			throw new Exception( 'Invalid code return by cloud api' );
		}

		$body = wp_remote_retrieve_body( $response );

		$json = json_decode( $body );

		return is_array( $json ) && count( $json ) == 1;
	}

	/**
	 * @param $file
	 *
	 * @return bool
	 * @throws Exception
	 */
	public function uploadMedia( $uid, $file ) {

		$response = $this->http->post( Brizy_Config::CLOUD_ENDPOINT . Brizy_Config::CLOUD_MEDIA, array(
			'body'    => array(
				'attachment' => base64_encode( file_get_contents( $file ) ),
				'name'       => $uid,
				'filename'   => basename( $file )
			),
			'headers' => $this->getHeaders()
		) );

		$code = wp_remote_retrieve_response_code( $response );

		if ( $code >= 400 ) {
			throw new Exception( 'Invalid code return by cloud api' );
		}

		return $code == 200;
	}


	/**
	 * @param $font
	 *
	 * Ex:
	 *  [
	 * 'id'      => 'askdalskdlaksd',
	 * 'family'  => 'proxima-nova',
	 * 'type'    => 'uploaded',
	 * 'weights' => [
	 * '400' => [
	 * 'ttf'   => codecept_data_dir( 'fonts/pn-regular-webfont.ttf' ),
	 * 'eot'   => codecept_data_dir( 'fonts/pn-regular-webfont.eot' ),
	 * 'woff'  => codecept_data_dir( 'fonts/pn-regular-webfont.woff' ),
	 * 'woff2' => codecept_data_dir( 'fonts/pn-regular-webfont.woff2' ),
	 * ],
	 * '500' => [
	 * 'eot'   => codecept_data_dir( 'fonts/pn-medium-webfont.eot' ),
	 * 'woff'  => codecept_data_dir( 'fonts/pn-medium-webfont.woff' ),
	 * 'woff2' => codecept_data_dir( 'fonts/pn-medium-webfont.woff2' ),
	 * ],
	 * '700' => [
	 * 'eot'   => codecept_data_dir( 'fonts/pn-bold-webfont.eot' ),
	 * 'woff'  => codecept_data_dir( 'fonts/pn-bold-webfont.woff' ),
	 * 'woff2' => codecept_data_dir( 'fonts/pn-bold-webfont.woff2' ),
	 * ],
	 * ]
	 * ];
	 *
	 * @return bool
	 * @throws Exception
	 */
	public function createFont( $font ) {

		$response = $this->http->post( Brizy_Config::CLOUD_ENDPOINT . Brizy_Config::CLOUD_FONTS, array(
			'body'    => array(
				'uid'    => $font['id'],
				'family' => $font['family'],
				'files'  => $font['weights']
			),
			'headers' => $this->getHeaders()
		) );

		$code = wp_remote_retrieve_response_code( $response );

		if ( $code >= 400 ) {
			throw new Exception( 'Invalid code return by cloud api' );
		}

		return $code == 200;
	}

}