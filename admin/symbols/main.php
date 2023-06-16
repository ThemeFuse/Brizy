<?php

class Brizy_Admin_Symbols_Main {
	/**
	 * @return mixed|self
	 */
	public static function _init() {
		static $instance;

		if ( ! $instance ) {
			$instance = new self();
			$instance->initialize();
		}

		return $instance;
	}

	public function initialize() {
		Brizy_Admin_Symbols_Api::_init();
	}


}
