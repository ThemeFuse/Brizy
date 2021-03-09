<?php

class Brizy_Admin_Cloud {

//	const PAGE_KEY = 'brizy-cloud';
//	const GET_CLOUD_PROJECTS_ACTION = 'brizy-cloud-projects';
//
//	static private $subpageId = null;
//
//	/**
//	 * @var Brizy_TwigEngine
//	 */
//	private $twig;

	/**
	 * @var Brizy_Editor_Project
	 */
	private $project;

	/**
	 * @var Brizy_Admin_Cloud_Client
	 */
	private $cloudClient;


	/**
	 * @return Brizy_Admin_Cloud
	 * @throws Exception
	 */
	public static function _init() {

		static $instance;

		return $instance ? $instance : $instance = new self( Brizy_Editor_Project::get() );
	}

	/**
	 * Brizy_Admin_Cloud constructor.
	 *
	 * @param Brizy_Editor_Project $project
	 *
	 * @throws Exception
	 */
	private function __construct( Brizy_Editor_Project $project ) {

		$this->project     = $project;
		$this->cloudClient = Brizy_Admin_Cloud_Client::instance( $project, new WP_Http() );

		add_action( 'wp_loaded', array( $this, 'initializeActions' ) );
//		add_action( 'wp_ajax_' . self::GET_CLOUD_PROJECTS_ACTION, array( $this, 'actionGetProjects' ) );
//		add_action( 'admin_enqueue_scripts', array( $this, 'registersCloudAssets' ) );
//		add_action( 'admin_menu', array( $this, 'actionRegisterCloutLoginPage' ), 11 );
//
//		if ( isset( $_SERVER['REQUEST_METHOD'] ) && $_SERVER['REQUEST_METHOD'] === 'POST' ) {
//			add_action( 'admin_init', array( $this, 'handleSubmit' ), 10 );
//		}
//
//		if ( isset( $_REQUEST['brizy-cloud-logout'] ) ) {
//			add_action( 'admin_init', array( $this, 'handleLogout' ), 10 );
//		}
//
//		$this->twig = Brizy_TwigEngine::instance( BRIZY_PLUGIN_PATH . "/admin/views/cloud/" );
	}

	public function initializeActions() {
		Brizy_Admin_Cloud_Api::_init( $this->project );
	}

//	public function registersCloudAssets() {
//		$current_screen = get_current_screen();
//		if ( $current_screen->id == self::$subpageId ) {
//			wp_enqueue_script(
//				Brizy_Editor::get()->get_slug() . '-cloud-js',
//				Brizy_Editor::get()->get_url( 'admin/static/js/cloud.js' ),
//				array( 'jquery' ),
//				true
//			);
//		}
//	}
//
//	public function actionGetProjects() {
//		$projects = $this->cloudClient->getProjects( array( 'container' => isset( $_REQUEST['container'] ) ? (int) $_REQUEST['container'] : null ) );
//		wp_send_json_success( $projects );
//		exit;
//	}
//
//	public function actionRegisterCloutLoginPage() {
//		self::$subpageId = add_submenu_page( Brizy_Admin_Settings::menu_slug(),
//			__( 'Cloud' ),
//			__( 'Cloud' ),
//			'manage_options',
//			self::menu_slug(),
//			array( $this, 'render' )
//		);
//	}

//	public function render() {
//
//		$token = $this->project->getMetaValue( 'brizy-cloud-token' );
//
//		if ( ! $token ) {
//			$this->handleLoginPage();
//		} else {
//			$this->handleProjectPage();
//		}
//	}

//	private function handleLoginPage() {
//		$context = array(
//			'nonce'    => wp_nonce_field( 'validate-cloud', '_wpnonce', true, false ),
//			'username' => '',
//			'password' => ''
//		);
//
//		echo $this->twig->render( 'cloud-login.html.twig', $context );
//	}

//	private function handleProjectPage() {
//		$pageUrl       = menu_page_url( self::menu_slug(), false );
//		$containers    = $this->cloudClient->getContainers();
//		$project       = $this->cloudClient->getProject( $this->project->getMetaValue( 'brizy-cloud-project' ) );
//		$usedContainer = isset( $_REQUEST['container'] ) ? (int) $_REQUEST['container'] : ( isset( $containers[0] ) ? $containers[0]->id : null );
//		$projects      = $this->cloudClient->getProjects( array( 'container' => $usedContainer ) );
//		$context       = array(
//			'nonce'             => wp_nonce_field( 'validate-cloud', '_wpnonce', true, false ),
//			'logoutUrl'         => add_query_arg( array( 'brizy-cloud-logout' => 1 ), menu_page_url( self::menu_slug(), false ) ),
//			'containers'        => $containers,
//			'selectedContainer' => is_object( $project ) ? $project->container : ( isset( $containers[0] ) ? array( 'container' => $containers[0]->id ) : null ),
//			'projects'          => $projects,
//			'pageUrl'           => $pageUrl,
//			'projectObject'     => $project
//		);
//
//		echo $this->twig->render( 'cloud-projects.html.twig', $context );
//	}

//	public function handleSubmit() {
//		if ( ! isset( $_POST['_wpnonce'] ) || ! wp_verify_nonce( $_POST['_wpnonce'], 'validate-cloud' ) ) {
//			return;
//		}
//		$pageUrl = menu_page_url( self::menu_slug(), false );
//
//		if ( isset( $_REQUEST['brizy-cloud-login'] ) ) {
//			$this->handleLogin();
//		}
//
//		if ( isset( $_REQUEST['brizy-cloud-logout'] ) ) {
//			$this->handleLogout();
//		}
//
//		if ( isset( $_REQUEST['brizy-cloud-use-container'] ) ) {
//			$this->handleUseContainer();
//		}
//
//		wp_redirect( $pageUrl );
//		exit;
//	}
//
//	public function handleLogin() {
//		if ( ! isset( $_REQUEST['cloud-username'] ) || ! isset( $_REQUEST['cloud-password'] ) ) {
//			Brizy_Admin_Flash::instance()->add_error( __( 'Please provide the username and password.' ) );
//
//			return;
//		}
//
//		try {
//			$token = $this->cloudClient->signIn( $_REQUEST['cloud-username'], $_REQUEST['cloud-password'] );
//
//			if ( ! $token ) {
//				Brizy_Admin_Flash::instance()->add_error( __( 'Unable to obtain authorization data. Please check your credentials.' ) );
//			} else {
//				$this->project->setCloudToken( $token );
//
//				$containers = $this->cloudClient->getContainers();
//
//				if ( isset( $containers[0] ) ) {
//					$this->project->setCloudContainer( $containers[0]->id );
//				}
//
//				$this->project->save();
//
//
//			}
//
//		} catch ( Exception $e ) {
//			Brizy_Logger::instance()->error( 'Unable to obtain cloud token', $e );
//			Brizy_Admin_Flash::instance()->add_error( __( 'Unable to obtain authorization data. Please check your credentials.' ) );
//		}
//
//		$pageUrl = menu_page_url( self::menu_slug(), false );
//		wp_redirect( $pageUrl );
//		exit;
//	}
//
//	public function handleLogout() {
//		$this->project->setCloudToken( null );
//		$this->project->setCloudContainer( null );
//		$this->project->save();
//	}
//
//	public function handleUseContainer() {
//		if ( ! isset( $_REQUEST['brizy-cloud-use-container'] ) || $_REQUEST['brizy-cloud-use-container'] == '' ) {
//			Brizy_Admin_Flash::instance()->add_error( __( 'Please provide the container id' ) );
//
//			return;
//		}
//
//		$projectId = $_REQUEST['brizy-cloud-use-container'];
//
//		if ( $projectId ) {
//			$this->project->setCloudContainer( $projectId );
//			Brizy_Admin_Flash::instance()->add_success( __( 'Success' ) );
//		} else {
//			$this->project->removeMetaValue( 'cloudContainer' );
//		}
//
//		$this->project->save();
//
//		$pageUrl = menu_page_url( self::menu_slug(), false );
//		wp_redirect( $pageUrl );
//		exit;
//	}
//
//	/**
//	 * @return string
//	 */
//	public function menu_slug() {
//		return self::PAGE_KEY;
//	}
//
//	/**
//	 * @return bool
//	 */
//	public function isLoggedIn() {
//		return ! ! $this->project->getCloudToken();
//	}
}
