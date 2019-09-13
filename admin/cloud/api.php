<?php
/**
 * Created by PhpStorm.
 * User: alex
 * Date: 7/18/18
 * Time: 10:48 AM
 */


class Brizy_Admin_Cloud_Api extends Brizy_Admin_AbstractApi {

	const nonce = 'brizy-api';

	const AJAX_SIGNIN_ACTION = 'brizy-cloud-signin';
	const AJAX_SIGNUP_ACTION = 'brizy-cloud-signup';
	const AJAX_RESET_PASSWORD_ACTION = 'brizy-cloud-resetpassword';

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

		$this->project     = $project;
		$this->cloudClient = new Brizy_Admin_Cloud_Client( $project, new WP_Http() );
		parent::__construct();
	}

	protected function initializeApiActions() {
		add_action( 'wp_ajax_' . self::AJAX_SIGNIN_ACTION, array( $this, 'actionSignIn' ) );
		add_action( 'wp_ajax_' . self::AJAX_SIGNUP_ACTION, array( $this, 'actionSignUp' ) );
		add_action( 'wp_ajax_' . self::AJAX_RESET_PASSWORD_ACTION, array( $this, 'actionResetPassword' ) );
	}

	public function actionSignIn() {

		$this->verifyNonce( self::nonce );

		$data = file_get_contents( "php://input" );

		if ( ( $data = json_decode( $data ) ) === false ) {
			$this->error( 400, 'Bad request' );
		}

		if ( $token = $this->cloudClient->signIn( $data->email, $data->password ) ) {
			$this->project->setCloudToken( $token );

			$containers = $this->cloudClient->getContainers();

			if ( isset( $containers[0] ) ) {
				$this->project->setCloudContainer( $containers[0]->id );
			}

			$this->project->save();
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

		if ( $token = $this->cloudClient->signUp( $data->firstName, $data->lastName, $data->email, $data->password, $data->confirmPassword ) ) {
			$this->project->setCloudToken( $token );
			$this->project->save();
			$this->success( [] );
		} else {
			$this->error( 400, 'Sing Up failed' );
		}
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

		if ( $token = $this->cloudClient->resetPassword( $data->email ) ) {
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

	/**
	 * @return null
	 */
	protected function getRequestNonce() {
		return self::nonce;
	}
}