<?php
/**
 * Created by PhpStorm.
 * User: alex
 * Date: 1/11/19
 * Time: 10:59 AM
 */

class Brizy_Admin_Blocks_Main
{

    const CP_GLOBAL = 'brizy-global-block';
    const CP_SAVED = 'brizy-saved-block';

    private $allReferencedBlocks = [];

    /**
     * @return Brizy_Admin_Blocks_Main
     */
    public static function _init()
    {
        static $instance;
        if (!$instance) {
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
        add_action('brizy_preview_mode', array($this, 'initializePreviewActions'));
    }

    public function isReferencedInPage(Brizy_Editor_Post $block)
    {
        return isset($this->allReferencedBlocks[$block->getUid()]);
    }

    public function addReferencedInPage(Brizy_Editor_Post $block)
    {
        return $this->allReferencedBlocks[$block->getUid()] = $block;
    }

    public function initializePreviewActions($post)
    {
        // make sure we include this only in preview and only pages edited with brizy
        $is_view_page = Brizy_Public_Main::is_view_page($post);
        $compiler = $post->get_compiler();
        if ($is_view_page) {
            add_action('wp_enqueue_scripts', [$this, 'enqueueMatchedGlobalBlockAssets']);
        }
    }

    public function initializeActions()
    {

        add_filter('brizy_global_data', array($this, 'populateGlobalData'));
        add_filter('brizy_editor_config', [$this, 'addPageGlobalBlocks'], 10, 2);
        Brizy_Admin_Blocks_Api::_init();
    }

    /**
     * Populated the global data for compiler
     *
     * @param $globalData
     *
     * @return mixed
     * @throws Brizy_Editor_Exceptions_NotFound
     */
    public function populateGlobalData($globalData)
    {

        if (!is_object($globalData)) {
            $globalData = (object)array('globalBlocks' => array(), 'savedBlocks' => array());
        }
        $blocks = get_posts(array(
            'post_type' => Brizy_Admin_Blocks_Main::CP_GLOBAL,
            'posts_per_page' => -1,
            'post_status' => 'publish',
            'orderby' => 'ID',
            'order' => 'ASC',
        ));
        foreach ($blocks as $block) {
            $brizy_editor_block = Brizy_Editor_Block::get($block);
            $uid = $brizy_editor_block->getUid();
            $block_data = $brizy_editor_block->convertToOptionValue();
            $globalData->globalBlocks[$uid] = array(
                'data' => $brizy_editor_block->get_editor_data(false),
                'position' => $block_data['position'],
                'rules' => $block_data['rules'],
            );
        }
        $blocks = get_posts(array(
            'post_type' => Brizy_Admin_Blocks_Main::CP_SAVED,
            'posts_per_page' => -1,
            'post_status' => 'publish',
            'orderby' => 'ID',
            'order' => 'ASC',
        ));
        foreach ($blocks as $block) {
            $brizy_editor_block = Brizy_Editor_Block::get($block);
            $block_data = $brizy_editor_block->convertToOptionValue();
            $globalData->savedBlocks[] = array(
                'data' => $brizy_editor_block->get_editor_data(false),
                'rules' => $block_data['rules'],
            );
        }

        return $globalData;
    }

    /**
     * Add global block in editor config
     *
     * @param $config
     * @param $context
     *
     * @return mixed
     * @throws Exception
     */
    public function addPageGlobalBlocks($config, $context)
    {

        $blockManager = new Brizy_Admin_Blocks_Manager(Brizy_Admin_Blocks_Main::CP_GLOBAL);
        $blocks = $blockManager->getEntities(['post_status' => 'any']);
        // include all blocks
        $resultBlocks = [];
        foreach ($blocks as $block) {
            $resultBlocks[] = Brizy_Editor_Block::get($block->getWpPostId());
        }
        $config['globalBlocks'] = $blockManager->createResponseForEntities($resultBlocks, [], $context);

        return $config;

    }

    /**
     * This will enqueue assets for blocks that matches the current page rule set.
     * This will not include the block that are include by uid with {{ brizy_dc_global_block }} placeholder
     * @return void
     */
    public function enqueueMatchedGlobalBlockAssets()
    {
        $post = get_post(Brizy_Editor::get()->currentPostId());
        $matching_brizy_blocks = $this->getMatchingBrizyBlocks($post);
        foreach ($matching_brizy_blocks as $block) {
            Brizy_Public_AssetEnqueueManager::_init()->enqueuePost($block);
        }
    }

    static public function registerCustomPosts()
    {

        $labels = array(
            'name' => _x('Global blocks', 'post type general name'),
        );
        register_post_type(self::CP_GLOBAL, array(
            'labels' => $labels,
            'public' => false,
            'has_archive' => false,
            'description' => __bt('brizy', 'Brizy').' '.__('global block.', 'brizy'),
            'publicly_queryable' => false,
            'show_ui' => false,
            'show_in_menu' => false,
            'query_var' => false,
            'capability_type' => 'page',
            'hierarchical' => false,
            'show_in_rest' => false,
            'exclude_from_search' => true,
            'supports' => array('title', 'revisions', 'page-attributes'),
        ));
        $labels = array(
            'name' => _x('Saved blocks', 'brizy'),
        );
        register_post_type(self::CP_SAVED, array(
            'labels' => $labels,
            'public' => false,
            'has_archive' => false,
            'description' => __bt('brizy', 'Brizy').' '.__('global block.'),
            'publicly_queryable' => false,
            'show_ui' => false,
            'show_in_menu' => false,
            'query_var' => false,
            'capability_type' => 'page',
            'hierarchical' => false,
            'show_in_rest' => false,
            'exclude_from_search' => true,
            'supports' => array('title', 'revisions', 'page-attributes'),
        ));
        add_filter('brizy_supported_post_types', function ($posts) {
            $posts[] = self::CP_SAVED;
            $posts[] = self::CP_GLOBAL;

            return $posts;
        });
    }

    public function getMatchingBrizyBlocks($wpPost = null)
    {
        static $globalBLocks = null;
        if ($globalBLocks) {
            //return $globalBLocks;
        }

        $ruleMatches = [];

        if (!$wpPost) {
            $ruleMatches = Brizy_Admin_Rules_Manager::getCurrentPageGroupAndType();
            $wpPost = get_post($ruleMatches[0]['entityValues'][0]);
        }

        if ($wpPost->post_type == 'editor-template') {
            $ruleMatches = $this->getTemplateRuleMatches($wpPost);
        } else {
            $template = Brizy_Admin_Templates::instance()->getTemplateForCurrentPage();

           if ($template) {
                $ruleMatches = $this->getTemplateRuleMatches($template->getWpPost());
            } else {
                $ruleMatches[] = [
                    'applyFor' => Brizy_Admin_Rule::POSTS,
                    'entityType' => $wpPost->post_type,
                    'entityValues' => [$wpPost->ID],
                ];
            }
        }
        $matching_blocks = $this->findMatchingBlocks($ruleMatches);

        $referenced = [];
        if ($wpPost) {
            try {
                $referenced = $this->findReferencedInPage(Brizy_Editor_Post::get($wpPost));
            } catch (\Exception $e) {

            }
        }

        return $globalBLocks = array_merge(
            $matching_blocks,
            $this->findReferencedInGlobalBlocks($matching_blocks),
            $referenced
        );
    }

    private function getTemplateRuleMatches(WP_Post $template)
    {
        $rule_manager = new Brizy_Admin_Rules_Manager();
        $template_rules = $rule_manager->getRules($template->ID);
//        $ruleMatches = array_map(function (Brizy_Admin_Rule $r) {
//            return [
//                //'type'         => $r->getType(),
//                'applyFor' => $r->getAppliedFor(),
//                'entityType' => $r->getEntityType(),
//                'entityValues' => $r->getEntityValues(),
//            ];
//        }, $template_rules);
        $ruleMatches[] = [
            'applyFor' => Brizy_Admin_Rule::BRIZY_TEMPLATE,
            'entityType' => $template->post_type,
            'entityValues' => [$template->ID],
        ];

        return $ruleMatches;
    }

    /**
     * @param $applyFor
     * @param $entityType
     * @param $entityValues
     *
     * @return array
     */
    private function findMatchingBlocks($ruleMatches)
    {

        $resultBlocks = array();
        $allBlocks = get_posts(array(
            'post_type' => [self::CP_GLOBAL, Brizy_Admin_Popups_Main::CP_POPUP],
            'numberposts' => -1,
            'post_status' => 'publish',
        ));
        $ruleManager = new Brizy_Admin_Rules_Manager();
        $ruleSets = [];
        foreach ($allBlocks as $aBlock) {
            $ruleSets[$aBlock->ID] = $ruleManager->getRuleSet($aBlock->ID);
        }

        $excludeIds = [];
        foreach ($ruleMatches as $ruleMatch) {
            $include = null;
            $applyFor = $ruleMatch['applyFor'];
            $entityType = $ruleMatch['entityType'];
            $entityValues = $ruleMatch['entityValues'];
            $allBlocks = Brizy_Admin_Rules_Manager::sortEntitiesByRuleWeight($allBlocks, [
                'type' => $applyFor,
                'entityType' => $entityType,
                'entityValues' => $entityValues,
            ]);
            foreach ($allBlocks as $aBlock) {
                try {
                    $var = $ruleSets[$aBlock->ID];
                    if ($var->isMatching($applyFor, $entityType, $entityValues)) {
                        $resultBlocks[$aBlock->ID] = Brizy_Editor_Block::get($aBlock);
                    } else {
                        $excludeIds[] = $aBlock->ID;
                    }
                } catch (\Exception $e) {
                    $excludeIds[] = $aBlock->ID;
                }
            }
        }

        foreach ($resultBlocks as $i => $resultBlock) {
            if (in_array($i, $excludeIds)) {
                unset($resultBlocks[$i]);
            }
        }

        return array_values($resultBlocks);
    }

    /**
     * @param array<Brizy_Editor_Block> $matching_blocks
     *
     * @return array
     * @throws Exception
     */
    private function findReferencedInGlobalBlocks($matching_blocks)
    {
        $context = Brizy_Content_ContextFactory::createContext(Brizy_Editor_Project::get(), null);
        $placeholderProvider = new Brizy_Content_Providers_GlobalBlockProvider($context);
        $extractor = new \BrizyPlaceholders\Extractor($placeholderProvider);
        $globalPopups = [];
        foreach ($matching_blocks as $block) {
            $content1 = $block->get_compiled_html();
            list($placeholders, $placeholderInstances, $content) = $extractor->extract($content1);
            foreach ($placeholders as $i => $placeholder) {
                $attrs = $placeholder->getAttributes();
                $blockManager = new Brizy_Admin_Blocks_Manager(Brizy_Admin_Blocks_Main::CP_GLOBAL);
                if (isset($attrs['uid'])) {
                    $block = $blockManager->getEntity($attrs['uid']);
                    // store global popups to be added in footer
                    if ($placeholderInstances[$i] instanceof Brizy_Content_Placeholders_GlobalBlock) {
                        $globalPopups[$attrs['uid']] = $block;
                    }
                }
            }
        }

        return $globalPopups;
    }

    private function findReferencedInPage($wpPost)
    {

        if (!$wpPost) {
            return [];
        }
        $context = Brizy_Content_ContextFactory::createContext(Brizy_Editor_Project::get(), $wpPost);
        $placeholderProvider = new Brizy_Content_Providers_GlobalBlockProvider($context);
        $extractor = new \BrizyPlaceholders\Extractor($placeholderProvider);
        $globalPopups = [];
        $content1 = $wpPost->get_compiled_html();
        list($placeholders, $placeholderInstances, $content) = $extractor->extract($content1);
        foreach ($placeholders as $i => $placeholder) {
            $attrs = $placeholder->getAttributes();
            $blockManager = new Brizy_Admin_Blocks_Manager(Brizy_Admin_Blocks_Main::CP_GLOBAL);
            if (isset($attrs['uid'])) {
                $block = $blockManager->getEntity($attrs['uid']);
                // store global popups to be added in footer
                if ($placeholderInstances[$i] instanceof Brizy_Content_Placeholders_GlobalBlock) {
                    $globalPopups[$attrs['uid']] = $block;
                }
            }
        }

        return $globalPopups;
    }
}