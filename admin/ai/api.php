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
    const AJAX_SEND_PROJECT      = '_ai_send_project';

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
        $pref = 'wp_ajax_' . Brizy_Editor::prefix();

        $createSession    = $pref . self::AJAX_CREATE_SESSION;
        $generateTemplate = $pref . self::AJAX_GENERATE_TEMPLATE;
        $importDelete     = $pref . self::AJAX_IMPORT_DELETE;
        $importKeep       = $pref . self::AJAX_IMPORT_KEEP;
        $sendProject      = $pref . self::AJAX_SEND_PROJECT;

        add_action($createSession, array($this, 'aiCreateSession'));
        add_action($generateTemplate, array($this, 'aiGenerateTemplate'));
        add_action($importDelete, array($this, 'aiImportDelete'));
        add_action($importKeep, array($this, 'aiImportKeep'));
        add_action($sendProject, array($this, 'aiSendProject'));
    }

    public function aiCreateSession()
    {
        $licenseKey = '';

        if (class_exists('BrizyPro_Admin_License')) {
            $licenseData = BrizyPro_Admin_License::_init()->getCurrentLicense();
            if (!empty($licenseData['key'])) {
                $licenseKey = $licenseData['key'];
            }
        }

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
                'X-API-Key' => $licenseKey,
                'Content-Type' => 'application/json'
            ];

            $options = [
                'headers' => $headers
            ];

            $response = $httpClient->request(
                Brizy_Config::getAiCreateSessionUrl(),
                $options,
                'POST'
            );

            $createSession = $response->get_response_body();

            if ($createSession) {
                if (isset($createSession['aiUrl']) && isset($createSession['sessionId'])) {
                    $siteUrl = get_site_url();

                    $createSession['aiUrl'] = $createSession['aiUrl'] . '&callbackUrl=' . $siteUrl;

                    wp_send_json_success($createSession);
                } else {
                    wp_send_json_error($createSession, 400);
                }
            } else {
                wp_send_json_error($createSession, 400);
            }
        } catch (Exception $e) {
            wp_send_json_error($e->getMessage(), 500);
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

        try {
            $response = $httpClient->request(
                Brizy_Config::getAiGeneratedTemplateUrl() . $sessionId,
                [],
                'GET'
            );

            $body = $response->get_response_body();

            if ($body) {
                wp_send_json_success($body);
            } else {
                wp_send_json_error('No response received from the API.', 400);
            }
        } catch (Exception $e) {
            wp_send_json_error($e->getMessage(), 500);
        }
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

        if ($body === null) {
            wp_send_json_error('Invalid JSON in body parameter', 400);

            return;
        }

        if (!isset($body['project']) || !isset($body['pages'])) {
            wp_send_json_error('Invalid data structure', 400);

            return;
        }

        try {
            $this->deletePageData();

            $imported    = $this->importPagesData($body);
            $projectData = $this->importProjectDataDelete($body);
            $globalBlocks = $this->importGlobalBlocksData($body);

            if ($projectData === null) {
                return;
            }

            $postId = 0;
            if (is_array($imported) && !empty($imported)) {
                $postId = (int) $imported[0]['id'];
            }

            $this->recompileProject($postId);

            $editPageUrl = admin_url('post.php?action=in-front-editor&post=' . $postId);

            wp_send_json_success(array(
                'globalBlocks' => $globalBlocks,
                'pages'       => $imported,
                'pageId'      => $postId,
                'editPageUrl' => $editPageUrl,
                'projectData' => $projectData,
            ));
        } catch (Exception $e) {
            wp_send_json_error($e->getMessage(), 500);
        }
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

        if ($body === null) {
            wp_send_json_error('Invalid JSON in body parameter', 400);

            return;
        }

        if (!isset($body['project']) || !isset($body['pages'])) {
            wp_send_json_error('Invalid data structure', 400);

            return;
        }

        try {
            $imported    = $this->importPagesData($body);
            $projectData = $this->importProjectDataKeep($body);

            if ($projectData === null) {
                return;
            }

            $postId = 0;
            if (is_array($imported) && !empty($imported)) {
                $postId = (int) $imported[0]['id'];
            }

            $editPageUrl = admin_url('post.php?action=in-front-editor&post=' . $postId);

            wp_send_json_success(array(
                'pages'       => $imported,
                'pageId'      => $postId,
                'editPageUrl' => $editPageUrl,
                'projectData' => $projectData,
            ));
        } catch (Exception $e) {
            wp_send_json_error($e->getMessage(), 500);
        }
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

        $mergeProjectDataFontsBlocks = array_merge(
            $projectData['fonts']['blocks']['data'],
            $bodyProjectData['fonts']['blocks']['data']
        );
        $keepProjectDataFontsBlocks  = [];
        $idsProjectDataFontsBlocks   = [];
        foreach ($mergeProjectDataFontsBlocks as $fontsBlocks) {
            if (!in_array($fontsBlocks['brizyId'], $idsProjectDataFontsBlocks)) {
                $idsProjectDataFontsBlocks[]  = $fontsBlocks['brizyId'];
                $keepProjectDataFontsBlocks[] = $fontsBlocks;
            }
        }
        $projectData['fonts']['blocks']['data'] = $keepProjectDataFontsBlocks;

        $mergeProjectDataFontsConfig = array_merge(
            $projectData['fonts']['config']['data'],
            $bodyProjectData['fonts']['config']['data']
        );
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
            $mergeProjectDataFontsGoogle = array_merge(
                $projectData['fonts']['google']['data'],
                $bodyProjectData['fonts']['google']['data']
            );
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

        $project->set_compiler(Brizy_Editor_Entity::COMPILER_EXTERNAL);

        $project->set_uses_editor(true);

        try {
            $project->save(0);
            $project->savePost();
        } catch (Exception $e) {
            wp_send_json_error('Error import project data:', $e->getMessage(), 400);
        }

        return json_decode($project->getDataAsJson());
    }

    private function importProjectDataDelete($body)
    {
        $project = Brizy_Editor_Project::get();

        $decodedProject = json_decode($body['project'], true);

        if ($decodedProject === null || !isset($decodedProject['data'])) {
            wp_send_json_error('Invalid project data structure', 400);

            return null;
        }
        $bodyProjectData = $decodedProject['data'];

        $project->setDataAsJson($bodyProjectData);

        $current_data_version = $project->getCurrentDataVersion();
        $project->setDataVersion($current_data_version + 1);

        $project->set_compiler(Brizy_Editor_Entity::COMPILER_EXTERNAL);

        $project->set_uses_editor(true);

        try {
            $project->save(0);
            $project->savePost();
        } catch (Exception $e) {
            wp_send_json_error($e->getMessage(), 400);

            return null;
        }

        return json_decode($project->getDataAsJson());
    }

    private function importGlobalBlocksData($body)
    {
        $blocksManager = new Brizy_Admin_Blocks_Manager(Brizy_Admin_Blocks_Main::CP_GLOBAL);
        $existingBlocks = $blocksManager->getEntities(['post_status' => 'any', 'posts_per_page' => -1]);

        foreach ($existingBlocks as $block) {
            if ($block instanceof Brizy_Editor_Block) {
                $blocksManager->deleteEntity($block);
            }
        }

        if (!isset($body['globalBlocks']) || empty($body['globalBlocks'])) {
            return [];
        }

        $importedBlocks = [];
        $blockManager = new Brizy_Admin_Blocks_Manager(Brizy_Admin_Blocks_Main::CP_GLOBAL);

        try {
            foreach ($body['globalBlocks'] as $globalBlockData) {
                if (is_string($globalBlockData)) {
                    $globalBlockData = json_decode($globalBlockData, true);

                    if ($globalBlockData === null) {
                        continue;
                    }
                }

                if (!is_array($globalBlockData) || !isset($globalBlockData['uid']) || !isset($globalBlockData['data'])) {
                    continue;
                }

                $uid = $globalBlockData['uid'];
                $status = $globalBlockData['status'] ?? 'publish';

                $block = $blockManager->createEntity($uid, $status);

                if (!$block) {
                    continue;
                }

                if (isset($globalBlockData['meta'])) {
                    $meta = is_string($globalBlockData['meta']) ? $globalBlockData['meta'] : json_encode($globalBlockData['meta']);
                    $block->setMeta($meta);
                }

                if (isset($globalBlockData['data'])) {
                    $data = is_string($globalBlockData['data']) ? $globalBlockData['data'] : json_encode($globalBlockData['data']);
                    $block->setEditorData($data);
                }

                $block->set_needs_compile(true);

                if (isset($globalBlockData['title'])) {
                    $block->setTitle($globalBlockData['title']);
                }

                if (isset($globalBlockData['tags'])) {
                    $tags = is_string($globalBlockData['tags']) ? $globalBlockData['tags'] : json_encode($globalBlockData['tags']);
                    $block->setTags($tags);
                }

                if (isset($globalBlockData['dependencies']) && is_array($globalBlockData['dependencies'])) {
                    $block->setDependencies($globalBlockData['dependencies']);
                }

                if (isset($globalBlockData['position'])) {
                    $positionData = $globalBlockData['position'];
                    $position = null;

                    if (is_string($positionData)) {
                        $position = json_decode($positionData, true);
                    } elseif (is_array($positionData)) {
                        $position = $positionData;
                    }

                    $positionObj = new Brizy_Editor_BlockPosition(
                        isset($position['top']) ? $position['top'] : null,
                        isset($position['bottom']) ? $position['bottom'] : null,
                        isset($position['align']) ? $position['align'] : null
                    );

                    $block->setPosition($positionObj);
                }

                $block->set_compiler(Brizy_Editor_Entity::COMPILER_EXTERNAL);
                $block->save();

                $defaultRules = [
                    [
                        'type' => 1,
                        'appliedFor' => 1,
                        'entityType' => 'page',
                        'entityValues' => []
                    ]
                ];
                $rulesData = json_encode($defaultRules);
                $ruleManager = new Brizy_Admin_Rules_Manager();
                $rules = $ruleManager->createRulesFromJson($rulesData, Brizy_Admin_Blocks_Main::CP_GLOBAL);

                if ($rules) {
                    $ruleManager->addRules($block->getWpPostId(), $rules);
                }

                $importedBlocks[] = $block->createResponse();
                do_action('brizy_global_block_created', $block);
            }

            Brizy_Editor_Block::cleanClassCache();
        } catch (Exception $exception) {
            error_log('Error importing global blocks: ' . $exception->getMessage());
        }

        return $importedBlocks;
    }

    private function importPagesData($body)
    {
        $imported = [];

        foreach ($body['pages'] as $page) {
            $page = json_decode($page, true);

            if ($page === null) {
                continue;
            }

            $pageTitle = isset($page['title']) ? $page['title'] : 'default title';
            $pageSlug  = isset($page['slug']) ? $page['slug'] : 'default-slug';
            $pageData  = isset($page['pageData']) ? $page['pageData'] : '{"items":[]}';

            $pageStructure = array(
                'post_title'     => $pageTitle,
                'post_name'      => $pageSlug,
                'post_status'    => 'publish',
                'post_type'      => 'page',
                'post_author'    => get_current_user_id() ? get_current_user_id() : 1,
                'comment_status' => 'closed',
                'page_template'  => Brizy_Config::BRIZY_BLANK_TEMPLATE_FILE_NAME,
            );
            $postId = wp_insert_post($pageStructure);

            if (!$postId || is_wp_error($postId)) {
                continue;
            }

            try {
                $post = Brizy_Editor_Post::get($postId);

                $current_data_version = $post->getCurrentDataVersion();
                $post->setDataVersion($current_data_version + 1);

                $post->set_editor_data($pageData);

                $post->enable_editor();
                $post->set_editor_version(BRIZY_EDITOR_VERSION);
                $post->set_needs_compile(true);
                $post->set_plugin_version(BRIZY_VERSION);
                $post->set_pro_plugin_version(defined('BRIZY_PRO_VERSION') ? BRIZY_PRO_VERSION : null);
                $post->set_compiler(Brizy_Editor_Entity::COMPILER_EXTERNAL);
                $post->set_compiler_version(0);

                $post->saveStorage();
                $post->save();
                $post->savePost(true);

                $imported[] = array(
                    'id'    => $postId,
                    'title' => $pageTitle,
                    'slug'  => $pageSlug,
                    'data'  => $pageData,
                );
            } catch (Exception $e) {
                continue;
            }
        }

        return $imported;
    }

    private function deletePageData()
    {
        $existing_pages = get_posts(array(
            'post_type'   => 'page',
            'post_status' => 'any',
            'numberposts' => -1,
            'fields'      => 'ids',
        ));

        if (!empty($existing_pages)) {
            foreach ($existing_pages as $existing_page_id) {
                if (Brizy_Editor_Entity::isBrizyEnabled($existing_page_id)) {
                    if (current_user_can('delete_post', $existing_page_id)) {
                        wp_delete_post($existing_page_id, true);
                    }
                }
            }
        }
    }

    public function aiSendProject()
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

        try {
            $projectData = Brizy_Editor_Project::get()->createResponse();
            $url = Brizy_Config::getAiSetProjectDataUrl() . $sessionId;
            $httpClient = new Brizy_Editor_Http_Client();

            $project = Brizy_Editor_Project::get();
            $typography = $project->getCompiledStyles()['styles'][0]['content']['content'];
            $projectFonts = $this->getProjectFonts();

            $data = [
                'projectData' => $projectData,
                'projectTypography' => $typography,
                'projectFonts' => $projectFonts,
            ];

            $options = [
                'body' => json_encode(['data' => $data]),
                'headers' => [
                    'Content-Type' => 'application/json',
                ],
            ];

            $request = $httpClient->request($url, $options, 'POST');

            $response = $request->get_response_body();

            if ($response) {
                wp_send_json_success($response);
            } else {
                wp_send_json_error('No response received from the external API.', 500);
            }
        } catch (Exception $e) {
            wp_send_json_error($e->getMessage(), 500);
        }
    }

    private function getProjectFonts()
    {
        $fonts   = [];
        $project = Brizy_Editor_Project::get();

        try {
            $projectData = $project->getDecodedData();
            $allGoogleFonts = [];

            if (is_object($projectData) && isset($projectData->fonts) && is_object($projectData->fonts)) {
                $fontsObject = $projectData->fonts;
                foreach (get_object_vars($fontsObject) as $key => $value) {
                    if ($key === 'adobe' || $key === 'upload' || $key === 'system') {
                        continue;
                    }
                    
                    if (is_object($value) && isset($value->data) && is_array($value->data)) {
                        $allGoogleFonts = array_merge($allGoogleFonts, $value->data);
                    }
                }
            }

            if (!empty($allGoogleFonts)) {
                $filteredFonts = [];
                
                foreach ($allGoogleFonts as $font) {
                    if (is_object($font) && isset($font->deleted) && $font->deleted === true) {
                        continue;
                    }

                    if (is_object($font) && isset($font->family) && isset($font->variants)) {
                        $filteredFonts[] = $font;
                    }
                }

                if (!empty($filteredFonts)) {
                    $families = [];

                    foreach ($filteredFonts as $font) {
                        if (is_object($font) && isset($font->family) && isset($font->variants)) {
                            $fontFamily = str_replace(' ', '+', $font->family);
                            $weights = is_array($font->variants) ? implode(',', $font->variants) : $font->variants;

                            $families[] = $fontFamily . ':' . $weights;
                        }
                    }

                    if (!empty($families)) {
                        $family  = implode('|', $families);
                        $fontUrl = 'https://fonts.bunny.net/css?family=' . $family . '&subset=arabic,bengali,cyrillic,cyrillic-ext,devanagari,greek,greek-ext,gujarati,hebrew,khmer,korean,latin-ext,tamil,telugu,thai,vietnamese&display=swap';

                        $fonts[] = [
                            'name'    => 'google',
                            'type'    => 'google-font',
                            'url'     => $fontUrl,
                            'content' => '',
                            'fonts'   => $filteredFonts
                        ];
                    }
                }
            }
        } catch (Exception $e) {
            error_log('Error getting project fonts: ' . $e->getMessage());
        }

        return $fonts;
    }

    private function recompileProject($postId)
    {
        if (empty($postId) || $postId <= 0) {
            return;
        }

        $pageUrl = get_permalink($postId);

        if (!$pageUrl) {
            return;
        }

        $httpClient = new Brizy_Editor_Http_Client();

        try {
            $httpClient->request($pageUrl, [], 'GET');
        } catch (Exception $e) {
            // Ignore errors
        }
    }
    
}
