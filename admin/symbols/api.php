<?php


class Brizy_Admin_Symbols_Api extends Brizy_Admin_AbstractApi {
	const nonce = Brizy_Editor_API::nonce;
	const CREATE_ACTION = '_add_symbol';
	const UPDATE_ACTION = '_update_symbol';
	const DELETE_ACTION = '_delete_symbol';
	const LIST_ACTION = '_list_symbols';


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
		add_filter( 'brizy_editor_config', array( $this, 'editorConfig' ), 10, 2 );
	}

	public function editorConfig( $config, $context = null ) {
		$config['symbols'] = $this->manager->getList();

		return $config;
	}

	/**
	 * @return null|void
	 */
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
			$asymbol = $this->manager->createFromJson( $data );
			$symbol  = null;
			if ( $asymbol->getUid() ) {
				$symbol = $this->manager->get( $asymbol->getUid() );
				$symbol->patchFrom( $asymbol );
			} else {
				$symbol = $asymbol;
			}
			$symbol->incrementVersion();
			$this->manager->validateSymbol( $symbol );
			$this->manager->saveSymbol( $symbol );
		} catch ( Exception $e ) {
			$this->error( 400, "Error" . $e->getMessage() );
		}

		wp_send_json_success( $symbol, 200 );
	}

	public function actionDelete() {

		$this->verifyNonce( self::nonce );

		$uid = $this->param( 'uid' );

		if ( ! $uid ) {
			$this->error( 400, "Error: Please provide the symbol uid" );
		}

		try {
			$symbol = $this->manager->get( $uid );
			$this->manager->deleteSymbol( $symbol );
		} catch ( Exception $e ) {
			$this->error( 400, 'Unable to delete symbol' );
		}

		$this->success( null );
	}

}
