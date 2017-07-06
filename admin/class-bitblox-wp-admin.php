<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

class BitBlox_WP_Admin {

	public static function _init() {
		static $instance;

		if ( ! $instance ) {
			$instance = new BitBlox_WP_Admin();
		}
	}

	protected function __construct() {
		if ( defined( 'DOING_AJAX' ) ) {
			add_action( 'wp_ajax__bitblox_wp_admin_editor_enable', array( $this, '_action_request_enable' ) );
			add_action( 'wp_ajax__bitblox_wp_admin_editor_disable', array( $this, '_action_request_disable' ) );

			return;
		}

		//add_action( 'post_submitbox_minor_actions', array( $this, '_action_bitblox_add_edit_button' ) );
		add_action( 'admin_enqueue_scripts', array( $this, '_action_register_static' ) );
		add_action( 'post_updated', array( $this, '_action_update_post_content' ) );
		add_action( 'before_delete_post', array( $this, '_action_delete_page' ) );
		add_action( 'media_buttons', array( $this, '_action_media_buttons' ) );
		add_filter( 'page_row_actions', array( $this, '_filter_add_bitblox_edit_row_actions' ), 10, 2 );
		add_filter( 'admin_body_class', array( $this, '_filter_add_body_class' ), 10, 2 );
		add_filter( 'the_editor', array( $this, '_filter_add_bitblox_edit_button' ), 10, 2 );
	}

	public static function render( $view, array $args = array() ) {
		return BitBlox_WP_View::get(
			implode( DIRECTORY_SEPARATOR, array( dirname( __FILE__ ), 'views', $view ) ),
			$args
		);
	}

	/**
	 * @internal
	 *
	 * @param WP_Post $post
	 */
	public function _action_bitblox_add_edit_button( $post ) {
		try {
			$post = BitBlox_WP_Post::get( $post->ID );
			echo self::render( 'button', array( 'id' => $post->ID() ) );
		} catch ( Exception $exception ) {

		}
	}

	/**
	 * @internal
	 */
	public function _action_register_static() {
		if ( ! ( $id = get_the_ID() ) ) {
			return;
		}

		try {
			BitBlox_WP_Post::get( $id );
		} catch ( Exception $x ) {
			return;
		}

		wp_enqueue_style(
			bitblox_wp()->get_slug() . '-admin-js',
			bitblox_wp()->get_url( '/admin/static/css/style.css' )
		);
		wp_enqueue_script(
			bitblox_wp()->get_slug() . '-admin-js',
			bitblox_wp()->get_url( '/admin/static/js/script.js' ),
			array( 'jquery', 'underscore' ),
			bitblox_wp()->get_version(),
			true
		);

		wp_localize_script(
			bitblox_wp()->get_slug() . '-admin-js',
			'BitBlox_WP_Admin_Data',
			array(
				'url'     => admin_url( 'admin-ajax.php' ),
				'id'      => get_the_ID(),
				'actions' => array(
					'enable'  => '_bitblox_wp_admin_editor_enable',
					'disable' => '_bitblox_wp_admin_editor_disable',
				)
			)
		);
	}

	public function _action_request_enable() {
		if ( ! isset( $_POST['id'] ) || ! ( $p = get_post( $_POST['id'] ) ) ) {
			wp_send_json_error( array(
				'code'    => 'invalid_request',
				'message' => __( 'Invalid post', bitblox_wp()->get_domain() ),
			) );
			exit();
		}

		try {
			$post = BitBlox_WP_Post::get( $p->ID );

			if ( $p->post_status == 'auto-draft' ) {
				$p->post_status = 'draft';
				wp_update_post( $p );
			}

			wp_send_json_success( array(
				'redirect' => $post->enable_editor()->edit_url()
			) );
		} catch ( BitBlox_WP_Exception $exception ) {
			wp_send_json_error( array(
				'code'    => $exception->getCode(),
				'message' => $exception->getMessage(),
			) );
		}
	}

	public function _action_request_disable() {
		if ( ! isset( $_POST['id'] ) || ! ( $p = get_post( $_POST['id'] ) ) ) {
			wp_send_json_error( array(
				'code'    => 'invalid_request',
				'message' => __( 'Invalid post', bitblox_wp()->get_domain() ),
			) );
			exit();
		}

		try {
			BitBlox_WP_Post::get( $p->ID )->disable_editor();
			wp_send_json_success();
		} catch ( BitBlox_WP_Exception $exception ) {
			wp_send_json_error( array(
				'code'    => $exception->getCode(),
				'message' => $exception->getMessage(),
			) );
		}
	}

	/**
	 * @internal
	 *
	 *
	 * @param int $id
	 **/
	public function _action_update_post_content( $id ) {
		remove_action( 'post_updated', array( $this, '_action_update_post_content' ) );

		try {
			$post = BitBlox_WP_Post::get( $id );

			if ( $post->uses_editor() ) {
				$post->update_html();
			}
		} catch ( BitBlox_WP_Exception_Unsupported_Post_Type $exception ) {
			add_action( 'post_updated', array( $this, '_action_update_post_content' ) );

			return;
		} catch ( Exception $exception ) {
			BitBlox_WP_Flash::add_notice(
				'get-project',
				'<strong>BitBloxWP</strong>: ' . __(
					'Unable to update page content. Please try later',
					bitblox_wp()->get_domain()
				),
				BitBlox_WP_Flash::ERROR
			);
		}

		add_action( 'post_updated', array( $this, '_action_update_post_content' ) );
	}

	/**
	 * @internal
	 *
	 * @param int $id
	 **/
	public function _action_delete_page( $id ) {
		try {
			$post = BitBlox_WP_Post::get( $id );
			BitBlox_WP_User::get()->delete_project( new BitBlox_WP_API_Project(
				$post->get_id(),
				$post->get_page_id()
			) );

			do_action( 'bitblox_wp_delete_post', $id );
		} catch ( Exception $exception ) {
		}
	}

	/**
	 * @internal
	 **/
	public function _action_media_buttons() {
		try {
			$post = BitBlox_WP_Post::get( get_the_ID() );
			if ( $post->can_edit() ) {
				echo self::render( 'button', array( 'id' => $post->ID(), ) );
			}
		} catch ( Exception $exception ) {

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
	public function _filter_add_bitblox_edit_row_actions( $actions, $post ) {
		try {
			$p = BitBlox_WP_Post::get( $post->ID );
			if ( ! $p->uses_editor() ) {
				return $actions;
			}
		} catch ( Exception $exception ) {
			return $actions;
		}

		if ( ! $p->can_edit() ) {
			return $actions;
		}

		$actions['bitblox-edit'] = "<a href='{$p->edit_url()}'>"
		                           . __( 'Edit with BitBlox', bitblox_wp()->get_domain() )
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
			$post = BitBlox_WP_Post::get( $id );
		} catch ( Exception $x ) {
			return $body;
		}

		return $body . ( $post->uses_editor() ? 'bitblox-editor-enabled' : '' );
	}

	/**
	 * @internal
	 *
	 * @param string $data
	 *
	 * @return string
	 **/
	public function _filter_add_bitblox_edit_button( $data ) {
		if ( ! ( $id = get_the_ID() ) ) {
			return;
		}

		try {
			$post = BitBlox_WP_Post::get( $id );
		} catch ( Exception $x ) {
			return;
		}

		return $data . self::render( 'editor', array( 'url' => $post->edit_url() ) );
	}
}
