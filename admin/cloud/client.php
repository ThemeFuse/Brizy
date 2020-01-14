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
	 * @var integer
	 */
	private $library;

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
			//'X-AUTH-APP-TOKEN'  => Brizy_Config::CLOUD_APP_KEY,
			'X-AUTH-USER-TOKEN' => $this->brizyProject->getMetaValue( 'brizy-cloud-token' ),
			'X-EDITOR-VERSION'  => BRIZY_EDITOR_VERSION
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

		return $code >= 200 && $code < 300;
	}

	public function getContainers() {
		return $this->getCloudEntity( Brizy_Config::CLOUD_ENDPOINT . Brizy_Config::CLOUD_CONTAINERS, [] );
	}

	public function getProjects( $filters ) {
		return $this->getCloudEntity( Brizy_Config::CLOUD_ENDPOINT . Brizy_Config::CLOUD_PROJECTS, $filters );
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

	public function getBlocks( $filters = array() ) {
		return $this->getCloudEntityByContainer( Brizy_Config::CLOUD_ENDPOINT . Brizy_Config::CLOUD_SAVEDBLOCKS, $filters );
	}

	/**
	 * @param Brizy_Editor_Block $block
	 *
	 * @return bool
	 * @throws Exception
	 */
	public function createOrUpdateBlock( Brizy_Editor_Block $block ) {

		$cloudBlockData = array(
			'container' => $this->brizyProject->getCloudContainer(),
			'meta'      => $block->getMeta(),
			'data'      => $block->get_editor_data(),
			'uid'       => $block->getUid()
		);

		$url = Brizy_Config::CLOUD_ENDPOINT . Brizy_Config::CLOUD_SAVEDBLOCKS;

		if ( $block->getCloudId() ) {
			$response = $this->http->request( $url, array(
				'method'  => 'PUT',
				'headers' => $this->getHeaders(),
				'body'    => $cloudBlockData,
			) );
		} else {
			$response = $this->http->post( $url, array( 'headers' => $this->getHeaders(), 'body' => $cloudBlockData ) );
		}

		$code = wp_remote_retrieve_response_code( $response );


		if ( $code >= 400 ) {
			throw new Exception( 'Invalid code return by cloud api' );
		}

		return json_decode( wp_remote_retrieve_body( $response ) );
	}

	/**
	 * @param $blockId
	 *
	 * @return bool
	 * @throws Exception
	 */
	public function deleteBlock( $blockId ) {
		$query    = http_build_query( [ 'container' => $this->brizyProject->getCloudContainer() ] );
		$url      = Brizy_Config::CLOUD_ENDPOINT . Brizy_Config::CLOUD_SAVEDBLOCKS . "/" . $blockId . "?" . $query;
		$response = $this->http->request( $url, array( 'method' => 'DELETE', 'headers' => $this->getHeaders() ) );
		$code     = wp_remote_retrieve_response_code( $response );

		if ( $code >= 400 ) {
			throw new Exception( 'Invalid code return by cloud api' );
		}

		return $code == 200;
	}


	/**
	 * @param $filters
	 *
	 * @return array|mixed|object|null
	 */
	public function getPopups( $filters = array() ) {
		return $this->getCloudEntityByContainer( Brizy_Config::CLOUD_ENDPOINT . Brizy_Config::CLOUD_POPUPS, $filters );
	}

	/**
	 * @param Brizy_Editor_Popup $popup
	 *
	 * @return bool
	 * @throws Exception
	 */
	public function createOrUpdatePopup( Brizy_Editor_Popup $popup ) {

		$cloudBlockData = array(
			'container'   => $this->brizyProject->getCloudContainer(),
			'meta'        => $popup->getMeta(),
			'data'        => $popup->get_editor_data(),
			'is_autosave' => 0,
			'uid'         => $popup->getUid()
		);

		$url = Brizy_Config::CLOUD_ENDPOINT . Brizy_Config::CLOUD_POPUPS;

		if ( $popup->getCloudId() ) {
			$response = $this->http->request( $url, array(
				'method'  => 'PUT',
				'headers' => $this->getHeaders(),
				'body'    => $cloudBlockData
			) );
		} else {
			$response = $this->http->post( $url, array( 'headers' => $this->getHeaders(), 'body' => $cloudBlockData ) );
		}

		$code = wp_remote_retrieve_response_code( $response );

		if ( $code >= 400 ) {
			throw new Exception( 'Invalid code return by cloud api' );
		}

		return json_decode( wp_remote_retrieve_body( $response ) );
	}

	/**
	 * @param $popupId
	 *
	 * @return bool
	 * @throws Exception
	 */
	public function deletePopup( $popupId ) {
		$query    = http_build_query( [ 'container' => $this->brizyProject->getCloudContainer() ] );
		$url      = Brizy_Config::CLOUD_ENDPOINT . Brizy_Config::CLOUD_POPUPS . "/" . $popupId . "?" . $query;
		$response = $this->http->request( $url, array( 'method' => 'DELETE', 'headers' => $this->getHeaders() ) );
		$code     = wp_remote_retrieve_response_code( $response );

		if ( $code >= 400 ) {
			throw new Exception( 'Invalid code return by cloud api' );
		}

		return $code == 200;
	}


	/**
	 * @param $filters
	 *
	 * @return array|mixed|object|null
	 */
	public function getLayouts( $filters = array() ) {
		return $this->getCloudEntityByContainer( Brizy_Config::CLOUD_ENDPOINT . Brizy_Config::CLOUD_LAYOUTS, $filters );
	}


	/**
	 * @param Brizy_Editor_Layout $layout
	 *
	 * @return bool
	 * @throws Exception
	 */
	public function createOrUpdateLayout( Brizy_Editor_Layout $layout ) {

		$cloudBlockData = array(
			'container' => $this->brizyProject->getCloudContainer(),
			'meta'      => $layout->getMeta(),
			'data'      => $layout->get_editor_data(),
			'uid'       => $layout->getUid()
		);

		$url = Brizy_Config::CLOUD_ENDPOINT . Brizy_Config::CLOUD_LAYOUTS;

		if ( $layout->getCloudId() ) {
			$response = $this->http->request( $url, array(
				'method'  => 'PUT',
				'headers' => $this->getHeaders(),
				'body'    => $cloudBlockData,
			) );
		} else {
			$response = $this->http->post( $url, array( 'headers' => $this->getHeaders(), 'body' => $cloudBlockData ) );
		}

		$code = wp_remote_retrieve_response_code( $response );

		if ( $code >= 400 ) {
			throw new Exception( 'Invalid code return by cloud api' );
		}

		return json_decode( wp_remote_retrieve_body( $response ) );
	}

	/**
	 * @param $layoutId
	 *
	 * @return bool
	 * @throws Exception
	 */
	public function deleteLayout( $layoutId ) {
		$query    = http_build_query( [ 'container' => $this->brizyProject->getCloudContainer() ] );
		$url      = Brizy_Config::CLOUD_ENDPOINT . Brizy_Config::CLOUD_LAYOUTS . "/" . $layoutId . "?" . $query;
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
		return ! is_null( $this->getCloudEntityByContainer( Brizy_Config::CLOUD_ENDPOINT . Brizy_Config::CLOUD_MEDIA, [ 'name' => $uid ] ) );
	}

	/**
	 * @param $file
	 *
	 * @return bool
	 * @throws Exception
	 */
	public function uploadMedia( $uid, $file ) {

		$response = $this->http->post( Brizy_Config::CLOUD_ENDPOINT . Brizy_Config::CLOUD_MEDIA, array(
			'headers' => $this->getHeaders(),
			'body'    => array(
				'container'  => $this->brizyProject->getCloudContainer(),
				'attachment' => base64_encode( file_get_contents( $file ) ),
				'name'       => $uid,
				'filename'   => basename( $file )
			)
		) );

		$code = wp_remote_retrieve_response_code( $response );

		if ( $code >= 400 ) {
			throw new Exception( 'Invalid code return by cloud api' );
		}

		return json_decode( wp_remote_retrieve_body( $response ) );
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
			'headers' => $this->getHeaders(),
			'body'    => array(
				'container' => $this->brizyProject->getCloudContainer(),
				'uid'       => $font['id'],
				'family'    => $font['family'],
				'files'     => $font['weights']
			)
		) );

		$code = wp_remote_retrieve_response_code( $response );

		if ( $code >= 400 ) {
			throw new Exception( 'Invalid code return by cloud api' );
		}

		return json_decode( wp_remote_retrieve_body( $response ) );
	}

	public function getFont( $uid ) {
		$response = $this->getCloudEntityByContainer( Brizy_Config::CLOUD_ENDPOINT . Brizy_Config::CLOUD_FONTS, array( 'uid' => $uid ) );

		if ( is_array( $response ) && isset( $response[0] ) ) {
			return $response[0];
		}

		return null;
	}


	/**
	 * @param $endpoint
	 * @param $filters
	 *
	 * @return array|mixed|object|null
	 */
	private function getCloudEntity( $endpoint, $filters = array() ) {

		$http_build_query = http_build_query( $filters );

		if ( $http_build_query ) {
			$http_build_query = '?' . $http_build_query;
		}

		$url      = $endpoint . $http_build_query;
		$response = $this->http->get( $url, array( 'headers' => $this->getHeaders() ) );

		$code = wp_remote_retrieve_response_code( $response );
		if ( $code == 200 ) {
			return json_decode( $response['body'] );
		}

		return null;
	}

	/**
	 * @param $endpoint
	 * @param $filters
	 *
	 * @return array|mixed|object|null
	 */
	private function getCloudEntityByContainer( $endpoint, $filters = array() ) {

		$filters = array_merge( $filters, [ 'container' => $this->brizyProject->getCloudContainer() ] );

		return $this->getCloudEntity( $endpoint, $filters );
	}

}