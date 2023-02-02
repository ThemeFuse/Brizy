<?php defined( 'ABSPATH' ) or die();

class Brizy_Import_Main {

	private $provider;

	public function __construct() {

		$this->provider = new Brizy_Import_Provider();

		if ( defined( 'WP_CLI' ) && WP_CLI ) {
			WP_CLI::add_command( 'brizy demo', Brizy_Import_WpCli::class );
		} else {
			add_action( 'admin_menu',                 [ $this, 'addSubmenuPageTemplates' ], 11 );
			add_action( 'wp_ajax_brizy-import-demo',  [ $this, 'ajaxImportDemo' ] );
			add_action( 'admin_enqueue_scripts',      [ $this, 'adminEnqueueScripts' ] );
		}

		add_filter( 'http_request_args', [ $this, 'doNotRejectUnsafeUrl' ], 999 );
	}

	public function addSubmenuPageTemplates() {

		if ( is_network_admin() ) {
			return;
		}

		add_filter( 'screen_options_show_screen', function ( $display ) {
			return isset( $_GET['page'] ) && $_GET['page'] == 'starter-templates' ? false : $display;
		} );

		add_submenu_page(
			Brizy_Admin_Settings::menu_slug(),
			__( 'Starter Templates', 'brizy' ),
			__( 'Starter Templates', 'brizy' ),
			'manage_options',
			'starter-templates',
			[ $this, 'renderTemplatesPage' ],
			8
		);
	}

	public function renderTemplatesPage() {

		$args = [
			'l10n'       => [
				'all'           => __( 'All', 'brizy' ),
				'livePreview'   => __( 'Live Preview', 'brizy' ),
				'install'       => __( 'Install', 'brizy' ),
				'free'          => __( 'Free', 'brizy' ),
				'pro'           => __( 'Pro', 'brizy' ),
				'search'        => __( 'Search', 'brizy' ),
				'allCategories' => __( 'All Categories', 'brizy' ),
				'goPro'         => __( 'Go Pro', 'brizy' ),
				't1'            => __( 'Something went wrong', 'brizy' ),
				't2'            => __( 'Bad news, your starter template was not installed. Something went wrong and we couldn’t do it. Please contact us.', 'brizy' ),
				't3'            => __( 'Ok', 'brizy' ),
				't4'            => __( 'Template Successfully Installed', 'brizy' ),
				't5'            => __( 'Good news, your starter template was successfully installed. Time to build your amaizing website fast & easy!', 'brizy' ),
				't6'            => __( 'Thank You!', 'brizy' ),
				't7'            => __( 'Installing Starter Template', 'brizy' ),
				't8'            => __( 'Please don’t close this window until the installation is finished. This might take up to a couple of minutes (five min, usually less).', 'brizy' ),
				't9'            => __( 'Keep existing content', 'brizy' ),
				't10'           => sprintf( __( 'Choose this option if you want to keep your current content. If you are using %s, some of the global options might overlap.', 'brizy' ), __bt( 'brizy', 'Brizy' ) ),
				't11'           => __( 'Install Template', 'brizy' ),
				't12'           => __( 'Delete existing content', 'brizy' ),
				't13'           => __( 'Choose this option if you want to start fresh and delete your current content. A backup is advisable, there is no turning back from this.', 'brizy' ),
				't14'           => __( 'Deletes your current content', 'brizy' ),
			],
			'supportUrl' => Brizy_Config::SUPPORT_URL,
			'goProUrl'   => Brizy_Config::GO_PRO_DASHBOARD_URL,
			'isPro'      => Brizy_Compatibilities_BrizyProCompatibility::isPro(),
		];

		try {
			$args          = array_merge( $args, $this->provider->getAllDemos() );
			$args['count'] = count( $args['demos'] );

			Brizy_Editor_View::render( BRIZY_PLUGIN_PATH . '/import/views/starter-templates', $args );

		} catch ( Exception $e ) {
			echo $e->getMessage();
		}
	}

	public function ajaxImportDemo() {
		check_ajax_referer( 'brizy-admin-nonce', 'nonce' );

		if ( empty( $_POST['demo'] ) || ! is_numeric( $_POST['demo'] ) ) {
			wp_send_json_error( __( 'Invalid demo id. Please contact our support.', 'brizy' ), '500' );
		}

		$import = new Brizy_Import_Import( $_POST['demo'] );

		try {
            $import->import( (bool) $_POST['rmContent'] );
		} catch (Exception $e) {
			wp_send_json_error( $e->getMessage(), '500' );
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

	public function doNotRejectUnsafeUrl( $args ) {
		$args['reject_unsafe_urls'] = false;
		return $args;
	}
}
