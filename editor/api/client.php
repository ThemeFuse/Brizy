<?php

class Brizy_Editor_API_Client {

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
		$this->access_token = $token;
	}

	public function get_projects() {
		return $this->get( 'projects' )->get_response_body();
	}

	public function create_project() {
		return $this->post( 'projects' )->get_response_body();
	}

	public function get_project( $id ) {
		return $this->get( "projects/$id" )->get_response_body();
	}

	public function update_project( Brizy_Editor_API_Project $project) {

		return $this->put( "projects/{$project->get_id()}", $project->get_data() )->get_response_body();
	}

	public function publish_project( $id ) {
		return $this->put( "projects/{$id}/publish" )->get_response_body();
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


	public function get_page_html( $project_id, $page_id ) {
		return $this->get( "projects/$project_id/pages/$page_id/html" )->get_response_body();
	}

	public function create_page( $project_id, Brizy_Editor_API_Page $page ) {
		return $this->post( "projects/$project_id/pages", $page->export() )->get_response_body();
	}

	public function update_page( $project_id, $page_id, Brizy_Editor_API_Page $page ) {
		return $this->put( "projects/$project_id/pages/$page_id", $page->export() )->get_response_body();
	}

	public function delete_page( $project_id, $page_id ) {
		return $this->delete( "projects/$project_id/pages/$page_id" )->get_response_body();
	}

	public function add_media( $project_id, $base64 ) {
		return $this->post( "projects/$project_id/media", array( 'attachment' => $base64 ) )->get_response_body();
	}


	protected function get_headers() {
		return array(
			'Authorization' => 'Bearer ' . $this->access_token->access_token()
		);
	}

	protected function url( $suffix ) {
		return implode( '/', array( Brizy_Editor_Api_Config::GATEWAY_URI, 'v1', $suffix ) );
	}

	protected function get( $route, $body = null ) {
		return $this->request( $route, $body );
	}

	protected function post( $route, $body = null ) {
		return $this->request( $route, $body, 'POST' );
	}

	protected function delete( $route, $body = null ) {
		return $this->request( $route, $body, 'DELETE' );
	}

	protected function put( $route, $body = null ) {
		return $this->request( $route, $body, 'PUT' );
	}

	protected function request( $route, $body = null, $method = 'GET' ) {
		return Brizy_Editor_Http_Client::request(
			$this->url( $route ),
			array(
				'headers' => $this->get_headers(),
				'body'    => $body,
				'timeout' => 30
			),
			$method
		);
	}
}