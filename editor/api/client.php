<?php

class Brizy_Editor_API_Client extends Brizy_Editor_Http_Client {

	/**
	 * @var Brizy_Editor_API_AccessToken
	 */
	private $access_token;

	/**
	 * Brizy_Editor_API_Client constructor.
	 *
	 * @param $token
	 */
	public function __construct( $token ) {
		parent::__construct();
		$this->access_token = $token;
	}

	/**
	 * @return array|mixed|object
	 * @throws Brizy_Editor_API_Exceptions_Exception
	 * @throws Brizy_Editor_Http_Exceptions_BadRequest
	 * @throws Brizy_Editor_Http_Exceptions_ResponseException
	 * @throws Brizy_Editor_Http_Exceptions_ResponseNotFound
	 * @throws Brizy_Editor_Http_Exceptions_ResponseUnauthorized
	 */
	public function create_project() {
		return $this->post( 'projects', array() )->get_response_body();
	}

	/**
	 * @param Brizy_Editor_API_Project $project
	 *
	 * @return array|mixed|object
	 * @throws Brizy_Editor_API_Exceptions_Exception
	 * @throws Brizy_Editor_Http_Exceptions_BadRequest
	 * @throws Brizy_Editor_Http_Exceptions_ResponseException
	 * @throws Brizy_Editor_Http_Exceptions_ResponseNotFound
	 * @throws Brizy_Editor_Http_Exceptions_ResponseUnauthorized
	 */
	public function get_project( Brizy_Editor_API_Project $project ) {

		return $this->get( "projects/{$project->get_id()}", array() )->get_response_body();
	}

	/**
	 * @param Brizy_Editor_API_Project $project
	 *
	 * @return array|mixed|object
	 * @throws Brizy_Editor_API_Exceptions_Exception
	 * @throws Brizy_Editor_Http_Exceptions_BadRequest
	 * @throws Brizy_Editor_Http_Exceptions_ResponseException
	 * @throws Brizy_Editor_Http_Exceptions_ResponseNotFound
	 * @throws Brizy_Editor_Http_Exceptions_ResponseUnauthorized
	 */
	public function update_project( Brizy_Editor_API_Project $project ) {
		return $this->put( "projects/{$project->get_id()}", array( 'body' => array( 'globals' => $project->get_globals_as_json() ) ) )->get_response_body();
	}

	/**
	 * @param $id
	 *
	 * @return array|mixed|object
	 * @throws Brizy_Editor_API_Exceptions_Exception
	 * @throws Brizy_Editor_Http_Exceptions_BadRequest
	 * @throws Brizy_Editor_Http_Exceptions_ResponseException
	 * @throws Brizy_Editor_Http_Exceptions_ResponseNotFound
	 * @throws Brizy_Editor_Http_Exceptions_ResponseUnauthorized
	 */
	public function delete_project( $id ) {
		return $this->delete( "projects/$id" )->get_response_body();
	}

	/**
	 * @param $project_id
	 *
	 * @return array|mixed|object
	 * @throws Brizy_Editor_API_Exceptions_Exception
	 * @throws Brizy_Editor_Http_Exceptions_BadRequest
	 * @throws Brizy_Editor_Http_Exceptions_ResponseException
	 * @throws Brizy_Editor_Http_Exceptions_ResponseNotFound
	 * @throws Brizy_Editor_Http_Exceptions_ResponseUnauthorized
	 */
	public function get_pages( $project_id ) {
		return $this->get( "projects/$project_id/pages" )->get_response_body();
	}

	/**
	 * @param $project_id
	 * @param $page_id
	 *
	 * @return array|mixed|object
	 * @throws Brizy_Editor_API_Exceptions_Exception
	 * @throws Brizy_Editor_Http_Exceptions_BadRequest
	 * @throws Brizy_Editor_Http_Exceptions_ResponseException
	 * @throws Brizy_Editor_Http_Exceptions_ResponseNotFound
	 * @throws Brizy_Editor_Http_Exceptions_ResponseUnauthorized
	 */
	public function get_page( $project_id, $page_id ) {
		return $this->get( "projects/$project_id/pages/$page_id" )->get_response_body();
	}

	/**
	 * @param $project_id
	 * @param Brizy_Editor_API_Page $page
	 *
	 * @return array|mixed|object
	 * @throws Brizy_Editor_API_Exceptions_Exception
	 * @throws Brizy_Editor_Http_Exceptions_BadRequest
	 * @throws Brizy_Editor_Http_Exceptions_ResponseException
	 * @throws Brizy_Editor_Http_Exceptions_ResponseNotFound
	 * @throws Brizy_Editor_Http_Exceptions_ResponseUnauthorized
	 */
	public function create_page( $project_id, Brizy_Editor_API_Page $page ) {
		return $this->post( "projects/$project_id/pages", array( 'body' => $page->export() ) )->get_response_body();
	}

	/**
	 * @param $project_id
	 * @param $page_id
	 * @param Brizy_Editor_API_Page $page
	 *
	 * @return array|mixed|object
	 * @throws Brizy_Editor_API_Exceptions_Exception
	 * @throws Brizy_Editor_Http_Exceptions_BadRequest
	 * @throws Brizy_Editor_Http_Exceptions_ResponseException
	 * @throws Brizy_Editor_Http_Exceptions_ResponseNotFound
	 * @throws Brizy_Editor_Http_Exceptions_ResponseUnauthorized
	 */
	public function update_page( $project_id, $page_id, Brizy_Editor_API_Page $page ) {
		return $this->put( "projects/$project_id/pages/$page_id", array( 'body' => $page->export() ) )->get_response_body();
	}

	/**
	 * @param Brizy_Editor_API_Project $project
	 * @param Brizy_Editor_API_Page $page
	 * @param $config
	 *
	 * @return array|mixed|object
	 * @throws Brizy_Editor_API_Exceptions_Exception
	 * @throws Brizy_Editor_Http_Exceptions_BadRequest
	 * @throws Brizy_Editor_Http_Exceptions_ResponseException
	 * @throws Brizy_Editor_Http_Exceptions_ResponseNotFound
	 * @throws Brizy_Editor_Http_Exceptions_ResponseUnauthorized
	 */
	public function compile_page( $project, $page, $config ) {

		global $wp_rewrite;

		$site_url = get_site_url();

		$upload_dir = wp_upload_dir(null,true);

		if($wp_rewrite->permalink_structure=="")
		{
			$upload_dir['url'] = str_replace($site_url,$site_url."/index.php",$upload_dir['url']);
			$upload_dir['baseurl'] = str_replace($site_url,$site_url."/index.php",$upload_dir['baseurl']);
		}

		$urls = array(
			'urls' => json_encode( array(
				'api'     => $this->url( '' ),
				'primary' => $config['urls']['primary'],
				'base'    => $config['urls']['base'],
				'static'  => $upload_dir['baseurl'].sprintf(Brizy_Config::BRIZY_WP_EDITOR_ASSET_PATH, $project->get_template_version()),
				'assets'  => $config['urls']['assets'],
				'image'   => $upload_dir['baseurl'].Brizy_Config::LOCAL_PAGE_MEDIA_STATIC_URL
			) )
		);

		$compile_url = sprintf( Brizy_Config::COMPILER_URI, $project->get_id(), $page->get_id(), $this->access_token->access_token() );

		return parent::request( $compile_url, array( 'body' => $urls ), 'POST' )->get_response_body();
	}

	/**
	 * @param $project_id
	 * @param $page_id
	 *
	 * @return array|mixed|object
	 * @throws Brizy_Editor_API_Exceptions_Exception
	 * @throws Brizy_Editor_Http_Exceptions_BadRequest
	 * @throws Brizy_Editor_Http_Exceptions_ResponseException
	 * @throws Brizy_Editor_Http_Exceptions_ResponseNotFound
	 * @throws Brizy_Editor_Http_Exceptions_ResponseUnauthorized
	 */
	public function delete_page( $project_id, $page_id ) {
		return $this->delete( "projects/$project_id/pages/$page_id" )->get_response_body();
	}

	/**
	 * @param $project_id
	 * @param $base64
	 *
	 * @return array|mixed|object
	 * @throws Brizy_Editor_API_Exceptions_Exception
	 * @throws Brizy_Editor_Http_Exceptions_BadRequest
	 * @throws Brizy_Editor_Http_Exceptions_ResponseException
	 * @throws Brizy_Editor_Http_Exceptions_ResponseNotFound
	 * @throws Brizy_Editor_Http_Exceptions_ResponseUnauthorized
	 */
	public function add_media( $project_id, $base64 ) {
		return $this->post( "projects/$project_id/media", array(
			'timeout' => 30,
			'body'    => array( 'attachment' => $base64 )
		) )->get_response_body();
	}

	/**
	 * @return array
	 */
	protected function get_headers() {
		return array(
			'Authorization' => 'Bearer ' . $this->access_token->access_token()
		);
	}

	/**
	 * @param $suffix
	 *
	 * @return string
	 */
	protected function url( $suffix ) {
		$implode = rtrim(implode( "/", [ Brizy_Config::GATEWAY_URI, 'v1', $suffix ] ),"/");

		return $implode;
	}

	/**
	 * @param $url
	 * @param array $options
	 * @param string $method
	 *
	 * @return Brizy_Editor_Http_Response
	 * @throws Brizy_Editor_API_Exceptions_Exception
	 * @throws Brizy_Editor_Http_Exceptions_BadRequest
	 * @throws Brizy_Editor_Http_Exceptions_ResponseException
	 * @throws Brizy_Editor_Http_Exceptions_ResponseNotFound
	 * @throws Brizy_Editor_Http_Exceptions_ResponseUnauthorized
	 */
	public function request( $url, $options = array(), $method = 'GET' ) {
		return parent::request(
			$this->url( $url ),
			$options,
			$method
		);
	}

	/**
	 * @param $options
	 *
	 * @return array
	 */
	protected function prepare_options( $options ) {

		$options = parent::prepare_options( $options );

		$options['headers'] = array_merge( $options['headers'], $this->get_headers() );

		return $options;
	}
}