<?php

if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

class Brizy_Admin_Main {

	public static function _init() {
		static $instance;

		if ( ! $instance ) {
			$instance = new self();
		}

		return $instance;
	}

	protected function __construct() {

		if ( ! Brizy_Editor::is_user_allowed() ) {
			return;
		}
		add_action( 'admin_head', array( $this, 'hide_editor' ) );

		//add_action( 'admin_action_brizy_new_post', array( $this, 'admin_action_new_post' ) );

		add_action( 'admin_post__brizy_admin_editor_enable', array( $this, 'action_request_enable' ) );
		add_action( 'admin_post__brizy_admin_editor_disable', array( $this, 'action_request_disable' ) );
		add_action( 'admin_post__brizy_change_template', array( $this, 'action_change_template' ) );

		add_action( 'admin_enqueue_scripts', array( $this, 'action_register_static' ) );
		//add_action( 'before_delete_post', array( $this, 'action_delete_page' ) );

		add_action( 'edit_form_after_title', array( $this, 'action_add_enable_disable_buttons' ) );

		add_filter( 'page_row_actions', array( $this, 'filter_add_brizy_edit_row_actions' ), 10, 2 );
		add_filter( 'post_row_actions', array( $this, 'filter_add_brizy_edit_row_actions' ), 10, 2 );
		add_filter( 'admin_body_class', array( $this, 'filter_add_body_class' ), 10, 2 );
		add_filter( 'save_post', array( $this, 'compile_post_action' ), 10, 2 );

		if ( current_user_can( 'edit_posts' ) ) {
			add_filter( 'plugin_action_links_' . BRIZY_PLUGIN_BASE, array( $this, 'plugin_action_links' ) );
			add_filter( 'display_post_states', array( $this, 'display_post_states' ), 10, 2 );
		}

		if ( function_exists( 'gutenberg_init' ) ) {
			add_action( 'admin_print_scripts-edit.php', array( $this, 'add_edit_button_to_gutenberg' ), 12 );
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

	public function compile_post_action( $post_id, $post ) {
		try {
			$post_type = $post->post_type;

			if ( ! in_array( $post_type, brizy()->supported_post_types() ) ) {
				return;
			}

			$b_post = Brizy_Editor_Post::get( $post_id );

			if ( ! $b_post->uses_editor() ) {
				return;
			}

			$b_post->compile_page();
			$b_post->save();

			remove_action( 'save_post', array( $this, 'compile_post_action' ) );
			wp_update_post( array( 'ID' => $post_id, 'post_content' => $b_post->get_compiled_html_body() ) );
			add_action( 'save_post', array( $this, 'compile_post_action' ), 10, 2 );

			// compile
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
					return "<div style='display: none'>{$editor_html}</div>";
				} );
			}
		}
	}

	public function add_edit_button_to_gutenberg() {
		global $typenow;

		$new_post_url = add_query_arg( array(
			'action'    => 'brizy_new_post',
			'post_type' => $typenow,
		), admin_url( 'edit.php' ) );

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
		if ( ! in_array( get_post_type(), brizy()->supported_post_types() ) ) {
			return;
		}

		wp_enqueue_style(
			brizy()->get_slug() . '-admin-js',
			brizy()->get_url( '/admin/static/css/style.css' )
		);
		wp_enqueue_script(
			brizy()->get_slug() . '-admin-js',
			brizy()->get_url( '/admin/static/js/script.js' ),
			array( 'jquery', 'underscore' ),
			brizy()->get_version(),
			true
		);

		wp_localize_script(
			brizy()->get_slug() . '-admin-js',
			'Brizy_Admin_Data',
			array(
				'url'     => admin_url( 'admin-ajax.php' ),
				'id'      => get_the_ID(),
				'actions' => array(
					'enable'  => '_brizy_admin_editor_enable',
					'disable' => '_brizy_admin_editor_disable',
				)
			)
		);
	}

//	private function get_brizy_posts() {
//
//		$posts = get_posts( array(
//			'meta_key'    => Brizy_Editor_Storage_Post::META_KEY,
//			'post_type'   => brizy()->supported_post_types(),
//			'post_status' => 'any',
//			get_site_url()
//		) );
//
//		return $posts;
//	}

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
			Brizy_Editor_Post::get( $p->ID )->disable_editor();
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
	 * @param $id
	 */
//	public function action_delete_page( $id ) {
//
//		try {
//			if ( ! in_array( get_post_type( $id ), brizy()->supported_post_types() ) ) {
//				return;
//			}
//
//			$project = Brizy_Editor_Project::get();
//			$post    = Brizy_Editor_Post::get( $id );
//
//			if ( ! $post->uses_editor() ) {
//				return;
//			}
//
//			$is_index = $post->get_api_page()->is_index();
//
//			// if the index page is deleted the we must mark other page as index
//			// for now we will mark the first returned page.
//			if ( $is_index && ! $this->has_brizy_index_page() ) {
//
//				$posts = $this->get_brizy_posts();
//
//				if ( isset( $posts[0] ) ) {
//					$bpost = Brizy_Editor_Post::get( $posts[0]->ID );
//					$bpost->set_is_index( true );
//					$bpost->save();
//				}
//			}
//
//			$post->set_status( Brizy_Editor_PostStatus::STATUS_TRASH );
//
//			//$updated_page = Brizy_Editor_User::get()->update_page( $project->get_api_project(), $post->get_api_page() );
//			//$post->updatePageData( $updated_page );
//
//			do_action( 'brizy_delete_post', $id );
//
//		} catch ( Exception $exception ) {
//			return;
//		}
//
//	}

	/**
	 * @internal
	 **/
	public function action_add_enable_disable_buttons() {
		if ( in_array( get_post_type(), brizy()->supported_post_types() ) ) {
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

		$is_allowed = Brizy_Editor::is_capable( "edit_post", $post->ID );

		if ( ! in_array( get_post_type(), brizy()->supported_post_types() ) || ! $is_allowed ) {
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

		return $body . ( $post->uses_editor() ? 'brizy-editor-enabled' : '' );
	}


//	public function admin_action_new_post() {
//
//		if ( empty( $_GET['post_type'] ) ) {
//			$post_type = 'post';
//		} else {
//			$post_type = $_GET['post_type'];
//		}
//
//		if ( ! in_array( $post_type, brizy()->supported_post_types() ) ) {
//			return;
//		}
//
//		$count     = $this->get_brizy_auto_draft_count();
//		$post_data = [
//			'post_type'  => $post_type,
//			'post_title' => 'Brizy #' . ( $count + 1 )
//		];
//
//		try {
//			$post_id = wp_insert_post( $post_data );
//
//			$p = get_post( $post_id );
//
//			$this->enable_brizy_for_post( $p );
//		} catch ( Exception $e ) {
//			Brizy_Admin_Flash::instance()->add_error( 'Unable to create the page. Please try again later.' );
//
//			wp_redirect( $_SERVER['HTTP_REFERER'] );
//		}
//	}

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
			$post_type   = $p->post_type;

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

			if ( $post_type != 'post' ) {
				$post->set_template( Brizy_Config::BRIZY_TEMPLATE_FILE_NAME );
			}

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