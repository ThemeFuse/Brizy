<?php


class Brizy_Admin_Cloud_Client extends WP_Http {

	use Brizy_Editor_Asset_AttachmentAware;

	/**
	 * @var Brizy_Editor_Project
	 */
	private $project;

	/**
	 * @var mixed|null
	 */
	private $token;

	/**
	 * @var array|mixed|object
	 */
	private $libraries;

	/**
	 * @var Brizy_Admin_Cloud_Client
	 */
	private static $instance;

	/**
	 *
	 */
	public static function instance() {
		if ( self::$instance ) {
			return self::$instance;
		}

		return self::$instance = new self( Brizy_Editor_Project::get() );
	}

	/**
	 * Brizy_Admin_Cloud_Client constructor.
	 *
	 * @param Brizy_Editor_Project $project
	 *
	 * @throws Exception
	 */
	private function __construct( Brizy_Editor_Project $project ) {
		$this->project   = $project;
		$this->token     = $this->project->getMetaValue( 'brizy-cloud-token' );
		$this->libraries = $this->getLibraries();
	}


	private function getLibraries() {
		$response = $this->get( Brizy_Config::CLOUD_ENDPOINT . Brizy_Config::CLOUD_LIBRARY );

		$code = wp_remote_retrieve_response_code( $response );

		if ( $code == 200 ) {

			$body = wp_remote_retrieve_body( $response );

			$libraries = json_decode( $body );

			if(count($libraries)==0) {
				throw new Exception( 'No libraries provided' );
			}


			return $libraries;
		}

		return null;
	}

	/**
	 * @param string $url
	 * @param array $args
	 *
	 * @return array|WP_Error
	 */
	public function request( $url, $args = array() ) {

		if ( ! isset( $args['headers'] ) ) {
			$args['headers'] = array();
		}

		if ( $this->token ) {
			$args['headers']['X-AUTH-APP-TOKEN']  = Brizy_Config::CLOUD_APP_KEY;
			$args['headers']['X-AUTH-USER-TOKEN'] = $this->token;
		}

		return parent::request( $url, $args );
	}


	/**
	 * @param $username
	 * @param $password
	 *
	 * @return array|bool|WP_Error
	 */
	public function obtainToken( $username, $password ) {

		$response = $this->post( Brizy_Config::CLOUD_ENDPOINT . Brizy_Config::CLOUD_AUTH_TOKEN, array(
			'headers' => array(
				'Content-type' => 'application/x-www-form-urlencoded'
			),
			'body'    => array(
				'username' => $username,
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

	public function getContainers() {
		$response = $this->get( Brizy_Config::CLOUD_ENDPOINT . Brizy_Config::CLOUD_CONTAINERS );

		return json_decode( $response['body'] );
	}

	public function getProjects( $filters ) {

		$url      = Brizy_Config::CLOUD_ENDPOINT . Brizy_Config::CLOUD_PROJECTS;
		$url      = $url . '?' . http_build_query( $filters );
		$response = $this->get( $url );

		$code = wp_remote_retrieve_response_code( $response );
		if ( $code == 200 ) {
			return json_decode( $response['body'] );
		}

		return null;

	}

	public function getProject( $id ) {

		$url      = sprintf( Brizy_Config::CLOUD_ENDPOINT . Brizy_Config::CLOUD_PROJECTS . "/%d", (int) $id );
		$response = $this->get( $url );

		$code = wp_remote_retrieve_response_code( $response );
		if ( $code == 200 ) {
			return json_decode( $response['body'] );
		}

		return null;
	}

	public function createProject( $container, $name ) {

		$response = $this->post( Brizy_Config::CLOUD_ENDPOINT . Brizy_Config::CLOUD_PROJECTS, array(
			'body' => array(
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
		$cloudBlockData = array(
			'library'     => $this->libraries[0]->id,
			'meta'        => array(),
			'data'        => $block->get_editor_data(),
			'is_autosave' => 0,
			'uid'         => $block->get_uid()
		);
		$url            = Brizy_Config::CLOUD_ENDPOINT . Brizy_Config::CLOUD_SAVEDBLOCKS;
		if ( $block->getCloudId() ) {
			$response = $this->request( $url, array( 'method' => 'PUT', 'body' => $cloudBlockData ) );
		} else {
			$response = $this->post( $url, array( 'body' => $cloudBlockData ) );
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
		$response = $this->request( $url, array( 'method' => 'DELETE' ) );
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
		$http     = new WP_Http();
		$response = $http->get( Brizy_Config::CLOUD_ENDPOINT . Brizy_Config::CLOUD_MEDIA . '?name=' . $uid );

		$code = wp_remote_retrieve_response_code( $response );

		if ( $code >= 400 ) {
			throw new Exception( 'Invalid code return by cloud api' );
		}

		$body = wp_remote_retrieve_body( $response );

		$json = json_decode( $body );

		return is_array( $json ) && count( $json ) == 1;
	}

	/**
	 * @param $uid
	 * @param $path
	 *
	 * @return bool
	 * @throws Exception
	 */
	public function uploadMedia( $uid ) {

		$attachmentId = $this->getAttachmentByMediaName( $uid );

		if ( ! $attachmentId ) {
			throw new Exception( 'Invalid uid provided in upload block media' );
		}

		$file = get_attached_file( $attachmentId );

		$http     = new WP_Http();
		$response = $http->post( Brizy_Config::CLOUD_ENDPOINT . Brizy_Config::CLOUD_MEDIA, array(
			'body' => array(
				'attachment' => base64_encode( file_get_contents( $file ) ),
				'filename'   => basename( $file )
			)
		) );

		$code = wp_remote_retrieve_response_code( $response );

		if ( $code >= 400 ) {
			throw new Exception( 'Invalid code return by cloud api' );
		}

		return $code == 200;
	}


}