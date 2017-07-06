<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

class BitBlox_WP_Public {

	private $inline_styles = array();

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
		if ( is_user_logged_in() ) {
			add_action( 'wp_enqueue_scripts', array( $this, '_action_register_static' ) );
			add_action( 'wp_ajax__bitblox_wp_public_update_page', array( $this, '_action_request' ) );
			add_filter( 'the_content', array( $this, '_action_load_editor' ) );
			add_action( 'wp', array( $this, '_action_update_on_preview' ) );
			add_action( 'admin_bar_menu', array( $this, '_action_add_admin_bar_update_button' ), 9999 );
			add_action( 'wp_print_scripts', array( $this, '_action_preview_inline_styles' ) );
		}
		add_action( 'wp_enqueue_scripts', array( $this, '_action_register_page_static' ) );
		add_action( 'wp_print_scripts', array( $this, '_action_register_page_inline_static' ) );
		add_filter( 'the_content', array( $this, '_filter_parse_content_for_images' ) );
		add_filter( 'template_include', array( $this, '_filter_template_include_load_blank_template' ), 1 );

		foreach ( bitblox_wp()->supported_post_types() as $type ) {
			add_filter( "theme_{$type}_templates", array( $this, '_filter_register_page_templates' ) );
		}
	}

	/**
	 * @param $content
	 *
	 * @return string
	 *
	 * @internal
	 */
	function _action_load_editor( $content ) {
		if ( ! is_user_logged_in() || is_admin() || ! bitblox_wp_is_edit_page() ) {
			return $content;
		}

		try {
			$post = BitBlox_WP_Post::get( get_the_ID() );
		} catch ( Exception $exception ) {
			return $content;
		}

		$editor = new BitBlox_WP_Editor( $post->ID(), $post->get_id() );
		$editor->load();
		BitBlox_WP_Public::render( 'editor' );

		return BitBlox_WP_View::get( self::path( 'views/template' ) );
	}

	/**
	 * @internal
	 */
	function _action_add_admin_bar_update_button() {
		global $wp_admin_bar;
		if ( ! is_user_logged_in() || is_admin() || ! bitblox_wp_is_edit_page() ) {
			return;
		}

		try {
			BitBlox_WP_Post::get( get_the_ID() );
		} catch ( Exception $exception ) {
			return;
		}

		$wp_admin_bar->add_menu( array(
			'id'    => bitblox_wp()->get_slug() . '-post-preview-url',
			'title' => __( 'Preview' ),
			'href'  => get_preview_post_link(),
			'meta'  => array(
				'target' => '_blank'
			)
		) );
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
		global $post;
		if ( ! is_preview() ) {
			return;
		}

		try {
			$p = BitBlox_WP_Post::get( get_the_ID() );
		} catch ( Exception $exception ) {
			return;
		}

		$html = $p->get_draft_html();

		$post->post_content = $html->get_content();

		foreach ( $html->get_links() as $item ) {
			wp_enqueue_style(
				uniqid( 'bitblox-wp-post-preview' ),
				$item
			);
		}

		$tmp = 'jquery';
		wp_localize_script( 'jquery', '__SHORTCODES_CONFIG__', array() );
		foreach ( $html->get_scripts() as $item ) {
			$id = uniqid( 'bitblox-wp-post-preview' );
			wp_enqueue_script( $id, $item, array( $tmp ), false, true );
			$tmp = $id;
		}

		$this->inline_styles = $html->get_styles();
	}

	/**
	 * @internal
	 */
	function _action_preview_inline_styles() {
		foreach ( $this->inline_styles as $inline_style ) {
			echo "<style type='text/css'>$inline_style</style>";
		}
	}

	/**
	 * @internal
	 **/
	public function _action_register_page_static() {
		if ( is_preview() ) {
			return;
		}
		try {
			$post = BitBlox_WP_Post::get( get_the_ID() );
			if ( ! $post->uses_editor() ) {
				return;
			}
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
		if ( is_preview() ) {
			return;
		}
		try {
			$post = BitBlox_WP_Post::get( get_the_ID() );
			if ( ! $post->uses_editor() ) {
				return;
			}
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
		if ( is_preview() ) {
			return $content;
		}

		try {
			$p = BitBlox_WP_Post::get( get_the_ID() );

			if ( ! $p->uses_editor() ) {
				return $content;
			}

			$post_content = $p->get_wp_post()->post_content;
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
			'ID'           => $p->ID(),
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
