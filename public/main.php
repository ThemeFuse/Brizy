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

	public function initialize_wordpress_editor() {

		if ( $this->is_editing_page_without_editor() ) {
			add_action( 'admin_bar_menu', array( $this, '_action_add_admin_bar_update_button' ), 9999 );
		}
	}

	public function initialize_front_end() {

		$is_preview = is_preview() && ! $this->is_editing_page_with_editor();

		if ( $is_preview ) {
			$this->compile_page_before_preview();
		}

		// add the actions for the case when the user edits the page with the editor
		if ( $this->is_editing_page_with_editor() && Brizy_Editor::is_user_allowed() ) {
			add_action( 'wp_enqueue_scripts', 'wp_enqueue_media' );
			add_action( 'wp_head', array( $this, '_editor_head' ) );
			add_filter( 'the_content', array( $this, '_filter_the_content' ), 100 );
			add_filter( 'show_admin_bar', '__return_false' );
		} elseif ( $this->is_view_page() ) {

            // compile page before showing..
			$this->post
				->compile_page()
				->save();

			// insert the compiled head and content
			add_action( 'wp_head', array( $this, 'insert_page_head' ) );
			add_filter( 'the_content', array( $this, 'insert_page_content' ) );
		}
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

			if ( WP_DEBUG ) {
				$context['DEBUG'] = true;
			}

			$render_block = $template->renderBlock( 'editor_content', $context );

			return $render_block;
		}

		return $content;
	}

	function _editor_head() {

		$template = $this->getEditorTwigTemplate();

		$context = array( 'editorData' => $this->getConfigObject() );
		if ( WP_DEBUG ) {
			$context['DEBUG'] = true;
		}

		$render_block = $template->renderBlock( 'header_content', $context );
		echo $render_block;
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
	 *  Show the compiled page head content
	 */
	public function insert_page_head( ) {

		$compiled_html_head = $this->post->get_compiled_html_head();
		echo $compiled_html_head;
	}

	/** @internal
	 *
	 * @param string $content
	 *
	 * @return string
	 **/
	public function insert_page_content( $content ) {

		return $this->post->get_compiled_html_body();
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

		$template_path = Brizy_Config::EDITOR_STATIC_URL . "/editor.html.twig";

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
