<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

class Brizy_Admin_Main {



	public static function _init() {
		static $instance;

		if ( ! $instance ) {
			$instance = new self();
		}
	}

	protected function __construct() {

		if(!Brizy_Editor::is_user_allowed()) return;

		if ( defined( 'DOING_AJAX' )  ) {
			add_action( 'wp_ajax__brizy_admin_editor_enable', array( $this, '_action_request_enable' ) );
			add_action( 'wp_ajax__brizy_admin_editor_disable', array( $this, '_action_request_disable' ) );

			return;
		}

		add_action( 'admin_enqueue_scripts', array( $this, '_action_register_static' ) );
		add_action( 'before_delete_post', array( $this, '_action_delete_page' ) );
		add_action( 'media_buttons', array( $this, '_action_add_enable_disable_buttons' ) );
		add_filter( 'page_row_actions', array( $this, '_filter_add_brizy_edit_row_actions' ), 10, 2 );
		add_filter( 'post_row_actions', array( $this, '_filter_add_brizy_edit_row_actions' ), 10, 2 );
		add_filter( 'admin_body_class', array( $this, '_filter_add_body_class' ), 10, 2 );
		add_filter( 'the_editor', array( $this, '_filter_add_brizy_edit_button' ), 10, 2 );
		add_filter( 'plugin_action_links_' . BRIZY_PLUGIN_BASE, array($this, 'plugin_action_links') );
	}

	public function plugin_action_links( $links ) {
		$settings_link = sprintf( '<a href="%s">%s</a>', admin_url( 'admin.php?page=' . Brizy_Admin_Settings::menu_slug() ), __( 'Settings', 'brizy' ) );
		array_unshift( $links, $settings_link );
		return $links;
	}

	public static function render( $view, array $args = array() ) {
		return Brizy_Editor_View::get(
			implode( DIRECTORY_SEPARATOR, array( dirname( __FILE__ ), 'views', $view ) ),
			$args
		);
	}

	/**
	 * @internal
	 */
	public function _action_register_static() {
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

	private function get_brizy_posts() {

		$posts = get_posts( array(
			'meta_key'    => Brizy_Editor_Storage_Post::META_KEY,
			'post_type'   => brizy()->supported_post_types(),
			'post_status' => 'any',
		) );

		return $posts;
	}

	private function has_brizy_index_page() {

		$posts = $this->get_brizy_posts();

		if ( is_array( $posts ) ) {
			foreach ( $posts as $apost ) {
				$bpost = Brizy_Editor_Post::get( $apost->ID );

				if ( $bpost->is_index() ) {
					return true;
				}
			}
		}

		return false;
	}

	/**
	 * @internal
	 */
	public function _action_request_enable() {


		if ( ! isset( $_POST['id'] ) || ! ( $p = get_post( $_POST['id'] ) ) ) {
			wp_send_json_error( array(
				'code'    => 'invalid_request',
				'message' => __( 'Invalid post', 'brizy' ),
			) );
			exit();
		}

		$mark_the_page_as_index = false;

		// obtain the project
		try {
			$project = Brizy_Editor_Project::get();

			$mark_the_page_as_index = ! $this->has_brizy_index_page();

		} catch ( Brizy_Editor_Exceptions_NotFound $e ) {

			try {
				$project = Brizy_Editor_Project::create();

				$mark_the_page_as_index = true;
			} catch ( Exception $e ) {

				Brizy_Admin_Flash::instance()->add_error( 'Unable to create the project. Please try again later.' );

				wp_send_json_error( array(
					'redirect' => $_SERVER['HTTP_REFERER']
				) );
			}
		}

		// obtain the post
		try {

			$post = Brizy_Editor_Post::get( $p->ID );

			if ( $p->post_status == 'auto-draft' ) {
				$p->post_status = 'draft';
				wp_update_post( $p );
			}

			if ( $mark_the_page_as_index ) {
				$post->set_is_index( $mark_the_page_as_index );
				$post->save();
			}

			// redirect
			wp_send_json_success( array( 'redirect' => $post->enable_editor()->edit_url() ) );

		}
		catch ( Brizy_Editor_Exceptions_NotFound $exception ) {

			try {
				$post = Brizy_Editor_Post::create( $project, $p );

				$post->set_is_index( $mark_the_page_as_index );
				$post->save();

				if ( $p->post_status == 'auto-draft' ) {
					$p->post_status = 'draft';
					wp_update_post( $p );
				}

				wp_send_json_success( array(
					'redirect' => $post->enable_editor()->edit_url()
				) );

			} catch ( Brizy_Editor_Exceptions_Exception $exception ) {

				Brizy_Admin_Flash::instance()->add_error( 'Unable to create the page. Please try again later.' );

				wp_send_json_error( array(
					'code'     => $exception->getCode(),
					'message'  => $exception->getMessage(),
					'redirect' => $_SERVER['HTTP_REFERER']
				) );
			}
		}
		catch(Exception $exception)
		{
			wp_send_json_error( array(
				'code'     => $exception->getCode(),
				'message'  => $exception->getMessage(),
				'redirect' => $_SERVER['HTTP_REFERER']
			) );
		}
	}

	/**
	 * @internal
	 */
	public function _action_request_disable() {
		if ( ! isset( $_POST['id'] ) || ! ( $p = get_post( $_POST['id'] ) ) ) {
			wp_send_json_error( array(
				'code'    => 'invalid_request',
				'message' => __( 'Invalid post', 'brizy' ),
			) );
			exit();
		}

		try {
			Brizy_Editor_Post::get( $p->ID )->disable_editor();
			wp_send_json_success();
		} catch ( Brizy_Editor_Exceptions_Exception $exception ) {

			Brizy_Admin_Flash::instance()->add_error( 'Unable to disabled the editor. Please try again later.' );

			wp_send_json_error( array(
				'redirect' => $_SERVER['HTTP_REFERER']
			) );

		}
	}

	/**
	 * @internal
	 *
	 * @param int $id
	 **/
	public function _action_delete_page( $id ) {

		try {
			$project = Brizy_Editor_Project::get();
			$post    = Brizy_Editor_Post::get( $id );

			if ( ! $post->uses_editor() ) {
				return;
			}

			$is_index = $post->get_api_page()->is_index();

			// if the index page is deleted the we must mark other page as index
			// for now we will mark the first returned page.
			if ( $is_index && ! $this->has_brizy_index_page() ) {

				$posts = $this->get_brizy_posts();

				if ( isset( $posts[0] ) ) {
					$bpost = Brizy_Editor_Post::get( $posts[0]->ID );
					$bpost->set_is_index( true );
					$bpost->save();
				}
			}

			$post->disable_editor();

			Brizy_Editor_User::get()->delete_page( $project->get_api_project(), $post->get_api_page() );

			do_action( 'brizy_delete_post', $id );

		} catch ( Brizy_Editor_Exceptions_UnsupportedPostType $exception ) {
			return;
		} catch ( Exception $exception ) {
			Brizy_Admin_Flash::instance()->add_error( 'Unable to empty the trash. Please try again later.' );
			wp_redirect( $_SERVER['HTTP_REFERER'] );
			exit;
		}
	}

	/**
	 * @internal
	 **/
	public function _action_add_enable_disable_buttons() {
		if ( in_array( get_post_type(), brizy()->supported_post_types() ) ) {
			echo self::render( 'button', array( 'id' => get_the_ID(), ) );
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
	public function _filter_add_brizy_edit_row_actions( $actions, $post ) {

		if ( ! in_array( get_post_type(), brizy()->supported_post_types() ) ) {
			return $actions;
		}

		try {
			$p = Brizy_Editor_Post::get( $post->ID );

			$actions['brizy-edit'] = "<a href='{$p->edit_url()}'>"
			                         . __( 'Edit with Brizy', 'brizy' )
			                         . "</a>";
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
	public function _filter_add_body_class( $body ) {
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

	/**
	 * @internal
	 *
	 * @param string $data
	 *
	 * @return string
	 **/
	public function _filter_add_brizy_edit_button( $data ) {
		if ( ! in_array( get_post_type(), brizy()->supported_post_types() ) ) {
			return $data;
		}

		return $data . self::render( 'editor',
				array(
					'url' => add_query_arg(
						array( Brizy_Editor_Constants::EDIT_KEY => '' ),
						get_permalink( get_the_ID() )
					)
				) );
	}
}
