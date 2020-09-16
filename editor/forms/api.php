<?php


/**
 * @todo: Implement Brizy_Admin_AbstractApi here
 *
 * Class Brizy_Editor_Forms_Api
 */
class Brizy_Editor_Forms_Api {

	const AJAX_GET_FORM = '_get_form';
	const AJAX_CREATE_FORM = '_create_form';
	const AJAX_UPDATE_FORM = '_update_form';
	const AJAX_DELETE_FORM = '_delete_form';
	const AJAX_SUBMIT_FORM = '_submit_form';

	const AJAX_GET_INTEGRATION = '_get_integration';
	const AJAX_CREATE_INTEGRATION = '_create_integration';
	const AJAX_UPDATE_INTEGRATION = '_update_integration';
	const AJAX_DELETE_INTEGRATION = '_delete_integration';

	const AJAX_SET_RECAPTCHA_ACCOUNT = '_set_recaptcha_account';
	const AJAX_GET_RECAPTCHA_ACCOUNT = '_get_recaptcha_account';
	const AJAX_DELETE_RECAPTCHA_ACCOUNT = '_delete_recaptcha_account';
	const AJAX_VALIDATE_RECAPTCHA_ACCOUNT = '_validate_recaptcha_account';


	const AJAX_AUTHENTICATION_CALLBACK = '_authentication_callback';

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
		$pref        = 'wp_ajax_' . Brizy_Editor::prefix();
		$pref_nopriv = 'wp_ajax_nopriv_' . Brizy_Editor::prefix();
		if ( Brizy_Editor_User::is_user_allowed() ) {

			add_action( $pref . self::AJAX_GET_FORM, array( $this, 'get_form' ) );
			add_action( $pref . self::AJAX_CREATE_FORM, array( $this, 'create_form' ) );
			add_action( $pref . self::AJAX_UPDATE_FORM, array( $this, 'update_form' ) );
			add_action( $pref . self::AJAX_DELETE_FORM, array( $this, 'delete_form' ) );
			add_action( $pref . self::AJAX_CREATE_INTEGRATION, array( $this, 'createIntegration' ) );
			add_action( $pref . self::AJAX_GET_INTEGRATION, array( $this, 'getIntegration' ) );
			add_action( $pref . self::AJAX_UPDATE_INTEGRATION, array( $this, 'updateIntegration' ) );
			add_action( $pref . self::AJAX_DELETE_INTEGRATION, array( $this, 'deleteIntegration' ) );
		}

		add_filter( 'brizy_form_submit_data', array( $this, 'handleFileTypeFields' ), - 100, 2 );

		add_action( $pref . self::AJAX_SUBMIT_FORM, array( $this, 'submit_form' ) );
		add_action( $pref_nopriv . self::AJAX_SUBMIT_FORM, array( $this, 'submit_form' ) );
	}


	protected function error( $code, $message ) {
		wp_send_json_error( array( 'code' => $code, 'message' => $message ), 200 );
	}

	protected function success( $data, $code = 200 ) {
		wp_send_json_success( $data, $code );
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
			Brizy_Logger::instance()->critical( $exception->getMessage(), array( $exception ) );
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
				$this->success( $instance, 201 );
			}

			$this->error( 400, $validation_result );

		} catch ( Exception $exception ) {
			Brizy_Logger::instance()->critical( $exception->getMessage(), array( $exception ) );
			$this->error( $exception->getCode(), $exception->getMessage() );
			exit;
		}
	}

	public function update_form() {
		try {
			$this->authorize();

			$manager = new Brizy_Editor_Forms_FormManager( Brizy_Editor_Project::get() );

			$form_json = json_decode( file_get_contents( 'php://input' ) );

			if ( ! $form_json ) {
				$this->error( 400, 'Invalid json object provided' );
			}

			if ( ! isset( $_REQUEST['formId'] ) ) {
				$this->error( 400, 'Invalid form id provided' );
			}

			$form = $manager->getForm( $_REQUEST['formId'] );

			if ( ! $form ) {
				$this->error( 404, 'Form not found' );
			}

			$instance          = Brizy_Editor_Forms_Form::updateFromJson( $form, $form_json );
			$validation_result = $instance->validate();

			if ( $validation_result === true ) {
				$manager->addForm( $instance );
				$this->success( $instance, 200 );
			}

			$this->error( 400, $validation_result );

		} catch ( Exception $exception ) {
			Brizy_Logger::instance()->critical( $exception->getMessage(), array( $exception ) );
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
			Brizy_Logger::instance()->critical( $exception->getMessage(), array( $exception ) );
			$this->error( $exception->getCode(), $exception->getMessage() );
			exit;
		}
	}

	public function submit_form() {
		try {
			$manager = new Brizy_Editor_Forms_FormManager( Brizy_Editor_Project::get() );
			/**
			 * @var Brizy_Editor_Forms_Form $form ;
			 */

			$form = $manager->getForm( isset($_REQUEST['form_id'])?$_REQUEST['form_id']:null );

			if ( ! $form ) {
				$this->error( 404, "Form not found" );
			}

			$fields = json_decode( stripslashes( $_REQUEST['data'] ) );

			if ( ! $fields ) {
				$this->error( 400, "Invalid form data" );
			}

			// validtate recaptha response if exists
			$accountManager    = new Brizy_Editor_Accounts_ServiceAccountManager( Brizy_Editor_Project::get() );
			$recaptchaAccounts = $accountManager->getAccountsByGroup( Brizy_Editor_Accounts_AbstractAccount::RECAPTCHA_GROUP );

			if ( count( $recaptchaAccounts ) > 0 ) {
				$recaptchaField = null;
				foreach ( $fields as $field ) {
					if ( $field->name == 'g-recaptcha-response' ) {
						$recaptchaField = $field;
					}
				}

				if ( ! $recaptchaField ) {
					Brizy_Logger::instance()->error( "The submitted data is invalid." );
					$this->error( 400, "The submitted data is invalid." );
				}

				$recaptchaAccount = $recaptchaAccounts[0];

				$http     = new WP_Http();
				$array    = array(
					'secret'   => $recaptchaAccount->getSecretKey(),
					'response' => $recaptchaField->value
				);
				$response = $http->post( 'https://www.google.com/recaptcha/api/siteverify', array(
						'body' => $array
					)
				);

				$body = wp_remote_retrieve_body( $response );

				$responseJsonObject = json_decode( $body );

				if ( ! is_object( $responseJsonObject ) || ! $responseJsonObject->success ) {
					$this->error( 400, "Unable to validation request" );
				}
			}

			$form   = apply_filters( 'brizy_form', $form );
			$fields = apply_filters( 'brizy_form_submit_data', $fields, $form );

			$result = null;
			foreach ( $form->getIntegrations() as $integration ) {

				if ( ! $integration->isCompleted() ) {
					continue;
				}

				try {
					$result = $integration->handleSubmit( $form, $fields );
				} catch ( Exception $e ) {
					Brizy_Logger::instance()->exception( $e );
					$this->error( 500, 'Member was not created.' );
				} finally {
					if ( ! $result && $integration->getException() ) {
						throw new Exception( $integration->getException()->get_error_message() );
					}
				}
			}

			$this->success( 200 );

		} catch ( Exception $exception ) {
			Brizy_Logger::instance()->critical( $exception->getMessage(), array( $exception ) );
			$this->error( 400, $exception->getMessage() );
			exit;
		}
	}

	public function handleFileTypeFields( $fields, $form ) {

		foreach ( $fields as $field ) {
			if ( $field->type == 'FileUpload' ) {
				$uFile = $_FILES[ $field->name ];

				foreach ( $_FILES[ $field->name ]['name'] as $index => $value ) {
					$uFile = array(
						'name'     => $_FILES[ $field->name ]['name'][ $index ],
						'type'     => $_FILES[ $field->name ]['type'][ $index ],
						'tmp_name' => $_FILES[ $field->name ]['tmp_name'][ $index ],
						'error'    => $_FILES[ $field->name ]['error'][ $index ],
						'size'     => $_FILES[ $field->name ]['size'][ $index ]
					);

					$uploadOverrides = array( 'test_form' => false );

					$file = wp_handle_upload( $uFile, $uploadOverrides );

					if ( ! $file || isset( $file['error'] ) ) {
						Brizy_Logger::instance()->error( 'Failed to handle upload', $fields );
						throw new Exception( 'Failed to handle upload' );
					}

					// create attachment
					$wp_upload_dir = wp_upload_dir();
					$attachment    = array(
						'guid'           => $wp_upload_dir['url'] . '/' . basename( $file['file'] ),
						'post_mime_type' => $file['type'],
						'post_title'     => preg_replace( '/\.[^.]+$/', '', basename( $file['file'] ) ),
						'post_content'   => '',
						'post_status'    => 'inherit'
					);

					$attach_id = wp_insert_attachment( $attachment, $file['file'] );

					if ( $attach_id instanceof WP_Error ) {
						Brizy_Logger::instance()->critical( 'Failed to handle upload', array( $attach_id ) );
						throw new Exception( 'Failed to handle upload' );
					}

					update_post_meta( $attach_id, 'brizy-form-upload', 1 );

					// Make sure that this file is included, as wp_generate_attachment_metadata() depends on it.
					require_once( ABSPATH . 'wp-admin/includes/image.php' );

					// Generate the metadata for the attachment, and update the database record.
					$attach_data = wp_generate_attachment_metadata( $attach_id, $file['file'] );
					wp_update_attachment_metadata( $attach_id, $attach_data );

					$field->value = $file['url'];
				}
			}
		}

		return $fields;
	}

	public function createIntegration() {

		$this->authorize();
		$manager = new Brizy_Editor_Forms_FormManager( Brizy_Editor_Project::get() );

		$form = $manager->getForm( $_REQUEST['formId'] );

		if ( ! $form ) {
			$this->error( 400, "Invalid form id" );
		}

		try {
			$integration = Brizy_Editor_Forms_AbstractIntegration::createInstanceFromJson( json_decode( file_get_contents( 'php://input' ) ) );

			if ( $form->getIntegration( $integration->getid() ) ) {
				$this->error( 400, "This integration is already created" );
			}

			$integration = apply_filters( 'brizy_create_integration', $integration, $form );
			$integration = apply_filters( 'brizy_prepare_integration', $integration, $form );
			$integration = apply_filters( 'brizy_add_integration_accounts', $integration, $form );

			if ( $form->addIntegration( $integration ) ) {
				$manager->addForm( $form );
				$this->success( $integration );
			}

		} catch ( Exception $exception ) {
			Brizy_Logger::instance()->critical( $exception->getMessage(), array( $exception ) );
			$this->error( 400, $exception->getMessage() );
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
			$integration = apply_filters( 'brizy_prepare_integration', $integration, $form );
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
		$integration = apply_filters( 'brizy_prepare_integration', $integration, $form );

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
