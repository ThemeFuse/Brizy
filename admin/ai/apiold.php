<?php

if ( ! defined( 'ABSPATH' ) ) {
    die( 'Direct access forbidden.' );
}

/**
 * AI-Core API handler for Brizy admin
 * Manages AI-Core session creation, data fetching, and website import from Brizy's AI service.
 */
class Brizy_Admin_Ai_Api {
    const nonce = 'brizy-api';

    const AJAX_CREATE_SESSION    = '_ai_create_session';
    const AJAX_STARTED_PROJECT   = '_ai_started_project';
    const AJAX_GENERATE_TEMPLATE = '_ai_generate_template';

    /**
     * Initializes the class using a singleton pattern to ensure only one instance exists.
     * @return Brizy_Admin_Ai_Api
     */
    public static function _init() {
        static $instance;

        if ( ! $instance ) {
            $instance = new self();
        }

        return $instance;
    }

    /**
     * Constructor. Fires the registration of AJAX actions.
     */
    public function __construct() {
        $this->registerAjaxActions();
    }

    /**
     * Registers the WordPress AJAX action handlers for the AI functionality.
     */
    private function registerAjaxActions() {
        $pref = 'wp_ajax_' . Brizy_Editor::prefix();

        $createSession    = $pref . self::AJAX_CREATE_SESSION;
        $startedProject   = $pref . self::AJAX_STARTED_PROJECT;
        $generateTemplate = $pref . self::AJAX_GENERATE_TEMPLATE;

        add_action( $createSession, array( $this, 'aiCreateSession' ) );
        add_action( $startedProject, array( $this, 'aiStartedProject' ) );
        add_action( $generateTemplate, array( $this, 'aiGenerateTemplate' ) );
    }

    /**
     * Retrieves the current Brizy Pro license key.
     * Required for authenticating with the AI API.
     * @return string The license key or an empty string if not found.
     */
    private function getLicenseKey() {
        $licenseKey = '';

        if ( class_exists( 'BrizyPro_Admin_License' ) ) {
            $licenseData = BrizyPro_Admin_License::_init()->getCurrentLicense();
            if ( ! empty( $licenseData['key'] ) ) {
                $licenseKey = $licenseData['key'];
            }
        }

        return $licenseKey;
    }

    /**
     * Creates a new session with the external AI service and returns the AI interface URL.
     */
    public function aiCreateSession() {
        $licenseKey = $this->getLicenseKey();

        if ( empty( $licenseKey ) ) {
            wp_send_json_error( array(
                'message' => 'License key is required.',
            ), 403 );

            return;
        }

        if ( ! isset( $_REQUEST['action'] ) ) {
            wp_send_json_error( 'Action parameter is required', 400 );

            return;
        }

        if ( ! isset( $_REQUEST['hash'] ) ) {
            wp_send_json_error( 'Hash parameter is required', 400 );

            return;
        }

        if ( ! wp_verify_nonce( $_REQUEST['hash'], self::nonce ) ) {
            wp_send_json_error( 'Invalid nonce', 400 );

            return;
        }

        $httpClient = new Brizy_Editor_Http_Client();

        try {
            $headers = [
                'X-API-Key' => $licenseKey
            ];

            $options = [
                'headers' => $headers
            ];

            $createSession = $httpClient->request(
                Brizy_Config::getAiCreateSessionUrl(),
                $options,
                'POST'
            )->get_response_body();

            if ( $createSession ) {
                if ( $createSession['aiUrl'] ) {
                    $siteUrl = get_site_url();

                    $callBackUrl = $siteUrl . '/wp-admin/admin.php?page=starter-templates';

                    $createSession['aiUrl'] = $createSession['aiUrl'] . '&callbackUrl=' . $callBackUrl;

                    wp_send_json_success( $createSession );
                } else {
                    wp_send_json_error( $createSession, 400 );
                }
            } else {
                wp_send_json_error( 'No response received from the API.', 400 );
            }

        } catch ( Exception $e ) {
            wp_send_json_error( 'Error communicating with the API: ' . $e->getMessage(), 500 );
        }
    }

    /**
     * Saves the session ID to the database to track the user's progress.
     */
    public function aiStartedProject() {
        if ( ! isset( $_REQUEST['hash'] ) || ! wp_verify_nonce( $_REQUEST['hash'], self::nonce ) ) {
            wp_send_json_error( 'Invalid nonce', 400 );

            return;
        }

        $sessionId = isset( $_REQUEST['sessionId'] ) ? sanitize_text_field( $_REQUEST['sessionId'] ) : '';
        if ( empty( $sessionId ) ) {
            wp_send_json_error( 'sessionId is required', 400 );

            return;
        }

        update_option( 'brizy_ai_session_id', $sessionId );

        wp_send_json_success( array( 'message' => 'AI project marked as started', 'sessionId' => $sessionId ) );
    }

    /**
     * Fetches the generated website data from the AI service and triggers the import process.
     */
    public function aiGenerateTemplate() {
        if ( ! isset( $_REQUEST['hash'] ) || ! wp_verify_nonce( $_REQUEST['hash'], self::nonce ) ) {
            wp_send_json_error( 'Invalid nonce', 400 );

            return;
        }

        $sessionId = isset( $_REQUEST['sessionId'] ) ? sanitize_text_field( $_REQUEST['sessionId'] ) : '';

        if ( empty( $sessionId ) ) {
            wp_send_json_error( 'sessionId parameter is required', 400 );

            return;
        }

        $httpClient = new Brizy_Editor_Http_Client();

        $response = $httpClient->request(
            Brizy_Config::getAiGeneratedTemplateUrl() . $sessionId,
            [],
            'GET'
        );

        $body = $response->get_response_body();

        $imported    = $this->importPagesData( $body );
        $projectData = $this->importProjectData( $body );

        $homePostId = 0;
        if ( is_array( $imported ) && ! empty( $imported ) ) {
            $homePostId = (int) $imported[0]['id'];
        }

        $editHomepageUrl = admin_url( 'post.php?action=in-front-editor&post=' . $homePostId );

        wp_send_json_success( array(
            'pages'           => $imported,
            'homeId'          => $homePostId,
            'editHomepageUrl' => $editHomepageUrl,
            'projectData'     => $projectData,
        ) );
    }

    /**
     * Imports the global project styles from the AI data payload.
     * This replaces the existing site-wide color palettes and font styles.
     *
     * @param  array  $body  The full response body from the AI service.
     *
     * @return string The new project data as a JSON string, or an empty string on failure.
     * @throws Brizy_Editor_Exceptions_AccessDenied
     */
    private function importProjectData( $body ) {
        $project = Brizy_Editor_Project::get();

        $bodyproject = json_decode( $body['project'], true );
        $project->setDataAsJson( $bodyproject['data'] );

        $current_data_version = $project->getCurrentDataVersion();
        $project->setDataVersion( $current_data_version + 1 );

        $project->set_compiler( Brizy_Editor_Entity::COMPILER_BROWSER );

        $project->set_uses_editor( true );

        try {
            $project->save( 0 );
            $project->savePost();
        } catch ( Exception $e ) {
            wp_send_json_error( 'Error import project data:', $e->getMessage(), 400 );
        }

        return $project->getDataAsJson();
    }

    /**
     * Imports the individual pages from the AI data payload.
     * This is a destructive action: it deletes all existing pages first.
     *
     * @param  array  $body  The full response body from the AI service.
     *
     * @return array An array of imported page data.
     * @throws Brizy_Editor_Exceptions_AccessDenied
     */
    private function importPagesData( $body ) {
        if ( isset( $body['project'] ) ) {
            $body['project'] = $body;
        }

        $existing_pages = get_posts( array(
            'post_type'   => 'page',
            'post_status' => 'any',
            'numberposts' => - 1,
            'fields'      => 'ids',
        ) );

        if ( ! empty( $existing_pages ) ) {
            foreach ( $existing_pages as $existing_page_id ) {
                wp_delete_post( $existing_page_id, true );
            }
        }

        $imported = [];

        foreach ( $body['pages'] as $page ) {
            $page = json_decode( $page, true );

            $pageTitle = isset( $page['title'] ) ? $page['title'] : 'default title';
            $pageSlug  = isset( $page['slug'] ) ? $page['slug'] : 'default-slug';
            $pageData  = isset( $page['pageData'] ) ? $page['pageData'] : '{"items":[]}';

            $pageStructure = array(
                'post_title'     => $pageTitle,
                'post_name'      => $pageSlug . '-' . uniqid(),
                'post_status'    => 'publish',
                'post_type'      => 'page',
                'post_author'    => get_current_user_id() ? get_current_user_id() : 1,
                'comment_status' => 'closed',
                'page_template'  => Brizy_Config::BRIZY_BLANK_TEMPLATE_FILE_NAME,
            );

            $postId = wp_insert_post( $pageStructure );
            $post   = Brizy_Editor_Post::get( $postId );

            $post->enable_editor();
            $post->saveStorage();
            $post->set_editor_data( $pageData );
            $post->setDataVersion( 1 );
            $post->set_compiler_version( 0 );
            $post->set_editor_version( BRIZY_EDITOR_VERSION );
            $post->set_needs_compile( true );
            $post->save( 0 );
            $post->compile_page();
            $post->savePost( true );

            $imported[] = array(
                'id'    => $postId,
                'title' => $pageTitle,
                'slug'  => $pageSlug,
                'data'  => $pageData,
            );
        }

        return $imported;
    }
}
