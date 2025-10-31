<?php

if ( ! defined( 'ABSPATH' ) ) {
    die( 'Direct access forbidden.' );
}

/**
 * Brizy_Admin_Ai_Main
 */
class Brizy_Admin_Ai_Main {
    
    /**
     * @return Brizy_Admin_Ai_Main
     */
    public static function _init() {
        static $instance;

        if ( ! $instance ) {
            $instance = new self();
        }

        return $instance;
    }

    protected function __construct() {
        $this->registerApiMethods();
    }

    public function registerApiMethods() {
        if ( is_admin() ) {
            Brizy_Admin_Ai_Api::_init();
        }
    }
}