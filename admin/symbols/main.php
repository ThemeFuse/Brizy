<?php
/**
 * Created by PhpStorm.
 * User: alex
 * Date: 1/11/19
 * Time: 10:59 AM
 */


class Brizy_Admin_Symbols_Main
{

    /**
     * @return Brizy_Admin_Symbols_Main
     */
    public static function _init()
    {
        static $instance;

        if ( ! $instance) {
            $instance = new self();
        }

        return $instance;
    }

    /**
     * BrizyPro_Admin_Popups constructor.
     */
    public function __construct()
    {
        if (Brizy_Editor_User::is_user_allowed()) {
            add_action('wp_loaded', array($this, 'initializeActions'));
        }
    }

    public function initializeActions()
    {
        Brizy_Admin_Symbols_Api::_init();
    }
}