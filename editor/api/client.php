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
		$this->access_token = $token;
	}


	public function create_project() {
		return $this->post( 'projects', [] )->get_response_body();
	}


	public function update_project( Brizy_Editor_API_Project $project ) {

		return $this->put( "projects/{$project->get_id()}", $project->get_data() )->get_response_body();
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
		return $this->post( "projects/$project_id/pages", [ 'body' => $page->export() ] )->get_response_body();
	}

	public function update_page( $project_id, $page_id, Brizy_Editor_API_Page $page ) {
		return $this->put( "projects/$project_id/pages/$page_id", [ 'body' => $page->export() ] )->get_response_body();
	}

	public function compile_page( $project_id, $page_id, $config ) {

		/**
		 * @todo: pass the config to the compiler to compile the html with the right urls.
		 */
		$urls = array(
			'urls' => json_encode( array(
				'primary' => $config['urls']['primary'],
				'base'    => $config['urls']['base'],
				'static'  => $config['urls']['static']
			), JSON_UNESCAPED_SLASHES )
		);

		return $this->post( "projects/$project_id/pages/$page_id/htmls", array( 'body' => $urls ) )->get_response_body();
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
		return implode( '/', array( Brizy_Config::GATEWAY_URI, 'v1', $suffix ) );
	}

	public function request( $url, array $options = array(), $method = 'GET' ) {

		if ( ! isset( $options['headers'] ) ) {
			$options['headers'] = [];
		}

		$options['headers'] = array_merge( $options['headers'], $this->get_headers() );

		return parent::request(
			$this->url( $url ),
			$options,
			$method
		);
	}
}