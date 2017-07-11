<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

class Brizy_Admin {

	public static function _init() {
		static $instance;

		if ( ! $instance ) {
			$instance = new Brizy_Admin();
		}
	}

	protected function __construct() {
		if ( defined( 'DOING_AJAX' ) ) {
			add_action( 'wp_ajax__brizy_admin_editor_enable', array( $this, '_action_request_enable' ) );
			add_action( 'wp_ajax__brizy_admin_editor_disable', array( $this, '_action_request_disable' ) );

			return;
		}

		add_action( 'admin_enqueue_scripts', array( $this, '_action_register_static' ) );
		add_action( 'before_delete_post', array( $this, '_action_delete_page' ) );
		add_action( 'media_buttons', array( $this, '_action_add_enable_disable_buttons' ) );
		add_filter( 'page_row_actions', array( $this, '_filter_add_brizy_edit_row_actions' ), 10, 2 );
		add_filter( 'admin_body_class', array( $this, '_filter_add_body_class' ), 10, 2 );
		add_filter( 'the_editor', array( $this, '_filter_add_brizy_edit_button' ), 10, 2 );
	}

	public static function render( $view, array $args = array() ) {
		return Brizy_View::get(
			implode( DIRECTORY_SEPARATOR, array( dirname( __FILE__ ), 'views', $view ) ),
			$args
		);
	}

	/**
	 * @internal
	 */
	public function _action_register_static() {
		if ( ! in_array( get_post_type(), brizy()->supported_post_types() ) ) {
			return;
		}

		wp_enqueue_style(
			brizy()->get_slug() . '-admin-js',
			brizy()->get_url( '/admin/static/css/style.css' )
		);
		wp_enqueue_script(
			brizy()->get_slug() . '-admin-js',
			brizy()->get_url( '/admin/static/js/script.js' ),
			array( 'jquery', 'underscore' ),
			brizy()->get_version(),
			true
		);

		wp_localize_script(
			brizy()->get_slug() . '-admin-js',
			'Brizy_Admin_Data',
			array(
				'url'     => admin_url( 'admin-ajax.php' ),
				'id'      => get_the_ID(),
				'actions' => array(
					'enable'  => '_brizy_admin_editor_enable',
					'disable' => '_brizy_admin_editor_disable',
				)
			)
		);
	}

	/**
	 * @internal
	 */
	public function _action_request_enable() {
		if ( ! isset( $_POST['id'] ) || ! ( $p = get_post( $_POST['id'] ) ) ) {
			wp_send_json_error( array(
				'code'    => 'invalid_request',
				'message' => __( 'Invalid post', brizy()->get_domain() ),
			) );
			exit();
		}

		try {
			$post = Brizy_Post::get( $p->ID );

			if ( $p->post_status == 'auto-draft' ) {
				$p->post_status = 'draft';
				wp_update_post( $p );
			}

			wp_send_json_success( array(
				'redirect' => $post->enable_editor()->edit_url()
			) );
		} catch ( Brizy_Exception_Not_Found $exception ) {
			$post = Brizy_Post::create( $p->ID );

			if ( $p->post_status == 'auto-draft' ) {
				$p->post_status = 'draft';
				wp_update_post( $p );
			}

			wp_send_json_success( array(
				'redirect' => $post->enable_editor()->edit_url()
			) );
		} catch ( Brizy_Exception $exception ) {
			wp_send_json_error( array(
				'code'    => $exception->getCode(),
				'message' => $exception->getMessage(),
			) );
		}
	}

	/**
	 * @internal
	 */
	public function _action_request_disable() {
		if ( ! isset( $_POST['id'] ) || ! ( $p = get_post( $_POST['id'] ) ) ) {
			wp_send_json_error( array(
				'code'    => 'invalid_request',
				'message' => __( 'Invalid post', brizy()->get_domain() ),
			) );
			exit();
		}

		try {
			Brizy_Post::get( $p->ID )->disable_editor();
			wp_send_json_success();
		} catch ( Brizy_Exception $exception ) {
			wp_send_json_error( array(
				'code'    => $exception->getCode(),
				'message' => $exception->getMessage(),
			) );
		}
	}

	/**
	 * @internal
	 *
	 * @param int $id
	 **/
	public function _action_delete_page( $id ) {
		try {
			$post = Brizy_Post::get( $id );
			Brizy_User::get()->delete_project( new Brizy_API_Project(
				$post->get_id(),
				$post->get_page_id()
			) );

			do_action( 'brizy_delete_post', $id );
		} catch ( Exception $exception ) {
		}
	}

	/**
	 * @internal
	 **/
	public function _action_add_enable_disable_buttons() {
		if ( in_array( get_post_type(), brizy()->supported_post_types() ) ) {
			echo self::render( 'button', array( 'id' => get_the_ID(), ) );
		}
	}

	/**
	 * @internal
	 *
	 * @param array $actions
	 * @param WP_Post $post
	 *
	 * @return array
	 **/
	public function _filter_add_brizy_edit_row_actions( $actions, $post ) {
		if ( ! in_array( get_post_type(), brizy()->supported_post_types() ) ) {
			return $actions;
		}

		$actions['brizy-edit'] = "<a href='{$p->edit_url()}'>"
		                           . __( 'Edit with BitBlox', brizy()->get_domain() )
		                           . "</a>";

		return $actions;
	}

	/**
	 * @internal
	 *
	 * @param string $body
	 *
	 * @return string
	 **/
	public function _filter_add_body_class( $body ) {
		if ( ! ( $id = get_the_ID() ) ) {
			return $body;
		}

		try {
			$post = Brizy_Post::get( $id );
		} catch ( Exception $x ) {
			return $body;
		}

		return $body . ( $post->uses_editor() ? 'brizy-editor-enabled' : '' );
	}

	/**
	 * @internal
	 *
	 * @param string $data
	 *
	 * @return string
	 **/
	public function _filter_add_brizy_edit_button( $data ) {
		if ( ! in_array( get_post_type(), brizy()->supported_post_types() ) ) {
			return $data;
		}

		return $data . self::render( 'editor',
				array(
					'url' => add_query_arg(
						array( Brizy_Constants::EDIT_KEY => '' ),
						get_permalink( get_the_ID() )
					)
				) );
	}
}
