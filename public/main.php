<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

class Brizy_Public_Main {

	/**
	 * @var Brizy_Editor_Project
	 */
	private $project;

	/**
	 * @var Brizy_Editor_Post
	 */
	private $post;


	/**
	 * @var Twig_Template
	 */
	private $twig_template;

	public function initialize_wordpress_editor() {

		if ( $this->is_editing_page_without_editor() ) {
			add_action( 'admin_bar_menu', array( $this, '_action_add_admin_bar_update_button' ), 9999 );
		}
	}

	public function initialize_front_end() {

		add_filter( 'template_include', array( $this, '_filter_template_include_load_blank_template' ), 1 );

		$is_preview = is_preview() && ! $this->is_editing_page_with_editor();

		if ( $is_preview ) {
			$this->compile_page_before_preview();
		}

		// add the actions for the case when the user edits the page with the editor
		if ( $this->is_editing_page_with_editor() ) {
			//add_action( 'wp_enqueue_scripts', array( $this, '_action_register_editor_static_assets' ) );
			add_action( 'wp_enqueue_scripts', 'wp_enqueue_media' );
			add_filter( 'the_content', array( $this, '_filter_the_content' ), 100 );
			add_action( 'wp_head', array( $this, '_editor_head' ) );
			add_filter( 'show_admin_bar', '__return_false' );
		} elseif ( $this->is_view_page() ) {
			add_action( 'wp_enqueue_scripts', array( $this, '_action_register_page_static_assets' ) );
			add_action( 'wp_print_scripts', array( $this, '_action_register_page_inline_static' ) );
			add_action( 'wp_head', array( $this, '_action_register_other_meta_tags' ) );

			if ( ! $is_preview ) {
				add_filter( 'the_content', array( $this, '_filter_parse_content_for_images' ) );
			} else {
				add_filter( 'the_content', array( $this, '_filter_content_for_preview' ) );
			}
		}
	}

	/**
	 * @param $view
	 * @param array $args
	 */
	public static function render( $view, array $args = array() ) {
		Brizy_Editor_View::render( self::path( "views/$view" ), $args );
	}

	/**
	 * Brizy_Public_Main constructor.
	 *
	 * @param $project
	 * @param $post
	 */
	public function __construct( $project, $post ) {

		$this->project = $project;
		$this->post    = $post;
	}


	/**
	 * @return bool
	 */
	public function is_editing_page_with_editor() {
		return ! is_admin() && current_user_can( 'edit_pages' ) && isset( $_GET[ Brizy_Editor_Constants::EDIT_KEY ] ) && $this->post->uses_editor();
	}

	/**
	 * @return bool
	 */
	public function is_editing_page_without_editor() {
		return is_admin() && current_user_can( 'edit_pages' ) && ( isset( $_REQUEST['post'] ) && $_REQUEST['post'] == $this->post->get_id() );
	}

	/**
	 * @return bool
	 */
	public function is_view_page() {
		return ! is_admin() && $this->post->uses_editor();
	}

	/**
	 * @param $content
	 *
	 * @return string
	 *
	 * @internal
	 */
	function _filter_the_content( $content ) {
		if ( is_singular() && is_main_query() ) {

			$template = $this->getEditorTwigTemplate();

			$config_object = $this->getConfigObject();

			$context = array( 'editorData' => $config_object );

			if(WP_DEBUG)
			    $context['DEBUG'] = true;

			return $template->renderBlock( 'editor_content', $context );
		}

		return $content;
	}

	function _editor_head() {

		$template = $this->getEditorTwigTemplate();

		$context = array( 'editorData' => $this->getConfigObject() );
		if(WP_DEBUG)
			$context['DEBUG'] = true;

		echo  $template->renderBlock( 'header_content', $context );
	}


	/**
	 * @internal
	 */
	function _action_add_admin_bar_update_button() {
		global $wp_admin_bar;

		$wp_admin_bar->add_menu( array(
			'id'    => brizy()->get_slug() . '-post-preview-url',
			'title' => __( 'Preview' ),
			'href'  => get_preview_post_link(),
			'meta'  => array(
				'target' => '_blank'
			)
		) );

		$status = get_post_status( $this->post->get_id() );
		if ( in_array( $status, array( 'publish', 'future', 'private' ) ) ) {
			$wp_admin_bar->add_menu( array(
				'id'    => brizy()->get_slug() . '-post-view-url',
				'title' => __( 'View' ),
				'href'  => get_permalink(),
				'meta'  => array(
					'target' => '_blank'
				)
			) );
		}
	}

	/**
	 * @internal
     * @deprecated not used any more.. the assets are loaded from twig template
	 */
	public function _action_register_editor_static_assets() {

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
			Brizy_Editor_Editor_Editor::get( Brizy_Editor_Project::get(), Brizy_Editor_Post::get( get_the_ID() ) )->enqueue_editor_assets();
		} catch ( Exception $exception ) {
		}
	}

	/**
	 * The problem here is that the post content intended to be shown it is already passed
	 * by wp and what we do here will be available in next preview.
	 *
	 * Compiling the page on every get_item request is not an option as it will add too much load on compiler
	 *
	 * @internal
	 **/
	public function compile_page_before_preview() {

		$this->post->compile_page()->save();

		wp_update_post( array(
			'ID'           => $this->post->get_id(),
			'post_content' => $this->post->get_compiled_html_body(),
		) );

	}

	/**
	 * @internal
	 **/
	public function _action_register_page_static_assets() {

		wp_localize_script( 'jquery', '__SHORTCODES_CONFIG__', array() );

		$brizy_page_head_scripts   = $this->post->get_head_scripts();
		$brizy_page_footer_scripts = $this->post->get_footer_scripts();
		$brizy_page_styles         = $this->post->get_styles();

		foreach ( $brizy_page_head_scripts as $script ) {
			$script->enqueue();
		}

		foreach ( $brizy_page_footer_scripts as $script ) {
			$script->enqueue();
		}

		foreach ( $brizy_page_styles as $style ) {
			$style->enqueue();
		}
	}


	public function _action_register_page_inline_static() {

		$inline_styles = $this->post->get_inline_styles();
		if ( is_array( $inline_styles ) ) {
			foreach ( $inline_styles as $style ) { ?>
                <style type="text/css" rel="stylesheet">
                    <?php echo $style ?>
                </style>
				<?php
			}
		}
	}


	public function _action_register_other_meta_tags() {

		$links = $this->post->get_links_tags();

		if ( is_array( $links ) ) {
			foreach ( $links as $link ) {

				$attrs = array();
				foreach ( $link as $attr => $value ) {
					$attr  = htmlentities( $attr );
					$value = htmlentities( $value );

					$attrs[] = "{$attr}=\"{$value}\"";
				}

				$attrs = implode( ' ', $attrs );

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
	public function _filter_content_for_preview( $content ) {

		return $this->post->get_compiled_html_body();
	}

	/**
	 * @param string $content
	 *
	 * @return mixed
	 */
	public function _filter_parse_content_for_images( $content ) {
		$post_content = $this->post->get_wp_post()->post_content;

		preg_match( Brizy_Config::ASSETS_PATTERN, $post_content, $matches );

		if ( empty( $matches ) ) {
			return $content;
		}

		$image = $matches[0];
		$new   = Brizy_Editor_Asset_MediaUpload::upload( $image );

		$compiled_html_body = str_replace( $image, $new->get_url(), $post_content );

		$this->post->set_compiled_html_body( $compiled_html_body )
		           ->save();

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

	/**
	 * @param string $rel
	 *
	 * @return string
	 */
	public static function path( $rel ) {
		return dirname( __FILE__ ) . "/$rel";
	}

	private function getEditorTwigTemplate() {

		if ( $this->twig_template ) {
			return $this->twig_template;
		}

		$template_path = Brizy_Config::EDITOR_PRIMARY_URL . "/editor.html.twig";

		$loader = new Twig_Loader_Array( [
			'editor' => file_get_contents( $template_path )
		] );


		$twig     = new Twig_Environment( $loader, array() );
		$template = $twig->load( 'editor' );

		return $this->twig_template = $template;
	}

	private function getConfigObject() {
		$editor        = Brizy_Editor_Editor_Editor::get( $this->project, $this->post );
		$config_json   = json_encode( $editor->config() );
		$config_object = json_decode( $config_json );

		return $config_object;
	}
}
