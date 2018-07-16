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
	 * @var Brizy_Editor_UrlBuilder
	 */
	private $url_builder;


	/**
	 * Brizy_Public_Main constructor.
	 *
	 * @param $project
	 * @param $post
	 */
	public function __construct( $project, $post ) {

		$this->project     = $project;
		$this->post        = $post;
		$this->url_builder = new Brizy_Editor_UrlBuilder( $project, $post );
	}

	public function initialize_wordpress_editor() {

		if ( $this->is_editing_page_without_editor() ) {
			add_action( 'admin_bar_menu', array( $this, '_action_add_admin_bar_update_button' ), 9999 );
		}
	}

	public function initialize_front_end() {

		if ( $this->is_editing_page_with_editor() && Brizy_Editor::is_user_allowed() ) {
			add_action( 'template_include', array( $this, 'template_include' ), 10000 );
		} elseif ( $this->is_editing_page_with_editor_on_iframe() && Brizy_Editor::is_user_allowed() ) {

			add_action( 'wp_enqueue_scripts', array( $this, '_action_enqueue_editor_assets' ) );
			//wp_enqueue_script( 'wp-api' );
			//add_action( 'wp_head', array( $this, 'editor_head' ), 0 );
			add_filter( 'the_content', array( $this, '_filter_the_content' ) );
			add_filter( 'show_admin_bar', '__return_false' );
			add_filter( 'body_class', array( $this, 'body_class_editor' ) );

		} elseif ( $this->is_view_page() ) {

			if ( post_password_required( $this->post->get_wp_post() ) ) {
				return;
			}

			$this->compilePage();

			remove_filter( 'the_content', 'wpautop' );
			// insert the compiled head and content
			add_filter( 'body_class', array( $this, 'body_class_frontend' ) );
			add_action( 'wp_head', array( $this, 'insert_page_head' ) );
			add_filter( 'the_content', array( $this, 'insert_page_content' ), - 10000 );
			add_action( 'admin_bar_menu', array( $this, 'toolbar_link' ), 999 );
		}
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
	 */
	public function _action_enqueue_editor_assets() {
		if (wp_script_is('jquery') === false) {
			wp_register_script('jquery', "/wp-includes/js/jquery/jquery.js");
		}

		wp_enqueue_media();
	}

	public function toolbar_link( $wp_admin_bar ) {
		$type = $this->post->get_wp_post()->post_type;
		$args = array(
			'id'    => 'brizy_Edit_page_link',
			'title' => __( "Edit {$type} with Brizy" ),
			'href'  => $this->post->edit_url(),
			'meta'  => array()
		);
		$wp_admin_bar->add_node( $args );
	}

	public function template_include( $atemplate ) {
		$template_path = self::path( 'views/page.html.twig' );
		$twig_template = $this->getTwigTemplate( $template_path );

		$config_object = $this->getConfigObject();

		$iframe_url = add_query_arg(
			array( Brizy_Editor_Constants::EDIT_KEY_IFRAME => '' ),
			get_permalink( $this->post->get_wp_post()->ID )
		);

		$context = array(
			'editorData' => $config_object,
			'iframe_url' => $iframe_url,
			'page_title' => apply_filters( 'the_title', $this->post->get_wp_post()->post_title )

		);

		if ( defined( 'BRIZY_DEVELOPMENT' ) ) {
			$context['DEBUG'] = true;
		}

		echo $twig_template->render( $context );

		return self::path( 'views/empty.php' );
	}

	public function body_class_frontend( $classes ) {

		$classes[] = 'brz';

		return $classes;
	}

	public function body_class_editor( $classes ) {

		$classes[] = 'brz';
		$classes[] = 'brz-ed';

		return $classes;
	}

	/**
	 * @return bool
	 */
	public function is_editing_page_with_editor() {
		return ! is_admin() && isset( $_GET[ Brizy_Editor_Constants::EDIT_KEY ] ) && $this->post->uses_editor();
	}

	/**
	 * @return bool
	 */
	public function is_editing_page_with_editor_on_iframe() {
		return ! is_admin() && isset( $_GET[ Brizy_Editor_Constants::EDIT_KEY_IFRAME ] ) && $this->post->uses_editor();
	}

	/**
	 * @return bool
	 */
	public function is_editing_page_without_editor() {
		return isset( $_REQUEST['post'] ) && $_REQUEST['post'] == $this->post->get_id();
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

			$template_path = self::path( 'views/editor.html.twig' );

			$twig_template = $this->getTwigTemplate( $template_path );

			$config_object = $this->getConfigObject();

			$context = array( 'editorData' => $config_object );

			if ( WP_DEBUG ) {
				$context['DEBUG'] = true;
			}

			$render_block = $twig_template->render( $context );

			return $render_block;
		}

		return $content;
	}

	function editor_head() {

		$twig_template = $this->getTwigTemplate();

		$config_object = $this->getConfigObject();

		$context = array( 'editorData' => $config_object );

		if ( WP_DEBUG ) {
			$context['DEBUG'] = true;
		}

		echo $twig_template->renderBlock( 'header_content', $context );
	}


//	function _invalidate_editor_assets( $new_version, $old_version ) {
//		$this->project
//			->invalidateAssetsFor( $old_version )
//			->set_template_version( $new_version )
//			->setStoreAssets( true )
//			->save();
//	}


	/**
	 *  Show the compiled page head content
	 */
	public function insert_page_head() {

		if ( ! $this->post->get_compiled_html() ) {

			$compiled_html_head = $this->post->get_compiled_html_head();
			$compiled_html_head = Brizy_SiteUrlReplacer::restoreSiteUrl( $compiled_html_head );

			$this->post->set_needs_compile( true )
			           ->save();

			?>
            <!-- BRIZY HEAD -->
			<?php echo $compiled_html_head; ?>
            <!-- END BRIZY HEAD -->
			<?php

			return;
		}

		$compiled_page = $this->post->get_compiled_page( $this->project );

		$compiled_page->addAssetProcessor( new Brizy_Editor_Asset_StripTagsProcessor( array( '<title>' ) ) );

		$head = $compiled_page->get_head();

		?>
        <!-- BRIZY HEAD -->
		<?php echo $head; ?>
        <!-- END BRIZY HEAD -->
		<?php

		return;
	}

	/**
	 * @param $content
	 *
	 * @return null|string|string[]
	 * @throws Exception
	 */
	public function insert_page_content( $content ) {
		if ( ! $this->post->get_compiled_html() ) {

			$compiled_html_body = $this->post->get_compiled_html_body();
			$content            = Brizy_SiteUrlReplacer::restoreSiteUrl( $compiled_html_body );

			$this->post->set_needs_compile( true )
			           ->save();

			return $content;
		}

		$compiled_page = $this->post->get_compiled_page( $this->project );

		$body = $compiled_page->get_body();

		return $body;
	}

	/**
	 * @param string $rel
	 *
	 * @return string
	 */
	public static function path( $rel ) {
		return dirname( __FILE__ ) . "/$rel";
	}

	private function getTwigTemplate( $template_path = null ) {

		if ( $this->twig_template[ $template_path ] ) {
			return $this->twig_template[ $template_path ];
		}

		$loader = new Twig_Loader_Array( array(
			'editor' => file_get_contents( $template_path )
		) );

		$twig          = new Twig_Environment( $loader, array() );
		$twig_template = $twig->load( 'editor' );

		return $this->twig_template[ $template_path ] = $twig_template;
	}

	private function getConfigObject() {
		$editor        = Brizy_Editor_Editor_Editor::get( $this->project, $this->post );
		$config_json   = json_encode( $editor->config() );
		$config_object = json_decode( $config_json );

		return $config_object;
	}

	private function compilePage() {
		$is_preview    = is_preview() || isset( $_GET['preview'] );
		$needs_compile = ! $this->post->isCompiledWithCurrentVersion() || $this->post->get_needs_compile();

		if ( $is_preview || $needs_compile ) {
			try {
				$this->post->compile_page();

				if ( ! $is_preview && $needs_compile ) {
					$this->post->save();
				}

			} catch ( Exception $e ) {
				Brizy_Logger::instance()->exception( $e );
			}
		}
	}
}
