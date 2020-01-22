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
	 * @var array
	 */
	protected $listProperties = array();

	/**
	 * @var array
	 */
	protected $folders = array();

	/**
	 * @var
	 */
	protected $usedAccount;

	/**
	 * @var
	 */
	protected $fieldsMap = '[]';

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
	 * @param $fields
	 *
	 * @return bool|mixed
	 * @throws Exception
	 */
	public function handleSubmit( Brizy_Editor_Forms_Form $form, $fields ) {

		$this->exception = null;

		/**
		 * @var \BrizyForms\Service\Service $service ;
		 */
		$service = \BrizyForms\ServiceFactory::getInstance( $this->getId() );

		if ( ! ( $service instanceof \BrizyForms\Service\Service ) ) {
			$this->error( 400, "Invalid integration service" );
		}

		do_action( 'brizy_submit_form', $service, $fields, $this );
	}

	/**
	 * @return array|mixed
	 */
	public function jsonSerialize() {

		$get_object_vars = parent::jsonSerialize();

		if ( ! is_null( $this->getFields() ) ) {
			$get_object_vars['fields'] = $this->getFields();
		}
		if ( ! is_null( $this->getLists() ) ) {
			$get_object_vars['lists'] = $this->getLists();
		}
		if ( ! is_null( $this->getListProperties() ) ) {
			$get_object_vars['listProperties'] = $this->getListProperties();
		}
		if ( ! is_null( $this->getFolders() ) ) {
			$get_object_vars['folders'] = $this->getFolders();
		}
		if ( ! is_null( $this->getUsedAccount() ) ) {
			$get_object_vars['usedAccount'] = $this->getUsedAccount();
		}
		if ( ! is_null( $this->getUsedList() ) ) {
			$get_object_vars['usedList'] = $this->getUsedList();
		}
		if ( ! is_null( $this->getUsedFolder() ) ) {
			$get_object_vars['usedFolder'] = $this->getUsedFolder();
		}
		if ( ! is_null( $this->getFieldsMap() ) ) {
			$get_object_vars['fieldsMap'] = $this->getFieldsMap();
		}
		if ( ! is_null( $this->getAccounts() ) ) {
			$get_object_vars['accounts'] = $this->getAccounts();
		}
		if ( ! is_null( $this->isConfirmationNeeded() ) ) {
			$get_object_vars['confirmationNeeded'] = $this->isConfirmationNeeded();
		}
		if ( ! is_null( $this->hasConfirmation() ) ) {
			$get_object_vars['hasConfirmation'] = $this->hasConfirmation();
		}

		return $get_object_vars;
	}

	/**
	 * @return string
	 */
	public function serialize() {
		$value = $this->jsonSerialize();
		unset( $value['accounts'] );
		unset( $value['folders'] );
		unset( $value['lists'] );
		unset( $value['fields'] );
		unset( $value['listProperties'] );

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
				foreach ( $json_obj->lists as $list ) {
					if ( ! $list instanceof Brizy_Editor_Forms_Group ) {
						$instance->addList( Brizy_Editor_Forms_Group::createFromJson( $list ) );
					} else {
						$instance->addList( $list );
					}
				}
			}

			if ( isset( $json_obj->folders ) ) {
				foreach ( $json_obj->folders as $folder ) {
					if ( ! $folder instanceof Brizy_Editor_Forms_Folder ) {
						$instance->addFolder( Brizy_Editor_Forms_Folder::createFromJson( $folder ) );
					} else {
						$instance->addFolder( $folder );
					}
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

	static public function createFromSerializedData( $data, $instance = null ) {
		if ( is_null( $instance ) ) {
			$instance = new self( $data['id'] );
		}

		if ( isset( $data['completed'] ) ) {
			$instance->setCompleted( $data['completed'] );
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

			if ( is_array( $data['fieldsMap'] ) ) {
				$instance->setFieldsMap( json_encode( $data['fieldsMap'] ) );
			} elseif ( empty( $data['fieldsMap'] ) ) {
				$instance->setFieldsMap( '[]' );
			} else {
				$instance->setFieldsMap( $data['fieldsMap'] );
			}

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
	 * @param Brizy_Editor_Forms_Folder $folders
	 */
	public function addFolder( Brizy_Editor_Forms_Folder $folders ) {
		$this->folders[] = $folders;
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
	public function getFolders() {
		return $this->folders;
	}

	/**
	 * @param array $folders
	 *
	 * @return Brizy_Editor_Forms_ServiceIntegration
	 */
	public function setFolders( $folders ) {
		$this->folders = $folders;

		return $this;
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

		$used_account = $this->getUsedList();
		foreach ( (array) $this->lists as $list ) {
			$var = $list->getId();
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

	/**
	 * @return array
	 */
	public function getListProperties() {
		return $this->listProperties;
	}

	/**
	 * @param array $listProperties
	 *
	 * @return Brizy_Editor_Forms_ServiceIntegration
	 */
	public function setListProperties( $listProperties ) {
		$this->listProperties = $listProperties;

		return $this;
	}
}
