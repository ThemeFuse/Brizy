<?php

class Brizy_Admin_Templates
{

    const CP_TEMPLATE = 'brizy_template';
    const TEMPLATE_TYPE_KEY = 'brizy_template_type';
    const CP_TEMPLATES = 'brizy_templates';
    const RULE_LIST_VEIW = 'brizy_rule_list_view';
    const RULE_TAXONOMY_LIST = 'brizy_taxonomy_list';
    const RULE_CREATE = 'brizy_create';

    const TYPE_SINGLE = 'single';
    const TYPE_ARCHIVE = 'archive';
    const TYPE_SINGLE_PRODUCT = 'single_product';
    const TYPE_PRODUCT_ARCHIVE = 'product_archive';

    /**
     * @var Brizy_Editor_Post
     */
    private static $template;

    /**
     * Brizy_Admin_Templates constructor.
     */
    protected function __construct()
    {
        add_action('wp_loaded', array($this, 'initializeActions'));
    }

    /**
     * @return Brizy_Editor_Post
     */
    public static function getTemplate()
    {
        return self::$template;
    }

    public function initializeActions()
    {
        // do other stuff here
        if (is_admin()) {
            add_filter('post_updated_messages', array($this, 'filterTemplateMessages'));
            add_action('add_meta_boxes', array($this, 'registerTemplateMetaBox'), 9);
            add_action('transition_post_status', array($this, 'actionTransitionPostStatus'), 10, 3);
            add_action('wp_ajax_' . self::RULE_LIST_VEIW, array($this, 'getTemplateRuleBox'));
            add_filter('post_row_actions', array($this, 'removeRowActions'), 10, 1);
            add_action('admin_init', array($this, 'addTemplateRoleCaps'), 10000);
            add_action('admin_enqueue_scripts', array($this, 'action_register_static'));
            add_filter('save_post', array($this, 'saveTemplateRules'), 10, 2);
            add_filter('pre_post_update', array($this, 'validate_template_rules'), 10, 2);
            add_action('admin_notices', array($this, 'saveTemplateRulesNotices'));
        } elseif (!defined('DOING_AJAX') &&
            !is_admin() &&
            !isset($_REQUEST[Brizy_Editor::prefix('_media')]) &&
            !isset($_REQUEST[Brizy_Editor::prefix('-edit-iframe')]) &&
            !isset($_REQUEST[Brizy_Editor::prefix('_file')]) &&
            !isset($_REQUEST[Brizy_Editor::prefix('_attachment')]) &&
            !isset($_REQUEST[Brizy_Editor::prefix('_block_screenshot')]) &&
            !isset($_REQUEST[Brizy_Editor::prefix('')])) {
            add_action('wp', array($this, 'templateFrontEnd'));
        }
    }

    /**
     * @return Brizy_Admin_Templates
     * @deprecated
     */
    public static function _init()
    {
        return self::instance();
    }

    public static function instance()
    {
        static $instance;

        if (!$instance) {
            $instance = new self();
        }

        return $instance;
    }

    function action_register_static()
    {

        if (is_customize_preview() || get_post_type() !== Brizy_Admin_Templates::CP_TEMPLATE) {
            return;
        }

        $urlBuilder = new Brizy_Editor_UrlBuilder();

        //  hyperapp.js is also used in PRO
        wp_enqueue_script(
            Brizy_Editor::get_slug() . '-hyperapp-js',
            $urlBuilder->plugin_url('admin/static/js/hyperapp.js'),
            array('jquery', 'underscore'),
            BRIZY_VERSION,
            true
        );

        wp_enqueue_style(
            Brizy_Editor::get_slug() . '-select2',
            $urlBuilder->plugin_url('vendor/select2/select2/dist/css/select2.min.css'),
            array(),
            true
        );

        wp_enqueue_script(
            Brizy_Editor::get_slug() . '-select2',
            $urlBuilder->plugin_url('vendor/select2/select2/dist/js/select2.full.min.js'),
            array('jquery')
        );

        wp_enqueue_script(
            Brizy_Editor::get_slug() . '-rules',
            $urlBuilder->plugin_url('admin/static/js/rules.js'),
            array(Brizy_Editor::get_slug() . '-hyperapp-js'),
            BRIZY_VERSION,
            true
        );

        $templateGroups = [
            'single' => __('Single', 'brizy'),
            'archive' => __('Archive', 'brizy'),

        ];

        if (class_exists('WooCommerce')) {
            $templateGroups['single_product'] = __('Product', 'brizy');
            $templateGroups['product_archive'] = __('Product Archive', 'brizy');
        }
        $ruleManager = new Brizy_Admin_Rules_Manager();
        wp_localize_script(
            Brizy_Editor::get_slug() . '-rules',
            'Brizy_Admin_Rules',
            array(
                'url' => set_url_scheme(admin_url('admin-ajax.php')),
                'rules' => $ruleManager->getRules(get_the_ID()),
                'hash' => wp_create_nonce(Brizy_Admin_Rules_Api::nonce),
                'id' => get_the_ID(),
                'templateType' => Brizy_Admin_Templates::getTemplateType(get_the_ID()),
                'labels' => $templateGroups,
                'prefix' => Brizy_Editor::prefix(),
            )
        );
    }

    /**
     * @param $messages
     *
     * @return mixed
     */
    function filterTemplateMessages($messages)
    {
        $post = get_post();
        $post_type = get_post_type($post);
        $post_type_object = get_post_type_object($post_type);

        $messages[self::CP_TEMPLATE] = array(
            0 => '', // Unused. Messages start at index 1.
            1 => __('Template updated.'),
            2 => __('Custom field updated.'),
            3 => __('Custom field deleted.'),
            4 => __('Template updated.'),
            /* translators: %s: date and time of the revision */
            5 => isset($_GET['revision']) ? sprintf(
                __('Template restored to revision from %s'),
                wp_post_revision_title((int)$_GET['revision'], false)
            ) : false,
            6 => __('Template published.'),
            7 => __('Template saved.'),
            8 => __('Template submitted.'),
            9 => sprintf(
                __('Template scheduled for: <strong>%1$s</strong>.'),
                // translators: Publish box date format, see http://php.net/date
                date_i18n(__('M j, Y @ G:i'), strtotime($post->post_date))
            ),
            10 => __('Template draft updated.'),
        );

        if ($post_type_object->publicly_queryable && 'Template' === $post_type) {
            $permalink = get_permalink($post->ID);

            $view_link = sprintf(' <a href="%s">%s</a>', esc_url($permalink), __('View Template'));
            $messages[$post_type][1] .= $view_link;
            $messages[$post_type][6] .= $view_link;
            $messages[$post_type][9] .= $view_link;

            $preview_permalink = add_query_arg('preview', 'true', $permalink);
            $preview_link = sprintf(
                ' <a target="_blank" href="%s">%s</a>',
                esc_url($preview_permalink),
                __('Preview Template')
            );
            $messages[$post_type][8] .= $preview_link;
            $messages[$post_type][10] .= $preview_link;
        }

        return $messages;
    }

    public function addTemplateRoleCaps()
    {
        $roles = wp_roles()->roles;
        foreach ($roles as $name => $role) {
            $roleObject = get_role($name);

            /*if ( $roleObject->has_cap( 'brizy_edit_whole_page' ) || $roleObject->has_cap( 'brizy_edit_content_only' ) ) {
                $roleObject->add_cap( 'read_' . self::CP_TEMPLATE );
                $roleObject->add_cap( 'read_private_' . self::CP_TEMPLATES );
                $roleObject->add_cap( 'edit_' . self::CP_TEMPLATE );
                $roleObject->add_cap( 'edit_' . self::CP_TEMPLATES );
                $roleObject->add_cap( 'edit_others_' . self::CP_TEMPLATES );
                $roleObject->add_cap( 'edit_published_' . self::CP_TEMPLATES );
                $roleObject->add_cap( 'publish_' . self::CP_TEMPLATES );
                $roleObject->add_cap( 'delete_others_' . self::CP_TEMPLATES );
                $roleObject->add_cap( 'delete_private_' . self::CP_TEMPLATES );
                $roleObject->add_cap( 'delete_published_' . self::CP_TEMPLATES );
            } else */
            {
                $roleObject->remove_cap('read_' . self::CP_TEMPLATE);
                $roleObject->remove_cap('read_private_' . self::CP_TEMPLATES);
                $roleObject->remove_cap('edit_' . self::CP_TEMPLATE);
                $roleObject->remove_cap('edit_' . self::CP_TEMPLATES);
                $roleObject->remove_cap('edit_others_' . self::CP_TEMPLATES);
                $roleObject->remove_cap('edit_published_' . self::CP_TEMPLATES);
                $roleObject->remove_cap('publish_' . self::CP_TEMPLATES);
                $roleObject->remove_cap('delete_others_' . self::CP_TEMPLATES);
                $roleObject->remove_cap('delete_private_' . self::CP_TEMPLATES);
                $roleObject->remove_cap('delete_published_' . self::CP_TEMPLATES);
            }
        }
    }

    static public function registerCustomPostTemplate()
    {

        $labels = array(
            'name' => _x('Templates', 'post type general name', 'brizy'),
            'singular_name' => _x('Template', 'post type singular name', 'brizy'),
            'menu_name' => _x('Templates', 'admin menu', 'brizy'),
            'name_admin_bar' => _x('Template', 'add new on admin bar', 'brizy'),
            'add_new' => _x('Add New', self::CP_TEMPLATE, 'brizy'),
            'add_new_item' => __('Add New Template', 'brizy'),
            'new_item' => __('New Template', 'brizy'),
            'edit_item' => __('Edit Template', 'brizy'),
            'view_item' => __('View Template', 'brizy'),
            'all_items' => __('Templates', 'brizy'),
            'search_items' => __('Search Templates', 'brizy'),
            'parent_item_colon' => __('Parent Templates:', 'brizy'),
            'not_found' => __('No Templates found.', 'brizy'),
            'not_found_in_trash' => __('No Templates found in Trash.', 'brizy'),
        );

        register_post_type(
            self::CP_TEMPLATE,
            array(
                'labels' => $labels,
                'public' => false,
                'has_archive' => false,
                'description' => __bt('brizy', 'Brizy') . ' ' . __('templates', 'brizy') . '.',
                'publicly_queryable' => Brizy_Editor_User::is_user_allowed(),
                'show_ui' => true,
                'show_in_menu' => Brizy_Admin_Settings::menu_slug(),
                'query_var' => false,
                'rewrite' => array('slug' => 'brizy-template'),
                'capability_type' => 'page',
                'hierarchical' => false,
                'show_in_rest' => false,
                'can_export' => true,
                'exclude_from_search' => true,
                'supports' => array('title', 'revisions', 'page-attributes'),
            )
        );

        add_filter(
            'brizy_supported_post_types',
            function ($posts) {
                $posts[] = self::CP_TEMPLATE;

                return $posts;
            }
        );
    }

    public function registerTemplateMetaBox()
    {
        add_meta_box(
            'template-rules',
            __('Display Conditions', 'brizy'),
            array(
                $this,
                'templateRulesBox',
            ),
            self::CP_TEMPLATE,
            'normal',
            'high'
        );
    }

    public function removeRowActions($actions)
    {
        if (get_post_type() === self::CP_TEMPLATE) {
            unset($actions['view']);
        }

        return $actions;
    }

    public function templateRulesBox()
    {
        try {

            $templateId = isset($_REQUEST['post']) ? (int)$_REQUEST['post'] : get_the_ID();

            if (!$templateId) {
                throw new Exception();
            }
            $ruleManager = new Brizy_Admin_Rules_Manager();
            $rules = $ruleManager->getRules($templateId);

            $nonce = wp_create_nonce(Brizy_Editor_API::nonce);
            $context = array(
                'rules' => $rules,
                'types' => array(),
                'apply_for' => array(),
                'templateId' => $templateId,
                'reload_action' => admin_url(
                    'admin-ajax.php?action=' . self::RULE_LIST_VEIW . '&post=' . $templateId . '&hash=' . $nonce
                ),
                'submit_action' => admin_url('admin-ajax.php?action=' . Brizy_Admin_Rules_Api::CREATE_RULE_ACTION),
                'delete_action' => admin_url(
                    'admin-ajax.php?action=' . Brizy_Admin_Rules_Api::DELETE_RULE_ACTION . '&postId=' . $templateId . '&hash=' . $nonce
                ),
                'nonce' => $nonce,
            );

            echo Brizy_TwigEngine::instance(path_join(BRIZY_PLUGIN_PATH, "admin/views"))
                ->render('rules-box.html.twig', $context);
        } catch (Exception $e) {
            Brizy_Logger::instance()->error($e->getMessage(), array('exception' => $e));
            esc_html_e('Unable to show the rule box.', 'brizy');
        }
    }

    public function getTemplateRuleBox()
    {
        $this->templateRulesBox();
        exit;
    }


    /**
     * @return Brizy_Editor_Post|mixed|null
     * @throws Exception
     */
    public function getTemplateForCurrentPage()
    {
        list($applyFor, $entityType, $entityValues) = Brizy_Admin_Rules_Manager::getCurrentPageGroupAndType();

        $is_preview = is_preview();

        $templates = get_posts(
            array(
                'post_type' => self::CP_TEMPLATE,
                'numberposts' => -1,
                'post_status' => $is_preview ? 'any' : 'publish',
            )
        );

        $templates = Brizy_Admin_Rules_Manager::sortEntitiesByRuleWeight(
            $templates,
            [
                'type' => $applyFor,
                'entityType' => $entityType,
                'entityValues' => $entityValues,
            ]
        );

        $ruleManager = new Brizy_Admin_Rules_Manager();
        foreach ($templates as $atemplate) {
            $ruleSet = $ruleManager->getRuleSet($atemplate->ID);
            try {
                if ($ruleSet->isMatching($applyFor, $entityType, $entityValues)) {
                    return Brizy_Editor_Post::get($atemplate->ID);
                }
            } catch (\Exception $e) {
                continue; // we catch here  the  exclusions
            }
        }
        return null;
    }

    /**
     * @param $template
     *
     * @return string
     */
    public function templateInclude($template)
    {
        if (!self::getTemplate()) {
            return $template;
        }

        $templateName = self::getTemplate()->get_template();
        $urlBuilder = new Brizy_Editor_UrlBuilder();

        if (!$templateName || $templateName == 'default') {
            return $urlBuilder->plugin_path('public/views/templates/' . Brizy_Config::BRIZY_TEMPLATE_FILE_NAME);
        }

        if (in_array(
            $templateName,
            array(
                Brizy_Config::BRIZY_BLANK_TEMPLATE_FILE_NAME,
                Brizy_Config::BRIZY_TEMPLATE_FILE_NAME,
            )
        )) {

            return $urlBuilder->plugin_path('/public/views/templates/' . $templateName);
        }

        return $template;
    }

    public function templateFrontEnd()
    {
        global $wp_query;
        $pid = Brizy_Editor::get()->currentPostId();

        $is_using_brizy = false;
        try {
            if (in_array(get_post_type($pid), Brizy_Editor::get()->supported_post_types())) {
                $is_using_brizy = Brizy_Editor_Entity::isBrizyEnabled($pid);
            }
        } catch (Exception $e) {

        }
        try {

            if (is_null($pid) || !$is_using_brizy) {
                self::$template = $this->getTemplateForCurrentPage();

                if (!self::getTemplate()) {
                    return;
                }

                add_filter('template_include', array($this, 'templateInclude'), 20000);

                $is_preview = is_preview() || isset($_GET['preview']);
                $needs_compile = $is_preview || !self::getTemplate()->isCompiledWithCurrentVersion() || self::getTemplate()->get_needs_compile();

                if ($needs_compile) {
                    try {
                        self::getTemplate()->compile_page();
                        if (!$is_preview && $needs_compile) {
                            self::getTemplate()->saveStorage();
                            self::getTemplate()->savePost();
                        }
                    } catch (Exception $e) {
                        //ignore
                        Brizy_Logger::instance()->error($e->getMessage(), []);
                    }
                }

                if ($pid) {
                    $this->pid = $pid;
                }

                remove_filter('the_content', 'wpautop');

	            add_filter( 'brizy_asset_manager_post', function ( $post ) use ( $pid ) {

	                if ( $post->post_type !== self::CP_TEMPLATE ) {
	                    return $post;
                    }

		            return get_post( $pid );
	            } );

                // insert the compiled head and content
                add_filter('body_class', array($this, 'bodyClassFrontend'));
                add_action('wp_head', array($this, 'insertTemplateHead'));
                add_action('brizy_template_content', array($this, 'showTemplateContent'), -12000);
                add_action('wp_enqueue_scripts', array($this, 'enqueue_preview_assets'), 9999);
	            add_filter( 'the_content', [ $this, 'filterPageContent' ], - 12000 );
            }

        } catch (Exception $e) {
            //ignore
            Brizy_Logger::instance()->error($e->getMessage(), []);
        }
    }

    /**
     * @internal
     */
    public function enqueue_preview_assets()
    {
        if (wp_script_is('jquery') === false) {
            wp_register_script('jquery-core', "/wp-includes/js/jquery/jquery.js");
            wp_register_script('jquery-migrate', "/wp-includes/js/jquery/jquery-migrate.min.js");
            wp_register_script('jquery', false, array('jquery-core', 'jquery-migrate'));
        }

	    Brizy_Public_AssetEnqueueManager::_init()->enqueuePost( self::getTemplate() );

        do_action( 'brizy_preview_enqueue_scripts', self::getTemplate() );
    }

    public function bodyClassFrontend($classes)
    {
        $classes[] = 'brz';

        return $classes;
    }

    /**
     *  Show the compiled page head content
     */
    public function insertTemplateHead()
    {
        if (!self::getTemplate()) {
            return;
        }

        $pid = Brizy_Editor::get()->currentPostId();
        $template = self::getTemplate();
        $post = $template->getWpPost();

        if ($pid) {
            $post = get_post($pid);
        }

        $compiled_page = self::getTemplate()->get_compiled_page();
        $templateHead = $compiled_page->get_head();

	    if ( empty( $templateHead ) ) {
		    return;
	    }

        $head = apply_filters('brizy_content', $templateHead, Brizy_Editor_Project::get(), $post, 'head');
        ?>
        <!-- BRIZY HEAD -->
        <?php echo $head; ?>
        <!-- END BRIZY HEAD -->
        <?php
    }

    /**
     * @param $content
     *
     * @return null|string|string[]
     * @throws Exception
     */
    public function showTemplateContent()
    {
        $content = $this->getTemplateContent();
        echo apply_filters('the_content', $content);
    }


    private function getTemplateContent()
    {
        if (!self::getTemplate()) {
            return;
        }

        $pid  = Brizy_Editor::get()->currentPostId();
        $post = self::getTemplate()->getWpPost();

	    if ( $pid ) {
		    $post = get_post( $pid );
	    }

        $content = apply_filters(
            'brizy_content',
	        self::getTemplate()->get_compiled_page()->getBody(),
            Brizy_Editor_Project::get(),
            $post,
            'body'
        );

        return apply_filters( 'brizy_template_content_compiled', $content );
    }

    /**
     * @param $content
     *
     * @return null|string|string[]
     * @throws Exception
     */
    public function filterPageContent($content)
    {
        if (!self::getTemplate() || doing_filter('brizy_content')) {
            return $content;
        }

        $pid = Brizy_Editor::get()->currentPostId();
        $brizyPost = null;

        if ($pid) {
            $brizyPost = get_post($pid);
        }

        $content = $this->getTemplateContent();

        return apply_filters(
            'brizy_content',
            $content,
            Brizy_Editor_Project::get(),
            $brizyPost,
            'body'
        );
    }

    /**
     * Check for rules conflicts on transition post from trash to another post status.
     * If we have some conflicts between the rules from the transition post rules and other rules from existing posts,
     * then we remove conflicting rules from the restored post.
     *
     * @param string $new_status New post status.
     * @param string $old_status Old post status.
     * @param WP_Post $post Transition post.
     */
    public function actionTransitionPostStatus($new_status, $old_status, $post)
    {

        if ('trash' !== $old_status || self::CP_TEMPLATE !== $post->post_type) {
            return;
        }

        $post_id = $post->ID;
        $rule_manager = new Brizy_Admin_Rules_Manager();
        $post_rules = $rule_manager->getRules($post_id);

        if (!$post_rules) {
            return;
        }

        $all_rules = $rule_manager->getAllRulesSet(array('post__not_in' => array($post_id)))->getRules();
        $has_conflicts = false;

        foreach ($post_rules as $post_rule) {

            foreach ($all_rules as $arule) {

                if ($post_rule->isEqual($arule)) {
                    $rule_manager->deleteRule($post_id, $post_rule->getId());
                    $has_conflicts = true;
                }
            }
        }

        if ($has_conflicts) {
            Brizy_Admin_Flash::instance()->add_error(
                'Conflict of rules: Some rules have been deleted for restored posts. Please check them.'
            );
        }
    }


    public static function getPostSample($templateId)
    {
        $wp_post = get_post($templateId);
        if ($wp_post->post_type !== Brizy_Admin_Templates::CP_TEMPLATE &&
            $wp_post->post_type !== Brizy_Admin_Popups_Main::CP_POPUP) {
            return $wp_post;
        }


        $ruleManager = new Brizy_Admin_Rules_Manager();
        $rules = $ruleManager->getRules($wp_post->ID);
        $rule = null;

        // find first include rule
        foreach ($rules as $rule) {
            /**
             * @var Brizy_Admin_Rule $rule ;
             */
            if ($rule->getType() == Brizy_Admin_Rule::TYPE_INCLUDE) {
                break;
            }
        }

        if ($rule) {
            switch ($rule->getAppliedFor()) {
                case  Brizy_Admin_Rule::POSTS :
                    $args = array(
                        'post_type' => $rule->getEntityType(),
                    );

                    $entities = $rule->getEntityValues();

                    // if this is an array with more that one items
                    if (count($rule->getEntityValues()) > 1) {
                        $args['post__in'] = $rule->getEntityValues();
                    }

                    // check if there are complex rules like in category or child of category
                    if (count($rule->getEntityValues()) == 1) {

                        if (is_numeric($entities[0])) {
                            $args['post__in'] = $rule->getEntityValues();
                        } else {
                            $parts = explode('|', $entities[0]);

                            if (count($parts) > 1) {
                                $args[$parts[1]] = [$parts[2]];
                            }
                        }
                    }

                    $args["meta_query"] = array(
                        array(
                            "key" => "brizy",
                            'compare' => 'NOT EXISTS',
                        ),
                    );

                    $array = get_posts($args);

                    return array_pop($array);
                    break;
                case Brizy_Admin_Rule::TAXONOMY :
                    $args = array(
                        'taxonomy' => $rule->getEntityType(),
                        'hide_empty' => false,
                    );
                    $entities = $rule->getEntityValues();
                    foreach ($entities as $val) {
                        if (is_numeric($val)) {
                            $args['term_taxonomy_id'][] = $val;
                        } else {
                            $parts = explode('|', $entities[0]);

                            if (count($parts) > 1) {
                                $args['term_taxonomy_id'][] = $parts[2];
                            }
                        }
                    }

                    $array = get_terms($args);

                    $term = array_pop($array);

                    $array = get_posts(
                        [
                            'post_status' => 'publish',
                            'tax_query' => array(
                                array(
                                    'taxonomy' => $term->taxonomy,
                                    'field' => 'term_id',
                                    'terms' => $term->term_id,
                                ),
                            ),
                        ]
                    );

                    return array_pop($array);
                    break;
                case  Brizy_Admin_Rule::ARCHIVE :
                    return null;
                    break;
                case  Brizy_Admin_Rule::TEMPLATE :

                    switch ($rule->getEntityType()) {
                        case 'author':
                            $authors = get_users();

                            return array_pop($authors);
                            break;
                        case '404':
                        case 'search':
                            return null;
                            break;
                        case 'home_page':
                            $get_option = get_option('page_for_posts');

                            if ($get_option) {
                                return Brizy_Editor_Entity::isBrizyEnabled($get_option) ? null : get_post($get_option);
                            }
                            break;
                        case 'front_page':
                            $get_option = get_option('page_on_front');

                            if ($get_option) {
                                return Brizy_Editor_Entity::isBrizyEnabled($get_option) ? null : get_post($get_option);
                            }
                            break;
                    }
                    break;
            }
        }
    }

    public function saveTemplateRulesNotices()
    {

        global $pagenow;

        if ($pagenow !== 'post.php' || get_post_type() !== Brizy_Admin_Templates::CP_TEMPLATE) {
            return;
        }

        $post_id = get_the_ID();

        if ($error = get_transient("editor_tpl_rule_errors_{$post_id}")) {

            $prefix = ucfirst(Brizy_Editor::prefix());

            echo '<div class="error"><p>' . $prefix . ': ' . $error . '</p></div>';

            delete_transient("editor_tpl_rule_errors_{$post_id}");
        }
    }

    private function obtainRulesFromPostSubmit($post_id)
    {
        if ($parent_id = wp_is_post_revision($post_id)) {
            $post_id = $parent_id;
        }

        // set template type from $_POST
        $type = null;
        if (isset($_POST['brizy-template-type'])) {
            $type = strtolower($_POST['brizy-template-type']);
            if (in_array(
                $type,
                [
                    self::TYPE_SINGLE,
                    self::TYPE_ARCHIVE,
                    self::TYPE_PRODUCT_ARCHIVE,
                    self::TYPE_SINGLE_PRODUCT,
                ]
            )) {
                self::setTemplateType($post_id, $type);
            }
        } else {
            return [];
        }

        // get rules from $_POST
        $rules = [];
        if ($type && isset($_POST['brizy-' . $type . '-rule-type']) && is_array($_POST['brizy-' . $type . '-rule-type'])) {
            foreach ($_POST['brizy-' . $type . '-rule-type'] as $i => $ruleType) {

                // ignore this rule if type is invalid
                if (!in_array(
                    (int)$ruleType,
                    [
                        Brizy_Admin_Rule::TYPE_EXCLUDE,
                        Brizy_Admin_Rule::TYPE_INCLUDE,
                    ]
                )) {
                    continue;
                }

                $values = explode("|", $_POST['brizy-' . $type . '-rule-group'][$i]);
                list($appliedFor, $entityType) = $values;

                // ingnore invalid group value
                if (!$appliedFor) {
                    continue;
                }

                $entityValues = [];
                if (isset($_POST['brizy-' . $type . '-rule-entity-values'][$i])) {
                    $entityValues = (array)$_POST['brizy-' . $type . '-rule-entity-values'][$i];
                }

                $rules[] = new Brizy_Admin_Rule(null, $ruleType, $appliedFor, $entityType, $entityValues);
            }
        }

        return $rules;
    }


    public function validate_template_rules($post_id, $data)
    {
        if (!isset($_REQUEST['brizy-template-type'])) {
            return;
        }

        $rules = $this->obtainRulesFromPostSubmit($post_id);

        if (count($rules) == 0) {
            return;
        }

        try {
            // validate rule
            $ruleValidator = Brizy_Admin_Rules_ValidatorFactory::getValidator($post_id);

            if (!$ruleValidator) {
                $this->addError($post_id, esc_html__('Unable to get the rule validator for this post type.', 'brizy'));
                header('Location: ' . get_edit_post_link($post_id, 'redirect'));
                exit;
            }

            $ruleValidator->validateRulesForPostId($rules, $post_id);
        } catch (Brizy_Editor_Exceptions_DataVersionMismatch $e) {
            $this->addError($post_id, esc_html__('Invalid data version.', 'brizy'));
            header('Location: ' . get_edit_post_link($post_id, 'redirect'));
            exit;
        } catch (Exception $e) {
            $this->addError($post_id, $e->getMessage());
            header('Location: ' . get_edit_post_link($post_id, 'redirect'));
            exit;
        }
    }

    public function saveTemplateRules($post_id)
    {
        try {
            if (!isset($_REQUEST['brizy-template-type'])) {
                return;
            }

            $rules = $this->obtainRulesFromPostSubmit($post_id);
            $ruleManager = new Brizy_Admin_Rules_Manager();
            $ruleManager->setRules($post_id, $rules);
        } catch (Brizy_Editor_Exceptions_DataVersionMismatch $e) {
            $this->addError($post_id, esc_html__('Invalid data version.', 'brizy'));
        } catch (Exception $e) {
            $this->addError($post_id, $e->getMessage());
        }
    }

    public function addError($post_id, $message)
    {
        set_transient("editor_tpl_rule_errors_{$post_id}", $message, 45);
    }

    /**
     * @param $id
     *
     * @return mixed
     */
    public static function getTemplateType($id)
    {
        return get_post_meta($id, self::TEMPLATE_TYPE_KEY, true);
    }

    /**
     * @param $id
     * @param $type
     */
    public static function setTemplateType($id, $type)
    {
        update_post_meta($id, self::TEMPLATE_TYPE_KEY, $type);
    }
}


