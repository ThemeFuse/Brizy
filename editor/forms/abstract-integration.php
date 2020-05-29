<?php


abstract class Brizy_Editor_Forms_AbstractIntegration extends Brizy_Admin_Serializable {

	/**
	 * @var string
	 */
	protected $id;


	/**
	 * @var bool
	 */
	protected $completed;


	/**
	 * @var WP_Error
	 */
	protected $exception;

	/**
	 * Brizy_Editor_Forms_AbstractIntegration constructor.
	 *
	 * @param $id
	 */
	public function __construct( $id ) {
		$this->id = $id;
	}

	/**
	 * @param Brizy_Editor_Forms_Form $form
	 * @param $fields
	 *
	 * @return mixed
	 */
	abstract public function handleSubmit( Brizy_Editor_Forms_Form $form, $fields );

	public function handleFailToSendMessage( WP_Error $error ) {
		$this->exception = $error;
	}

	/**
	 * @return bool
	 */
	public function isCompleted() {
		return $this->completed;
	}

	/**
	 * @param bool $completed
	 *
	 * @return Brizy_Editor_Forms_AbstractIntegration
	 */
	public function setCompleted( $completed ) {
		$this->completed = $completed;

		return $this;
	}

	/**
	 * @return string
	 */
	public function serialize() {
		return serialize( $this->jsonSerialize() );
	}

	/**
	 * @return array|mixed
	 */
	public function jsonSerialize() {
		$get_object_vars = array(
			'id'        => $this->getId(),
			'completed' => $this->isCompleted(),
		);

		return $get_object_vars;
	}

	/**
	 * @param $json_obj
	 *
	 * @return Brizy_Editor_Forms_AbstractIntegration
	 * @throws Exception
	 */
	public static function createInstanceFromJson( $json_obj ) {
		$instance = null;
		if ( is_object( $json_obj ) ) {

			switch ( $json_obj->id ) {
				case 'wordpress':
					$instance = Brizy_Editor_Forms_WordpressIntegration::createFromJson( $json_obj );
					break;
				case 'smtp':
					if ( class_exists( 'Brizy_Editor_Forms_SmtpIntegration' ) ) {
						$instance = Brizy_Editor_Forms_SmtpIntegration::createFromJson( $json_obj );
					}
					break;
				case 'gmail_smtp':
					if ( class_exists( 'Brizy_Editor_Forms_GmailSmtpIntegration' ) ) {
						$instance = Brizy_Editor_Forms_GmailSmtpIntegration::createFromJson( $json_obj );
					}
					break;
				default:
					if ( class_exists( 'Brizy_Editor_Forms_ServiceIntegration' ) ) {
						$instance = Brizy_Editor_Forms_ServiceIntegration::createFromJson( $json_obj );
					}
					break;
			}

			if ( $instance ) {
				$instance->setId( $json_obj->id );

				if ( isset( $json_obj->completed ) ) {
                    $instance->setCompleted( $json_obj->completed );
                }
			}

			add_action( 'wp_mail_failed', array( $instance, 'handleFailToSendMessage' ) );
		}

		return $instance;
	}

	/**
	 * @param $data
	 *
	 * @param null $instance
	 *
	 * @return Brizy_Editor_Forms_ServiceIntegration|Brizy_Editor_Forms_WordpressIntegration|void|null
	 */
	public static function createFromSerializedData( $data, $instance = null ) {

		if ( $data instanceof Brizy_Editor_Forms_WordpressIntegration ||
		     $data instanceof Brizy_Editor_Forms_ServiceIntegration ) {
			return $data;
		}

		if ( is_array( $data ) ) {

			switch ( $data['id'] ) {
				case 'wordpress':
					$instance = Brizy_Editor_Forms_WordpressIntegration::createFromSerializedData( $data, $instance );
					break;
				case 'smtp':
					if ( class_exists( 'Brizy_Editor_Forms_SmtpIntegration' ) ) {
						$instance = Brizy_Editor_Forms_SmtpIntegration::createFromSerializedData( $data );
					}
					break;
				case 'gmail_smtp':
					if ( class_exists( 'Brizy_Editor_Forms_GmailSmtpIntegration' ) ) {
						$instance = Brizy_Editor_Forms_GmailSmtpIntegration::createFromSerializedData( $data );
					}
					break;
				default:
					if ( class_exists( 'Brizy_Editor_Forms_ServiceIntegration' ) ) {
						$instance = Brizy_Editor_Forms_ServiceIntegration::createFromSerializedData( $data );
					}
					break;
			}

			if ( $instance ) {
				$instance->setId( $data['id'] );
				$instance->setCompleted( $data['completed'] );
			}
		}

		return $instance;
	}


	/**
	 * @return array|mixed
	 */
	public function convertToOptionValue() {
		return $this->jsonSerialize();
	}

	/**
	 * @return string
	 */
	public function getId() {
		return $this->id;
	}

	/**
	 * @param string $id
	 *
	 * @return Brizy_Editor_Forms_AbstractIntegration
	 */
	public function setId( $id ) {
		$this->id = $id;

		return $this;
	}

	/**
	 * @return WP_Error
	 */
	public function getException() {
		return $this->exception;
	}

	public function __destruct() {
		remove_action( 'wp_mail_failed', array( $this, 'handleFailToSendMessage' ) );
	}
}
