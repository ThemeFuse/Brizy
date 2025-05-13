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
        if ($is_view_page) {
            $this->enqueueMatchedGlobalBlockAssets($post);
            $this->enqueueMatchedGlobalBlockAssets();
        }
    }

    public function initializeActions()
    {

        add_filter('brizy_editor_config', [$this, 'addPageGlobalBlocks'], 10, 2);
        add_filter('brizy_editor_config', [$this, 'compilePageGlobalBlocks'], 10, 2);
        Brizy_Admin_Blocks_Api::_init();
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
        if (Brizy_Editor_Editor_Editor::EDITOR_CONTEXT !== $context) {
            return $config;
        }
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

    public function compilePageGlobalBlocks($config, $context)
    {
        if (Brizy_Editor_Editor_Editor::COMPILE_CONTEXT !== $context) {
            return $config;
        }
        // get page
        $post = get_post($config['wp']['page']);
        $blockManager = new Brizy_Admin_Blocks_Manager(Brizy_Admin_Blocks_Main::CP_GLOBAL);
        // get all blocks matching  by rules
        $blocks = $this->getMatchingBrizyBlocks($post);
        // get all global block from dependencies
        if (!isset($config['globalBlocks'])) {
            $config['globalBlocks'] = [];
        }
        $tmp = array_merge($config['globalBlocks'], $blockManager->createResponseForEntities($blocks, [], $context));
        $config['globalBlocks'] = array_values(array_reduce($tmp, function ($result, $object) {
            $result[$object['uid']] = $object;

            return $result;
        }, []));

        return $config;
    }

    /**
     * This will enqueue assets for blocks that matches the current page rule set.
     * This will not include the block that are include by uid with {{ brizy_dc_global_block }} placeholder
     * @return void
     */
    public function enqueueMatchedGlobalBlockAssets(Brizy_Editor_Post $post = null)
    {
//		if ( ! in_array( get_post_type( $id ), [ self::CP_GLOBAL, Brizy_Admin_Popups_Main::CP_POPUP ] ) ) {
//			$matching_brizy_blocks = $this->getMatchingBrizyBlocks( get_post( $id ) );
//			foreach ( $matching_brizy_blocks as $block ) {
//				if ( ! $manager->isPostEnqueued( $block->getWpPostId() ) ) {
//					$manager->enqueuePost( $block );
//				}
//			}
//		}
        $wpPost = null;
        if ($post instanceof Brizy_Editor_Post) {
            $wpPost = $post->getWpPost();
        }
        $matching_brizy_blocks = $this->getMatchingBrizyBlocks($wpPost);
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
            'description' => __bt('brizy', 'Brizy') . ' ' . __('global block.', 'brizy'),
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
            'description' => __bt('brizy', 'Brizy') . ' ' . __('global block.'),
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

        $ruleMatches = [];
        if ($wpPost instanceof WP_Post) {
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
        } else {
            $ruleMatches = Brizy_Admin_Rules_Manager::getCurrentPageGroupAndType();
            if (isset($ruleMatches[0]['entityValues'][0])) {
                $wpPost = get_post($ruleMatches[0]['entityValues'][0]);
            }
        }
        $matching_blocks = [];
        if (count($ruleMatches)) {
            $matching_blocks = $this->findMatchingBlocks($ruleMatches);
        }
        $referenced = [];
        if ($wpPost) {
            try {
                $referenced = $this->findReferencedInPage(Brizy_Editor_Post::get($wpPost));
            } catch (\Exception $e) {

            }
        }

        return array_merge($matching_blocks, $this->findReferencedInGlobalBlocks($matching_blocks), $referenced);
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

        return array_reduce($resultBlocks, function ($result, $object) {
            $result[$object->getUid()] = $object;

            return $result;
        }, []);

        //return array_values( $resultBlocks );
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
            if (!$content1) continue;
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

    private function findReferencedInPage(Brizy_Editor_Post $wpPost)
    {

        /**
         * @todo: Rewrite this to use dependencies.
         */
        if (!$wpPost) {
            return [];
        }
        if (is_null($wpPost->getDependencies())) {
            $blockManager = new Brizy_Admin_Blocks_Manager(Brizy_Admin_Blocks_Main::CP_GLOBAL);
            function getDependencies($allDeps, Brizy_Editor_Post $wpPost, Brizy_Admin_Blocks_Manager $blockManager)
            {
                if (!is_array($wpPost->getDependencies()) || count($wpPost->getDependencies()) == 0) {
                    return $allDeps;
                }
                $allDeps = array_merge($allDeps, $wpPost->getDependencies());
                foreach ($wpPost->getDependencies() as $dep) {
                    $block = $blockManager->getEntity($dep);
                    if ($block) {
                        $allDeps = getDependencies($allDeps, $block, $blockManager);
                    }
                }

                return $allDeps;
            }

            $deps = getDependencies([], $wpPost, $blockManager);
            $resultBlocks = array_map(function ($uid) use ($blockManager) {
                return $blockManager->getEntity($uid);
            }, $deps);
            $blocks = array_reduce($resultBlocks, function ($result, $object) {
                $result[$object->getUid()] = $object;

                return $result;
            }, []);

            return $blocks;
        }
        if (!empty($wpPost->get_compiled_html())) {
            $context = Brizy_Content_ContextFactory::createContext(Brizy_Editor_Project::get(), $wpPost);
            $placeholderProvider = new Brizy_Content_Providers_GlobalBlockProvider($context);
            $extractor = new \BrizyPlaceholders\Extractor($placeholderProvider);
            $blocks = [];
            list($placeholders, $placeholderInstances, $content) = $extractor->extract($wpPost->get_compiled_html());
            foreach ($placeholders as $i => $placeholder) {
                $attrs = $placeholder->getAttributes();
                $blockManager = new Brizy_Admin_Blocks_Manager(Brizy_Admin_Blocks_Main::CP_GLOBAL);
                if (isset($attrs['uid'])) {
                    $block = $blockManager->getEntity($attrs['uid']);
                    // store global popups to be added in footer
                    if ($placeholderInstances[$i] instanceof Brizy_Content_Placeholders_GlobalBlock) {
                        $blocks[$attrs['uid']] = $block;
                    }
                }
            }

            return $blocks;
        }
        // return all blocks
        $blockManager = new Brizy_Admin_Blocks_Manager(Brizy_Admin_Blocks_Main::CP_GLOBAL);
        $blocks = $blockManager->getEntities(['post_status' => 'any']);
        // include all blocks
        $resultBlocks = [];
        foreach ($blocks as $block) {
            $resultBlocks[] = Brizy_Editor_Block::get($block->getWpPostId());
        }

        return $resultBlocks;
    }
}