<?php

class Brizy_Admin_Symbols_Api extends Brizy_Admin_AbstractApi {
	const nonce = Brizy_Editor_API::nonce;
	const CREATE_ACTION = '_add_symbol';
	const UPDATE_ACTION = '_update_symbol';
	const DELETE_ACTION = '_delete_symbol';
	const LIST_ACTION = '_list_symbols';
	const FILTERED_LIST_ACTION = '_filtered_list_symbols';
	const ITEM_ACTION = '_get_symbol';


	/**
	 * @var Brizy_Admin_Symbols_Manager
	 */
	private $manager;


	/**
	 * Brizy_Admin_Rules_Api constructor.
	 *
	 * @param Brizy_Admin_Symbols_Manager $manager
	 */
	public function __construct( $manager ) {
		$this->manager = $manager;
		parent::__construct();
	}

	/**
	 * @return Brizy_Admin_Rules_Api
	 */
	public static function _init() {
		static $instance;
		if ( ! $instance ) {
			$instance = new self( new Brizy_Admin_Symbols_Manager() );
		}

		return $instance;
	}

	protected function getRequestNonce() {
		return $this->param( 'hash' );
	}

	protected function initializeApiActions() {
		$pref = 'wp_ajax_' . Brizy_Editor::prefix();
		add_action( $pref . self::CREATE_ACTION, array( $this, 'actionCreateOrUpdate' ) );
		add_action( $pref . self::UPDATE_ACTION, array( $this, 'actionCreateOrUpdate' ) );
		add_action( $pref . self::DELETE_ACTION, array( $this, 'actionDelete' ) );
		add_action( $pref . self::LIST_ACTION, array( $this, 'actionGetList' ) );
		add_action( $pref . self::FILTERED_LIST_ACTION, array( $this, 'actionGetListFiltered' ) );
		add_action( $pref . self::ITEM_ACTION, array( $this, 'actionGetItem' ) );
	}



	public function actionGetItem() {
		$this->verifyNonce( self::nonce );
		try {
			$symbol = $this->manager->getByUID( $this->param( 'uid' ) );
			$this->success( $symbol->convertToFullOptionValue() );
		} catch ( Exception $e ) {
			Brizy_Logger::instance()->error( $e->getMessage(), [ $e ] );
			$this->error( 400, $e->getMessage() );
		}

		return null;
	}

	public function actionGetListFiltered() {
		$this->verifyNonce( self::nonce );
		try {
			$symbols = $this->manager->getFiltered( (array) $this->param( 'uid' ) );
			$symbols = array_map( function ( $symbol ) {
				return $symbol->convertToFullOptionValue();
			}, $symbols );
			$this->success( $symbols );
		} catch ( Exception $e ) {
			Brizy_Logger::instance()->error( $e->getMessage(), [ $e ] );
			$this->error( 400, $e->getMessage() );
		}

		return null;
	}

	public function actionGetList() {
		$this->verifyNonce( self::nonce );
		try {
			$symbols = $this->manager->getList();
			$this->success( $symbols );
		} catch ( Exception $e ) {
			Brizy_Logger::instance()->error( $e->getMessage(), [ $e ] );
			$this->error( 400, $e->getMessage() );
		}

		return null;
	}

	public function actionCreateOrUpdate() {

		$this->verifyNonce( self::nonce );
		$data = file_get_contents( "php://input" );
		try {

			$asymbols = $this->manager->createFromJson( $data );
			foreach ( $asymbols as $asymbol ) {
				$this->manager->validateSymbol( $asymbol );
			}
			$this->manager->saveAllSymbols( $asymbols );
		} catch ( Exception $e ) {
			$this->error( 400, "Error: " . $e->getMessage() );
		}
		wp_send_json_success( $asymbols, 200 );
	}

	public function actionDelete() {

		$this->verifyNonce( self::nonce );
		$uids = (array) $this->param( 'uid' );
		try {
			if ( ! $uids ) {
				throw new Exception( "'uid' parameter is missing" );
			}
			foreach ( $uids as $uid ) {
				$this->manager->deleteSymbol( $uid );
			}

		} catch ( Exception $e ) {
			$this->error( 400, "Error: " . $e->getMessage() );
		}
		$this->success( null );
	}

}
