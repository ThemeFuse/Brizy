<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

class Brizy_Editor_Project {

	const BRIZY_PROJECT = 'brizy-project';

	/**
	 * @var Brizy_Editor_API_Project
	 */
	private $api_project;

	//private $title;
	//private $draft;
	//private $published;
	//private $globals;
	//private $html;

	/**
	 * @return Brizy_Editor_Project
	 */
	public static function get() {
		$brizy_editor_storage_common = Brizy_Editor_Storage_Common::instance();

		return $brizy_editor_storage_common->get( self::BRIZY_PROJECT );
	}

	/**
	 * @return Brizy_Editor_Project
	 */
	public static function create() {
		$api_project = Brizy_Editor_User::get()->create_project();

		$project = new self( $api_project );
		$project->save();

		return $project;
	}

	/**
	 * Brizy_Editor_Project constructor.
	 *
	 * @param $api_project
	 */
	protected function __construct( $api_project ) {
		$this->api_project = $api_project;
	}


	/**
	 * @return mixed
	 */
	public function get_id() {
		return $this->api_project->get_id();
	}


	/**
	 * @param $id
	 *
	 * @return $this
	 */
	public function set_id( $id ) {
		$this->api_project->set_id( $id );

		return $this;
	}

	/**
	 * @return array|mixed|object
	 */
	public function get_globals() {
		return $this->api_project->get_globals();
	}

	/**
	 * @param $globals
	 *
	 * @return $this
	 */
	public function set_globals( $globals ) {
		$this->api_project->set_globals( $globals );

		return $this;
	}

	/**
	 * @return Brizy_Editor_API_Project
	 */
	public function get_api_project() {
		return $this->api_project;
	}


	/**
	 * @return self
	 */
	public function save() {

		$brizy_editor_storage_common = Brizy_Editor_Storage_Common::instance();
		$brizy_editor_storage_common->set( self::BRIZY_PROJECT, $this );

		return $this;
	}

// ==================================================================================================================


//	public function get_title() {
//		if ( empty( $this->title ) ) {
//			$data        = Brizy_Editor_User::get()->get_page_data( $this->get_api_project() );
//			$this->title = $data['data'];
//		}
//
//		return $this->title;
//	}
//
//	public function set_title( $title ) {
//
//		Brizy_Editor_User::get()->update_page(
//			$this->get_api_project(),
//			$title,
//			$this->get_draft()
//		);
//
//		$this->title = $title;
//
//		return $this;
//	}

//	public function get_draft() {
//		if ( empty( $this->published ) ) {
//			$data            = Brizy_Editor_User::get()->get_page_data( $this->get_api_project() );
//			$this->published = $data['data'];
//		}
//
//		return $this->published;
//	}
//
//	public function set_draft( $data ) {
//		Brizy_Editor_User::get()->update_page(
//			$this->get_api_project(),
//			$this->get_title(),
//			$data
//		);
//
//		$this->draft = $data;
//
//		return $this;
//	}

//	public function get_published() {
//		if ( empty( $this->published ) ) {
//			$data            = Brizy_Editor_User::get()->get_page_data( $this->get_api_project() );
//			$this->published = $data['data'];
//		}
//
//		return $this->published;
//	}

//	public function set_published( $data ) {
//		Brizy_Editor_User::get()->update_page(
//			$this->get_api_project(),
//			$this->get_title(),
//			$data
//		);
//
//		$this->draft = $data;
//
//		return $this;
//	}

//	public function get_globals() {
//		if ( empty( $this->globals ) ) {
//			$this->globals = Brizy_Editor_User::get()->get_project( $this->get_id() )->get_globals();
//		}
//
//		return $this->globals;
//	}
//
//	public function set_globals( $data ) {
//		$this->globals = $data;
//		Brizy_Editor_User::get()->update_project_globals( $this->get_api_project()->set_globals( $data ) );
//
//		return $this;
//	}
//
//	public function get_html() {
//		if ( ! $this->html ) {
//			$html = Brizy_Editor_User::get()
//			                         ->publish_project( $this->get_api_project() )
//			                         ->get_html( $this->get_api_project() );
//
//			$this->html = $html['html'];
//		}
//
//
//		return new Brizy_Editor_CompiledHtml( $this->html );
//	}

//	private function get_api_project() {
//		return new Brizy_Editor_API_Project( $this->get_id(), $this->get_page_id() );
//	}

}