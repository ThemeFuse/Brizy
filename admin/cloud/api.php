<?php
/**
 * Created by PhpStorm.
 * User: alex
 * Date: 7/18/18
 * Time: 10:48 AM
 */


class Brizy_Admin_Cloud_Api extends Brizy_Admin_AbstractApi {

	use Brizy_Admin_Cloud_SyncAware;

	const nonce = 'brizy-api';

	const AJAX_SIGNIN_ACTION = 'brizy-cloud-signin';
	const AJAX_SIGNUP_ACTION = 'brizy-cloud-signup';
	const AJAX_SIGNOUT_ACTION = 'brizy-cloud-signout';
	const AJAX_RESET_PASSWORD_ACTION = 'brizy-cloud-resetpassword';
	const AJAX_TRIGGER_SYNC_ACTION = 'brizy-cloud-sync';

	/**
	 * @var Brizy_Editor_Project
	 */
	private $project;

	/**
	 * @var Brizy_Admin_Cloud_Client
	 */
	private $cloudClient;

	/**
	 * Brizy_Admin_Cloud_Api constructor.
	 *
	 * @param Brizy_Editor_Project $project
	 */
	public function __construct( Brizy_Editor_Project $project ) {

		$this->project = $project;
		$this->setClient( new Brizy_Admin_Cloud_Client( $project, new WP_Http() ) );
		parent::__construct();
	}

	protected function initializeApiActions() {
		add_action( 'wp_ajax_' . self::AJAX_SIGNIN_ACTION, array( $this, 'actionSignIn' ) );
		add_action( 'wp_ajax_' . self::AJAX_SIGNUP_ACTION, array( $this, 'actionSignUp' ) );
		add_action( 'wp_ajax_' . self::AJAX_SIGNOUT_ACTION, array( $this, 'actionSignOut' ) );
		add_action( 'wp_ajax_' . self::AJAX_RESET_PASSWORD_ACTION, array( $this, 'actionResetPassword' ) );
		add_action( 'wp_ajax_' . self::AJAX_TRIGGER_SYNC_ACTION, array( $this, 'actionSync' ) );
	}


	public function actionSignIn() {

		$this->verifyNonce( self::nonce );

		$data = file_get_contents( "php://input" );

		if ( ( $data = json_decode( $data ) ) === false ) {
			$this->error( 400, 'Bad request' );
		}

		if ( $token = $this->getClient()->signIn( $data->email, $data->password ) ) {
			$this->project->setCloudToken( $token );

			$containers = $this->getClient()->getContainers();

			if ( isset( $containers[0] ) ) {
				$this->project->setCloudContainer( $containers[0]->id );
			}

			$this->project->saveStorage();
			$this->success( [] );
		} else {
			$this->error( 400, 'SingIn failed' );
		}
	}

	public function actionSignUp() {

		$this->verifyNonce( self::nonce );

		$data = file_get_contents( "php://input" );

		if ( ( $data = json_decode( $data ) ) === false ) {
			$this->error( 400, 'Bad request' );
		}

		if ( $token = $this->getClient()->signUp( $data->firstName, $data->lastName, $data->email, $data->password, $data->confirmPassword ) ) {
			$this->project->setCloudToken( $token );
			$this->project->saveStorage();
			$this->success( [] );
		} else {
			$this->error( 400, 'Sing Up failed' );
		}
	}

	public function actionSignOut() {

		$this->verifyNonce( self::nonce );

		$this->project->setCloudToken( null );
		$this->project->saveStorage();

		wp_clear_scheduled_hook( Brizy_Admin_Cloud_Cron::BRIZY_CLOUD_CRON_KEY );

		$this->success( [] );
	}

	public function actionResetPassword() {

		$this->verifyNonce( self::nonce );

		$data = file_get_contents( "php://input" );

		if ( ( $data = json_decode( $data ) ) === false ) {
			$this->error( 400, 'Bad request' );
		}

		if ( ! $data->email ) {
			$this->error( 400, 'Invalid email' );
		}

		if ( $token = $this->getClient()->resetPassword( $data->email ) ) {
			$this->success( [] );
		} else {
			$this->error( 400, 'Reset password failed' );
		}
	}

	/**
	 * @param Brizy_Editor_Project $project
	 *
	 * @return Brizy_Admin_Cloud_Api
	 * @throws Exception
	 */
	public static function _init( Brizy_Editor_Project $project ) {
		static $instance;

		if ( ! $instance ) {
			$instance = new self( $project );
		}

		return $instance;
	}

	public function actionSync() {
		try {

			if ( ! $this->project->getCloudToken() ) {
				$this->error( 400, 'Unauthorized' );
			}

			$merged = array_merge( $this->syncLayouts( true ), $this->syncBlocks( true ) );

			return $this->success( [ 'synchronized' => count( $merged ) ] );
		} catch ( Exception $e ) {
			$this->error( 500, 'Sync failed' );
		}
	}


	/**
	 * @return null
	 */
	protected function getRequestNonce() {
		return self::nonce;
	}
}