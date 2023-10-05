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

    /**
     * BrizyPro_Admin_Popups constructor.
     */
//    public function __construct()
//    {
//        if (Brizy_Editor_User::is_user_allowed()) {
//            add_action('wp_loaded', array($this, 'initializeActions'));
//        }
//    }
//
//    public function initializeActions()
//    {
//        Brizy_Admin_Symbols_Api::_init();
//    }

}
