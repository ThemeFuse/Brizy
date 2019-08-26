<?php

class Brizy_Admin_SiteSettings_Dashboard {

	public function __construct() {
		add_action( 'brizy_site_settings_popup_html', array( $this, 'action_popup_html' ) );
		add_action( 'template_include', array( $this, 'action_template_include' ), 10000 );
		//add_action( 'wp_enqueue_scripts', array( $this, 'action_enqueue_scripts' ) );

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
			}

			$query = build_query(
				array(
					'brizy-site-settings' => '',
					'brizy-settings-tab'  => $_REQUEST['brizy-settings-tab-submit']
				)
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
			$file         = wp_handle_upload( $uploadedfile, array( 'test_form' => false ) );

			if ( ! $file || isset( $file['error'] ) ) {

				echo( isset( $file['error'] ) ? 'Error: ' . $file['error'] : 'The file wasn\'t uploaded. Please try again or contact the support team of Brizy plugin.' );

				return;
			}

			$attachment = array(
				'guid'           => $file['url'],
				'post_mime_type' => $file['type'],
				'post_title'     => preg_replace( '/\\.[^.]+$/', '', basename( $file['name'] ) ),
				'post_content'   => '',
				'post_status'    => 'inherit'
			);

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
			$upload_overrides = array( 'test_form' => false );
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

	public function action_popup_html() {
		$twig = Brizy_TwigEngine::instance( dirname( __FILE__ ) . '/views' );

		$context = array(
			'brizy_settings_tab' => isset( $_REQUEST['brizy-settings-tab'] ) ? $_REQUEST['brizy-settings-tab'] : 'site-settings',
			'site_settings'      => array(
				'title'       => html_entity_decode( get_bloginfo( 'name' ) ),
				'description' => html_entity_decode( get_bloginfo( 'description' ) ),
				'favicon_id'  => get_option( 'site_icon' ),
				'favicon_url' => get_site_icon_url()
			),
			'social_sharing'     => array(
				'title'         => html_entity_decode( get_option( 'brizy-social-title' ) ),
				'description'   => html_entity_decode( get_option( 'brizy-social-description' ) ),
				'thumbnail'     => get_option( 'brizy-social-thumbnail' ),
				'thumbnail_url' => site_url( get_option( 'brizy-social-thumbnail' ) )
			),
			'custom_css'         => html_entity_decode( get_option( 'brizy-custom-css' ) ),
			'code_injection'     => array(
				'header_code' => html_entity_decode( get_option( 'brizy-header-injection' ) ),
				'footer_code' => html_entity_decode( get_option( 'brizy-footer-injection' ) )
			),
		);

		echo $twig->render( 'index.html.twig', $context );
	}
}
