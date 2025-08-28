<?php

if ( ! defined( 'ABSPATH' ) ) {
    die( 'Direct access forbidden.' );
}

/**
 * Main AI functionality handler for Brizy admin
 * Initializes AI features and registers API methods
 */
class Brizy_Admin_Ai_Main {
    
    /**
     * Initialize AI functionality (singleton pattern)
     * @return Brizy_Admin_Ai_Main
     */
    public static function _init() {
        static $instance;

        if ( ! $instance ) {
            $instance = new self();
        }

        return $instance;
    }

    /**
     * Constructor - registers API methods
     */
    protected function __construct() {
        $this->registerApiMethods();
    }

    /**
     * Register AI API methods for admin users
     */
    public function registerApiMethods() {
        if ( is_admin() && Brizy_Editor_User::is_user_allowed() ) {

            Brizy_Admin_Ai_Api::_init();
        }
    }
}
