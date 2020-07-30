<?php
/**
 * Created by PhpStorm.
 * User: alex
 * Date: 2/7/19
 * Time: 10:13 AM
 */


class Brizy_Editor_Accounts_Api extends Brizy_Admin_AbstractApi {

	const nonce = 'brizy-api';
	const BRIZY_GET_ACCOUNT = '_get_account';
	const BRIZY_GET_ACCOUNTS = '_get_accounts';
	const BRIZY_ADD_ACCOUNT = '_add_account';
	const BRIZY_UPDATE_ACCOUNT = '_update_account';
	const BRIZY_DELETE_ACCOUNT = '_delete_account';

	/**
	 * @var Brizy_Editor_Accounts_ServiceAccountManager
	 */
	private $manager;

	/**
	 * Brizy_Admin_Rules_Api constructor.
	 *
	 * @param Brizy_Editor_Accounts_ServiceAccountManager $manager
	 */
	public function __construct( $manager ) {
		$this->manager = $manager;

		parent::__construct();
	}

	/**
	 * @return Brizy_Editor_Accounts_Api
	 * @throws Exception
	 */
	public static function _init() {
		static $instance;

		if ( ! $instance ) {
			$instance = new self( new Brizy_Editor_Accounts_ServiceAccountManager( Brizy_Editor_Project::get() ) );
		}

		return $instance;
	}

	/***
	 * @return null
	 */
	protected function getRequestNonce() {
		return $this->param( 'hash' );
	}

	/**
	 * Register all api actions
	 */
	protected function initializeApiActions() {
		$pref = 'wp_ajax_' . Brizy_Editor::prefix();
		add_action( $pref . self::BRIZY_GET_ACCOUNT, array( $this, 'actionGetAccount' ) );
		add_action( $pref . self::BRIZY_GET_ACCOUNTS, array( $this, 'actionGetAccounts' ) );
		add_action( $pref . self::BRIZY_ADD_ACCOUNT, array( $this, 'actionAddAccount' ) );
		add_action( $pref . self::BRIZY_UPDATE_ACCOUNT, array( $this, 'actionUpdateAccount' ) );
		add_action( $pref . self::BRIZY_DELETE_ACCOUNT, array( $this, 'actionDeleteAccount' ) );
	}


	public function actionGetAccount() {
		$this->verifyNonce( self::nonce );
		if ( ! $this->param( 'id' ) ) {
			$this->error( 400, 'Invalid account id' );
		}
		try {
			$manager = new Brizy_Editor_Accounts_ServiceAccountManager( Brizy_Editor_Project::get() );
			$account = $manager->getAccount( $this->param( 'id' ) );

			if ( ! $account ) {
				$this->error( 404, 'Account not found' );
			}

			$this->success( $account );
		} catch ( Exception $e ) {
			Brizy_Logger::instance()->critical( $e->getMessage(), array( $e ) );
			$this->error( 500, $e->getMessage() );
		}
	}


	public function actionGetAccounts() {
		$this->verifyNonce( self::nonce );

		$filter = array();

		if ( $this->param( 'group' ) ) {
			$filter['group'] = $this->param( 'group' );
		}
		if ( $this->param( 'service' ) ) {
			$filter['service'] = $this->param( 'service' );
		}

		try {
			$manager  = new Brizy_Editor_Accounts_ServiceAccountManager( Brizy_Editor_Project::get() );
			$accounts = $manager->getFilteredAccounts( $filter );
			$this->success( $accounts );
		} catch ( Exception $e ) {
			Brizy_Logger::instance()->critical( $e->getMessage(), array( $e ) );
			$this->error( 500, $e->getMessage() );
		}
	}

	public function actionAddAccount() {
		$this->verifyNonce( self::nonce );
		try {
			$manager  = new Brizy_Editor_Accounts_ServiceAccountManager( Brizy_Editor_Project::get() );
			$instance = Brizy_Editor_Accounts_AbstractAccount::createFromJson( json_decode( file_get_contents( 'php://input' ) ) );
			$instance->validate();
			$manager->addAccount( $instance );
			$this->success( $instance );
		} catch ( Exception $e ) {
			Brizy_Logger::instance()->critical( $e->getMessage(), array( $e ) );
			$this->error( 500, $e->getMessage() );
		}
	}

	public function actionUpdateAccount() {
		$this->verifyNonce( self::nonce );
		try {
			$manager  = new Brizy_Editor_Accounts_ServiceAccountManager( Brizy_Editor_Project::get() );
			$instance = Brizy_Editor_Accounts_AbstractAccount::createFromJson( json_decode( file_get_contents( 'php://input' ) ) );
			$manager->updateAccount( $instance );
			$this->success( $instance );
		} catch ( Exception $e ) {
			Brizy_Logger::instance()->critical( $e->getMessage(), array( $e ) );
			$this->error( 500, $e->getMessage() );
		}
	}

	public function actionDeleteAccount() {
		$this->verifyNonce( self::nonce );
		try {

			if ( ! $this->param( 'id' ) ) {
				$this->error( 400, 'Invalid account id' );
			}

			$manager = new Brizy_Editor_Accounts_ServiceAccountManager( Brizy_Editor_Project::get() );
			$manager->deleteAccountById( $this->param( 'id' ) );
			$this->success( null );
		} catch ( Exception $e ) {
			Brizy_Logger::instance()->critical( $e->getMessage(), array( $e ) );
			$this->error( 500, $e->getMessage() );
		}
	}

}