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
		//add_filter( 'the_content', array( $this, '_filter_parse_content_for_images' ) );
		add_filter( 'template_include', array( $this, '_filter_template_include_load_blank_template' ), 1 );

		foreach ( bitblox_wp()->supported_post_types() as $type ) {
			add_filter( "theme_{$type}_templates", array( $this, '_filter_register_page_templates' ) );
		}
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

		wp_localize_script( 'jquery', '__SHORTCODES_CONFIG__', array() );

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

	/**
	 * @internal
	 *
	 * @param string $content
	 *
	 * @return string
	 **/
	public function _filter_parse_content_for_images( $content ) {
		try {
			$post         = BitBlox_WP_Post::get( get_the_ID() );
			$post_content = $post->get_post()->post_content;
		} catch ( Exception $exception ) {
			return $content;
		}
		$pattern = '/(https?:\/\/static.bitblox.xyz\/storage\/media[a-z|0-9|\/|\*|\.]+\.[png|gif|bmp|jpg|jpeg]+)/i';
		preg_match( $pattern, $post_content, $matches );

		if ( empty( $matches ) ) {
			return $content;
		}

		$image = $matches[0];
		$new   = BitBlox_WP_Media_Upload::upload( $image );

		wp_update_post( array(
			'ID'           => $post->get_id(),
			'post_content' => str_replace( $image, $new->get_url(), $post_content ),
		) );

		return str_replace( $image, $new->get_url(), $content );
	}

	/**
	 * @internal
	 *
	 * @param array $templates
	 *
	 * @return array
	 **/
	public function _filter_register_page_templates( $templates ) {
		return array_merge( $templates,
			array(
				'bitblox-wp-blank-template.php' => __( 'Blank', bitblox_wp()->get_domain() )
			) );
	}

	/**
	 * @internal
	 *
	 * @param string $template
	 *
	 * @return string
	 **/
	public function _filter_template_include_load_blank_template( $template ) {
		$post_template = get_post_meta( get_the_ID(), '_wp_page_template', true );

		return $post_template === 'bitblox-wp-blank-template.php'
			? self::path( 'views/templates/bitblox-wp-blank-template.php' )
			: $template;
	}

	protected static function path( $rel ) {
		return dirname( __FILE__ ) . "/$rel";
	}
}
