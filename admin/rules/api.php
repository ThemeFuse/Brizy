<?php


class Brizy_Admin_Rules_Api extends Brizy_Admin_AbstractApi
{

    const nonce = Brizy_Editor_API::nonce;
    const CREATE_RULES_ACTION = '_add_rules';
    const CREATE_RULE_ACTION = '_add_rule';
    const UPDATE_RULES_ACTION = '_update_rules';
    const DELETE_RULE_ACTION = '_delete_rule';
    const LIST_RULE_ACTION = '_list_rules';
    const VALIDATE_RULE = '_validate_rule';
    const RULE_GROUP_LIST = '_rule_group_list';
    const RULE_POSTS_GROUP_LIST = '_rule_posts_group_list';
    const RULE_ARCHIVE_GROUP_LIST = '_rule_archive_group_list';
    const RULE_TEMPLATE_GROUP_LIST = '_rule_template_group_list';


    /**
     * @var Brizy_Admin_Rules_Manager
     */
    private $manager;


    /**
     * Brizy_Admin_Rules_Api constructor.
     *
     * @param Brizy_Admin_Rules_Manager $manager
     */
    public function __construct($manager)
    {
        $this->manager = $manager;

        parent::__construct();
    }

    /**
     * @return Brizy_Admin_Rules_Api
     */
    public static function _init()
    {
        static $instance;

        if (!$instance) {
            $instance = new self(new Brizy_Admin_Rules_Manager());
        }

        return $instance;
    }

    protected function getRequestNonce()
    {
        return $this->param('hash');
    }

    protected function initializeApiActions()
    {
        $pref = 'wp_ajax_' . Brizy_Editor::prefix();

        add_action($pref . self::CREATE_RULE_ACTION, array($this, 'actionCreateRule'));
        add_action($pref . self::CREATE_RULES_ACTION, array($this, 'actionCreateRules'));
        add_action($pref . self::UPDATE_RULES_ACTION, array($this, 'actionUpdateRules'));
        add_action($pref . self::DELETE_RULE_ACTION, array($this, 'actionDeleteRule'));
        add_action($pref . self::LIST_RULE_ACTION, array($this, 'actionGetRuleList'));
        add_action($pref . self::VALIDATE_RULE, array($this, 'actionValidateRule'));
        add_action($pref . self::RULE_GROUP_LIST, array($this, 'getGroupList'));
        add_action($pref . self::RULE_POSTS_GROUP_LIST, array($this, 'getPostsGroupsList'));
        add_action($pref . self::RULE_ARCHIVE_GROUP_LIST, array($this, 'getArchiveGroupsList'));
        add_action($pref . self::RULE_TEMPLATE_GROUP_LIST, array($this, 'getTemplateGroupsList'));
    }

    /**
     * @return null|void
     */
    public function actionGetRuleList()
    {

        $this->verifyNonce(self::nonce);

        $postId = (int)$this->param('post');

        if (!$postId) {
            wp_send_json_error((object)array('message' => 'Invalid template'), 400);
        }

        try {
            $rules = $this->manager->getRules($postId);

            $this->success($rules);
        } catch (Exception $e) {
            Brizy_Logger::instance()->error($e->getMessage(), [$e]);
            $this->error(400, $e->getMessage());
        }

        return null;
    }

    public function actionValidateRule()
    {
        $this->verifyNonce(self::nonce);

        $postId = (int)$this->param('post');

        $postType = get_post_type($postId);

        if (!$postId) {
            $this->error(400, "Validation" . 'Invalid post');
        }

        $ruleData = file_get_contents("php://input");

        try {
            $rule = $this->manager->createRuleFromJson($ruleData, $postType);
            $ruleValidator = Brizy_Admin_Rules_ValidatorFactory::getValidator($postId);

            if (!$ruleValidator) {
                $this->error(400, 'Unable to get the rule validator for this post type');
            }

            $ruleValidator->validateRuleForPostId($rule, $postId);

            wp_send_json_success($rule, 200);
        } catch (Brizy_Admin_Rules_ValidationException $e) {
            wp_send_json_error(array('message' => $e->getMessage(), 'rule' => $e->getRuleId()), 400);
        } catch (Exception $e) {
            $this->error(400, "Validation" . $e->getMessage());
        }
    }

    public function actionCreateRule()
    {

        $this->verifyNonce(self::nonce);

        $postId = (int)$this->param('post');
        $ignoreDataVersion = (int)$this->param('ignoreDataVersion');
        $dataVersion = (int)$this->param('dataVersion');

        $postType = get_post_type($postId);

        if (!$postId) {
            $this->error(400, "Validation" . 'Invalid post');
        }

        if (!$dataVersion && $ignoreDataVersion === 0) {
            $this->error(400, "Validation" . 'Invalid data version');
        }

        $ruleData = file_get_contents("php://input");

        try {
            $rule = $this->manager->createRuleFromJson($ruleData, $postType);
        } catch (Exception $e) {
            $this->error(400, "Validation" . $e->getMessage());
        }

        try {
            // validate rule
            $ruleValidator = Brizy_Admin_Rules_ValidatorFactory::getValidator($postId);

            if (!$ruleValidator) {
                $this->error(400, 'Unable to get the rule validator for this post type');
            }

            $ruleValidator->validateRuleForPostId($rule, $postId);

            if (!$ignoreDataVersion) {
                $post = Brizy_Editor_Entity::get($postId);
                $post->setDataVersion($dataVersion);
                $post->save(0);
            }

            $this->manager->addRule($postId, $rule);

        } catch (Brizy_Editor_Exceptions_DataVersionMismatch $e) {
            $this->error(400, 'Invalid data version');
        } catch (Brizy_Admin_Rules_ValidationException $e) {
            wp_send_json_error(array('message' => $e->getMessage(), 'rule' => $e->getRuleId()), 400);
        } catch (Exception $e) {
            $this->error(400, $e->getMessage());
        }

        wp_send_json_success($rule, 200);
    }

    public function actionCreateRules()
    {
        $this->verifyNonce(self::nonce);

        $postId = (int)$this->param('post');
        $ignoreDataVersion = (int)$this->param('ignoreDataVersion');
        $dataVersion = (int)$this->param('dataVersion');
        $postType = get_post_type($postId);

        if (!$postId) {
            $this->error(400, 'Invalid post');
        }

        if (!$dataVersion && $ignoreDataVersion === 0) {
            $this->error(400, "Validation" . 'Invalid data version');
        }

        $rulesData = file_get_contents("php://input");

        try {
            $rules = $this->manager->createRulesFromJson($rulesData, $postType);

            if (count($rules) == 0) {
                $this->error(400, "No rules found.");
            }

        } catch (Exception $e) {
            $this->error(400, $e->getMessage());
        }

        // validate rule
        $validator = Brizy_Admin_Rules_ValidatorFactory::getValidator($postId);

        if (!$validator) {
            $this->error(400, 'Unable to get the rule validator for this post type');
        }

        try {
            $validator->validateRulesForPostId($rules, $postId);

            if (!$ignoreDataVersion) {
                $post = Brizy_Editor_Entity::get($postId);
                $post->setDataVersion($dataVersion);
                $post->save(0);
            }

            foreach ($rules as $newRule) {
                $this->manager->addRule($postId, $newRule);
            }

        } catch (Brizy_Editor_Exceptions_DataVersionMismatch $e) {
            $this->error(400, 'Invalid data version');
        } catch (Brizy_Admin_Rules_ValidationException $e) {
            wp_send_json_error(array(
                'rule' => $e->getRuleId(),
                'message' => $e->getMessage()
            ), 400);
        }

        $this->success($rules);

        return null;
    }


    public function actionUpdateRules()
    {
        $this->verifyNonce(self::nonce);

        $postId = (int)$this->param('post');
        $ignoreDataVersion = (int)$this->param('ignoreDataVersion');
        $dataVersion = (int)$this->param('dataVersion');
        $postType = get_post_type($postId);

        if (!$postId || !in_array($postType, [
                Brizy_Admin_Templates::CP_TEMPLATE,
                Brizy_Admin_Popups_Main::CP_POPUP
            ])) {
            wp_send_json_error((object)array('message' => 'Invalid template'), 400);
        }

        if (!$dataVersion && $ignoreDataVersion === 0) {
            $this->error(400, "Validation" . 'Invalid data version');
        }

        $rulesData = file_get_contents("php://input");

        try {
            $rules = $this->manager->createRulesFromJson($rulesData, $postType);
        } catch (Exception $e) {
            Brizy_Logger::instance()->error($e->getMessage(), [$e]);
            $this->error(400, $e->getMessage());
        }

//		$validator = Brizy_Admin_Rules_ValidatorFactory::getValidator( $postId );
//		if ( ! $validator ) {
//			$this->error( 400, 'Unable to get the rule validator for this post type' );
//		}

        try {
            if (!$ignoreDataVersion) {
                $post = Brizy_Editor_Entity::get($postId);
                $post->setDataVersion($dataVersion);
                $post->save(0);
            }

            $this->manager->saveRules($postId, $rules);
        } catch (Brizy_Editor_Exceptions_DataVersionMismatch $e) {
            $this->error(400, 'Invalid data version');
        } catch (Exception $e) {
            $this->error(400, 'Unable to save rules');
        }

        wp_send_json_success($rules, 200);

        return null;
    }

    public function actionDeleteRule()
    {

        $this->verifyNonce(self::nonce);

        $postId = (int)$this->param('post');
        $ignoreDataVersion = (int)$this->param('ignoreDataVersion');
        $dataVersion = (int)$this->param('dataVersion');
        $ruleId = $this->param('rule');

        if (!$postId || !$ruleId) {
            $this->error(400, 'Invalid request');
        }

        if (!$dataVersion && $ignoreDataVersion === 0) {
            $this->error(400, "Validation" . 'Invalid data version');
        }

        try {

            if (!$ignoreDataVersion) {
                $post = Brizy_Editor_Entity::get($postId);
                $post->setDataVersion($dataVersion);
                $post->save(0);
            }

            $this->manager->deleteRule($postId, $ruleId);
        } catch (Brizy_Editor_Exceptions_DataVersionMismatch $e) {
            $this->error(400, 'Invalid data version');
        } catch (Exception $e) {
            $this->error(400, 'Unable to delete rules');
        }

        $this->success(null);
    }

    public function getGroupList()
    {

        $context = $this->param('context');
        $templateType = $this->param('templateType');

        $closure = function ($v) {
            return array(
                'title' => $v->label,
                'value' => $v->name,
                'groupValue' => $v->groupValue
            );
        };

        $groups = [];

        if ($templateType == 'single' || $templateType == 'single_product' || $context == 'popup-rules') {
            $groups[] = array(
                'title' => 'Pages',
                'value' => Brizy_Admin_Rule::POSTS,
                'items' => array_map($closure, $this->getCustomPostsList(Brizy_Admin_Rule::POSTS, $templateType, $context))
            );
        }

        if ($templateType == 'product_archive') {
            $wooPageItems = $this->getWooPageList(Brizy_Admin_Rule::ARCHIVE, $templateType);
            $groups[] =
                $templateType == 'product_archive' && count($wooPageItems) && Brizy_Editor_Editor_Editor::get_woocomerce_plugin_info() ? array(
                    'title' => 'Pages',
                    'value' => Brizy_Admin_Rule::WOO_SHOP_PAGE,
                    'items' => $wooPageItems
                ) : null;
        }

        if ($templateType == 'archive' || $templateType == 'product_archive' || $context == 'popup-rules') {

            $archiveItems = array_map($closure, $this->getArchivesList(Brizy_Admin_Rule::ARCHIVE, $templateType));
            $taxonomyItems = array_map($closure, $this->getTaxonomyList(Brizy_Admin_Rule::TAXONOMY, $templateType));

            if ($templateType === 'product_archive') {
                $archiveItems[] = array(
                    'title' => 'Search page',
                    'value' => 'search',
                    'groupValue' => Brizy_Admin_Rule::TEMPLATE
                );
            }


            $groups[] =
                count($taxonomyItems) ? array(
                    'title' => 'Categories',
                    'value' => Brizy_Admin_Rule::TAXONOMY,
                    'items' => $taxonomyItems
                ) : null;
            $groups[] =
                count($archiveItems) ? array(
                    'title' => 'Archives',
                    'value' => Brizy_Admin_Rule::ARCHIVE,
                    'items' => $archiveItems
                ) : null;
        }

        if ($items = $this->geTemplateList($context, $templateType)) {
            $groups[] = array(
                'title' => 'Others',
                'value' => Brizy_Admin_Rule::TEMPLATE,
                'items' => $items
            );
        }

        $groups = array_values(array_filter($groups, function ($o) {
            return !is_null($o);
        }));
        wp_send_json_success($groups, 200);
    }

    public function getPostsGroupsList()
    {

        global $wp_post_types;

        if (!($post_type = $this->param('postType'))) {
            wp_send_json_error('Invalid post type', 400);
        }

        if (!isset($wp_post_types[$post_type])) {
            wp_send_json_error('Post type not found', 400);
        }

        $postTypeName = $wp_post_types[$post_type]->labels->name;
        $taxonomies = get_object_taxonomies($post_type, 'objects');

        if (isset($taxonomies['product_visibility'])) {
            unset($taxonomies['product_visibility']);
        }

        $groups = array();

        $closureFromTerm = function ($v) {
            return array(
                'title' => $v->name,
                'value' => "in|" . $v->taxonomy . "|" . $v->term_id,
                'groupValue' => $v->taxonomy
            );
        };
        $closureChildTerm = function ($v) {
            return array(
                'title' => $v->name,
                'value' => "child|" . $v->taxonomy . "|" . $v->term_id,
                'groupValue' => $v->taxonomy
            );
        };

        $closureAuthor = function ($v) use ($postTypeName) {
            return array(
                'title' => ucfirst($v->data->user_nicename),
                'value' => 'author|' . $v->ID,
                'groupValue' => 'author'
            );
        };

        $closurePost = function ($v) {
            return array(
                'title' => $v->post_title,
                'value' => $v->ID,
                'groupValue' => $v->post_type
            );
        };


        // exclude woocomerce hidden tags
        $exclude = ['simple', 'variable', 'grouped', 'external'];

        foreach ($taxonomies as $tax) {
            $groups[] = array(
                'title' => __("From", 'brizy') . " " . $tax->labels->singular_name,
                'value' => Brizy_Admin_Rule::POSTS,
                'items' => array_map($closureFromTerm, array_filter(get_terms([
                    'taxonomy' => $tax->name,
                    'hide_empty' => false,
                ]), function ($term) use ($exclude) {
                    return in_array($term->slug, $exclude) ? false : true;
                }))
            );

            if ($tax->hierarchical) {
                $groups[] = array(
                    'title' => __("From any child of", 'brizy') . " " . $tax->labels->singular_name,
                    'value' => Brizy_Admin_Rule::POSTS,
                    'items' => array_map($closureChildTerm, get_terms([
                        'taxonomy' => $tax->name,
                        'hide_empty' => false
                    ]))
                );
            }
        }

        unset($taxonomies);

        $groups[] = array(
            'title' => 'Specific ' . $postTypeName,
            'value' => Brizy_Admin_Rule::POSTS,
            'items' => array_map($closurePost, Brizy_Editor_Post::get_post_list(null, $post_type, null, 0, 10000))
        );

        $groups[] = array(
            'title' => 'Specific Author',
            'value' => Brizy_Admin_Rule::POSTS,
            'items' => array_map($closureAuthor, get_users())
        );

        $groups = array_values(array_filter($groups, function ($o) {
            return !is_null($o);
        }));

        wp_send_json_success($groups, 200);
    }

    public function getArchiveGroupsList()
    {

        if (!($taxonomy = $this->param('taxonomy'))) {
            wp_send_json_error('Invalid taxonomy', 400);
        }

        $groups = [];

        $taxonomies = get_taxonomies(array('public' => true, 'show_ui' => true, 'name' => $taxonomy), 'objects');

        $closureSingleTerm = function ($v) {
            return array(
                'title' => $v->name,
                'value' => $v->term_id,
                'groupValue' => $v->taxonomy
            );
        };

        $closureTerm = function ($v) {
            return array(
                'title' => $v->name,
                'value' => "child|" . $v->taxonomy . "|" . $v->term_id,
                'groupValue' => $v->taxonomy
            );
        };

        foreach ($taxonomies as $tax) {
            $groups[] = array(
                'title' => __("Specific", 'brizy') . " " . $tax->labels->singular_name,
                'value' => Brizy_Admin_Rule::TAXONOMY,
                'items' => array_map($closureSingleTerm, get_terms([
                    'taxonomy' => $tax->name,
                    'hide_empty' => false
                ]))
            );

            if ($tax->hierarchical) {
                $groups[] = array(
                    'title' => __("Any child of", 'brizy') . " " . $tax->labels->singular_name,
                    'value' => Brizy_Admin_Rule::TAXONOMY,
                    'items' => array_map($closureTerm, get_terms([
                        'taxonomy' => $tax->name,
                        'hide_empty' => false
                    ]))
                );
            }
        }

        $groups = array_values(array_filter($groups, function ($o) {
            return !is_null($o);
        }));
        wp_send_json_success($groups, 200);

    }

    public function getTemplateGroupsList()
    {
        $context = $this->param('context');
        $templateType = $this->param('templateType');

        $groups = [];

        $closureAuthor = function ($v) {
            return array(
                'title' => $v->user_nicename,
                'value' => $v->ID,
                'groupValue' => 'author'
            );
        };

        $groups[] = array(
            'title' => 'Specific Author',
            'value' => Brizy_Admin_Rule::TEMPLATE,
            'items' => array_map($closureAuthor, get_users(['fields' => ['ID', 'user_nicename']]))
        );

        $groups = array_values(array_filter($groups, function ($o) {
            return !is_null($o);
        }));
        wp_send_json_success($groups, 200);
    }

    private function getCustomPostsList($groupValue, $templateType, $context)
    {
	    $postTypes = get_post_types( [ 'public' => true,'show_ui'=>true ], 'objects' );
	    $postTypes = array_diff_key( $postTypes, array_flip( [
		    'attachment',
		    'elementor_library',
		    Brizy_Admin_Stories_Main::CP_STORY
	    ] ) );

	    $postTypes = array_filter( $postTypes, function ( $type ) use ( $groupValue, $templateType, $context ) {

	    	if($context=='template-rules')
		    {
			    if ( $type->name == 'product' ) {
				    return $templateType == 'single_product';
			    } else {
				    return $templateType == 'single';
			    }
		    }

		    return $type->public && $type->show_ui;
	    } );

        return array_map(function ($t) use ($groupValue) {
            $t->groupValue = $groupValue;
            return $t;
        }, array_values($postTypes) );
	}

    private function getWooPageList($groupValue, $templateType)
    {
        return [
            [
                'title' => 'Shop Page',
                'value' => 'shop_page',
                'groupValue' => Brizy_Admin_Rule::WOO_SHOP_PAGE
            ]
        ];
    }

    private function getArchivesList($groupValue, $templateType)
    {
        global $wp_post_types;

        return array_values(array_filter($wp_post_types, function ($type) use ($groupValue, $templateType) {
            $type->groupValue = $groupValue;
            $is_product = $type->name == 'product';

            if ($templateType == 'product_archive') {
                return $is_product && $type->public && $type->show_ui && $type->has_archive;
            } else {
                return !$is_product && $type->public && $type->show_ui && $type->has_archive;
            }
        }));
    }

    private function getTaxonomyList($groupValue, $templateType)
    {
        $terms = get_taxonomies(array('public' => true, 'show_ui' => true), 'objects');

        return array_values(array_filter($terms, function ($term) use ($groupValue, $templateType) {
            $term->groupValue = $groupValue;
            $is_product_term = $term->name == 'product_cat' || $term->name == 'product_tag';

            if ($templateType == 'product_archive') {
                return $is_product_term;
            } else {
                return !$is_product_term;
            }
        }));
    }

    public function geTemplateList($context, $templateType)
    {

        $list = array(
            $templateType === 'archive' || $context == 'popup-rules' ? array(
                'title' => 'Author page',
                'value' => 'author',
                'groupValue' => Brizy_Admin_Rule::TEMPLATE
            ) : null,
            $templateType === 'archive' || $context == 'popup-rules' ? array(
                'title' => 'Search page',
                'value' => 'search',
                'groupValue' => Brizy_Admin_Rule::TEMPLATE
            ) : null,
            $templateType === 'single' || $context == 'popup-rules' ? array(
                'title' => 'Front page',
                'value' => 'front_page',
                'groupValue' => Brizy_Admin_Rule::TEMPLATE
            ) : null,
            $templateType === 'archive' || $context == 'popup-rules' ? array(
                'title' => 'Blog / Posts page',
                'value' => 'home_page',
                'groupValue' => Brizy_Admin_Rule::TEMPLATE
            ) : null,
            $templateType === 'single' || $context == 'popup-rules' ? array(
                'title' => '404 page',
                'value' => '404',
                'groupValue' => Brizy_Admin_Rule::TEMPLATE
            ) : null,

            $templateType === 'archive' || $context == 'popup-rules' ? array(
                'title' => 'Day Archive page',
                'value' => '',
                'groupValue' => Brizy_Admin_Rule::DAY_ARCHIVE
            ) : null,
            $templateType === 'archive' || $context == 'popup-rules' ? array(
                'title' => 'Month Archive page',
                'value' => '',
                'groupValue' => Brizy_Admin_Rule::MONTH_ARCHIVE
            ) : null,
            $templateType === 'archive' || $context == 'popup-rules' ? array(
                'title' => 'Year Archive page',
                'value' => '',
                'groupValue' => Brizy_Admin_Rule::YEAR_ARCHIVE
            ) : null,
            $templateType === 'archive' || $context == 'popup-rules' ? array(
                'title' => 'Date Archive page',
                'value' => '',
                'groupValue' => Brizy_Admin_Rule::DATE_ARCHIVE
            ) : null,
            $templateType === 'archive' || $context == 'popup-rules' ? array(
                'title' => 'Archive page',
                'value' => '',
                'groupValue' => Brizy_Admin_Rule::ARCHIVE
            ) : null,
        );

        if (($context !== 'template-rules' && $templateType === 'single') || $context == 'popup-rules') {

            $list[] = array(
                'title' => 'Brizy Templates',
                'value' => 'brizy_template',
                'groupValue' => Brizy_Admin_Rule::BRIZY_TEMPLATE
            );
        }

        return array_values(array_filter($list, function ($o) {
            return !is_null($o);
        }));
    }

    private function get_post_list($searchTerm, $postType, $excludePostType = array())
    {

        global $wp_post_types;

        add_filter('posts_where', array($this, 'brizy_post_title_filter'), 10, 2);

        $post_query = array(
            'post_type' => $postType,
            'posts_per_page' => -1,
            'post_status' => $postType == 'attachment' ? 'inherit' : array(
                'publish',
                'pending',
                'draft',
                'future',
                'private'
            ),
            'orderby' => 'post_title',
            'order' => 'ASC'
        );

        if ($searchTerm) {
            $post_query['post_title_term'] = $searchTerm;
        }

        $posts = new WP_Query($post_query);

        $result = array();

        foreach ($posts->posts as $post) {

            if (in_array($post->post_type, $excludePostType)) {
                continue;
            }

            $result[] = (object)array(
                'ID' => $post->ID,
                'uid' => $this->create_uid($post->ID),
                'post_type' => $post->post_type,
                'post_type_label' => $wp_post_types[$post->post_type]->label,
                'title' => apply_filters('the_title', $post->post_title),
                'post_title' => apply_filters('the_title', $post->post_title)
            );
        }

        remove_filter('posts_where', 'brizy_post_title_filter', 10);

        return $result;
    }
}
