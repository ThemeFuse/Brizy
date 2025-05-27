<?php

class Brizy_Editor_Compiler
{

    const BRIZY_RECOMPILE_TAG_OPTION = 'brizy-recompile-tag';

    /**
     * @var Brizy_Editor_Project
     */
    private $project;

    /**
     * @var Brizy_Admin_Blocks_Manager
     */
    private $blocksManager;
    /**
     * @var Brizy_Editor_UrlBuilder
     */
    private $urlBuilder;
    private $compilerUrl;
    private $compilerDownloadUrl;

    public function __construct(
        Brizy_Editor_Project $project, Brizy_Admin_Blocks_Manager $blocksManager, Brizy_Editor_UrlBuilder $urlBuilder, $compilerUrl, $compilerDownloadUrl
    )
    {

        $this->project = $project;
        $this->blocksManager = $blocksManager;
        $this->urlBuilder = $urlBuilder;
        $this->compilerUrl = $compilerUrl;
        $this->compilerDownloadUrl = $compilerDownloadUrl;
    }

    public function compilePost(Brizy_Editor_Post $post, $editorConfig)
    {
        $this->urlBuilder->set_post_id($post->getWpPostId());
        $editor_data = $post->getEditorData(true);
        $compilerParam = $this->compilerParams($editor_data, $editorConfig);
        $httpClient = new Brizy_Editor_Http_Client();
        $compilerResult = $httpClient->request($this->compilerUrl, array('body' => $compilerParam), 'POST')->get_response_body();
        if (!is_array($compilerResult)) {
            throw new UnexpectedValueException('The compiler response body is invalid');
        }
        // process page data
        $pageData = $compilerResult['compiled']['page'];
        // update post
        $this->updatePost($post, $pageData);
        // update project styles
        if (isset($compilerResult['compiled']['project'])) {
            $this->updateProjectStyles($compilerResult['compiled']['project']);
        }
        // update global blocks
        if (isset($compilerResult['compiled']['globalBlocks'])) {
            $this->updateGlobalBLocks($compilerResult['compiled']['globalBlocks']);
        }

        return true;
    }

    public function needsCompile(Brizy_Editor_Post $post)
    {

        $currentCompiler = preg_replace("/((-beta\d+?)?-wp)$/", "", $post->get_compiler_version());
        $v2 = preg_replace("/((-beta\d+?)?-wp)$/", "", BRIZY_MINIMUM_COMPILER_VERSION);

        if (BRIZY_EDITOR_VERSION == 'dev') {
            $v2 = BRIZY_EDITOR_VERSION;// force recompile if the post does not have sections
            // usually this will be needed only in dev mode.
            if (empty($post->getCompiledSections())) {
                return true;
            }
        }
        if (version_compare($currentCompiler, $v2, "<")) {
            return true;
        }

        return false;
    }

    private function updateProjectStyles($styles)
    {
        $this->project->setCompiledStyles($styles);
        $this->project->set_compiler(Brizy_Editor_Entity::COMPILER_BROWSER);
        $this->project->saveStorage();
    }

    private function updatePost(Brizy_Editor_Post $post, $pageData)
    {

        $section_manager = $post->getCompiledSectionManager();
        $section_manager->merge($pageData);
        $post->setCompiledSections($section_manager->asJson());
        $post->setCompiledScripts([]);
        $post->setCompiledStyles([]);
        $post->set_needs_compile(false);
        $post->set_compiler(Brizy_Editor_Post::COMPILER_BROWSER);
        $post->set_compiler_version(BRIZY_EDITOR_VERSION);
        $post->set_plugin_version(BRIZY_VERSION);
        $post->set_pro_plugin_version(defined('BRIZY_PRO_VERSION') ? BRIZY_PRO_VERSION : null);
        $post->savePost();
        $post->saveStorage();
    }

    private function updateGlobalBLocks($globalBlockData)
    {
        foreach ($globalBlockData as $blockData) {
            $block = $this->blocksManager->getEntity($blockData['uid']);
            $this->updatePost($block, $blockData);
        }
    }

    private function compilerParams($pageData, $editorConfig)
    {

        return apply_filters('brizy_compiler_params', array(
            'page_id' => (int)$editorConfig['wp']['page'],
            'free_version' => BRIZY_EDITOR_VERSION,
            'free_url' => $this->compilerDownloadUrl,
            'config_json' => json_encode($editorConfig),
        ));
    }

    static public function resetCompiledVersion()
    {
        global $wpdb;
        $wpdb->query("UPDATE {$wpdb->postmeta} SET meta_value='0.0.0' WHERE meta_key = '" . Brizy_Editor_Post::BRIZY_POST_COMPILER_VERSION . "'");
    }

    static public function checkRecompileTag()
    {
        $currentTag = (int)get_option(self::BRIZY_RECOMPILE_TAG_OPTION, null);
        if ($currentTag < BRIZY_RECOMPILE_TAG) {
            self::resetCompiledVersion();
            update_option(self::BRIZY_RECOMPILE_TAG_OPTION, BRIZY_RECOMPILE_TAG);
        }
    }
}