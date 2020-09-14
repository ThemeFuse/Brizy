<?php


class Brizy_Editor_Forms_FormManager {

	/**
	 * @var Brizy_Editor_Project
	 */
	private $project;

	/**
	 * @var Brizy_Editor_Forms_Form[]
	 */
	private $forms;

	/**
	 * Brizy_Editor_Forms_Manager constructor.
	 *
	 * @param Brizy_Editor_Project $project
	 */
	public function __construct( Brizy_Editor_Project $project ) {
		$this->project = $project;
		try {
			$this->loadStorage();
		} catch ( Exception $exception ) {
			$this->forms = array();
		}
	}

	/**
	 * @return array|Brizy_Editor_Forms_Form[]
	 */
	public function getAllForms() {
		return $this->forms;
	}

	/**
	 * @param $form_id
	 *
	 * @return Brizy_Editor_Forms_Form
	 */
	public function getForm( $form_id ) {
		if ( $form_id && isset($this->forms[ $form_id ])) {
			return $this->forms[ $form_id ];
		}
	}

	/**
	 * @param Brizy_Editor_Forms_Form $form
	 */
	public function addForm( $form ) {
		$this->forms[ $form->getId() ] = $form;

		$this->updateStorage();
	}

	/**
	 * @param Brizy_Editor_Forms_Form $form
	 */
	public function deleteForm( $form ) {
		unset( $this->forms[ $form->getId() ] );

		$this->updateStorage();
	}

	/**
	 * @param $formId
	 */
	public function deleteFormById( $formId ) {
		unset( $this->forms[ $formId ] );

		$this->updateStorage();
	}

	/**
	 * @throws Brizy_Editor_Exceptions_NotFound
	 */
	private function loadStorage() {
		$data = $this->project->getMetaValue( 'forms' );

		if ( ! $data ) {
			$data = array();
		}

		foreach ( $data as $id => $form_data ) {

			if ( $form_data instanceof Brizy_Editor_Forms_Form ) {
				$this->forms[ $id ] = $form_data;
			} elseif ( is_array( $form_data ) ) {
				$this->forms[ $id ] = Brizy_Editor_Forms_Form::createFromSerializedData( $form_data );
			}

		}
	}

	private function updateStorage() {

		$data = array();
		foreach ( $this->forms as $id => $form ) {
			$data[ $id ] = $form->convertToOptionValue();
		}
		$this->project->setMetaValue( 'forms', $data );
		$this->project->saveStorage();
	}
}
