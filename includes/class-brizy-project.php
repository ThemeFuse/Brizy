<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

class Brizy_Project {

	private $id;
	private $page_id;

	private $title;
	private $draft;
	private $published;
	private $globals;
	private $html;

	public static function create() {
		$project = Brizy_User::get()->create_project();

		return new self( $project->get_id(), $project->get_page_id() );
	}

	protected function __construct( $id, $page_id ) {
		$this->id      = $id;
		$this->page_id = $page_id;
	}

	public function get_id() {
		return $this->id;
	}

	public function get_page_id() {
		return $this->page_id;
	}

	public function get_title() {
		if ( empty( $this->title ) ) {
			$data        = Brizy_User::get()->get_page_data( $this->get_api_project() );
			$this->title = $data['data'];
		}

		return $this->title;
	}

	public function set_title( $title ) {
		Brizy_User::get()->update_page(
			$this->get_api_project(),
			$title,
			$this->get_draft()
		);

		$this->title = $title;

		return $this;
	}

	public function get_draft() {
		if ( empty( $this->published ) ) {
			$data            = Brizy_User::get()->get_page_data( $this->get_api_project() );
			$this->published = $data['data'];
		}

		return $this->published;
	}

	public function set_draft( $data ) {
		Brizy_User::get()->update_page(
			$this->get_api_project(),
			$this->get_title(),
			$data
		);

		$this->draft = $data;

		return $this;
	}

	public function get_published() {
		if ( empty( $this->published ) ) {
			$data            = Brizy_User::get()->get_page_data( $this->get_api_project() );
			$this->published = $data['data'];
		}

		return $this->published;
	}

	public function set_published( $data ) {
		Brizy_User::get()->update_page(
			$this->get_api_project(),
			$this->get_title(),
			$data
		);

		$this->draft = $data;

		return $this;
	}

	public function get_globals() {
		if ( empty( $this->globals ) ) {
			$this->globals = Brizy_User::get()->get_project( $this->get_id() )->get_globals();
		}

		return $this->globals;
	}

	public function set_globals( $data ) {
		$this->globals = $data;
		Brizy_User::get()->update_project_globals( $this->get_api_project()->set_globals( $data ) );

		return $this;
	}

	public function get_html() {
		if ( ! $this->html ) {
			$html = Brizy_User::get()
			                       ->publish_project( $this->get_api_project() )
			                       ->get_html( $this->get_api_project() );

			$this->html = $html['html'];
		}

		return new Brizy_Project_Html( $this->html );
	}

	private function get_api_project() {
		return new Brizy_API_Project( $this->get_id(), $this->get_page_id() );
	}

	public function __sleep() {
		return array( 'page_id', 'id' );
	}
}