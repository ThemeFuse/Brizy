<?php


class Brizy_Admin_Rules_Api extends Brizy_Admin_AbstractApi {

	const nonce = Brizy_Editor_API::nonce;
	const CREATE_RULES_ACTION = 'brizy_add_rules';
	const CREATE_RULE_ACTION = 'brizy_add_rule';
	const UPDATE_RULES_ACTION = 'brizy_update_rules';
	const DELETE_RULE_ACTION = 'brizy_delete_rule';
	const LIST_RULE_ACTION = 'brizy_list_rules';
	/**
	 * @var Brizy_Admin_Rules_Manager
	 */
	private $manager;


	/**
	 * Brizy_Admin_Rules_Api constructor.
	 *
	 * @param Brizy_Admin_Rules_Manager $manager
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
			$instance = new self( new Brizy_Admin_Rules_Manager() );
		}

		return $instance;
	}

	protected function getRequestNonce() {
		return $this->param( 'hash' );
	}

	protected function initializeApiActions() {
		add_action( 'wp_ajax_' . self::CREATE_RULE_ACTION, array( $this, 'actionCreateRule' ) );
		add_action( 'wp_ajax_' . self::CREATE_RULES_ACTION, array( $this, 'actionCreateRules' ) );
		add_action( 'wp_ajax_' . self::UPDATE_RULES_ACTION, array( $this, 'actionUpdateRules' ) );
		add_action( 'wp_ajax_' . self::DELETE_RULE_ACTION, array( $this, 'actionDeleteRule' ) );
		add_action( 'wp_ajax_' . self::LIST_RULE_ACTION, array( $this, 'actionGetRuleList' ) );
	}

	/**
	 * @return null|void
	 */
	public function actionGetRuleList() {

		$this->verifyNonce( self::nonce );

		$postId = (int) $this->param( 'post' );

		if ( ! $postId ) {
			wp_send_json_error( (object) array( 'message' => 'Invalid template' ), 400 );
		}

		try {
			$rules = $this->manager->getRules( $postId );

			$this->success( $rules );
		} catch ( Exception $e ) {
			Brizy_Logger::instance()->error( $e->getMessage(), [ $e ] );
			$this->error( 400, $e->getMessage() );
		}

		return null;
	}

	public function actionCreateRule() {

		$this->verifyNonce( self::nonce );

		$postId            = (int) $this->param( 'post' );
		$ignoreDataVersion = (int) $this->param( 'ignoreDataVersion' );
		$dataVersion       = (int) $this->param( 'dataVersion' );

		$postType = get_post_type( $postId );

		if ( ! $postId ) {
			$this->error( 400, "Validation" . 'Invalid post' );
		}

		if ( ! $dataVersion && $ignoreDataVersion===0 ) {
			$this->error( 400, "Validation" . 'Invalid data version' );
		}

		$ruleData = file_get_contents( "php://input" );

		try {
			$rule = $this->manager->createRuleFromJson( $ruleData, $postType );
		} catch ( Exception $e ) {
			$this->error( 400, "Validation" . $e->getMessage() );
		}

		try {
			// validate rule
			$ruleValidator = Brizy_Admin_Rules_ValidatorFactory::getValidator( $postId );

			if ( ! $ruleValidator ) {
				$this->error( 400, 'Unable to get the rule validator for this post type' );
			}

			$ruleValidator->validateRuleForPostId( $rule, $postId );

			if ( !$ignoreDataVersion ) {
				$post = Brizy_Editor_Entity::get( $postId );
				$post->setDataVersion( $dataVersion );
				$post->save( 0 );
			}

			$this->manager->addRule( $postId, $rule );

		} catch ( Brizy_Editor_Exceptions_DataVersionMismatch $e ) {
			$this->error( 400, 'Invalid data version' );
		} catch ( Brizy_Admin_Rules_ValidationException $e ) {
			wp_send_json_error( array( 'message' => $e->getMessage(), 'rule' => $e->getRuleId() ), 400 );
		} catch ( Exception $e ) {
			$this->error( 400, $e->getMessage() );
		}

		wp_send_json_success( $rule, 200 );
	}

	public function actionCreateRules() {
		$this->verifyNonce( self::nonce );

		$postId            = (int) $this->param( 'post' );
		$ignoreDataVersion = (int) $this->param( 'ignoreDataVersion' );
		$dataVersion       = (int) $this->param( 'dataVersion' );
		$postType          = get_post_type( $postId );

		if ( ! $postId ) {
			$this->error( 400, 'Invalid post' );
		}

		if ( ! $dataVersion && $ignoreDataVersion===0) {
			$this->error( 400, "Validation" . 'Invalid data version' );
		}

		$rulesData = file_get_contents( "php://input" );

		try {
			$rules = $this->manager->createRulesFromJson( $rulesData, $postType );
		} catch ( Exception $e ) {
			$this->error( 400, $e->getMessage() );
		}

		// validate rule
		$validator = Brizy_Admin_Rules_ValidatorFactory::getValidator( $postId );

		if ( ! $validator ) {
			$this->error( 400, 'Unable to get the rule validator for this post type' );
		}

		try {
			$validator->validateRulesForPostId( $rules, $postId );

			if ( !$ignoreDataVersion ) {
				$post = Brizy_Editor_Entity::get( $postId );
				$post->setDataVersion( $dataVersion );
				$post->save( 0 );
			}

			foreach ( $rules as $newRule ) {
				$this->manager->addRule( $postId, $newRule );
			}

		} catch ( Brizy_Editor_Exceptions_DataVersionMismatch $e ) {
			$this->error( 400, 'Invalid data version' );
		} catch ( Brizy_Admin_Rules_ValidationException $e ) {
			wp_send_json_error( array(
				'rule'    => $e->getRuleId(),
				'message' => $e->getMessage()
			), 400 );
		}

		$this->success( $rules );

		return null;
	}


	public function actionUpdateRules() {
		$this->verifyNonce( self::nonce );

		$postId            = (int) $this->param( 'post' );
		$ignoreDataVersion = (int) $this->param( 'ignoreDataVersion' );
		$dataVersion       = (int) $this->param( 'dataVersion' );
		$postType          = get_post_type( $postId );

		if ( ! $postId ) {
			wp_send_json_error( (object) array( 'message' => 'Invalid template' ), 400 );
		}

		if ( ! $dataVersion && $ignoreDataVersion===0) {
			$this->error( 400, "Validation" . 'Invalid data version' );
		}

		$rulesData = file_get_contents( "php://input" );

		try {
			$rules = $this->manager->createRulesFromJson( $rulesData, $postType );
		} catch ( Exception $e ) {
			Brizy_Logger::instance()->error( $e->getMessage(), [ $e ] );
			$this->error( 400, $e->getMessage() );
		}

		$validator = Brizy_Admin_Rules_ValidatorFactory::getValidator( $postId );
		if ( ! $validator ) {
			$this->error( 400, 'Unable to get the rule validator for this post type' );
		}

		try {
			if ( !$ignoreDataVersion ) {
				$post = Brizy_Editor_Entity::get( $postId );
				$post->setDataVersion( $dataVersion );
				$post->save( 0 );
			}

			$this->manager->saveRules( $postId, $rules );
		} catch ( Brizy_Editor_Exceptions_DataVersionMismatch $e ) {
			$this->error( 400, 'Invalid data version' );
		} catch ( Exception $e ) {
			$this->error( 400, 'Unable to save rules' );
		}

		wp_send_json_success( $rules, 200 );

		return null;
	}

	public function actionDeleteRule() {

		$this->verifyNonce( self::nonce );

		$postId            = (int) $this->param( 'post' );
		$ignoreDataVersion = (int) $this->param( 'ignoreDataVersion' );
		$dataVersion       = (int) $this->param( 'dataVersion' );
		$ruleId            = $this->param( 'rule' );

		if ( ! $postId || ! $ruleId ) {
			$this->error( 400, 'Invalid request' );
		}

		if ( ! $dataVersion && $ignoreDataVersion===0 ) {
			$this->error( 400, "Validation" . 'Invalid data version' );
		}

		try {

			if ( !$ignoreDataVersion ) {
				$post = Brizy_Editor_Entity::get( $postId );
				$post->setDataVersion( $dataVersion );
				$post->save( 0 );
			}

			$this->manager->deleteRule( $postId, $ruleId );
		} catch ( Brizy_Editor_Exceptions_DataVersionMismatch $e ) {
			$this->error( 400, 'Invalid data version' );
		} catch ( Exception $e ) {
			$this->error( 400, 'Unable to delete rules' );
		}

		$this->success( null );
	}
}
