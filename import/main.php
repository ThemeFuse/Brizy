<?php defined( 'ABSPATH' ) or die();

class Brizy_Import_Main {

	private $provider;

	public function __construct() {

		$this->provider = new Brizy_Import_Providers_Multisite();

		if ( defined( 'WP_CLI' ) && WP_CLI ) {
			WP_CLI::add_command( 'brizy demo', Brizy_Import_WpCli::class );
		} else {
			add_action( 'admin_menu',                [ $this, 'addSubmenuPageTemplates' ], 11 );
			add_action( 'wp_ajax_brizy-import-demo', [ $this, 'ajaxImportDemo' ] );
			add_action( 'admin_enqueue_scripts',     [ $this, 'adminEnqueueScripts' ] );
		}
	}

	public function addSubmenuPageTemplates() {

		if ( is_network_admin() ) {
			return;
		}

		add_submenu_page(
			Brizy_Admin_Settings::menu_slug(),
			__( 'Starter Templates', 'brizy' ),
			__( 'Starter Templates', 'brizy' ),
			'manage_options',
			'starter-templates',
			[ $this, 'renderTemplatesPage' ],
			1
		);
	}

	public function renderTemplatesPage() {

		$args = [
			'translations' => [
				'livePreview'   => __( 'Live Preview', 'brizy' ),
				'install'       => __( 'Install', 'brizy' ),
				'free'          => __( 'Free', 'brizy' ),
				'pro'           => __( 'Pro', 'brizy' ),
				'search'        => __( 'Search', 'brizy' ),
				'allCategories' => __( 'All Categories', 'brizy' ),
				'confirm'       => __( 'Are you sure you want to install this template?', 'brizy' ),
				'alert'         => __( 'Do not refresh this page until you see the import response.', 'brizy' ),
				'goPro'         => __( 'Go Pro', 'brizy' ),
			],
			'supportUrl'   => Brizy_Config::SUPPORT_URL,
			'goProUrl'     => Brizy_Config::GO_PRO_DASHBOARD_URL,
			'isPro'        => Brizy_Compatibilities_BrizyProCompatibility::isPro(),
		];

		try {
			$args = array_merge( $args, $this->provider->getAllDemos() );

			$twig = Brizy_TwigEngine::instance( BRIZY_PLUGIN_PATH . '/import/views' );
			echo $twig->render('starter-templates.html.twig', $args);
		} catch ( Exception $e ) {
			echo $e->getMessage();
		}
	}

	public function ajaxImportDemo() {
		check_ajax_referer( 'brizy-admin-nonce', 'nonce' );

		if ( ! current_user_can( 'manage_options' ) ) {
			wp_send_json_error( __( 'You are not allowed to do this.', 'brizy' ) );
		}

		if ( empty( $_POST['demo'] ) || ! is_numeric( $_POST['demo'] ) ) {
			wp_send_json_error( __( 'Invalid demo id. Please contact our support.', 'brizy' ) );
		}

		try {
//			$import = new Brizy_Import_Import( $_POST['demo'] );
//			$import->import();
		} catch (Exception $e) {
			wp_send_json_error( $e->getMessage() );
		}

		wp_send_json_success( __( 'Template imported successfully.', 'brizy' ) );
	}

	public function adminEnqueueScripts() {

		if ( ! isset( $_GET['page'] ) || $_GET['page'] != 'starter-templates' ) {
			return;
		}

		$urlBuilder = new Brizy_Editor_UrlBuilder();

		wp_enqueue_style(
			'demo-import-select2',
			$urlBuilder->plugin_url('vendor/select2/select2/dist/css/select2.min.css'),
			[],
			true
		);

		wp_enqueue_script(
			'demo-import-select2',
			$urlBuilder->plugin_url( 'vendor/select2/select2/dist/js/select2.full.min.js' ),
			[ 'jquery' ]
		);
	}
}
