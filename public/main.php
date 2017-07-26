<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

class Brizy_Public_Main {

	private $inline_styles = array();

	public static function _init() {
		static $instance;

		if ( ! $instance ) {
			$instance = new self();
		}
	}

	public static function render( $view, array $args = array() ) {
		Brizy_Editor_View::render( self::path( "views/$view" ), $args );
	}

	protected function __construct() {
		if ( ! is_admin() && is_user_logged_in() ) {
			add_action( 'wp', array( $this, '_action_register_static' ) );
			add_action( 'wp_ajax__brizy_public_update_page', array( $this, '_action_request' ) );
			add_filter( 'the_content', array( $this, '_action_load_editor' ) );
			add_action( 'wp', array( $this, '_action_update_on_preview' ) );
			add_action( 'admin_bar_menu', array( $this, '_action_add_admin_bar_update_button' ), 9999 );
			add_action( 'wp_print_scripts', array( $this, '_action_preview_inline_styles' ) );
		}
		add_action( 'wp_enqueue_scripts', array( $this, '_action_register_page_static' ) );
		add_action( 'wp_print_scripts', array( $this, '_action_register_page_inline_static' ) );
		add_action( 'wp_head', array( $this, '_action_register_other_meta_tags' ) );
		add_filter( 'the_content', array( $this, '_filter_parse_content_for_images' ) );
		add_filter( 'template_include', array( $this, '_filter_template_include_load_blank_template' ), 1 );
	}

	/**
	 * @param $content
	 *
	 * @return string
	 *
	 * @internal
	 */
	function _action_load_editor( $content ) {
		if ( ! is_user_logged_in() || is_admin() || ! brizy_is_edit_page() ) {
			return $content;
		}

		return Brizy_Editor_View::get( self::path( 'views/template' ) );
	}

	/**
	 * @internal
	 */
	function _action_add_admin_bar_update_button() {
		global $wp_admin_bar;
		if ( ! is_user_logged_in() || is_admin() || ! brizy_is_edit_page() ) {
			return;
		}

		try {
			Brizy_Editor_Post::get( get_the_ID() );
		} catch ( Exception $exception ) {
			return;
		}

		$wp_admin_bar->add_menu( array(
			'id'    => brizy()->get_slug() . '-post-preview-url',
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
		if ( ! brizy_is_edit_page() ) {
			return;
		}

		wp_enqueue_style(
			brizy()->get_slug() . '-public-editor-style',
			brizy()->get_url( '/public/static/css/style.css' )
		);
		wp_enqueue_script(
			brizy()->get_slug() . '-public-js',
			brizy()->get_url( '/public/static/js/script.js' ),
			array( 'jquery' ),
			brizy()->get_version(),
			true
		);

		wp_localize_script(
			brizy()->get_slug() . '-public-js',
			'Brizy_Public_Data',
			array(
				'url'    => admin_url( 'admin-ajax.php' ),
				'action' => '_brizy_public_update_page',
				'id'     => get_the_ID(),
			)
		);

		try {
			Brizy_Editor_Editor_Editor::get( Brizy_Editor_Post::get( get_the_ID() ) )->load();
		} catch ( Exception $exception ) {
			return;
		}


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
			$p = Brizy_Editor_Post::get( get_the_ID() );
		} catch ( Exception $exception ) {
			return;
		}

		$html = $p->get_html();

		$post->post_content = $html->get_body()->get_content();

		foreach ( $html->get_links_tags() as $item ) {
			wp_enqueue_style(
				uniqid( 'brizy-post-preview' ),
				$item
			);
		}

		$tmp = 'jquery';
		wp_localize_script( 'jquery', '__SHORTCODES_CONFIG__', array() );
		foreach ( $html->get_scripts() as $item ) {
			$id = uniqid( 'brizy-post-preview' );
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
		if ( is_preview() || brizy_is_edit_page() ) {
			return;
		}
		try {
			$post = Brizy_Editor_Post::get( get_the_ID() );
			if ( ! $post->uses_editor() ) {
				return;
			}
		} catch ( Exception $exception ) {
			return;
		}

		wp_localize_script( 'jquery', '__SHORTCODES_CONFIG__', array() );

		$brizy_editor_resources_static_scripts = $post->get_scripts();

		foreach ( $brizy_editor_resources_static_scripts as $script ) {
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
		if ( is_preview() || brizy_is_edit_page() ) {
			return;
		}
		try {
			$post = Brizy_Editor_Post::get( get_the_ID() );
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

	public function _action_register_other_meta_tags() {
		if ( is_preview() || brizy_is_edit_page() ) {
			return;
		}
		try {
			$post = Brizy_Editor_Post::get( get_the_ID() );
			if ( ! $post->uses_editor() ) {
				return;
			}
		} catch ( Exception $exception ) {
			return;
		}

		$links = $post->get_links_tags();


		if ( is_array( $links ) ) {
			foreach ( $links as $link ) {

				$attrs = array();
				foreach ( $link as $attr => $value ) {
					$attr  = htmlentities( $attr );
					$value = htmlentities( $value );

					$attrs[] = "{$attr}=\"{$value}\"";
				}

				$attrs = implode(' ',$attrs);

				echo "<link {$attrs}/>";

			}


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
		if ( is_preview() || brizy_is_edit_page() ) {
			return $content;
		}

		try {
			$p = Brizy_Editor_Post::get( get_the_ID() );

			if ( ! $p->uses_editor() ) {
				return $content;
			}

			$post_content = $p->get_wp_post()->post_content;
		} catch ( Exception $exception ) {
			return $content;
		}
		//$pattern = '/(https?:\/\/static.bitblox.xyz\/storage\/media[a-z|0-9|\/|\*|\.]+\.[png|gif|bmp|jpg|jpeg]+)/i';

        $pattern = '/(https?:\/\/bitblox.dev\/assets\/[a-z|0-9|\/|\*|\.]+\.[png|gif|bmp|jpg|jpeg]+)/i';
		preg_match( $pattern, $post_content, $matches );

		if ( empty( $matches ) ) {
			return $content;
		}

		$image = $matches[0];
		$new   = Brizy_Editor_Asset_MediaUpload::upload( $image );

		wp_update_post( array(
			'ID'           => $p->ID(),
			'post_content' => str_replace( $image, $new->get_url(), $post_content ),
		) );

		return str_replace( $image, $new->get_url(), $content );
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

		return $post_template === 'brizy-blank-template.php'
			? self::path( 'views/templates/brizy-blank-template.php' )
			: $template;
	}

	protected static function path( $rel ) {
		return dirname( __FILE__ ) . "/$rel";
	}
}
