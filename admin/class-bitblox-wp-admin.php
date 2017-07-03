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
			add_action( 'wp_ajax__bitblox_wp_admin_editor', array( $this, '_action_request' ) );

			return;
		}

		//add_action( 'post_submitbox_minor_actions', array( $this, '_action_bitblox_add_edit_button' ) );
		add_action( 'admin_enqueue_scripts', array( $this, '_action_register_static' ) );
		add_action( 'post_updated', array( $this, '_action_update_post_content' ) );
		add_action( 'before_delete_post', array( $this, '_action_delete_page' ) );
		add_action( 'media_buttons', array( $this, '_action_media_buttons' ) );
		add_filter( 'page_row_actions', array( $this, '_filter_add_bitblox_edit_n_row_actions' ), 10, 2 );
	}

	public static function render( $view, array $args = array() ) {
		ob_start();
		extract( $args );
		include "views/$view.php";

		return ob_get_clean();
	}

	/**
	 * @internal
	 *
	 * @param WP_Post $post
	 */
	public function _action_bitblox_add_edit_button( $post ) {
		try {
			$post = new BitBlox_WP_Page( $post->ID );
			echo self::render( 'button', array( 'id' => $post->get_id() ) );
		} catch ( Exception $exception ) {

		}
	}

	/**
	 * @internal
	 */
	public function _action_register_static() {
		wp_enqueue_script(
			bitblox_wp()->get_slug() . '-admin-js',
			bitblox_wp()->get_url( '/admin/static/js/script.js' ),
			array( 'jquery' ),
			bitblox_wp()->get_version(),
			true
		);

		wp_localize_script(
			bitblox_wp()->get_slug() . '-admin-js',
			'BitBlox_WP_Admin_Data',
			array(
				'url'    => admin_url( 'admin-ajax.php' ),
				'action' => '_bitblox_wp_admin_editor'
			)
		);
	}

	public function _action_request() {
		if ( ! isset( $_POST['id'] ) || ! ( $p = get_post( $_POST['id'] ) ) ) {
			wp_send_json_error( array(
				'code'    => 'invalid_request',
				'message' => __( 'Invalid post', bitblox_wp()->get_domain() ),
			) );
			exit();
		}

		try {
			$post = new BitBlox_WP_Page( $p->ID );

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

	/**
	 * @internal
	 *
	 *
	 * @param int $id
	 **/
	public function _action_update_post_content( $id ) {
		remove_action( 'post_updated', array( $this, '_action_update_post_content' ) );

		try {
			BitBlox_WP_Page::get( $id )->update_html();
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
			$post = BitBlox_WP_Page::get( $id );

			if ( $post->has_project() ) {
				BitBlox_WP_User::get()->delete_project( $post->get_project() );
			}

			do_action( 'bitblox_wp_delete_post', $id );
		} catch ( Exception $exception ) {
		}
	}

	/**
	 * @internal
	 **/
	public function _action_media_buttons() {
		try {
			$post = new BitBlox_WP_Page( get_the_ID() );
			if ( $post->can_edit() ) {
				echo self::render( 'button', array( 'id' => $post->get_id() ) );
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
	public function _filter_add_bitblox_edit_n_row_actions( $actions, $post ) {
		try {
			$p = BitBlox_WP_Page::get( $post->ID );
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
}
