<?php

if (!defined('ABSPATH')) {
    die('Direct access forbidden.');
}

class Brizy_Admin_Ai_Api
{
    const nonce = 'brizy-api';

    const AJAX_CREATE_SESSION    = '_ai_create_session';
    const AJAX_GENERATE_TEMPLATE = '_ai_generate_template';
    const AJAX_IMPORT_DELETE     = '_ai_import_delete';
    const AJAX_IMPORT_KEEP       = '_ai_import_keep';

    public static function _init()
    {
        static $instance;

        if (!$instance) {
            $instance = new self();
        }

        return $instance;
    }

    public function __construct()
    {
        $this->registerAjaxActions();
    }

    private function registerAjaxActions()
    {
        $pref = 'wp_ajax_'.Brizy_Editor::prefix();

        $createSession    = $pref.self::AJAX_CREATE_SESSION;
        $generateTemplate = $pref.self::AJAX_GENERATE_TEMPLATE;
        $importDelete     = $pref.self::AJAX_IMPORT_DELETE;
        $importKeep       = $pref.self::AJAX_IMPORT_KEEP;

        add_action($createSession, array($this, 'aiCreateSession'));
        add_action($generateTemplate, array($this, 'aiGenerateTemplate'));
        add_action($importDelete, array($this, 'aiImportDelete'));
        add_action($importKeep, array($this, 'aiImportKeep'));
    }

    private function getLicenseKey()
    {
        $licenseKey = '';

        if (class_exists('BrizyPro_Admin_License')) {
            $licenseData = BrizyPro_Admin_License::_init()->getCurrentLicense();
            if (!empty($licenseData['key'])) {
                $licenseKey = $licenseData['key'];
            }
        }

        return $licenseKey;
    }

    public function aiCreateSession()
    {
        $licenseKey = $this->getLicenseKey();

        if (empty($licenseKey)) {
            wp_send_json_error(array(
                'message' => 'License key is required.',
            ), 403);

            return;
        }

        if (!isset($_REQUEST['action'])) {
            wp_send_json_error('Action parameter is required', 400);

            return;
        }

        if (!isset($_REQUEST['hash'])) {
            wp_send_json_error('Hash parameter is required', 400);

            return;
        }

        if (!wp_verify_nonce($_REQUEST['hash'], self::nonce)) {
            wp_send_json_error('Invalid nonce', 400);

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

            if ($createSession) {
                if ($createSession['aiUrl']) {
                    $siteUrl = get_site_url();

                    $createSession['aiUrl'] = $createSession['aiUrl'].'&callbackUrl='.$siteUrl;

                    wp_send_json_success($createSession);
                } else {
                    wp_send_json_error($createSession, 400);
                }
            } else {
                wp_send_json_error('No response received from the API.', 400);
            }

        } catch (Exception $e) {
            wp_send_json_error('Error communicating with the API: '.$e->getMessage(), 500);
        }
    }

    public function aiGenerateTemplate()
    {
        if (!isset($_REQUEST['hash']) || !wp_verify_nonce($_REQUEST['hash'], self::nonce)) {
            wp_send_json_error('Invalid nonce', 400);

            return;
        }

        $sessionId = isset($_REQUEST['sessionId']) ? sanitize_text_field($_REQUEST['sessionId']) : '';

        if (empty($sessionId)) {
            wp_send_json_error('sessionId parameter is required', 400);

            return;
        }

        $httpClient = new Brizy_Editor_Http_Client();

        $response = $httpClient->request(
            Brizy_Config::getAiGeneratedTemplateUrl().$sessionId,
            [],
            'GET'
        );

        $body = $response->get_response_body();

        wp_send_json_success($body);
    }

    public function aiImportDelete()
    {
        if (!isset($_REQUEST['hash']) || !wp_verify_nonce($_REQUEST['hash'], self::nonce)) {
            wp_send_json_error('Invalid nonce', 400);

            return;
        }

        if (!isset($_REQUEST['body'])) {
            wp_send_json_error('Body parameter is required', 400);

            return;
        }

        $body = json_decode(stripslashes($_REQUEST['body']), true);

        if (!isset($body['project']) || !isset($body['pages'])) {
            wp_send_json_error('Invalid data structure', 400);

            return;
        }

        $this->deletePageData($body);

        $imported    = $this->importPagesData($body);
        $projectData = $this->importProjectDataDelete($body);

        $postId = 0;
        if (is_array($imported) && !empty($imported)) {
            $postId = (int) $imported[0]['id'];
        }

        $editPageUrl = admin_url('post.php?action=in-front-editor&post='.$postId);

        wp_send_json_success(array(
            'pages'       => $imported,
            'pageId'      => $postId,
            'editPageUrl' => $editPageUrl,
            'projectData' => $projectData,
        ));
    }

    public function aiImportKeep()
    {
        if (!isset($_REQUEST['hash']) || !wp_verify_nonce($_REQUEST['hash'], self::nonce)) {
            wp_send_json_error('Invalid nonce', 400);
            return;
        }

        if (!isset($_REQUEST['body'])) {
            wp_send_json_error('Body parameter is required', 400);
            return;
        }

        $body = json_decode(stripslashes($_REQUEST['body']), true);

        if (!isset($body['project']) || !isset($body['pages'])) {
            wp_send_json_error('Invalid data structure', 400);
            return;
        }

        $imported    = $this->importPagesData($body);
        $projectData = $this->importProjectDataKeep($body);

        $postId = 0;
        if (is_array($imported) && !empty($imported)) {
            $postId = (int) $imported[0]['id'];
        }

        $editPageUrl = admin_url('post.php?action=in-front-editor&post='.$postId);

        wp_send_json_success(array(
            'pages'       => $imported,
            'pageId'      => $postId,
            'editPageUrl' => $editPageUrl,
            'projectData' => $projectData,
        ));
    }

    private function importProjectDataDelete($body)
    {
        $project = Brizy_Editor_Project::get();

        $bodyProjectData = json_decode($body['project'], true)['data'];
        $project->setDataAsJson($bodyProjectData);

        $current_data_version = $project->getCurrentDataVersion();
        $project->setDataVersion($current_data_version + 1);

        $project->set_compiler(Brizy_Editor_Entity::COMPILER_BROWSER);

        $project->set_uses_editor(true);

        try {
            $project->save(0);
            $project->savePost();
        } catch (Exception $e) {
            wp_send_json_error('Error import project data:', $e->getMessage(), 400);
        }

        return json_decode($project->getDataAsJson());
    }

    private function importProjectDataKeep($body)
    {
        $project = Brizy_Editor_Project::get();

        $projectData     = json_decode($project->getDataAsJson(), true);
        $bodyProjectData = json_decode(json_decode($body['project'], true)['data'], true);

        $mergeProjectDataStyles = array_merge($projectData['styles'], $bodyProjectData['styles']);
        $keepProjectDataStyles  = [];
        $idsProjectDataStyles   = [];
        foreach ($mergeProjectDataStyles as $styles) {
            if (!in_array($styles['id'], $idsProjectDataStyles)) {
                $idsProjectDataStyles[]  = $styles['id'];
                $keepProjectDataStyles[] = $styles;
            }
        }
        $projectData['styles'] = $keepProjectDataStyles;

        $mergeProjectDataFontsBlocks = array_merge($projectData['fonts']['blocks']['data'], $bodyProjectData['fonts']['blocks']['data']);
        $keepProjectDataFontsBlocks  = [];
        $idsProjectDataFontsBlocks   = [];
        foreach ($mergeProjectDataFontsBlocks as $fontsBlocks) {
            if (!in_array($fontsBlocks['brizyId'], $idsProjectDataFontsBlocks)) {
                $idsProjectDataFontsBlocks[]  = $fontsBlocks['brizyId'];
                $keepProjectDataFontsBlocks[] = $fontsBlocks;
            }
        }
        $projectData['fonts']['blocks']['data'] = $keepProjectDataFontsBlocks;

        $mergeProjectDataFontsConfig = array_merge($projectData['fonts']['config']['data'], $bodyProjectData['fonts']['config']['data']);
        $keepProjectDataFontsConfig  = [];
        $idsProjectDataFontsConfig   = [];
        foreach ($mergeProjectDataFontsConfig as $fontsConfig) {
            if (!in_array($fontsConfig['brizyId'], $idsProjectDataFontsConfig)) {
                $idsProjectDataFontsConfig[]  = $fontsConfig['brizyId'];
                $keepProjectDataFontsConfig[] = $fontsConfig;
            }
        }
        $projectData['fonts']['config']['data'] = $keepProjectDataFontsConfig;

        if ($projectData['fonts']['google']['data'] && $bodyProjectData['fonts']['google']['data']) {
            $mergeProjectDataFontsGoogle = array_merge($projectData['fonts']['google']['data'], $bodyProjectData['fonts']['google']['data']);
            $keepProjectDataFontsGoogle  = [];
            $idsProjectDataFontsGoogle   = [];
            foreach ($mergeProjectDataFontsGoogle as $fontsGoogle) {
                if (!in_array($fontsGoogle['brizyId'], $idsProjectDataFontsGoogle)) {
                    $idsProjectDataFontsGoogle[]  = $fontsGoogle['brizyId'];
                    $keepProjectDataFontsGoogle[] = $fontsGoogle;
                }
            }
            $projectData['fonts']['google']['data'] = $keepProjectDataFontsGoogle;
        }

        $project->setDataAsJson(json_encode($projectData));

        $current_data_version = $project->getCurrentDataVersion();
        $project->setDataVersion($current_data_version + 1);

        $project->set_compiler(Brizy_Editor_Entity::COMPILER_BROWSER);

        $project->set_uses_editor(true);

        try {
            $project->save(0);
            $project->savePost();
        } catch (Exception $e) {
            wp_send_json_error('Error import project data:', $e->getMessage(), 400);
        }

        return json_decode($project->getDataAsJson());
    }

    private function importPagesData($body)
    {
        $imported = [];

        foreach ($body['pages'] as $page) {
            $page = json_decode($page, true);

            $pageTitle = isset($page['title']) ? $page['title'] : 'default title';
            $pageSlug  = isset($page['slug']) ? $page['slug'] : 'default-slug';
            $pageData  = isset($page['pageData']) ? $page['pageData'] : '{"items":[]}';

            $pageStructure = array(
                'post_title'     => $pageTitle,
                'post_name'      => $pageSlug.'-'.uniqid(),
                'post_status'    => 'publish',
                'post_type'      => 'page',
                'post_author'    => get_current_user_id() ? get_current_user_id() : 1,
                'comment_status' => 'closed',
                'page_template'  => Brizy_Config::BRIZY_BLANK_TEMPLATE_FILE_NAME,
            );

            $postId = wp_insert_post(postarr: $pageStructure);
            $post   = Brizy_Editor_Post::get($postId);

            $post->enable_editor();
            $post->saveStorage();
            $post->set_editor_data($pageData);
            $post->setDataVersion(1);
            $post->set_compiler_version(0);
            $post->set_editor_version(BRIZY_EDITOR_VERSION);
            $post->set_needs_compile(true);
            $post->save(0);
            $post->compile_page();
            $post->savePost(true);

            $imported[] = array(
                'id'    => $postId,
                'title' => $pageTitle,
                'slug'  => $pageSlug,
                'data'  => $pageData,
            );
        }

        return $imported;
    }

    private function deletePageData($body)
    {
        if (isset($body['project'])) {
            $body['project'] = $body;
        }

        $existing_pages = get_posts(array(
            'post_type'   => 'page',
            'post_status' => 'any',
            'numberposts' => -1,
            'fields'      => 'ids',
        ));

        if (!empty($existing_pages)) {
            foreach ($existing_pages as $existing_page_id) {
                wp_delete_post($existing_page_id, true);
            }
        }
    }

}
