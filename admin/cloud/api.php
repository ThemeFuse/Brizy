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

	const AJAX_SIGNIN_ACTION = '-cloud-signin';
	const AJAX_SIGNUP_ACTION = '-cloud-signup';
	const AJAX_SIGNOUT_ACTION = '-cloud-signout';
	const AJAX_RESET_PASSWORD_ACTION = '-cloud-resetpassword';
	const AJAX_TRIGGER_SYNC_ACTION = '-cloud-sync';
	const AJAX_SYNC_ALLOWED = '-cloud-sync-allowed';

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
	public function __construct( $project ) {

		$this->project = $project;
		$this->setClient( Brizy_Admin_Cloud_Client::instance( $project, new WP_Http() ) );
		parent::__construct();
	}

	/**
	 * @param Brizy_Editor_Project $project
	 *
	 * @return Brizy_Admin_Cloud_Api
	 * @throws Exception
	 */
	public static function _init( $project ) {
		static $instance;

		if ( ! $instance ) {
			$instance = new self( $project );
		}

		return $instance;
	}


	protected function initializeApiActions() {
		$pref = 'wp_ajax_' . Brizy_Editor::prefix();
		add_action( $pref . self::AJAX_SIGNIN_ACTION, array( $this, 'actionSignIn' ) );
		add_action( $pref . self::AJAX_SIGNUP_ACTION, array( $this, 'actionSignUp' ) );
		add_action( $pref . self::AJAX_SIGNOUT_ACTION, array( $this, 'actionSignOut' ) );
		add_action( $pref . self::AJAX_RESET_PASSWORD_ACTION, array( $this, 'actionResetPassword' ) );
		add_action( $pref . self::AJAX_TRIGGER_SYNC_ACTION, array( $this, 'actionSync' ) );
		add_action( $pref . self::AJAX_SYNC_ALLOWED, array( $this, 'actionSyncAllowed' ) );
	}

	public function actionSignIn() {

		$this->verifyNonce( self::nonce );

		$data = file_get_contents( "php://input" );

		if ( ( $data = json_decode( $data ) ) === false ) {
			$this->error( 400, 'Bad request' );
		}

		if ( $token = $this->getClient()->signIn( $data->email, $data->password ) ) {

			// this is important when you delete block from cloud the local blocks
			// will be deleted based on this valued
			$this->project->setCloudAccountId( $token );
			$this->project->setCloudToken( $token );

			$containers = $this->getClient()->getContainers();

			if ( isset( $containers[0] ) ) {
				$this->project->setCloudContainer( $containers[0]->id );
			} else {
				$this->error( 400, 'SingIn failed. Invalid container.' );
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

			// this is important when you delete block from cloud the local blocks
			// will be deleted based on this valued
			$this->project->setCloudAccountId( $token );
			$this->project->setCloudToken( $token );

			$containers = $this->getClient()->getContainers();

			if ( isset( $containers[0] ) ) {
				$this->project->setCloudContainer( $containers[0]->id );
			} else {
				$this->error( 400, 'Unable to obtain the container.' );
			}

			$this->project->saveStorage();
			$this->success( [] );
		} else {
			$this->error( 400, 'Sing Up failed' );
		}
	}

	public function actionSignOut() {

		$this->verifyNonce( self::nonce );

		// clear version in case something gets wonrg.
		Brizy_Admin_Cloud_Client::clearVersionCache();

		// this is important when you delete block from cloud the local blocks
		// will be deleted based on this valued
		$this->project->setCloudAccountId( null );
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

	public function actionSync() {
		try {

			if ( ! $this->project->getCloudToken() ) {
				$this->error( 400, 'Unauthorized' );
			}

			$merged = array_merge( $this->syncLayouts(0, true ), $this->syncBlocks(0, true ) );

			return $this->success( [ 'synchronized' => count( $merged ) ] );
		} catch ( Exception $e ) {
			Brizy_Logger::instance()->critical( 'Sync failed', [ $e ] );
			$this->error( 500, 'Sync failed' );

		}
	}

	public function actionSyncAllowed() {

		try {
			$versions                  = $this->getClient()->getCloudEditorVersions();
			$response                  = [];
			$response['isSyncAllowed'] = $versions['sync'] == BRIZY_SYNC_VERSION;

			return $this->success( $response );
		} catch ( Exception $e ) {
			Brizy_Logger::instance()->critical( 'Sync failed', [ $e ] );
			$this->error( 400, 'Sync unauthorized.' );
		}
	}

	/**
	 * @return null
	 */
	protected function getRequestNonce() {
		return $this->param( 'hash' );
	}
}
