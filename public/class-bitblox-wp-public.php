<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

class BitBlox_WP_Public {

	public static function _init() {
		static $instance;

		if ( ! $instance ) {
			$instance = new self();
		}
	}

	protected function __construct() {
		add_action( 'admin_bar_menu', array( $this, '_action_add_update_button' ), 999 );
		add_action( 'wp_enqueue_scripts', array( $this, '_action_register_static' ) );
		add_action( 'wp_ajax__bitblox_wp_public_update_page', array( $this, '_action_request' ) );
		add_filter( 'template_include', array( $this, '_filter_load_editor' ) );
	}

	/**
	 * @param $template
	 *
	 * @return string
	 *
	 * @internal
	 */
	function _filter_load_editor( $template ) {
		if ( ! is_user_logged_in() || is_admin() || ! bitblox_wp_is_edit_page() ) {
			return $template;
		}

		return implode( DIRECTORY_SEPARATOR, array( dirname( __FILE__ ), 'views', 'template.php' ) );
	}

	/**
	 * @internal
	 *
	 * @param WP_Admin_Bar $wp_admin_bar
	 */
	public function _action_add_update_button( $wp_admin_bar ) {
		if ( ! bitblox_wp_is_edit_page() ) {
			return;
		}

		$args = array(
			'id'    => 'bitblox-wp-public-update',
			'title' => __( 'Update' ),
			'href'  => '#',
			'meta'  => array(
				'class' => 'bitblox-wp-public-update-button',
			)
		);
		$wp_admin_bar->add_node( $args );
	}

	/**
	 * @internal
	 */
	public function _action_register_static() {
		if ( ! bitblox_wp_is_edit_page() ) {
			return;
		}

		wp_enqueue_script(
			bitblox_wp()->get_slug() . '-public-js',
			bitblox_wp()->get_url( '/public/static/js/script.js' ),
			array( 'jquery' ),
			bitblox_wp()->get_version(),
			true
		);

		wp_localize_script(
			bitblox_wp()->get_slug() . '-public-js',
			'BitBlox_WP_Public_Data',
			array(
				'url'    => admin_url( 'admin-ajax.php' ),
				'action' => '_bitblox_wp_public_update_page',
				'id'     => get_the_ID(),
			)
		);
	}

	/**
	 * @internal
	 */
	public function _action_request() {
		if ( ! isset( $_POST['id'] ) ) {
			wp_send_json_error( array(
				'code'    => 'invalid_request',
				'message' => __( 'Invalid request', bitblox_wp()->get_domain() ),
			) );
		}

		try {
			BitBlox_WP_Post::get( $_POST['id'] )->update_html();
		} catch ( BitBlox_WP_Exception $exception ) {
			wp_send_json_error( array(
				'code'    => $exception->getCode(),
				'message' => $exception->getMessage(),
			) );

			return;
		}
		wp_send_json_success();
	}
}
