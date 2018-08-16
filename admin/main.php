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
		add_filter( 'plugin_action_links_' . BRIZY_PLUGIN_BASE, array( $this, 'plugin_action_links' ) );
		add_filter( 'display_post_states', array( $this, 'display_post_states' ), 10, 2 );

		add_filter( 'save_post', array( $this, 'save_post' ), 10, 2 );

		if ( function_exists( 'gutenberg_init' ) ) {
			add_action( 'admin_print_scripts-edit.php', array( $this, 'add_edit_button_to_gutenberg' ), 12 );
		}
	}

	/**
	 * @param int $post
	 */
	public function action_delete_page( $post = null ) {
		try {

			$bpost = Brizy_Editor_Post::get( $post );


			$urlBuilder = new Brizy_Editor_UrlBuilder( Brizy_Editor_Project::get(), $bpost );

			$pageUploadPath = $urlBuilder->upload_path( $urlBuilder->page_upload_path( "assets/images" ) );

			Brizy_Admin_FileSystem::deleteAllDirectories( $pageUploadPath );

			$pageUploadPath = $urlBuilder->upload_path( $urlBuilder->page_upload_path( "assets/icons" ) );

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

	public function save_post( $post_id, $post ) {
		try {

			$brizy_post = null;

			$parent_id = wp_is_post_revision( $post_id );

			if ( $parent_id ) {
				$brizy_post = Brizy_Editor_Post::get( $parent_id );

				if ( $brizy_post->uses_editor() ) {
					$brizy_post->save( $post_id );
				}
			}

		} catch ( Exception $e ) {
			Brizy_Logger::instance()->exception( $e );

			return;
		}
	}

	public function hide_editor() {

		$post_type = get_post_type();
		if ( in_array( $post_type, brizy()->supported_post_types() ) ) {
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

	public function add_edit_button_to_gutenberg() {
		global $typenow;

		$new_post_url = add_query_arg( array(
			'action'    => 'brizy_new_post',
			'post_type' => $typenow,
		), set_url_scheme( admin_url( 'edit.php' ) ) );

		?>
        <script type="text/javascript">
            document.addEventListener('DOMContentLoaded', function () {
                var dropdown = document.querySelector('#split-page-title-action .dropdown');

                if (!dropdown) {
                    return;
                }

                var url = '<?php echo esc_attr( $new_post_url ); ?>';

                dropdown.insertAdjacentHTML('afterbegin', '<a href="' + url + '">Brizy</a>');
            });
        </script>
		<?php
	}

	public function plugin_action_links( $links ) {
		$settings_link = sprintf( '<a href="%s">%s</a>', admin_url( 'admin.php?page=' . Brizy_Admin_Settings::menu_slug() ), __( 'Settings', 'brizy' ) );
		array_unshift( $links, $settings_link );

		return $links;
	}

	/**
	 * @internal
	 */
	public function action_register_static() {

		wp_enqueue_style(
			brizy()->get_slug() . '-admin-css',
			brizy()->get_url( 'admin/static/css/style.css' )
		);
		wp_enqueue_style(
			brizy()->get_slug() . '-select2',
			'https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.6-rc.0/css/select2.min.css'
		);

		wp_enqueue_script(
			brizy()->get_slug() . '-admin-js',
			brizy()->get_url( 'admin/static/js/script.js' ),
			array( 'jquery', 'underscore' ),
			brizy()->get_version(),
			true
		);

		wp_localize_script(
			brizy()->get_slug() . '-admin-js',
			'Brizy_Admin_Data',
			array(
				'url'         => set_url_scheme( admin_url( 'admin-ajax.php' ) ),
				'ruleApiHash' => wp_create_nonce( Brizy_Admin_Rules_Api::nonce ),
				'id'          => get_the_ID(),
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
		$supported_post_types = brizy()->supported_post_types();
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
	 * @internal
	 *
	 * @param array $actions
	 * @param WP_Post $post
	 *
	 * @return array
	 **/
	public function filter_add_brizy_edit_row_actions( $actions, $post ) {

		$is_allowed = Brizy_Editor::is_user_allowed();

		if ( ! $is_allowed || ! in_array( get_post_type(), brizy()->supported_post_types() ) ) {
			return $actions;
		}

		try {
			$p = Brizy_Editor_Post::get( $post->ID );
			if ( $p->uses_editor() ) {
				$actions['brizy-edit'] = "<a href='{$p->edit_url()}'>"
				                         . __( 'Edit with Brizy', 'brizy' )
				                         . "</a>";
			}
		} catch ( Exception $exception ) {
			$t = 0;
		}

		return $actions;
	}

	/**
	 * @internal
	 *
	 * @param string $body
	 *
	 * @return string
	 **/
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
				$p->post_title = 'Brizy #' . $p->ID;
				$update_post   = true;
			}

			if ( $update_post ) {
				wp_update_post( $p );
			}

			$post->enable_editor();
			$post->set_template( Brizy_Config::BRIZY_BLANK_TEMPLATE_FILE_NAME );
			$post->save();
			// redirect
			wp_redirect( $post->edit_url() );

		} catch ( Exception $exception ) {

			Brizy_Admin_Flash::instance()->add_error( 'Failed to enable the editor for this post.' );
			wp_redirect( $_SERVER['HTTP_REFERER'] );
		}

		exit;
	}
}