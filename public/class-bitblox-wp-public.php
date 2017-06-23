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

	public static function render( $view, array $args = array() ) {
		BitBlox_WP_View::render( self::path( "views/$view" ), $args );
	}

	protected function __construct() {
		add_action( 'wp_enqueue_scripts', array( $this, '_action_register_static' ) );
		add_action( 'wp_enqueue_scripts', array( $this, '_action_register_page_static' ) );
		add_action( 'wp_print_scripts', array( $this, '_action_register_page_inline_static' ) );
		add_action( 'wp', array( $this, '_action_update_on_preview' ) );
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
	 **/
	public function _action_update_on_preview() {
		if ( ! is_preview() ) {
			return;
		}

		try {
			$post = BitBlox_WP_Post::get( get_the_ID() );
			$post->update_html();
		} catch ( Exception $exception ) {

		}
	}

	/**
	 * @internal
	 **/
	public function _action_register_page_static() {
		try {
			$post = BitBlox_WP_Post::get( get_the_ID() );
		} catch ( Exception $exception ) {
			return;
		}

		foreach ( $post->get_scripts() as $script ) {
			$script->enqueue();
		}
		foreach ( $post->get_styles() as $style ) {
			$style->enqueue();
		}
	}

	/**
	 * @internal
	 **/
	public function _action_register_page_inline_static() {
		try {
			$post = BitBlox_WP_Post::get( get_the_ID() );
		} catch ( Exception $exception ) {
			return;
		}

		foreach ( $post->get_inline_styles() as $style ) { ?>
            <style type="text/css" rel="stylesheet">
                <?php echo $style ?>
            </style>
			<?php
		}
	}

	protected static function path( $rel ) {
		return dirname( __FILE__ ) . "/$rel";
	}
}
