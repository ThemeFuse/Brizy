<?php

class BitBlox_WP_API_Client {

	private $access_token;

	public function __construct( BitBlox_WP_API_Access_Token $token ) {
		$this->access_token = $token;
	}

	public function get_projects() {
		return $this->get( 'projects' )->get_body();
	}

	public function create_project() {
		return $this->post( 'projects' )->get_body();
	}

	public function get_project( $id ) {
		return $this->get( "projects/$id" )->get_body();
	}

	public function delete_project( $id ) {
		return $this->delete( "projects/$id" )->get_body();
	}

	public function get_pages( $project_id ) {
		return $this->get( "projects/$project_id/pages" )->get_body();
	}

	public function get_page( $project_id, $page_id ) {
		return $this->get( "projects/$project_id/pages/$page_id" )->get_body();
	}

	public function get_page_html( $project_id, $page_id ) {
		return $this->get( "projects/$project_id/pages/$page_id/html" )->get_body();
	}

	public function create_page( $project_id, BitBlox_WP_API_Page $page ) {
		return $this->post( "projects/$project_id/pages", $page->export() )->get_body();
	}

	public function update_page( $project_id, $page_id, BitBlox_WP_API_Page $page ) {
		return $this->put( "projects/$project_id/pages/$page_id", $page->export() )->get_body();
	}

	public function add_media( $project_id, $base64 ) {
		return $this->post( "projects/$project_id/media", array( 'attachment' => $base64 ) )->get_body();
	}

	public static function base_url() {
		return 'http://api.bitblox.xyz';
	}

	protected function get_headers() {
		return array(
			'Authorization' => 'Bearer ' . $this->access_token->access_token()
		);
	}

	protected function url( $suffix ) {
		return implode( '/', array( self::base_url(), 'v1', $suffix ) );
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
		return BitBlox_WP_Http::request(
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