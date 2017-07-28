<?php

class Brizy_Editor_API {

	const nonce = 'brizy-api';
	const AJAX_PING = 'brizy_editor_ping';
	const AJAX_GET = 'brizy_editor_get_items';
	const AJAX_UPDATE = 'brizy_update_item';
	const AJAX_GET_GLOBALS = 'brizy_get_globals';
	const AJAX_SET_GLOBALS = 'brizy_set_globals';
	const AJAX_MEDIA = 'Brizy_Editor_Asset_Media';
	const AJAX_SIDEBARS = 'brizy_sidebars';
	const AJAX_BUILD = 'brizy_build';

	public static function init() {
		static $instance;

		if ( ! $instance ) {
			$instance = new self();
		}
	}

	protected function __construct() {
		add_action( 'wp_ajax_' . self::AJAX_PING, array( $this, 'ping' ) );
		add_action( 'wp_ajax_' . self::AJAX_GET, array( $this, 'get_item' ) );
		add_action( 'wp_ajax_' . self::AJAX_UPDATE, array( $this, 'update_item' ) );
		add_action( 'wp_ajax_' . self::AJAX_GET_GLOBALS, array( $this, 'get_globals' ) );
		add_action( 'wp_ajax_' . self::AJAX_SET_GLOBALS, array( $this, 'set_globals' ) );
		add_action( 'wp_ajax_' . self::AJAX_MEDIA, array( $this, 'media' ) );
		add_action( 'wp_ajax_' . self::AJAX_SIDEBARS, array( $this, 'get_sidebars' ) );
		add_action( 'wp_ajax_' . self::AJAX_BUILD, array( $this, 'build_content' ) );
	}

	/**
	 * @internal
	 **/
	public function ping() {
		try {
			$this->authorize();
			$this->success( array() );
		} catch ( Exception $exception ) {
			$this->error( $exception->getCode(), $exception->getMessage() );
			exit;
		}
	}

	/**
	 * @internal
	 **/
	public function get_globals() {
		try {
			$this->authorize();
			$id      = $this->param( 'id' );
			$project = Brizy_Editor_Project::get();
			$post    = Brizy_Editor_Post::get( $id );

			$data = self::create_post_globals( $project, $post );

			$this->success( $data );
		} catch ( Exception $exception ) {
			$this->error( $exception->getCode(), $exception->getMessage() );
			exit;
		}
	}

	/**
	 * @internal
	 */
	public function set_globals() {
		try {
			$this->authorize();

			$id      = $this->param( 'id' );
			$project = Brizy_Editor_Project::get();
			$post    = Brizy_Editor_Post::get( $id );

			$data = $this->param( 'data' );

			$project->set_globals( stripslashes( $data['globals'] ) );

			$project->save();

			Brizy_Editor_User::get()->update_project_globals( $project->get_api_project() );

			$this->success( self::create_post_globals( $project, $post ) );
		} catch ( Exception $exception ) {
			$this->error( $exception->getCode(), $exception->getMessage() );
			exit;
		}
	}

	/**
	 * @internal
	 **/
	public function get_item() {
		try {
			$this->authorize();
			$id   = $this->param( 'id' );
			$post = Brizy_Editor_Post::get( $id );

			$post_arr = self::create_post_arr( $post );
			$this->success( array( $post_arr ) );
		} catch ( Exception $exception ) {
			$this->error( $exception->getCode(), $exception->getMessage() );
			exit;
		}
	}

	/**
	 * @internal
	 **/
	public function update_item() {
		try {
			$id      = $this->param( 'id' );
			$content = $this->param( 'data' );
			$title   = $this->param( 'title' );


			$post = Brizy_Editor_Post::get( $id );

			$post->set_title( $title );
			$post->set_template( $this->param( 'template' ) );
			$post->set_data( $content );

			$post->save();

			$this->success( self::create_post_arr( $post ) );
		} catch ( Exception $exception ) {
			$this->error( $exception->getCode(), $exception->getMessage() );
		}
	}

	/**
	 * @internal
	 */
	public function build_content() {
		try {
			$id   = $this->param( 'id' );
			$post = Brizy_Editor_Post::get( $id );

			$post->compile_page()
			     ->save();

			$this->success( self::create_post_arr( $post ) );
		} catch ( Exception $exception ) {
			$this->error( $exception->getCode(), $exception->getMessage() );
		}
	}

	public function get_sidebars() {
		global $wp_registered_sidebars;

		$items = array();

		foreach ( $wp_registered_sidebars as $sidebar ) {
			$item    = array(
				'id'    => $sidebar['id'],
				'title' => $sidebar['name'],
			);
			$items[] = $item;
		}

		$this->success( $items );
	}

	/**
	 * @internal
	 **/
	public function media() {
		try {
			$this->authorize();
			$project       = Brizy_Editor_Post::get( $this->param( 'id' ) );
			$attachment_id = $this->param( 'attachmentId' );

			$this->success( Brizy_Editor_User::get()->get_media_id(
				new Brizy_Editor_API_Project(
					$project->get_id(),
					$project->get_page_id()
				),
				$attachment_id
			) );
		} catch ( Exception $exception ) {
			$this->error( $exception->getCode(), $exception->getMessage() );
		}
	}

	protected function param( $name ) {
		if ( isset( $_POST[ $name ] ) ) {
			return $_POST[ $name ];
		}

		throw new Brizy_Editor_Exceptions_NotFound( "Parameter '$name' is missing", 400 );
	}

	protected function error( $code, $message ) {
		wp_send_json_error( array( 'code' => $code, 'message' => $message ), $code );
	}

	protected function success( $data ) {
		wp_send_json( $data );
	}

	protected function static_url() {
		return brizy()->get_url( '/includes/editor/static' );
	}

	private function authorize() {
		if ( ! wp_verify_nonce( $_POST['hash'], self::nonce ) ) {
			throw new Brizy_Editor_Exceptions_AccessDenied();
		}
	}

	public static function create_post_arr( Brizy_Editor_Post $post ) {

		$p_id      = (int) $post->get_id();
		$the_title = get_the_title( $p_id );

		return array(
			'title'    => $the_title,
			'slug'     => sanitize_title( $the_title ),
			'data'     => $post->get_data(),
			'id'       => $p_id,
			'is_index' => $post->get_api_page()->is_index(),
			'template' => get_page_template_slug( $p_id ),
			'status'   => get_post_status( $p_id ),
			'url'      => get_the_permalink( $p_id )
		);
	}

	public static function create_post_globals( Brizy_Editor_Project $project, Brizy_Editor_Post $post ) {
		$wp_post = $post->get_wp_post();

		return array(
			'id'        => $project->get_id(),
			'name'      => $wp_post->post_name,
			'globals'   => $project->get_globals(),
			'createdAt' => $wp_post->post_date,
			'updatedAt' => $wp_post->post_date,
			'user'      => array(
				'email' => null,
				'id'    => null,
			),
		);
	}
}