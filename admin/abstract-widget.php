<?php

abstract class Brizy_Admin_AbstractWidget {

	abstract public function getId();

	abstract public function getName();

	abstract public function render();

	/**
	 * Brizy_Admin_AbstractWidget constructor.
	 * @throws Exception
	 */
	public function __construct() {
		wp_add_dashboard_widget( $this->internalGetId(), $this->getName(), array( $this, 'render' ) );
	}

	/**
	 * @return string
	 * @throws Exception
	 */
	protected function internalGetId() {
		$id = $this->getId();

		if ( empty( $id ) ) {
			throw new Exception( 'You should return an Id for the widget' );
		}

		return Brizy_Editor::get_slug() . '_' . $id;
	}
}
