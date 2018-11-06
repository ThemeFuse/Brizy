<?php
/**
 * Created by PhpStorm.
 * User: alex
 * Date: 5/23/18
 * Time: 10:59 AM
 */

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
			$this->forms = $project->getMetaValue( 'forms' );
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
		return $this->forms[ $form_id ];
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

	private function updateStorage() {
		$this->project->setMetaValue( 'forms', $this->forms );
	}
}