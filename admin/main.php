<?php

if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

class Brizy_Admin_Main {

	public static function instance() {
		static $instance;

		if ( ! $instance ) {
			$instance = new self();
		}

		return $instance;
	}

	/**
	 * Brizy_Admin_Main constructor.
	 */
	protected function __construct() {

		if ( ! Brizy_Editor::is_user_allowed() ) {
			return;
		}

		// watch all supported posts and create meta revisions
		$metaManager = new Brizy_Admin_Post_RevisionManager();
		$metaManager->addMonitor( new Brizy_Admin_Post_BrizyPostsMonitor() );
		$metaManager->addMonitor( new Brizy_Admin_Post_ProjectPostMonitor() );

		// enqueue admin scripts
		add_action( 'admin_enqueue_scripts', array( $this, 'action_register_static' ) );

		if ( current_user_can( Brizy_Admin_Capabilities::CAP_EDIT_WHOLE_PAGE ) || Brizy_Editor::is_administrator() ) {
			add_action( 'admin_post__brizy_admin_editor_enable', array(
				$this,
				'action_request_enable'
			) ); // enable editor for a post
			add_action( 'admin_post__brizy_admin_editor_disable', array(
				$this,
				'action_request_disable'
			) ); // disable editor for a post
			add_action( 'admin_post__brizy_change_template', array(
				$this,
				'action_change_template'
			) ); // action to change template from editor

			add_action( 'edit_form_after_title', array(
				$this,
				'action_add_enable_disable_buttons'
			) ); // add button to enable disable editor
		}

		add_action( 'before_delete_post', array( $this, 'action_delete_page' ) );

		add_filter( 'page_row_actions', array( $this, 'filter_add_brizy_edit_row_actions' ), 10, 2 );
		add_filter( 'post_row_actions', array( $this, 'filter_add_brizy_edit_row_actions' ), 10, 2 );
		add_filter( 'admin_body_class', array( $this, 'filter_add_body_class' ), 10, 2 );

		add_action( 'admin_head', array( $this, 'hide_editor' ) );
		add_action( 'brizy_global_data_updated', array( $this, 'global_data_updated' ) );
		add_filter( 'plugin_action_links_' . BRIZY_PLUGIN_BASE, array( $this, 'plugin_action_links' ) );
		add_filter( 'display_post_states', array( $this, 'display_post_states' ), 10, 2 );

		//add_filter( 'save_post', array( $this, 'save_post' ), 10, 2 );

		add_filter( 'wp_import_existing_post', array( $this, 'handleNewProjectPostImport' ), 10, 2 );
		add_filter( 'wp_import_post_meta', array( $this, 'handleNewProjectMetaImport' ), 10, 3 );

		add_filter( 'save_post', array( $this, 'save_focal_point' ), 10, 2 );

		add_filter( 'admin_post_thumbnail_html', array( $this, 'addFocalPoint' ), 10, 3 );

	}

	public function addFocalPoint( $content, $postId, $thumbId ) {

		if ( ! $thumbId ) {
			return $content;
		}

		$post             = get_post( $postId );
		$post_type_object = get_post_type_object( $post->post_type );

		$twigEngine = Brizy_TwigEngine::instance( BRIZY_PLUGIN_PATH . "/admin/views/" );

		$focalPoint = get_post_meta( $postId, 'brizy_attachment_focal_point', true );

		if ( ! $focalPoint ) {
			$focalPoint = array( 'x' => 50, 'y' => 50 );
		}

		$params = array(
			'focalPoint'        => $focalPoint,
			'thumbnailId'       => $thumbId,
			'thumbnailSrc'      => wp_get_attachment_image_src( $thumbId, 'original' ),
			'postId'            => $postId,
			'edit_update_label' => __( 'Edit or Update Image' ),
			'remove_label'      => $post_type_object->labels->remove_featured_image,
			'pluginUrl'         => BRIZY_PLUGIN_URL
		);


		return $twigEngine->render( 'featured-image.html.twig', $params );

		return $content;
	}

	/**
	 * @param int $post
	 */
	public function action_delete_page( $post = null ) {
		try {

			if ( wp_is_post_autosave( $post ) || wp_is_post_revision( $post ) ) {
				return;
			}


			$bpost = Brizy_Editor_Post::get( $post );

			$urlBuilder = new Brizy_Editor_UrlBuilder( Brizy_Editor_Project::get(), $bpost->get_parent_id() );

			$pageUploadPath = $urlBuilder->page_upload_path( "assets/images" );

			Brizy_Admin_FileSystem::deleteAllDirectories( $pageUploadPath );

			$pageUploadPath = $urlBuilder->page_upload_path( "assets/icons" );

			Brizy_Admin_FileSystem::deleteFilesAndDirectory( $pageUploadPath );


		} catch ( Exception $e ) {
			// ignore this.
		}
	}

	/**
	 * @param array $post_states
	 * @param WP_Post $post
	 *
	 * @return mixed
	 */
	public function display_post_states( $post_states, $post ) {
		try {
			$b_post = Brizy_Editor_Post::get( $post->ID );

			if ( $b_post->uses_editor() ) {
				$post_states['brizy'] = __( Brizy_Editor::get()->get_name() );
			}
		} catch ( Exception $e ) {
			// ignore this.
		}

		return $post_states;
	}

//	public function save_post( $post_id, $post ) {
//		try {
//
//			$brizy_post = null;
//
//			$parent_id = wp_is_post_revision( $post_id );
//
//			if ( $parent_id ) {
//				$brizy_post = Brizy_Editor_Post::get( $parent_id );
//
//				if ( $brizy_post->uses_editor() ) {
//					$brizy_post->save( $post_id );
//				}
//			}
//
//		} catch ( Exception $e ) {
//			Brizy_Logger::instance()->exception( $e );
//
//			return;
//		}
//	}


	/**
	 * @param $post_id
	 * @param $post
	 */
	public function save_focal_point( $post_id, $post ) {
		try {

			if ( $post_id && isset( $_REQUEST['_thumbnail_focal_point_x'] ) && isset( $_REQUEST['_thumbnail_focal_point_y'] ) ) {
				update_post_meta( $post_id, 'brizy_attachment_focal_point', array(
					'x' => (int) $_REQUEST['_thumbnail_focal_point_x'],
					'y' => (int) $_REQUEST['_thumbnail_focal_point_y']
				) );
			} else {
				delete_post_meta( $post_id, 'brizy_attachment_focal_point' );
			}

		} catch ( Exception $e ) {
			Brizy_Logger::instance()->exception( $e );

			return;
		}
	}

	public function hide_editor() {

		$post_type = get_post_type();
		if ( in_array( $post_type, Brizy_Editor::get()->supported_post_types() ) ) {
			$p = get_post();

			try {
				$is_using_brizy = Brizy_Editor_Post::get( $p->ID )->uses_editor();
			} catch ( Exception $e ) {
				$is_using_brizy = false;
			}

			if ( $is_using_brizy ) {
				//remove_post_type_support( $post_type, 'editor' );

				// hide the default editor
				add_filter( 'the_editor', function ( $editor_html ) {
					$args = func_get_args();

					if ( strpos( $editor_html, 'id="wp-content-editor-container"' ) !== false ) {
						return "<div style='display: none'>{$editor_html}</div>";
					}

					return $editor_html;
				} );
			}
		}
	}

	public function plugin_action_links( $links ) {
		$settings_link = sprintf( '<a href="%s">%s</a>', admin_url( 'admin.php?page=' . Brizy_Admin_Settings::menu_slug() ), __( 'Settings', 'brizy' ) );
		array_unshift( $links, $settings_link );

		if ( ! class_exists( 'BrizyPro_Main' ) ) {

			$links['go_pro'] = sprintf(
				'<a href="%1$s" target="_blank" style="color:#39b54a;font-weight:700;">%2$s</a>',
				Brizy_Config::GO_PRO_DASHBOARD_URL,
				__( 'Go Pro', 'brizy' )
			);
		}

		return $links;
	}

	/**
	 * @internal
	 */
	public function action_register_static() {

		wp_enqueue_style(
			Brizy_Editor::get()->get_slug() . '-admin-css',
			Brizy_Editor::get()->get_url( 'admin/static/css/style.css' ),
			array(),
			true
		);
		wp_enqueue_style(
			Brizy_Editor::get()->get_slug() . '-select2',
			'https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.6-rc.0/css/select2.min.css',
			array(),
			true
		);

		wp_enqueue_script(
			Brizy_Editor::get()->get_slug() . '-admin-js',
			Brizy_Editor::get()->get_url( 'admin/static/js/script.js' ),
			array( 'jquery', 'underscore' ),
			Brizy_Editor::get()->get_version(),
			true
		);

		wp_enqueue_script(
			Brizy_Editor::get()->get_slug() . '-admin-featured-image-js',
			Brizy_Editor::get()->get_url( 'admin/static/js/featured-image.js' ),
			array( 'jquery', 'underscore' ),
			Brizy_Editor::get()->get_version(),
			true
		);

		$get_post_focal = get_post_meta( get_the_ID(), 'brizy_attachment_focal_point', true );
		wp_localize_script(
			Brizy_Editor::get()->get_slug() . '-admin-js',
			'Brizy_Admin_Data',
			array(
				'url'         => set_url_scheme( admin_url( 'admin-ajax.php' ) ),
				'pluginUrl'   => BRIZY_PLUGIN_URL,
				'ruleApiHash' => wp_create_nonce( Brizy_Admin_Rules_Api::nonce ),
				'id'          => get_the_ID(),
				'page'        => array(
					'focalPoint' => $get_post_focal ? $get_post_focal : array( 'x' => 50, 'y' => 50 )
				),
				'actions'     => array(
					'enable'  => '_brizy_admin_editor_enable',
					'disable' => '_brizy_admin_editor_disable',
				)
			)
		);
	}

	/**
	 * @internal
	 */
	public function action_request_enable() {

		if ( ! isset( $_REQUEST['post'] ) || ! ( $p = get_post( (int) $_REQUEST['post'] ) ) ) {
			Brizy_Admin_Flash::instance()->add_error( 'Invalid Request.' );
			wp_redirect( $_SERVER['HTTP_REFERER'] );
			exit();
		}

		try {
			$this->enable_brizy_for_post( $p );
		} catch ( Exception $e ) {
			Brizy_Admin_Flash::instance()->add_error( 'Unable to create the page. Please try again later.' );
			wp_redirect( $_SERVER['HTTP_REFERER'] );
		}
	}

	/**
	 * @internal
	 */
	public function action_request_disable() {
		if ( ! isset( $_REQUEST['post'] ) || ! ( $p = get_post( $_REQUEST['post'] ) ) ) {
			Brizy_Admin_Flash::instance()->add_error( 'Invalid Request.' );
			wp_redirect( $_SERVER['HTTP_REFERER'] );
			exit();
		}

		try {
			Brizy_Editor_Post::get( $p->ID )
			                 ->disable_editor()
			                 ->save();
		} catch ( Brizy_Editor_Exceptions_Exception $exception ) {
			Brizy_Admin_Flash::instance()->add_error( 'Unable to disabled the editor. Please try again later.' );
		}
		wp_redirect( $_SERVER['HTTP_REFERER'] );
	}

	public function action_change_template() {
		if ( ! isset( $_REQUEST['post'] ) || ! isset( $_REQUEST['template'] ) || ! ( $p = get_post( $_REQUEST['post'] ) ) ) {
			Brizy_Admin_Flash::instance()->add_error( 'Invalid Request.' );
			wp_redirect( $_SERVER['HTTP_REFERER'] );
			exit();
		}

		try {
			Brizy_Editor_Post::get( $p->ID )->set_template( $_REQUEST['template'] );
			wp_redirect( Brizy_Editor_Post::get( $p->ID )->edit_url() );
		} catch ( Brizy_Editor_Exceptions_Exception $exception ) {
			Brizy_Admin_Flash::instance()->add_error( 'Unable to disabled the editor. Please try again later.' );
		}
	}

	/**
	 * @internal
	 **/
	public function action_add_enable_disable_buttons() {
		$get_post_type        = get_post_type();
		$supported_post_types = Brizy_Editor::get()->supported_post_types();
		if ( in_array( $get_post_type, $supported_post_types ) ) {
			$p = get_post();

			try {
				$is_using_brizy = Brizy_Editor_Post::get( $p->ID )->uses_editor();
			} catch ( Exception $e ) {
				$is_using_brizy = false;
			}

			echo Brizy_Admin_View::render( 'button', array(
				'id'             => get_the_ID(),
				'post'           => $p,
				'is_using_brizy' => $is_using_brizy,
				'url'            => add_query_arg(
					array( Brizy_Editor_Constants::EDIT_KEY => '' ),
					get_permalink( get_the_ID() )
				)
			) );
		}
	}

	/**
	 * @param array $actions
	 * @param WP_Post $post
	 *
	 * @return array
	 **@internal
	 *
	 */
	public function filter_add_brizy_edit_row_actions( $actions, $post ) {

		$is_allowed = Brizy_Editor::is_user_allowed();

		if ( ! $is_allowed || ! in_array( get_post_type(), Brizy_Editor::get()->supported_post_types() ) ) {
			return $actions;
		}

		try {
			$p = Brizy_Editor_Post::get( $post->ID );
			if ( $p->uses_editor() ) {
				$actions['brizy-edit'] = "<a href='{$p->edit_url()}'>"
				                         . __( 'Edit with ' . __bt( 'brizy', 'Brizy' ), 'brizy' )
				                         . "</a>";
			}
		} catch ( Exception $exception ) {
			$t = 0;
		}

		return $actions;
	}

	/**
	 * @param string $body
	 *
	 * @return string
	 **@internal
	 *
	 */
	public function filter_add_body_class( $body ) {
		if ( ! ( $id = get_the_ID() ) ) {
			return $body;
		}

		try {
			$post = Brizy_Editor_Post::get( $id );
		} catch ( Exception $x ) {
			return $body;
		}

		return $body . ( $post->uses_editor() ? ' brizy-editor-enabled ' : '' );
	}

	/**
	 * @param $p
	 *
	 * @throws Brizy_Editor_Exceptions_UnsupportedPostType
	 * @throws Exception
	 */
	private function enable_brizy_for_post( $p ) {

		$post = null;

		// obtain the post
		try {
			$post = Brizy_Editor_Post::get( $p->ID );
		} catch ( Exception $exception ) {
			$project = Brizy_Editor_Project::get();
			$post    = Brizy_Editor_Post::create( $project, $p );
		}

		if ( ! $post ) {
			Brizy_Admin_Flash::instance()->add_error( 'Failed to enable the editor for this post.' );
			wp_redirect( $_SERVER['HTTP_REFERER'] );
		}

		try {

			$update_post = false;

			if ( $p->post_status == 'auto-draft' ) {
				$p->post_status = 'draft';
				$update_post    = true;
			}

			if ( $p->post_title == __( 'Auto Draft' ) ) {
				$p->post_title = __bt( 'brizy', 'Brizy' ) . ' #' . $p->ID;
				$update_post   = true;
			}

			if ( false === strpos( $p->post_content, 'brz-root__container' ) ) {
				$p->post_content .= '<div class="brz-root__container"></div>';
				$update_post     = true;
			}

			if ( $update_post ) {
				wp_update_post( $p );
			}

			$post->enable_editor();
			$post->set_template( Brizy_Config::BRIZY_BLANK_TEMPLATE_FILE_NAME );
			$post->set_plugin_version( BRIZY_VERSION );
			$post->save();

			// redirect
			wp_redirect( $post->edit_url() );

		} catch ( Exception $exception ) {

			Brizy_Admin_Flash::instance()->add_error( 'Failed to enable the editor for this post.' );
			wp_redirect( $_SERVER['HTTP_REFERER'] );
		}

		exit;
	}

	public function handleNewProjectPostImport( $existing, $post ) {

		if ( $post['post_type'] == Brizy_Editor_Project::BRIZY_PROJECT ) {

			$currentProject        = Brizy_Editor_Project::get();
			$currentProjectGlobals = $currentProject->getDecodedData();
			$currentProjectPostId  = $currentProject->getWpPost()->ID;
			$currentProjectStorage = Brizy_Editor_Storage_Project::instance( $currentProjectPostId );

			$projectMeta = null;

			foreach ( $post['postmeta'] as $meta ) {
				if ( $meta['key'] == 'brizy-project' ) {
					$projectMeta = maybe_unserialize( $meta['value'] );
					break;
				}
			}

			if ( ! $projectMeta ) {
				// force import if the project data is not found in current project.
				return 0;
			}

			$projectData = json_decode( base64_decode( $projectMeta['data'] ) );

			// MERGE STYLES
			// 1. merge extra fonts
			$currentProjectGlobals->extraFonts = array_unique(
				array_merge(
					(array) ( isset( $currentProjectGlobals->extraFonts ) ? $currentProjectGlobals->extraFonts : array() ),
					(array) ( isset( $projectData->extraFonts ) ? $projectData->extraFonts : array() )
				)
			);
			// 2. merge extra fonts styles

			if ( ! isset( $currentProjectGlobals->styles ) ) {
				$currentProjectGlobals->styles = (object) array( '_extraFontStyles' => array() );
			}

			$currentProjectGlobals->styles->_extraFontStyles = array_merge(
				(array) ( isset( $currentProjectGlobals->styles->_extraFontStyles ) ? $currentProjectGlobals->styles->_extraFontStyles : array() ),
				(array) ( isset( $projectData->styles->_extraFontStyles ) ? $projectData->styles->_extraFontStyles : array() )
			);


			$currentProjectGlobals->styles->default = $projectData->styles->default;

			if ( $projectData->styles && isset( $projectData->styles->_selected ) ) {
				$selected                                          = $projectData->styles->_selected;
				$currentProjectGlobals->styles->_selected = $selected;
				if ( $selected ) {
					$currentProjectGlobals->styles->$selected = $projectData->styles->$selected;
				}
			}

			// create project data backup
			$data = $currentProjectStorage->get_storage();
			update_post_meta( $currentProjectPostId, 'brizy-project-import-backup-' . md5( time() ), $data );
			//---------------------------------------------------------

			$currentProject->setGlobals( $currentProjectGlobals );

			return $currentProjectPostId;
		}

		return $existing;
	}

	public function handleNewProjectMetaImport( $postMeta, $post_id, $post ) {
		if ( $post['post_type'] == Brizy_Editor_Project::BRIZY_PROJECT ) {
			return null;
		}

		return $postMeta;
	}

	public function global_data_updated() {
		// mark all brizy post to be compiled on next view
		$posts = Brizy_Editor_Post::get_all_brizy_posts();

		// we need to trigger a post update action to make sure the cache plugins will update clear the cache
		remove_action( 'save_post', array( Brizy_Admin_Main::instance(), 'compile_post_action' ) );
		// mark all post to be compiled on next view
		foreach ( $posts as $bpost ) {
			if ( ! $bpost->get_needs_compile() ) {
				$bpost->set_needs_compile( true );
				$bpost->save();
			}
			// wp_update_post( array( 'ID' => $bpost->get_id() ) );
		}
	}
}