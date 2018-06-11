<?php
/**
 * Created by PhpStorm.
 * User: alex
 * Date: 5/23/18
 * Time: 10:59 AM
 */

class Brizy_Editor_Forms_Manager {

	/**
	 * @var Brizy_Editor_Storage_Common
	 */
	private $storage;

	/**
	 * @var Brizy_Editor_Forms_Form[]
	 */
	private $forms;

	/**
	 * Brizy_Form_Manager constructor.
	 *
	 * @param Brizy_Editor_Storage_Common $storage
	 *
	 * @throws Brizy_Editor_Exceptions_NotFound
	 */
	public function __construct( $storage ) {
		$this->storage = $storage;
		$this->forms   = $this->storage->get( 'forms', false );
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
		$this->storage->set( 'forms', $this->forms );
	}
}