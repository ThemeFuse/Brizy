<?php


//class BrizyPro_Forms_ServiceIntegration extends Brizy_Editor_Forms_AbstractIntegration {
class Brizy_Editor_Forms_ServiceIntegration extends Brizy_Editor_Forms_AbstractIntegration {


	/**
	 * @var array
	 */
	protected $accounts = array();

	/**
	 * @var array
	 */
	protected $fields = array();

	/**
	 * @var array
	 */
	protected $lists = array();


	/**
	 * @var
	 */
	protected $usedAccount;

	/**
	 * @var
	 */
	protected $fieldsMap;

	/**
	 * @var
	 */
	protected $usedList;

	/**
	 * @var bool
	 */
	protected $hasConfirmation = false;


	/**
	 * @var bool
	 */
	protected $confirmationNeeded = false;

	/**
	 * @var string
	 */
	protected $usedFolder;

	/**
	 * @return array|mixed
	 */
	public function jsonSerialize() {

		$get_object_vars = parent::jsonSerialize();

		$get_object_vars['fields']             = $this->getFields();
		$get_object_vars['lists']              = $this->getLists();
		$get_object_vars['usedAccount']        = $this->getUsedAccount();
		$get_object_vars['usedList']           = $this->getUsedList();
		$get_object_vars['usedFolder']         = $this->getUsedFolder();
		$get_object_vars['fieldsMap']          = $this->getFieldsMap();
		$get_object_vars['accounts']           = $this->getAccounts();
		$get_object_vars['confirmationNeeded'] = $this->isConfirmationNeeded();
		$get_object_vars['hasConfirmation']    = $this->hasConfirmation();

		return $get_object_vars;
	}

	/**
	 * @return string
	 */
	public function serialize() {
		$value = $this->jsonSerialize();
		unset( $value['accounts'] );

		return serialize( $value );
	}

	/**
	 * @param $json_obj
	 *
	 * @return Brizy_Editor_Forms_ServiceIntegration|null
	 * @throws Exception
	 */
	public static function createFromJson( $json_obj ) {
		$instance = null;
		if ( is_object( $json_obj ) ) {
			$instance = new self( $json_obj->id );

			if ( isset( $json_obj->fields ) ) {
				foreach ( $json_obj->fields as $field ) {
					$instance->addField( Brizy_Editor_Forms_Field::createFromJson( $field ) );
				}
			}
			if ( isset( $json_obj->lists ) ) {
				foreach ( $json_obj->lists as $lists ) {
					$instance->addList( Brizy_Editor_Forms_Group::createFromJson( $lists ) );
				}
			}
			if ( isset( $json_obj->usedAccount ) ) {
				$instance->setUsedAccount( $json_obj->usedAccount );
			}
			if ( isset( $json_obj->usedList ) ) {
				$instance->setUsedList( $json_obj->usedList );
			}
			if ( isset( $json_obj->usedFolder ) ) {
				$instance->setUsedFolder( $json_obj->usedFolder );
			}
			if ( isset( $json_obj->fieldsMap ) ) {
				$instance->setFieldsMap( $json_obj->fieldsMap );
			}
			if ( isset( $json_obj->confirmationNeeded ) ) {
				$instance->setConfirmationNeeded( $json_obj->confirmationNeeded );
			}
			if ( isset( $json_obj->hasConfirmation ) ) {
				$instance->setHasConfirmation( $json_obj->hasConfirmation );
			}
		}

		return $instance;
	}

	static public function createFromSerializedData( $data ) {
		$instance = new self( $data['id'] );

		if ( isset( $data['completed'] ) ) {
			$instance->setCompleted( $data['completed'] );
		}

		if ( isset( $data['fields'] ) ) {
			foreach ( $data['fields'] as $field ) {

				if ( $field instanceof Brizy_Editor_Forms_Field ) {
					$instance->addField( $field );
				} else {
					$instance->addField( Brizy_Editor_Forms_Field::createFromSerializedData( $field ) );
				}

			}
		}
		if ( isset( $data['lists'] ) ) {
			foreach ( $data['lists'] as $list ) {
				if ( $list instanceof Brizy_Editor_Forms_Group ) {
					$instance->addList( $list );
				} else {
					$instance->addList( Brizy_Editor_Forms_Group::createFromSerializedData( $list ) );
				}
			}
		}
		if ( isset( $data['usedAccount'] ) ) {
			$instance->setUsedAccount( $data['usedAccount'] );
		}
		if ( isset( $data['usedList'] ) ) {
			$instance->setUsedList( $data['usedList'] );
		}
		if ( isset( $data['usedFolder'] ) ) {
			$instance->setUsedFolder( $data['usedFolder'] );
		}
		if ( isset( $data['fieldsMap'] ) ) {
			$instance->setFieldsMap( $data['fieldsMap'] );
		}
		if ( isset( $data['confirmationNeeded'] ) ) {
			$instance->setConfirmationNeeded( $data['confirmationNeeded'] );
		}
		if ( isset( $data['hasConfirmation'] ) ) {
			$instance->setHasConfirmation( $data['hasConfirmation'] );
		}

		return $instance;
	}

	/**
	 * @param Brizy_Editor_Forms_Group $list
	 */
	public function addList( Brizy_Editor_Forms_Group $list ) {
		$this->lists[] = $list;
	}

	/**
	 * @param Brizy_Editor_Forms_Field $field
	 */
	public function addField( Brizy_Editor_Forms_Field $field ) {
		$this->fields[] = $field;
	}


	/**
	 * @return array
	 */
	public function getFields() {
		return $this->fields;
	}

	/**
	 * @param array $fields
	 *
	 * @return self
	 */
	public function setFields( $fields ) {
		$this->fields = $fields;

		return $this;
	}

	/**
	 * @return array
	 */
	public function getLists() {
		return $this->lists;
	}

	/**
	 * @param array $lists
	 *
	 * @return self
	 */
	public function setLists( $lists ) {
		$this->lists = $lists;

		return $this;
	}

	/**
	 * @return mixed
	 */
	public function getUsedAccount() {
		return $this->usedAccount;
	}

	/**
	 * @param mixed $usedAccount
	 *
	 * @return self
	 */
	public function setUsedAccount( $usedAccount ) {
		$this->usedAccount = $usedAccount;

		return $this;
	}


	/**
	 * @return mixed
	 */
	public function getUsedListObject() {

		foreach ( (array) $this->lists as $list ) {
			$var          = $list->getId();
			$used_account = $this->getUsedList();
			if ( $var == $used_account ) {
				return $list;
			}
		}

		return null;
	}

	/**
	 * @return mixed
	 */
	public function getUsedList() {
		return $this->usedList;
	}

	/**
	 * @param mixed $usedList
	 *
	 * @return self
	 */
	public function setUsedList( $usedList ) {
		$this->usedList = $usedList;

		return $this;
	}

	/**
	 * @return mixed
	 */
	public function getFieldsMap() {
		return $this->fieldsMap;
	}

	/**
	 * @param mixed $fieldsMap
	 *
	 * @return self
	 */
	public function setFieldsMap( $fieldsMap ) {
		$this->fieldsMap = $fieldsMap;

		return $this;
	}

	/**
	 * @return array
	 */
	public function getAccounts() {
		return $this->accounts;
	}

	/**
	 * @param array $accounts
	 *
	 * @return Brizy_Editor_Forms_ServiceIntegration
	 */
	public function setAccounts( $accounts ) {
		$this->accounts = $accounts;

		return $this;
	}

	/**
	 * @return bool
	 */
	public function isConfirmationNeeded() {
		return (bool) $this->confirmationNeeded;
	}

	/**
	 * @param bool $confirmationNeeded
	 *
	 * @return Brizy_Editor_Forms_ServiceIntegration
	 */
	public function setConfirmationNeeded( $confirmationNeeded ) {
		$this->confirmationNeeded = (bool) $confirmationNeeded;

		return $this;
	}

	/**
	 * @return bool
	 */
	public function HasConfirmation() {
		return $this->hasConfirmation;
	}

	/**
	 * @param bool $hasConfirmation
	 *
	 * @return Brizy_Editor_Forms_ServiceIntegration
	 */
	public function setHasConfirmation( $hasConfirmation ) {
		$this->hasConfirmation = $hasConfirmation;

		return $this;
	}

	/**
	 * @return string
	 */
	public function getUsedFolder() {
		return $this->usedFolder;
	}

	/**
	 * @param string $usedFolder
	 *
	 * @return Brizy_Editor_Forms_ServiceIntegration
	 */
	public function setUsedFolder( $usedFolder ) {
		$this->usedFolder = $usedFolder;

		return $this;
	}
}