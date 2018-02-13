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


	public function create_project() {
		return $this->post( 'projects', array() )->get_response_body();
	}

	public function get_project( Brizy_Editor_API_Project $project ) {

		return $this->get( "projects/{$project->get_id()}", array() )->get_response_body();
	}

	public function update_project( Brizy_Editor_API_Project $project ) {
		return $this->put( "projects/{$project->get_id()}", array( 'body' => array( 'globals' => $project->get_globals_as_json() ) ) )->get_response_body();
	}

	public function delete_project( $id ) {
		return $this->delete( "projects/$id" )->get_response_body();
	}

	public function get_pages( $project_id ) {
		return $this->get( "projects/$project_id/pages" )->get_response_body();
	}

	public function get_page( $project_id, $page_id ) {
		return $this->get( "projects/$project_id/pages/$page_id" )->get_response_body();
	}

	public function create_page( $project_id, Brizy_Editor_API_Page $page ) {
		return $this->post( "projects/$project_id/pages", array( 'body' => $page->export() ) )->get_response_body();
	}

	public function update_page( $project_id, $page_id, Brizy_Editor_API_Page $page ) {
		return $this->put( "projects/$project_id/pages/$page_id", array( 'body' => $page->export() ) )->get_response_body();
	}

	public function compile_page( $project_id, $page_id, $config ) {

		$urls = array(
			'urls' => json_encode( array(
				'api'     => $this->url( '' ),
				'primary' => $config['urls']['primary'],
				'base'    => $config['urls']['base'],
				'static'  => $config['urls']['static'],
				'image'   => $config['urls']['image']
			) )
		);

		$compile_url = sprintf( Brizy_Config::COMPILER_URI, $project_id, $page_id, $this->access_token->access_token() );

		return parent::request( $compile_url, array( 'body' => $urls ), 'POST' )->get_response_body();
	}

	public function delete_page( $project_id, $page_id ) {
		return $this->delete( "projects/$project_id/pages/$page_id" )->get_response_body();
	}

	public function add_media( $project_id, $base64 ) {
		return $this->post( "projects/$project_id/media", array(
			'timeout' => 30,
			'body'    => array( 'attachment' => $base64 )
		) )->get_response_body();
	}

	protected function get_headers() {
		return array(
			'Authorization' => 'Bearer ' . $this->access_token->access_token()
		);
	}

	protected function url( $suffix ) {
		return Brizy_Config::GATEWAY_URI . DIRECTORY_SEPARATOR . 'v1' . DIRECTORY_SEPARATOR . $suffix;
	}

	public function request( $url, $options = array(), $method = 'GET' ) {
		return parent::request(
			$this->url( $url ),
			$options,
			$method
		);
	}

	protected function prepare_options( $options ) {

		$options = parent::prepare_options( $options );

		$options['headers'] = array_merge( $options['headers'], $this->get_headers() );

		return $options;
	}
}