<?php


class Brizy_Editor_Forms_Api {

	const AJAX_GET_FORM = 'brizy_get_form';
	const AJAX_CREATE_FORM = 'brizy_create_form';
	const AJAX_DELETE_FORM = 'brizy_delete_form';
	const AJAX_SUBMIT_FORM = 'brizy_submit_form';

	const AJAX_GET_INTEGRATION = 'brizy_get_integration';
	const AJAX_CREATE_INTEGRATION = 'brizy_create_integration';
	const AJAX_UPDATE_INTEGRATION = 'brizy_update_integration';
	const AJAX_DELETE_INTEGRATION = 'brizy_delete_integration';

	const AJAX_AUTHENTICATION_CALLBACK = 'brizy_authentication_callback';

	/**
	 * @var Brizy_Editor_Post
	 */
	private $post;

	/**
	 * @return Brizy_Editor_Post
	 */
	public function get_post() {
		return $this->post;
	}

	/**
	 * Brizy_Editor_API constructor.
	 *
	 * @param Brizy_Editor_Post $post
	 */
	public function __construct( $post ) {

		$this->post = $post;

		$this->initialize();
	}

	private function initialize() {

		if ( Brizy_Editor::is_user_allowed() ) {
			add_action( 'wp_ajax_' . self::AJAX_GET_FORM, array( $this, 'get_form' ) );
			add_action( 'wp_ajax_' . self::AJAX_CREATE_FORM, array( $this, 'create_form' ) );
			add_action( 'wp_ajax_' . self::AJAX_DELETE_FORM, array( $this, 'delete_form' ) );

			add_action( 'wp_ajax_' . self::AJAX_CREATE_INTEGRATION, array( $this, 'createIntegration' ) );
			add_action( 'wp_ajax_' . self::AJAX_GET_INTEGRATION, array( $this, 'getIntegration' ) );
			add_action( 'wp_ajax_' . self::AJAX_UPDATE_INTEGRATION, array( $this, 'updateIntegration' ) );
			add_action( 'wp_ajax_' . self::AJAX_DELETE_INTEGRATION, array( $this, 'deleteIntegration' ) );
		}

		add_action( 'wp_ajax_' . self::AJAX_SUBMIT_FORM, array( $this, 'submit_form' ) );
		add_action( 'wp_ajax_nopriv_' . self::AJAX_SUBMIT_FORM, array( $this, 'submit_form' ) );
	}

	protected function error( $code, $message ) {
		wp_send_json_error( array( 'code' => $code, 'message' => $message ), $code );
	}

	protected function success( $data ) {
		wp_send_json_success( $data );
	}

	private function authorize() {
		if ( ! wp_verify_nonce( $_REQUEST['hash'], Brizy_Editor_API::nonce ) ) {
			wp_send_json_error( array( 'code' => 400, 'message' => 'Bad request' ), 400 );
		}
	}

	public function get_form() {
		try {
			$this->authorize();

			$manager = new Brizy_Editor_Forms_FormManager( Brizy_Editor_Project::get() );

			$form = $manager->getForm( $_REQUEST['formId'] );

			if ( $form ) {
				$this->success( $form );
			}

			$this->error( 404, 'Form not found' );

		} catch ( Exception $exception ) {
			Brizy_Logger::instance()->exception( $exception );
			$this->error( $exception->getCode(), $exception->getMessage() );
			exit;
		}
	}

	public function create_form() {
		try {
			$this->authorize();

			$manager           = new Brizy_Editor_Forms_FormManager( Brizy_Editor_Project::get() );
			$instance          = Brizy_Editor_Forms_Form::createFromJson( json_decode( file_get_contents( 'php://input' ) ) );
			$validation_result = $instance->validate();

			if ( $validation_result === true ) {
				$manager->addForm( $instance );
				$this->success( $instance );
			}

			$this->error( 400, $validation_result );

		} catch ( Exception $exception ) {
			Brizy_Logger::instance()->exception( $exception );
			$this->error( $exception->getCode(), $exception->getMessage() );
			exit;
		}
	}

	public function delete_form() {
		try {
			$this->authorize();
			$manager = new Brizy_Editor_Forms_FormManager( Brizy_Editor_Project::get() );
			$manager->deleteFormById( $_REQUEST['formId'] );
			$this->success( array() );
		} catch ( Exception $exception ) {
			Brizy_Logger::instance()->exception( $exception );
			$this->error( $exception->getCode(), $exception->getMessage() );
			exit;
		}
	}

	public function submit_form() {
		try {
			$manager = new Brizy_Editor_Forms_FormManager( Brizy_Editor_Project::get() );
			/**
			 * @var Brizy_Editor_FormsCompatibility fix_Form $form ;
			 */

			$form = $manager->getForm( $_REQUEST['form_id'] );

			if ( ! $form ) {
				$this->error( 400, "Invalid form id" );
			}

			$fields = json_decode( stripslashes( $_REQUEST['data'] ) );

			if ( ! $fields ) {
				$this->error( 400, "Invalid form data" );
			}


			$form   = apply_filters( 'brizy_form', $form );
			$fields = apply_filters( 'brizy_form_submit_data', $fields, $form );


			foreach ( $form->getIntegrations() as $integration ) {
				if ( ! $integration->isCompleted() ) {
					continue;
				}

				try {

					if ( $integration instanceof Brizy_Editor_Forms_WordpressIntegration ) {

						$headers   = array();
						$headers[] = 'Content-type: text/html; charset=UTF-8';

						$field_string = array();
						foreach ( $fields as $field ) {
							$field_string[] = "{$field->label}: " . esc_html( $field->value );
						}

						$email_body = implode( '<br>', $field_string );

						$headers    = apply_filters( 'brizy_form_email_headers', $headers, $form, $fields );
						$email_body = apply_filters( 'brizy_form_email_body', $email_body, $form, $fields );

						if ( ! function_exists( 'wp_mail' ) ) {
							throw new Exception( 'Please check your wordpress configuration.' );
						}

						$result = wp_mail(
							$integration->getEmailTo(),
							$integration->getSubject(),
							$email_body,
							$headers
						);

					} else {

						/**
						 * @var \BrizyForms\Service\Service $service ;
						 */
						$service = \BrizyForms\ServiceFactory::getInstance( $integration->getId() );

						if ( ! ( $service instanceof \BrizyForms\Service\Service ) ) {
							$this->error( 400, "Invalid integration service" );
						}

						do_action( 'brizy_submit_form', $service, $form, $fields, $integration );
					}
				} catch ( Exception $e ) {
					Brizy_Logger::instance()->exception( $e );
					$this->error( 500, 'Member was not created.' );
				}
			}

			$this->success( 200 );

		} catch ( Exception $exception ) {
			Brizy_Logger::instance()->exception( $exception );
			$this->error( $exception->getCode(), $exception->getMessage() );
			exit;
		}
	}

	public function createIntegration() {
		$this->authorize();
		$manager = new Brizy_Editor_Forms_FormManager( Brizy_Editor_Project::get() );

		$form = $manager->getForm( $_REQUEST['formId'] );

		if ( ! $form ) {
			$this->error( 400, "Invalid form id" );
		}

		$integration = Brizy_Editor_Forms_AbstractIntegration::createInstanceFromJson( json_decode( file_get_contents( 'php://input' ) ) );

		if ( $form->getIntegration( $integration->getid() ) ) {
			$this->error( 400, "This integration is already created" );
		}

		$integration = apply_filters( 'brizy_create_integration', $integration, $form );
		$integration = apply_filters( 'brizy_add_integration_accounts', $integration, $form );

		if ( $form->addIntegration( $integration ) ) {
			$manager->addForm( $form );
			$this->success( $integration );
		}

		$this->error( 500, "Unable to create integration" );
	}

	public function getIntegration() {

		$this->authorize();

		$manager = new Brizy_Editor_Forms_FormManager( Brizy_Editor_Project::get() );

		$form = $manager->getForm( $_REQUEST['formId'] );
		if ( ! $form ) {
			$this->error( 400, "Invalid form id" );
		}
		$integrationId = $_REQUEST['integration'];
		if ( ! $integrationId ) {
			$this->error( 400, "Invalid form integration" );
		}

		$integration = $form->getIntegration( $integrationId );

		if ( $integration ) {
			$integration = apply_filters( 'brizy_add_integration_accounts', $integration, $form );
			$integration = apply_filters( 'brizy_get_integration', $integration, $form );
			$this->success( $integration );
		}

		$this->error( 404, 'Integration not found' );
	}

	public function updateIntegration() {

		$this->authorize();

		$manager = new Brizy_Editor_Forms_FormManager( Brizy_Editor_Project::get() );

		$form = $manager->getForm( $_REQUEST['formId'] );
		if ( ! $form ) {
			$this->error( 400, "Invalid form id" );
		}

		$integration = Brizy_Editor_Forms_AbstractIntegration::createInstanceFromJson( json_decode( file_get_contents( 'php://input' ) ) );

		$integration = apply_filters( 'brizy_update_integration', $integration, $form );

		//------------------

		if ( $integration && $form->updateIntegration( $integration ) ) {
			$manager->addForm( $form );
			$this->success( $integration );
		}

		$this->error( 404, 'Integration not found' );
	}

	public function deleteIntegration() {

		$this->authorize();

		$manager = new Brizy_Editor_Forms_FormManager( Brizy_Editor_Project::get() );
		$form    = $manager->getForm( $_REQUEST['formId'] );
		if ( ! $form ) {
			$this->error( 400, "Invalid form id" );
		}

		$integrationId = $_REQUEST['integration'];
		if ( ! $integrationId ) {
			$this->error( 400, "Invalid form integration" );
		}

		$integrationId = apply_filters( 'brizy_update_integration', $integrationId, $form );
		$deleted       = false;

		if ( $integrationId ) {
			$deleted = $form->deleteIntegration( $integrationId );
		}

		if ( $deleted ) {
			$manager->addForm( $form );
			$this->success( null );
		}

		$this->error( 404, 'Integration not found' );
	}


}