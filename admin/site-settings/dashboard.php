<?php

class Brizy_Admin_SiteSettings_Dashboard {

	public function __construct() {
		add_action( 'brizy_site_settings_popup_html', [ $this, 'action_popup_html' ] );
		add_action( 'template_include', [ $this, 'action_template_include' ], 10000 );

		$this->run();
	}

	public function action_template_include() {
		return Brizy_Editor::get()->get_path( 'admin/site-settings/views/dashboard.php' );
	}

	public function run() {
		try {
			$this->handleSubmits();
			$this->action_enqueue_scripts();
		} catch ( \Exception $e ) {
			echo '0';
		}
	}

	private function handleSubmits() {

		if ( isset( $_REQUEST['brizy-settings-tab-submit'] ) ) {
			switch ( $_REQUEST['brizy-settings-tab-submit'] ) {
				case 'site-settings':
					$this->handleSettingsTabSubmit();
					break;

				case 'social-sharing':
					$this->handleSocialSharingSubmit();
					break;

				case 'custom-css':
					$this->handleCustomCssSubmit();
					break;

				case 'code-injection':
					$this->handleCodeInjectionSubmit();
					break;

				case 'update-post':
					$this->hanldeUpdatePostSubmit();
					break;

				case 'delete-post':
					$this->hanldeDeletePostSubmit();
					break;
			}

			$query = build_query(
				[
					'brizy-site-settings' => '',
					'brizy-settings-tab'  => $_REQUEST['brizy-settings-tab-submit']
				]
			);

			wp_redirect( home_url( $query ) );
		}
	}

	public function action_enqueue_scripts() {

		wp_enqueue_style( 'settings-bootstrap', Brizy_Editor::get()->get_url( 'admin/site-settings/css/bootstrap.min.css' ) );
		wp_enqueue_style( 'settings-codemirror', Brizy_Editor::get()->get_url( 'admin/site-settings/css/codemirror.css' ) );
		//wp_enqueue_style( 'settings-select2', Brizy_Editor::get()->get_url( 'admin/site-settings/css/select2.min.css' ) );
		wp_enqueue_style( 'settings-style', Brizy_Editor::get()->get_url( 'admin/site-settings/css/style.css' ) );

		wp_enqueue_script( 'settings-jquery', Brizy_Editor::get()->get_url( 'admin/site-settings/js/jquery-3.3.1.min.js' ) );
		wp_enqueue_script( 'settings-bootstrap', Brizy_Editor::get()->get_url( 'admin/site-settings/js/bootstrap.min.js' ) );
		wp_enqueue_script( 'settings-codemirror', Brizy_Editor::get()->get_url( 'admin/site-settings/js/codemirror.js' ) );
		wp_enqueue_script( 'settings-css', Brizy_Editor::get()->get_url( 'admin/site-settings/js/css.js' ) );
		wp_enqueue_script( 'settings-comment', Brizy_Editor::get()->get_url( 'admin/site-settings/js/comment.js' ) );
		wp_enqueue_script( 'settings-select2', Brizy_Editor::get()->get_url( 'admin/site-settings/js/select2.full.js' ) );
//		wp_enqueue_script( 'settings-Sortable', Brizy_Editor::get()->get_url( 'admin/site-settings/js/Sortable.js' ) );
//		wp_enqueue_script( 'settings-app', Brizy_Editor::get()->get_url( 'admin/site-settings/js/app.js' ) );
		wp_enqueue_script( 'settings-submit', Brizy_Editor::get()->get_url( 'admin/site-settings/js/form-submit.js' ) );
		wp_enqueue_script( 'settings-general', Brizy_Editor::get()->get_url( 'admin/site-settings/js/general.js' ) );
	}

	private function handleSettingsTabSubmit() {

		if ( isset( $_POST['title'] ) ) {
			update_option( 'blogname', wp_unslash( $_POST['title'] ) );
		}

		if ( isset( $_POST['description'] ) ) {
			update_option( 'blogdescription', wp_unslash( $_POST['description'] ) );
		}

		if ( ! empty( $_FILES['favicon'] ) && empty( $_POST['favicon_id'] ) ) {

			include_once( ABSPATH . 'wp-admin/includes/image.php' );

			$uploadedfile = $_FILES['favicon'];
			$file         = wp_handle_upload( $uploadedfile, [ 'test_form' => false ] );

			if ( ! $file || isset( $file['error'] ) ) {

				echo( isset( $file['error'] ) ? 'Error: ' . $file['error'] : 'The file wasn\'t uploaded. Please try again or contact the support team of Brizy plugin.' );

				return;
			}

			$attachment = [
				'guid'           => $file['url'],
				'post_mime_type' => $file['type'],
				'post_title'     => preg_replace( '/\\.[^.]+$/', '', basename( $file['name'] ) ),
				'post_content'   => '',
				'post_status'    => 'inherit'
			];

			$id = wp_insert_attachment( $attachment, $file['file'] );

			if ( ! is_wp_error( $id ) ) {
				wp_update_attachment_metadata( $id, wp_generate_attachment_metadata( $id, $file['file'] ) );
				update_option( 'site_icon', $id );
			}
		}
	}

	public function handleSocialSharingSubmit() {
		if ( isset( $_POST['title'] ) ) {
			update_option( 'brizy-social-title', wp_unslash( $_POST['title'] ) );
		}
		if ( isset( $_POST['description'] ) ) {
			update_option( 'brizy-social-description', wp_unslash( $_POST['description'] ) );
		}

		if ( isset( $_FILES['thumbnail'] ) ) {
			$upload_overrides = [ 'test_form' => false ];
			$uploadedfile     = $_FILES['thumbnail'];
			$file             = wp_handle_upload( $uploadedfile, $upload_overrides );

			$file['file'] = str_replace(
				wp_normalize_path( untrailingslashit( ABSPATH ) ),
				'',
				$file['file']
			);

			if ( $file && ! isset( $file['error'] ) ) {
				update_option( 'brizy-social-thumbnail', $file['file'] );
			} else {
				/**
				 * Error generated by _wp_handle_upload()
				 * @see _wp_handle_upload() in wp-admin/includes/file.php
				 */
				echo $file['error'];
			}


		}
	}

	private function handleCustomCssSubmit() {
		if ( isset( $_POST['custom_css'] ) ) {
			update_option( 'brizy-custom-css', wp_unslash( $_POST['custom_css'] ) );
		}
	}

	private function handleCodeInjectionSubmit() {
		if ( isset( $_POST['header_code'] ) ) {
			update_option( 'brizy-header-injection', wp_unslash( $_POST['header_code'] ) );
		}
		if ( isset( $_POST['footer_code'] ) ) {
			update_option( 'brizy-footer-injection', wp_unslash( $_POST['footer_code'] ) );
		}
	}

	private function hanldeUpdatePostSubmit() {

		if ( ! get_post( $_POST['post_id'] ) ) {
			return;
		}

		wp_update_post(
			[
				'ID'          => $_POST['post_id'],
				'post_title'  => $_POST['page-title'],
				'post_name'   => $_POST['permalink'],
				'post_status' => $_POST['status'],
			]
		);
	}

	private function hanldeDeletePostSubmit() {
		wp_delete_post( $_POST['post_id'] );
	}

	public function action_popup_html() {

		$context = [
			'brizy_settings_tab' => isset( $_REQUEST['brizy-settings-tab'] ) ? $_REQUEST['brizy-settings-tab'] : 'site-settings',
			'fonts_url'          => BRIZY_PLUGIN_URL . '/admin/site-settings/fonts/',
			'site_settings'      => [
				'tabs' => [
					[
						'id'   => 'settings',
						'icon' => 'symbol-defs.svg#icon-General-Settings',
						'name' => esc_html__( 'Site Settings', 'brizy' )
					],
					[
						'id'   => 'socialSharing',
						'icon' => 'symbol-defs.svg#icon-Social',
						'name' => esc_html__( 'Social Sharing', 'brizy' )
					],
					[
						'id'   => 'customCSS',
						'icon' => 'symbol-defs.svg#icon-CSS',
						'name' => esc_html__( 'Custom CSS', 'brizy' )
					],
					[
						'id'   => 'codeInjection',
						'icon' => 'symbol-defs.svg#icon-Code-Injection',
						'name' => esc_html__( 'Code Injection', 'brizy' )
					]
				],
				'title'       => html_entity_decode( get_bloginfo( 'name' ) ),
				'description' => html_entity_decode( get_bloginfo( 'description' ) ),
				'favicon_id'  => get_option( 'site_icon' ),
				'favicon_url' => get_site_icon_url()
			],
			'social_sharing'     => [
				'title'         => html_entity_decode( get_option( 'brizy-social-title' ) ),
				'description'   => html_entity_decode( get_option( 'brizy-social-description' ) ),
				'thumbnail'     => get_option( 'brizy-social-thumbnail' ),
				'thumbnail_url' => site_url( get_option( 'brizy-social-thumbnail' ) )
			],
			'custom_css'         => html_entity_decode( get_option( 'brizy-custom-css' ) ),
			'code_injection'     => [
				'header_code' => html_entity_decode( get_option( 'brizy-header-injection' ) ),
				'footer_code' => html_entity_decode( get_option( 'brizy-footer-injection' ) )
			],
			'post_types' => [
				'tabs' => $this->get_post_types()
			],
			'posts' => $this->get_posts(),
		];

		echo Brizy_TwigEngine::instance( dirname( __FILE__ ) . '/views' )->render( 'index.html.twig', $context );
	}

	private function get_post_types() {

		$exclude_posts_types = [
			'attachment'
		];

		$include_posts_types = array_map( function( $post_type ) {
			global $wp_post_types;
			return isset( $wp_post_types[ $post_type ] ) ? $wp_post_types[ $post_type ] : '';

		}, [ 'brizy_template' ] );

		$args = [
			'public'              => true,
			'exclude_from_search' => false,
			'show_ui'             => true,
		];

		$post_types = array_diff_key( get_post_types( $args, 'objects' ), array_flip( $exclude_posts_types ) );
		$post_types = array_map( function( $val ){
			return [
				'id'            => $val->name,
				'icon'          => 'symbol-defs.svg#icon-Pages',
				'name'          => $val->label,
				'singular_name' => $val->labels->singular_name,
				//'add_new_post'  => add_query_arg( [ 'post_type' => $val->name ], admin_url( 'post-new.php' ) )
			];
		}, array_filter( array_merge( $post_types, $include_posts_types ) ) );

		return $post_types;
	}

	private function get_posts() {

		$post_types = $this->get_post_types();
		$out        = [];

		foreach ( $post_types as $post_type ) {

			$posts = get_posts(
				[
					'post_type'      => $post_type['id'],
					'post_status'    => 'any',
					'posts_per_page' => 10
				]
			);

			$posts = array_map( function( $post ) {
				$post->brizy_edit_url = $this->get_edit_post_url( $post );
				return $post;
			}, $posts );

			$out[] = [
				'post_type' => $post_type,
				'posts'     => $posts
			];
		}

		return $out;
	}

	private function get_edit_post_url( $post ) {

		try {
			$is_using_brizy = Brizy_Editor_Post::get( $post->ID )->uses_editor();
		} catch ( Exception $e ) {
			$is_using_brizy = false;
		}

		if ( $is_using_brizy ) {
			return add_query_arg( [ Brizy_Editor_Constants::EDIT_KEY => '' ], get_permalink( $post->ID ) );
		}

		return esc_url( add_query_arg( [ 'action' => '_brizy_admin_editor_enable', 'post' => $post->ID ], admin_url( 'admin-post.php' ) ) );
	}
}
