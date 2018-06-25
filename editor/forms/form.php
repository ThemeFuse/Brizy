<?php
/**
 * Created by PhpStorm.
 * User: alex
 * Date: 5/23/18
 * Time: 10:59 AM
 */

class Brizy_Editor_Forms_Form extends Brizy_Admin_Serializable {

	/**
	 * @var string
	 */
	protected $id;

	/**
	 * @var string
	 */
	protected $emailTo;

	/**
	 * @var string
	 */
	protected $subject;

	/**
	 * @var bool
	 */
	protected $hasIntegrations;

	/**
	 * @return string
	 */
	public function serialize() {
		return serialize( $this->jsonSerialize() );
	}

	public function jsonSerialize() {
		$get_object_vars = array(
			'id'      => $this->id,
			'emailTo' => $this->emailTo,
			'subject' => $this->subject,
		);

		return $get_object_vars;
	}

	public function convertToOptionValue() {
		return array(
			'id'      => $this->id,
			'emailTo' => $this->emailTo,
			'subject' => $this->subject,
		);
	}

	static public function createFromSerializedData( $data ) {
		$instance          = new self();
		$instance->id      = $data['id'];
		$instance->emailTo = $data['emailTo'];
		$instance->subject = $data['subject'];

		return $instance;
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
	 * @return Brizy_Editor_Forms_Form
	 */
	public function setId( $id ) {
		$this->id = $id;

		return $this;
	}

	/**
	 * @return string
	 */
	public function getEmailTo() {
		return $this->emailTo;
	}

	/**
	 * @param string $emailTo
	 *
	 * @return Brizy_Editor_Forms_Form
	 */
	public function setEmailTo( $emailTo ) {
		$this->emailTo = $emailTo;

		return $this;
	}

	/**
	 * @return string
	 */
	public function getSubject() {
		return $this->subject;
	}

	/**
	 * @param string $subject
	 *
	 * @return Brizy_Editor_Forms_Form
	 */
	public function setSubject( $subject ) {
		$this->subject = $subject;

		return $this;
	}

	/**
	 * @return Brizy_Editor_Forms_Form
	 * @throws Exception
	 */
	public function create_from_post() {
		$instance = new self();

		$stripcslashes = stripcslashes( $_POST['form'] );
		$json_obj      = json_decode( $stripcslashes );

		if ( ! isset( $json_obj ) ) {
			throw new Exception( 'Bad Request', 400 );
		}

		$_POST['form'] = get_object_vars( $json_obj );

		if ( isset( $_POST['form']['id'] ) ) {
			$instance->setId( $_POST['form']['id'] );
		}

		if ( isset( $_POST['form']['emailTo'] ) ) {
			$instance->setEmailTo( $_POST['form']['emailTo'] );
		}

		if ( isset( $_POST['form']['subject'] ) ) {
			$instance->setSubject( $_POST['form']['subject'] );
		}

		return $instance;
	}

	/**
	 * Target can be: create | update
	 *
	 * @param string $target
	 *
	 * @return array|bool
	 */
	public function validate( $target = 'create' ) {

		$errors = array();

		if ( $target == 'update' ) {
			if ( ! $this->getId() ) {
				$errors['fromEmail'] = 'Invalid form id';
			}
		}

		if ( ! $this->getEmailTo() || ! filter_var( $this->getEmailTo(), FILTER_VALIDATE_EMAIL ) ) {
			$errors['emailTo'] = 'Invalid email provided';
		}

		if ( count( $errors ) ) {
			return $errors;
		}

		return true;
	}

	/**
	 * @return bool
	 */
	public function hasIntegrations() {
		return $this->hasIntegrations;
	}

	/**
	 * @param bool $hasIntegrations
	 *
	 * @return Brizy_Editor_Forms_Form
	 */
	public function setHasIntegrations( $hasIntegrations ) {
		$this->hasIntegrations = $hasIntegrations;

		return $this;
	}


}