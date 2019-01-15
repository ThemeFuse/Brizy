<?php

class Brizy_Editor_Forms_Form extends Brizy_Admin_Serializable {

	/**
	 * @var string
	 */
	protected $id;


	/**
	 * @var Brizy_Editor_Forms_AbstractIntegration[]
	 */
	protected $integrations = array();

	/**
	 * @return string
	 */
	public function serialize() {
		return serialize( $this->convertToOptionValue() );
	}


	public function unserialize( $data ) {

		$vars = unserialize( $data );

		return self::createFromSerializedData($vars);
	}

	public function jsonSerialize() {
		$get_object_vars = array(
			'id'           => $this->id,
			'integrations' => $this->integrations
		);

		return $get_object_vars;
	}

	public function convertToOptionValue() {
		$get_object_vars = array(
			'id' => $this->id,
		);

		foreach ( $this->integrations as $integration ) {
			$get_object_vars['integrations'][] = $integration->convertToOptionValue();
		}

		return $get_object_vars;
	}

	static public function createFromSerializedData( $data ) {
		$instance     = new self();
		$instance->id = $data['id'];

		foreach ( $data['integrations'] as $integration ) {
			$brizy_editor_forms_wordpress_integration = Brizy_Editor_Forms_AbstractIntegration::createFromSerializedData( $integration );

			if ( $brizy_editor_forms_wordpress_integration ) {
				$instance->integrations[] = $brizy_editor_forms_wordpress_integration;
			}
		}

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
	 * @return Brizy_Editor_Forms_Form
	 * @throws Exception
	 */
	public static function create_from_post() {
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

		return $instance;
	}


	/**
	 * @return Brizy_Editor_Forms_Form
	 * @throws Exception
	 */
	public static function createFromJson( $json_obj ) {
		$instance = new self();

		if ( ! isset( $json_obj ) ) {
			throw new Exception( 'Bad Request', 400 );
		}

		if ( is_object( $json_obj ) ) {

			$instance->setId( $json_obj->id );

			// add uncompleted wordpress integration
			$current_user   = wp_get_current_user();
			$an_integration = new Brizy_Editor_Forms_WordpressIntegration();
			$an_integration->setEmailTo( $current_user->user_email );

			$instance->addIntegration( $an_integration );

			foreach ( (array) $json_obj->integrations as $integration ) {
				if ( is_object( $integration ) ) {
					$instance->addIntegration( Brizy_Editor_Forms_AbstractIntegration::createInstanceFromJson( $integration ) );
				}
			}
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

		if ( ! $this->getId() ) {
			$errors['id'] = 'Invalid form id';
		}

		if ( count( $errors ) ) {
			return $errors;
		}

		return true;
	}

	public function getIntegrations() {
		return $this->integrations;
	}

	/**
	 * @param $id
	 *
	 * @return Brizy_Editor_Forms_AbstractIntegration|null
	 */
	public function getIntegration( $id ) {

		foreach ( $this->integrations as $integration ) {
			if ( $integration->getId() == $id ) {
				return $integration;
			}
		}

		return null;
	}

	public function addIntegration( Brizy_Editor_Forms_AbstractIntegration $anIntegration ) {

		if ( ! $anIntegration ) {
			return false;
		}

		if ( $this->getIntegration( $anIntegration->getId() ) ) {
			return false;
		}

		$this->integrations[] = $anIntegration;

		return true;
	}

	/**+
	 * @param $anIntegration
	 *
	 * @return bool
	 */
	public function updateIntegration( Brizy_Editor_Forms_AbstractIntegration $anIntegration ) {

		if ( ! $anIntegration ) {
			return false;
		}

		foreach ( $this->integrations as $k => $integration ) {
			if ( $integration->getId() == $anIntegration->getId() ) {
				$this->integrations[ $k ] = $anIntegration;

				return true;
			}
		}

		return false;
	}


	/**
	 * @param $id
	 *
	 * @return bool
	 */
	public function deleteIntegration( $id ) {

		foreach ( $this->integrations as $k => $integration ) {
			if ( $integration->getId() == $id ) {
				unset( $this->integrations[ $k ] );
				$this->integrations = array_values( $this->integrations );

				return true;
			}
		}

		return false;
	}

}