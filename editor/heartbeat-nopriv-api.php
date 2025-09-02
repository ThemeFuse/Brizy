<?php

class Brizy_Editor_HeartbeatNoprivApi extends Brizy_Admin_AbstractApi
{

    const nonce = 'brizy-api';

    const AJAX_HEARTBEAT     = '_heartbeat';
    const AJAX_TIMESTAMP     = '_timestamp';
    const AJAX_LOGIN_HANDLER = '_login_handler';

    /**
     * Brizy_Editor_HeartbeatNoprivApi constructor.
     *
     */
    public function __construct()
    {
        parent::__construct();
    }

    protected function initializeApiActions()
    {
        $p = 'wp_ajax_'.Brizy_Editor::prefix();
        $n = 'wp_ajax_nopriv_'.Brizy_Editor::prefix();

        add_action($n.self::AJAX_HEARTBEAT, array($this, 'heartbeat'));
        add_action($n.self::AJAX_TIMESTAMP, array($this, 'timestamp'));
        add_action($n.self::AJAX_LOGIN_HANDLER, array($this, 'submitLoginHandler'));

        if (!Brizy_Editor_User::is_user_allowed()) {
            return;
        }

        add_action($p.self::AJAX_HEARTBEAT, array($this, 'heartbeat'));
        add_action($p.self::AJAX_TIMESTAMP, array($this, 'timestamp'));
    }

    public function heartbeat()
    {
        if (!is_user_logged_in()) {
            wp_send_json_success([
                'logged' => false
            ]);
        }

        if (!wp_verify_nonce($this->param('hash'), self::nonce)) {
            wp_send_json_success([
                'logged' => true,
                'nonce'  => wp_create_nonce(self::nonce)
            ]);
        }

        $this->verifyNonce(self::nonce);

        if (Brizy_Editor::get()->checkIfProjectIsLocked() === false) {
            Brizy_Editor::get()->lockProject();
        }

        $editor = new Brizy_Editor_Editor_Editor(Brizy_Editor_Project::get(), null);
        $editor = $editor->getProjectStatus();

        $editor['logged'] = true;

        wp_send_json_success(
            $editor
        );
    }

    function submitLoginHandler()
    {
        $user = wp_signon([], false);

        if (is_wp_error($user)) {
            wp_send_json_error(array(
                'message' => $user->get_error_message()
            ));
        } else {
            wp_send_json_success(array(
                'logged' => true,
                'nonce'  => wp_create_nonce(self::nonce)
            ));
        }

        exit;
    }

    public function timestamp()
    {
        $this->success(array('timestamp' => time()));
    }

    protected function getRequestNonce()
    {
        return $this->param('hash');
    }

}
