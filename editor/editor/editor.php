<?php

class Brizy_Editor_Editor_Editor
{

    use Brizy_Editor_Editor_ModuleGroups_ContextUtils;

    const COMPILE_CONTEXT = 'compile';
    const EDITOR_CONTEXT = 'editor';

    /**
     * @var self
     */
    static private $insance;

    /**
     * @var array
     */
    static private $config;

    /**
     * @var Brizy_Editor_Post
     */
    private $post;

    /**
     * @var Brizy_Editor_Project
     */
    private $project;

    /**
     * @var Brizy_Editor_UrlBuilder
     */
    private $urlBuilder;

    /**
     * @param Brizy_Editor_Project $project
     * @param Brizy_Editor_Post $post
     *
     * @return Brizy_Editor_Editor_Editor
     */
    public static function get(Brizy_Editor_Project $project, Brizy_Editor_Post $post)
    {

        $postId = $post && $post->getWpPostId() ? $post->getWpPostId() : 0;
        if (isset(self::$insance[$postId])) {
            return self::$insance[$postId];
        }

        return self::$insance[$postId] = new self($project, $post);
    }

    /**
     * Brizy_Editor_Editor_Editor constructor.
     *
     * @param Brizy_Editor_Project $project
     * @param Brizy_Editor_Post $post
     */
    public function __construct(Brizy_Editor_Project $project, Brizy_Editor_Post $post = null)
    {
        $this->post = $post;
        $this->project = $project;
        $this->urlBuilder = new Brizy_Editor_UrlBuilder($project, $post ? $post->getWpPostId() : null);
    }

    private function getMode($postType)
    {
        switch ($postType) {
            case Brizy_Admin_Stories_Main::CP_STORY:
                return 'internal_story';
            case Brizy_Admin_Templates::CP_TEMPLATE:
                return 'template';
            case Brizy_Admin_Popups_Main::CP_POPUP:
                return 'internal_popup';
            case 'product':
            case 'product_variation':
                return 'product';
            default:
                return 'page';
        }
    }

    public function getClientConfig($context)
    {
        $parent_post_type = get_post_type($this->post->getWpPostId());
        $mode = $this->getMode($parent_post_type);
        $config = [
            'hash' => wp_create_nonce(Brizy_Editor_API::nonce),
            'editorVersion' => BRIZY_EDITOR_VERSION,
            'url' => set_url_scheme(admin_url('admin-ajax.php')),
            'actions' => $this->getApiActions(),
            'pageId' => $this->post->getWpPostId(),
        ];

        $config = $this->getApiConfigFields($config, $context);
        $config = $this->addLoopSourcesClientConfig($config, $mode === 'template', $this->post->getWpPostId(), $context);

        return $config;
    }

    /**
     * @throws Exception
     */
    public function config($context = self::COMPILE_CONTEXT)
    {
        do_action('brizy_create_editor_config_before');

        $cachePostId = ($this->post ? $this->post->getWpPostId() : 0) . '_' . $context;
        if (isset(self::$config[$cachePostId])) {
            return self::$config[$cachePostId];
        }

        global $wp_registered_sidebars;

        $parent_post_type = get_post_type($this->post->getWpPostId());
        $wp_post_id = $this->post->getWpPostId();
        $preview_post_link = $this->getPreviewUrl($this->post->getWpPost());

        $change_template_url = set_url_scheme(
            admin_url('admin-post.php?post=' . $this->post->getWpPostId() . '&action=_brizy_change_template')
        );
        $mode = $this->getMode($parent_post_type);

        $heartBeatInterval = (int)apply_filters('wp_check_post_lock_window', 150);
        $config = array(
            'user' => array(
                'role' => 'admin',
                'isAuthorized' => $this->project->getMetaValue('brizy-cloud-token') !== null,
                'allowScripts' => $this->isUserAllowedToAddScripts($context),
            ),
            'project' => array(
                'id' => $this->project->getId(),
                'status' => $this->getProjectStatus(),
                'heartBeatInterval' => ($heartBeatInterval > 10 && $heartBeatInterval < 30 ? $heartBeatInterval : 30) * 1000,
            ),
            'urls' => array(
                'site' => home_url(),
                'api' => home_url('/wp-json/v1'),
                'assets' => $context == self::COMPILE_CONTEXT ? Brizy_Config::EDITOR_BUILD_RELATIVE_PATH : $this->urlBuilder->editor_build_url(),
                'image' => $this->urlBuilder->external_media_url() . "",
                'blockThumbnails' => $this->urlBuilder->external_asset_url('thumbs') . "",
                'templateThumbnails' => $this->urlBuilder->external_asset_url('thumbs') . "",
                'templateIcons' => $this->urlBuilder->proxy_url('editor/icons'),
                'templateFonts' => $this->urlBuilder->external_fonts_url(),
                'editorFonts' => home_url('/'),
                'pagePreview' => $preview_post_link,
                'about' => __bt('about-url', apply_filters('brizy_about_url', Brizy_Config::ABOUT_URL)),
                'backToDashboard' => get_edit_post_link($wp_post_id, null),
                'assetsExternal' => $this->urlBuilder->external_asset_url() . "",
                'termsOfService' => Brizy_Config::getTermsOfServiceUrl(),

                // wp specific
                'changeTemplate' => $change_template_url,
                'upgradeToPro' => Brizy_Config::getUpgradeUrl(),

                'support' => Brizy_Config::getSupportUrl(),
                'pluginSettings' => admin_url('admin.php?page=' . Brizy_Admin_Settings::menu_slug()),
                'dashboardNavMenu' => admin_url('nav-menus.php'),
                'customFile' => home_url('?' . Brizy_Editor::prefix('_attachment') . '='),
            ),
            'form' => array(
                'submitUrl' => '{{brizy_dc_ajax_url}}?action=' . Brizy_Editor::prefix(
                        Brizy_Editor_Forms_Api::AJAX_SUBMIT_FORM
                    ),
            ),
            'serverTimestamp' => time(),
            'menuData' => $this->get_menu_data(),
            'wp' => array(
                'pluginPrefix' => Brizy_Editor::prefix(),
                'permalink' => get_permalink($wp_post_id),
                'page' => $wp_post_id,
                'postType' => get_post_type($wp_post_id),
                'featuredImage' => $this->getThumbnailData($wp_post_id),
                'templates' => $this->post->get_templates(),

                'plugins' => array(
                    'dummy' => true,
                    'woocommerce' => self::get_woocomerce_plugin_info(),
                ),
                'hasSidebars' => count($wp_registered_sidebars) > 0,
                'pageData' => apply_filters('brizy_page_data', array()),
                'availableRoles' => Brizy_Admin_Membership_Membership::roleList(),
                'usersCanRegister' => get_option('users_can_register'),
            ),
            'mode' => $mode,
            'applications' => array(
                'form' => array(
                    'submitUrl' => '{{brizy_dc_ajax_url}}?action=' . Brizy_Editor::prefix(
                            Brizy_Editor_Forms_Api::AJAX_SUBMIT_FORM
                        ),
                ),
            ),
            'ui' => [],
            'server' => array(
                'maxUploadFileSize' => $this->fileUploadMaxSize(),
            ),
            'branding' => array('name' => __bt('brizy', 'Brizy')),
            'prefix' => Brizy_Editor::prefix(),
            'cloud' => $this->getCloudInfo(),
            'editorVersion' => BRIZY_EDITOR_VERSION,
            'imageSizes' => $this->getImgSizes(),
            'moduleGroups' => [],
            'help' => $this->getEditorHelpVideos(Brizy_Config::EDITOR_HELP_VIDEOS_URL),
            'l10n' => $this->getTexts(),
        );
        $manager = new Brizy_Editor_Accounts_ServiceAccountManager(Brizy_Editor_Project::get());

        $config = $this->addRecaptchaAccounts($manager, $config, $context);
        $config = $this->addSocialAccounts($manager, $config, $context);
        $config = $this->addWpPostTypes($config, $context);
        $config = $this->addTemplateFields($config, $mode === 'template', $wp_post_id, $context);
        $config['wp']['api'] = $this->getApiActions($config, $context);
        $config = $this->addGlobalBlocksData($config);
        $config = $this->addGlobalBlocksData($config);
        $config = $this->addLoopSourcesConfig($config, $mode === 'template', $wp_post_id, $context);
        $config = $this->getApiConfigFields($config, $context);
        $config = $this->addContentDefaults($config, $context);
        $config = $this->addUIConfig($config, $context);
        $config = $this->addProjectData($config, $context);
        $config = $this->addModuleGroups($config, $context);
        $config = $this->addPageData($config, $context);

        self::$config[$cachePostId] = apply_filters('brizy_editor_config', $config, $context);

        do_action('brizy_create_editor_config_after');

        return self::$config[$cachePostId];
    }

    private function addUIConfig($config, $context)
    {

        $is_popup = $this->isPopup($config);
        $is_story = $this->isStory($config);
        $is_template = $this->isTemplate($config);

        $options = [
            !Brizy_Compatibilities_BrizyProCompatibility::isPro() ?
                [
                    "type" => "link",
                    "icon" => "nc-unlock",
                    "label" => __bt("Upgrade to Pro", "Upgrade to Pro", 'brizy'),
                    "link" => $config['urls']['upgradeToPro'],
                    "linkTarget" => "_blank",
                ] : null,
            [
                "type" => "link",
                "icon" => "nc-info",
                "label" => __bt("About us", "About us", 'brizy'),
                "link" => $config['urls']['about'],
                "linkTarget" => "_blank"
            ],
            [
                "type" => "link",
                "icon" => "nc-help-docs",
                "label" => __bt("Support", "Support", 'brizy'),
                "link" => $config['urls']['support'],
                "linkTarget" => "_blank",
                "roles" => ["admin"]
            ],
            [
                "type" => "shortcuts",
                "icon" => "nc-alert-circle-que",
                "label" => __bt("Shortcuts", "Shortcuts", 'brizy'),
                "link" => "#"
            ],
            [
                "type" => "link",
                "icon" => "nc-cog",
                "label" => __bt("Plugin Settings", "Plugin Settings", 'brizy'),
                "link" => $config['urls']['pluginSettings'],
                "linkTarget" => "_blank",
                "roles" => ["admin"]
            ],
            [
                "type" => "link",
                "icon" => "nc-back",
                "label" => __bt("Go to Dashboard", "Go to Dashboard", 'brizy'),
                "link" => $config['urls']['backToDashboard']
            ]
        ];
        $config['ui']['leftSidebar'] = [
            "topTabsOrder" => ["addElements", "reorderBlock", "globalStyle"],
            "bottomTabsOrder" => ["deviceMode", "pageSettings", "more"],
            "pageSettings" => [
                "options" => [
                    "template" => !($is_popup || $is_story),
                    "membership" => !($is_popup || $is_story),
                    "featuredImage" => !($is_popup || $is_story) && !$is_template
                ]
            ],
            "more" => [
                "options" => array_values(array_filter($options))
            ]
        ];

        $config['ui']['popupSettings'] = [
            "horizontalAlign" => true,
            "verticalAlign" => true,
            "embedded" => false,
            "displayCondition" => $is_popup,
            "scrollPageBehind" => true,
            "clickOutsideToClose" => true,
            "deletePopup" => $is_popup,
            "backgroundPreviewUrl" => $config['urls']['pagePreview']
        ];

        return $config;
    }

    /**
     * @param $config
     *
     * @return string[]|WP_Post_Type[]
     */
    private function addWpPostTypes($config, $context)
    {
        $excludePostTypes = ['attachment'];

        $types = get_post_types(['public' => true]);
        $result = [];
        foreach ($types as $type) {
            if (in_array($type, $excludePostTypes)) {
                continue;
            }
            $typeObj = get_post_type_object($type);
            $typeDto = [
                'name' => $typeObj->name,
                'label' => $typeObj->label,
            ];
            $result[] = $typeDto;

        }

        $config['wp']['postTypes'] = $result;

        return $config;
    }

    private function addPageData($config, $context)
    {

        $config['pageData'] = $this->post->createConfigData($context);

        return $config;
    }

    private function addModuleGroups($config, $context)
    {

        $moduleGroupCollector = new Brizy_Editor_Editor_ModuleGroups_Manager();

        $config['ui']['leftSidebar'] = array_merge($config['ui']['leftSidebar'], ['moduleGroups' => $moduleGroupCollector->getAll($config)]);

        return $config;
    }


    private function addProjectData($config, $context)
    {

        $response = Brizy_Editor_Project::get()->createResponse();
        $response['data'] = json_decode($response['data']);
        $config['projectData'] = $response;

        return $config;
    }


    private function getApiConfigFields($config, $context)
    {
        $config['api'] = [
            'media' => [
                'mediaResizeUrl' => home_url()
            ],
            'customFile' => [
                'fileUrl' => home_url('?' . Brizy_Editor::prefix('_attachment') . '='),
            ],
            'templates' => [
                'kitsUrl' => Brizy_Config::getEditorTemplatesUrl('kits'),
                'layoutsUrl' => Brizy_Config::getEditorTemplatesUrl('layouts'),
                'popupsUrl' => Brizy_Config::getEditorTemplatesUrl('popups'),
                'storiesUrl' => Brizy_Config::getEditorTemplatesUrl('stories')
            ]
        ];

        return apply_filters('brizy_api_config_fields', $config, $context);
    }

    private function addContentDefaults($config, $context)
    {
        $config['contentDefaults'] = [
            'ProductMetafield' => ['linkSource' => 'page'],
            'Row' => [
                'linkSource' => 'page',
                'linkType' => 'page',
                'items' => [
                    [
                        'type' => 'Column',
                        'value' => [
                            '_styles' => ['column'],
                            'linkSource' => 'page',
                            'linkType' => 'page',
                            'items' => []
                        ]
                    ],
                    [
                        'type' => 'Column',
                        'value' => [
                            '_styles' => ['column'],
                            'linkSource' => 'page',
                            'linkType' => 'page',
                            'items' => []
                        ]
                    ]
                ]
            ],
            'Button' => ['linkSource' => 'page', 'linkType' => 'page'],
            'RichText' => ['linkSource' => 'page', 'linkType' => 'page'],
            'Icon' => ['linkSource' => 'page', 'linkType' => 'page'],
            'Image' => ['linkSource' => 'page', 'linkType' => 'page'],
            'Lottie' => ['linkSource' => 'page', 'linkType' => 'page'],
            'FeaturedImage' => ['linkSource' => 'page', 'linkType' => 'page'],
            'PostExcerpt' => [
                'linkSource' => 'page',
                'linkType' => 'page',
                'textPopulation' => '{{brizy_dc_post_excerpt}}',
                'textPopulationEntityType' => '',
                'textPopulationEntityId' => '',
                '_population' => [
                    'name' => 'brizy_dc_post_excerpt',
                    'placeholder' => '{{brizy_dc_post_excerpt}}'
                ]
            ],
            'Column' => [
                ['type' => 'Column', 'value' => ['linkSource' => 'page', 'linkType' => 'page', 'items' => []]],
                ['type' => 'Column', 'value' => ['linkSource' => 'page', 'linkType' => 'page', 'items' => []]]
            ],
            'PostContent' => [
                'linkSource' => 'page',
                'textPopulation' => '{{brizy_dc_post_content}}',
                'textPopulationEntityType' => '',
                'textPopulationEntityId' => '',
                '_population' => [
                    'name' => 'brizy_dc_post_content',
                    'placeholder' => '{{brizy_dc_post_content}}'
                ]
            ],
            'PostTitle' => [
                'linkSource' => 'page',
                'linkType' => 'page',
                'textPopulation' => '{{brizy_dc_post_title}}',
                'textPopulationEntityType' => '',
                'textPopulationEntityId' => '',
                '_population' => [
                    'name' => 'brizy_dc_post_title',
                    'placeholder' => '{{brizy_dc_post_title}}'
                ]
            ],
            'Posts' => [
                '_styles' => ['posts', 'posts-posts'],
                '_version' => 3,
                'order' => 'ASC',
                'orderBy' => 'ID',
                'source' => 'post',
                'type' => 'posts',
                'items' => [
                    [
                        'type' => 'Column',
                        'value' => [
                            '_styles' => ['posts--column'],
                            'items' => [
                                [
                                    'type' => 'Wrapper',
                                    'value' => [
                                        '_styles' => ['wrapper', 'wrapper--image'],
                                        'items' => [
                                            [
                                                'type' => 'Image',
                                                'value' => [
                                                    '_styles' => ['image', 'image--dynamic'],
                                                    'imagePopulation' => '{{brizy_dc_img_featured_image}}',
                                                ],
                                            ],
                                        ],
                                    ],
                                ],
                                [
                                    'type' => 'Wrapper',
                                    'value' => [
                                        '_styles' => [
                                            'wrapper',
                                            'wrapper-postTitle',
                                            'wrapper-postTitle-posts',
                                            'wrapper-postTitle-posts-posts'
                                        ],
                                        'items' => [
                                            [
                                                'type' => 'WPPostsTitle',
                                                'value' => [
                                                    '_styles' => [
                                                        'postTitle',
                                                        'postTitle-posts',
                                                        'postTitle-posts-posts'
                                                    ],
                                                ],
                                            ],
                                        ],
                                    ],
                                ],
                                [
                                    'type' => 'Wrapper',
                                    'value' => [
                                        '_styles' => [
                                            'wrapper',
                                            'wrapper-postExcerpt',
                                            'wrapper-postExcerpt-posts',
                                            'wrapper-postExcerpt-posts-posts'
                                        ],
                                        'items' => [
                                            [
                                                'type' => 'WPPostExcerpt',
                                                'value' => [
                                                    '_styles' => [
                                                        'postExcerpt',
                                                        'postExcerpt-posts',
                                                        'postExcerpt-posts-posts'
                                                    ],
                                                ],
                                            ],
                                        ],
                                    ],
                                ],
                                [
                                    'type' => 'Cloneable',
                                    'value' => [
                                        '_styles' => ['wrapper-clone', 'wrapper-clone--button'],
                                        'items' => [
                                            [
                                                'type' => 'Button',
                                                'value' => [
                                                    '_styles' => ['button', 'button--dynamic'],
                                                ],
                                            ],
                                        ],
                                    ],
                                ],
                            ],
                        ],
                    ],
                ],
            ],
            'AssetsPosts' => [
                '_version' => 3,
                'type' => 'posts',
                'source' => 'post',
                'orderBy' => 'id',
                'order' => 'DESC',
                'items' => [
                    [
                        'type' => 'Column',
                        'value' => [
                            '_styles' => [
                                'posts--column',
                            ],
                            'items' => [
                                [
                                    'type' => 'Wrapper',
                                    'value' => [
                                        '_styles' => [
                                            'wrapper',
                                            'wrapper--image',
                                        ],
                                        'items' => [
                                            [
                                                'type' => 'Image',
                                                'value' => [
                                                    '_styles' => [
                                                        'image',
                                                        'image--dynamic',
                                                    ],
                                                    'imagePopulation' => '{{brizy_dc_img_featured_image}}',
                                                ],
                                            ],
                                        ],
                                    ],
                                ],
                                [
                                    'type' => 'Wrapper',
                                    'value' => [
                                        '_styles' => [
                                            'wrapper',
                                            'wrapper-postTitle',
                                            'wrapper-postTitle-posts',
                                            'wrapper-postTitle-posts-posts',
                                        ],
                                        'items' => [
                                            [
                                                'type' => 'WPPostsTitle',
                                                'value' => [
                                                    '_styles' => [
                                                        'postTitle',
                                                        'postTitle-posts',
                                                        'postTitle-posts-posts',
                                                    ],
                                                ],
                                            ],
                                        ],
                                    ],
                                ],
                                [
                                    'type' => 'Wrapper',
                                    'value' => [
                                        '_styles' => [
                                            'wrapper',
                                            'wrapper-postExcerpt',
                                            'wrapper-postExcerpt-posts',
                                            'wrapper-postExcerpt-posts-posts',
                                        ],
                                        'items' => [
                                            [
                                                'type' => 'WPPostExcerpt',
                                                'value' => [
                                                    '_styles' => [
                                                        'postExcerpt',
                                                        'postExcerpt-posts',
                                                        'postExcerpt-posts-posts',
                                                    ],
                                                ],
                                            ],
                                        ],
                                    ],
                                ],
                                [
                                    'type' => 'Cloneable',
                                    'value' => [
                                        '_styles' => [
                                            'wrapper-clone',
                                            'wrapper-clone--button',
                                        ],
                                        'items' => [
                                            [
                                                'type' => 'Button',
                                                'value' => [
                                                    '_styles' => [
                                                        'button',
                                                        'button--dynamic',
                                                    ],
                                                ],
                                            ],
                                        ],
                                    ],
                                ],
                            ],
                        ],
                    ],
                ],
            ],
            'ShopCategories' => [
                "_version" => 3,
                "type" => "posts",
                "source" => "post",
                "orderBy" => "id",
                "order" => "DESC",
                "items" => [
                    [
                        'type' => 'Column',
                        'value' => [
                            '_styles' => [
                                'posts--column'
                            ],
                            'items' => [
                                [
                                    'type' => 'Wrapper',
                                    'value' => [
                                        '_styles' => [
                                            'wrapper',
                                            'wrapper--image'
                                        ],
                                        'items' => [
                                            [
                                                'type' => 'Image',
                                                'value' => [
                                                    '_styles' => [
                                                        'image',
                                                        'image--dynamic'
                                                    ],
                                                    'imagePopulation' => '{{brizy_dc_img_featured_image}}'
                                                ]
                                            ]
                                        ]
                                    ]
                                ],
                                [
                                    'type' => 'Wrapper',
                                    'value' => [
                                        '_styles' => [
                                            'wrapper',
                                            'wrapper-postTitle',
                                            'wrapper-postTitle-posts',
                                            'wrapper-postTitle-posts-posts'
                                        ],
                                        'items' => [
                                            [
                                                'type' => 'WPPostsTitle',
                                                'value' => [
                                                    '_styles' => [
                                                        'postTitle',
                                                        'postTitle-posts',
                                                        'postTitle-posts-posts'
                                                    ]
                                                ]
                                            ]
                                        ]
                                    ]
                                ],
                                [
                                    'type' => 'Wrapper',
                                    'value' => [
                                        '_styles' => [
                                            'wrapper',
                                            'wrapper-postExcerpt',
                                            'wrapper-postExcerpt-posts',
                                            'wrapper-postExcerpt-posts-posts'
                                        ],
                                        'items' => [
                                            [
                                                'type' => 'WPPostExcerpt',
                                                'value' => [
                                                    '_styles' => [
                                                        'postExcerpt',
                                                        'postExcerpt-posts',
                                                        'postExcerpt-posts-posts'
                                                    ]
                                                ]
                                            ]
                                        ]
                                    ]
                                ],
                                [
                                    'type' => 'Cloneable',
                                    'value' => [
                                        '_styles' => [
                                            'wrapper-clone',
                                            'wrapper-clone--button'
                                        ],
                                        'items' => [
                                            [
                                                'type' => 'Button',
                                                'value' => [
                                                    '_styles' => [
                                                        'button',
                                                        'button--dynamic'
                                                    ]
                                                ]
                                            ]
                                        ]
                                    ]
                                ]
                            ]
                        ]
                    ]
                ]
            ],
            'ShopPosts' => [
                '_version' => 3,
                'type' => 'posts',
                'source' => 'post',
                'orderBy' => 'id',
                'order' => 'DESC',
                'items' => [
                    [
                        'type' => 'Column',
                        'value' => [
                            '_styles' => [
                                'posts--column',
                            ],
                            'items' => [
                                [
                                    'type' => 'Wrapper',
                                    'value' => [
                                        '_styles' => [
                                            'wrapper',
                                            'wrapper--image',
                                        ],
                                        'items' => [
                                            [
                                                'type' => 'Image',
                                                'value' => [
                                                    '_styles' => [
                                                        'image',
                                                        'image--dynamic',
                                                    ],
                                                    'imagePopulation' => '{{brizy_dc_img_featured_image}}',
                                                ],
                                            ],
                                        ],
                                    ],
                                ],
                                [
                                    'type' => 'Wrapper',
                                    'value' => [
                                        '_styles' => [
                                            'wrapper',
                                            'wrapper-postTitle',
                                            'wrapper-postTitle-posts',
                                            'wrapper-postTitle-posts-posts',
                                        ],
                                        'items' => [
                                            [
                                                'type' => 'WPPostsTitle',
                                                'value' => [
                                                    '_styles' => [
                                                        'postTitle',
                                                        'postTitle-posts',
                                                        'postTitle-posts-posts',
                                                    ],
                                                ],
                                            ],
                                        ],
                                    ],
                                ],
                                [
                                    'type' => 'Wrapper',
                                    'value' => [
                                        '_styles' => [
                                            'wrapper',
                                            'wrapper-postExcerpt',
                                            'wrapper-postExcerpt-posts',
                                            'wrapper-postExcerpt-posts-posts',
                                        ],
                                        'items' => [
                                            [
                                                'type' => 'WPPostExcerpt',
                                                'value' => [
                                                    '_styles' => [
                                                        'postExcerpt',
                                                        'postExcerpt-posts',
                                                        'postExcerpt-posts-posts',
                                                    ],
                                                ],
                                            ],
                                        ],
                                    ],
                                ],
                                [
                                    'type' => 'Cloneable',
                                    'value' => [
                                        '_styles' => [
                                            'wrapper-clone',
                                            'wrapper-clone--button',
                                        ],
                                        'items' => [
                                            [
                                                'type' => 'Button',
                                                'value' => [
                                                    '_styles' => [
                                                        'button',
                                                        'button--dynamic',
                                                    ],
                                                ],
                                            ],
                                        ],
                                    ],
                                ],
                            ],
                        ],
                    ],
                ],
            ]
        ];

        return $config;
    }

    private function getPostLoopSources($isTemplate, $wp_post_id, $context)
    {
        $types = get_post_types(['public' => true]);

        $typesSort = ['page', 'post', 'editor-story'];
        $excludePostTypes = ['page', 'post', 'editor-story', 'attachment'];

        $types = array_merge($typesSort, array_filter($types, function ($type) use ($excludePostTypes) {
            return !in_array($type, $excludePostTypes);
        }));

        $result = [];

        $templateTypeArchive = false;
        if ($isTemplate) {
            $template_type = Brizy_Admin_Templates::getTemplateType($wp_post_id);
            if ($template_type == Brizy_Admin_Templates::TYPE_ARCHIVE || $template_type == Brizy_Admin_Templates::TYPE_PRODUCT_ARCHIVE) {
                $templateTypeArchive = true;
            }

            $rule_manager = new Brizy_Admin_Rules_Manager();
            $template_rules = $rule_manager->getRules($wp_post_id);
            $isSearchTemplate = $this->isSearchTemplate($template_rules);
        }

        $orderBy = [
            ['field' => 'title', 'label' => __('Title', 'brizy')],
            ['field' => 'date', 'label' => __('Date', 'brizy')],
            ['field' => 'rand', 'label' => __('Random', 'brizy')],
            ['field' => 'comment_count', 'label' => __('Comment Count', 'brizy')]
        ];

        $orderBy = [
            ['title' => __('Title', 'brizy')],
            ['date' => __('Date', 'brizy')],
            ['rand' => __('Random', 'brizy')],
            ['comment_count' => __('Comment Count', 'brizy')]
        ];

        if ($templateTypeArchive) {
            $orderByCustom = $orderBy;
            if ($isSearchTemplate) {
                $orderByCustom = array_merge($orderBy, [['relevance' => __('Relevance', 'brizy')]]);
            }
            $result[] = [
                "name" => "brz_current_context",
                "label" => "Current Query",
                'orderBy' => $orderByCustom
            ];
        }

        foreach ($types as $type) {
            $typeObj = get_post_type_object($type);

            $typeDto = [
                'name' => $typeObj->name,
                'label' => $typeObj->label,
                'orderBy' => $orderBy
            ];
            $result[] = $typeDto;
        }

        return $result;
    }

    private function addLoopSourcesConfig($config, $isTemplate, $wp_post_id, $context)
    {
        $sources = $this->getPostLoopSources($isTemplate, $wp_post_id, $context);

        # as stated in this issue: https://github.com/bagrinsergiu/blox-editor/issues/21795
        # we have to add in config the post sources
        $config['posts']['sources'] = array_map(function ($source) {
            return [
                'value' => $source['name'],
                'title' => $source['label']
            ];
        }, $sources);

        return $config;
    }

    private function addLoopSourcesClientConfig($config, $isTemplate, $wp_post_id, $context)
    {
        $sources = $this->getPostLoopSources($isTemplate, $wp_post_id, $context);
        $config['collectionTypes'] = $sources;

        return $config;
    }

    private function addGlobalBlocksData($config)
    {

        $postTaxonomies = get_post_taxonomies($wp_post_id = (int)$config['wp']['page']);
        $postTerms = [];
        foreach ($postTaxonomies as $tax) {
            $postTerms = array_merge($postTerms, wp_get_post_terms($wp_post_id, $tax));
        }

        $postTermsByKeys = [];
        foreach ($postTerms as $term) {
            $postTermsByKeys[$term->term_id] = $term;
        }

        $config['wp']['postTerms'] = $postTerms;
        $config['wp']['postTermParents'] = array_values(array_diff_key($this->getAllParents($postTermsByKeys), $postTermsByKeys));
        $config['wp']['postAuthor'] = (int)$this->post->getWpPost()->post_author;

        return $config;
    }

    /**
     * @return object
     */
    private function get_page_attachments()
    {
        global $wpdb;
        $query = $wpdb->prepare(
            "SELECT 
					pm.*
				FROM 
					{$wpdb->prefix}postmeta pm 
				    JOIN {$wpdb->prefix}postmeta pm2 ON pm2.post_id=pm.post_id AND pm2.meta_key='brizy_post_uid' AND pm2.meta_value=%s
				WHERE pm.meta_key='brizy_attachment_uid'
				GROUP BY pm.post_id",
            $this->post->getUid()
        );

        $results = $wpdb->get_results($query);
        $attachment_data = array();
        foreach ($results as $row) {
            $attachment_data[$row->meta_value] = true;
        }

        return (object)$attachment_data;
    }

    /**
     * @return array|null
     */
    public static function get_woocomerce_plugin_info()
    {
        if (function_exists('wc') && defined('WC_PLUGIN_FILE')) {
            return array('version' => WooCommerce::instance()->version);
        }

        return null;
    }

    /**
     * @param $wp_post_id
     *
     * @return array|null
     */
    private function getThumbnailData($wp_post_id)
    {
        $post_thumbnail_id = get_post_thumbnail_id($wp_post_id);
        $post_thumbnail = "";

        if ($post_thumbnail_id) {
            $post_thumbnail_focal_point = get_post_meta($wp_post_id, 'brizy_attachment_focal_point', true);

            if (!is_array($post_thumbnail_focal_point)) {
                $post_thumbnail_focal_point = array('x' => "", 'y' => "");
            }

            $post_thumbnail = array(
                'id' => $post_thumbnail_id,
                'url' => get_the_post_thumbnail_url($wp_post_id),
                'pointX' => isset($post_thumbnail_focal_point['x']) ? $post_thumbnail_focal_point['x'] : "",
                'pointY' => isset($post_thumbnail_focal_point['y']) ? $post_thumbnail_focal_point['y'] : "",
            );
        }

        return $post_thumbnail;
    }

    private function getAllParents($terms)
    {
        $result = [];
        foreach ($terms as $i => $term) {
            foreach ($this->getTermParents($term) as $aTerm) {
                if (!isset($result[$aTerm->term_id])) {
                    $result[$aTerm->term_id] = $aTerm;
                }
            }
        }

        return $result;
    }

    private function getTermParents($term)
    {
        $parents = [];
        if ($term->parent) {
            $parent = get_term_by('id', $term->parent, $term->taxonomy);

            if ($parent) {
                $parents[$parent->term_id] = $parent;
                if ($parent->parent > 0) {
                    $parents = array_merge($parents, $this->getTermParents($parent));
                }
            }
        }

        return $parents;
    }

    /**
     * @param $wp_post
     *
     * @return null|string
     * @throws Brizy_Editor_Exceptions_NotFound
     * @throws Brizy_Editor_Exceptions_UnsupportedPostType
     */
    private function getPreviewUrl($wp_post)
    {

        if ($wp_post->post_type == Brizy_Admin_Templates::CP_TEMPLATE) {

            $ruleManager = new Brizy_Admin_Rules_Manager();
            $rules = $ruleManager->getRules($wp_post->ID);
            $rule = null;


            if (!function_exists('addQueryStringToUrl')) {
                function addQueryStringToUrl($link, $query)
                {
                    $parsedUrl = parse_url($link);
                    $separator = (!isset($parsedUrl['query']) || $parsedUrl['query'] == null) ? '?' : '&';
                    $link .= $separator . $query;

                    return $link;
                }
            }


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
                    case Brizy_Admin_Rule::WOO_SHOP_PAGE:
                        if (function_exists('wc_get_page_id') && wc_get_page_id('shop')) {
                            $wp_post = get_post(wc_get_page_id('shop'));
                        }
                        break;
                    case  Brizy_Admin_Rule::POSTS :
                        $args = array(
                            'post_type' => $rule->getEntityType(),
                        );

                        if (count($rule->getEntityValues())) {
                            $args['post__in'] = $rule->getEntityValues();
                        }

                        $array = get_posts($args);

                        foreach ($array as $p) {

                            if ($p->post_type == 'attachment') {
                                return addQueryStringToUrl(get_attachment_link($p->ID), 'preview=1');
                            }

                            if (!Brizy_Editor::checkIfPostTypeIsSupported($p->ID, false) ||
                                !Brizy_Editor_Entity::isBrizyEnabled($p->ID)) {
                                $wp_post = $p;
                                break;
                            }

                        }
                        break;
                    case Brizy_Admin_Rule::TAXONOMY :
                        $args = array(
                            'taxonomy' => $rule->getEntityType(),
                            'hide_empty' => true,
                        );
                        if (count($rule->getEntityValues())) {
                            $args['term_taxonomy_id'] = $rule->getEntityValues();
                        }

                        $array = get_terms($args);

                        if (count($array) == 0) {
                            break;
                        }
                        $term = array_pop($array);
                        $link = get_term_link($term);

                        return addQueryStringToUrl($link, 'preview=1');
                        break;
                    case  Brizy_Admin_Rule::ARCHIVE :
                        if ($rule->getEntityType()) {
                            $link = get_post_type_archive_link($rule->getEntityType());

                            return addQueryStringToUrl($link, 'preview=1');
                        }

                        $link = $this->getOneArchiveLink();

                        return addQueryStringToUrl($link, 'preview=1');
                        break;
                    case  Brizy_Admin_Rule::TEMPLATE :

                        //  array( 'title' => 'Author page', 'value' => 'author', 'groupValue' => Brizy_Admin_Rule::TEMPLATE ),
                        //  array( 'title' => 'Search page', 'value' => 'search', 'groupValue' => Brizy_Admin_Rule::TEMPLATE ),
                        //  array( 'title' => 'Home page', 'value' => 'front_page', 'groupValue' => Brizy_Admin_Rule::TEMPLATE ),
                        //  array( 'title' => '404 page', 'value' => '404', 'groupValue' => Brizy_Admin_Rule::TEMPLATE ),
                        //  array( 'title' => 'Archive page', 'value' => '', 'groupValue' => Brizy_Admin_Rule::ARCHIVE ),
                        switch ($rule->getEntityType()) {
                            case 'author':
                                $authors = get_users();
                                $author = array_pop($authors);
                                $link = get_author_posts_url($author->ID);

                                return addQueryStringToUrl($link, 'preview=1');
                                break;

                            case 'search':
                                return addQueryStringToUrl(get_search_link('find-me'), 'preview=1');
                                break;
                            case '404':
                                return addQueryStringToUrl(get_home_url(null, (string)time()), 'preview=1');
                                break;
                            case 'home_page':
                                $get_option = get_option('page_for_posts');

                                if ($get_option) {
                                    return addQueryStringToUrl(get_permalink($get_option), 'preview=1');
                                }
                                break;
                            case 'front_page':
                                return addQueryStringToUrl(home_url(), 'preview=1');
                                break;
                        }

                        break;
                }

            }
        }

        return get_preview_post_link(
            $wp_post,
            array(
                'preview_id' => $wp_post->ID,
                'preview_nonce' => wp_create_nonce('post_preview_' . $wp_post->ID),
            )
        );
    }

    /**
     * @return array
     */
    private function get_menu_data()
    {
        $menus = wp_get_nav_menus();
        $menu_data = array();

        foreach ($menus as $menu) {

            $custom_menu_data = get_term_meta($menu->term_id, 'brizy_data', true);

            $menu_uid = get_term_meta($menu->term_id, 'brizy_uid', true);
            if (!$menu_uid) {
                $menu_uid = md5($menu->term_id . time());
                update_term_meta($menu->term_id, 'brizy_uid', $menu_uid);
            }

            $amenu = array(
                'id' => $menu_uid,
                'name' => $menu->name,
                'items' => array(),
            );

            $amenu = (object)array_merge(
                $amenu,
                get_object_vars(is_object($custom_menu_data) ? $custom_menu_data : (object)array())
            );

            $menuItems = [];

            add_action('wp_get_nav_menu_items', function ($items) use (&$menuItems) {
                foreach ($items as $item) {
                    $menuItems[$item->ID] = $item;
                }

                return $items;
            }, -1000);

            $currentItems = wp_get_nav_menu_items($menu->term_id);

            _wp_menu_item_classes_by_context($menuItems);

            $currentItemsAssociative = [];
            foreach ($currentItems as $currentItem) {
                $currentItemsAssociative[$currentItem->ID] = $currentItem;
            }

            $menuItems = $currentItemsAssociative + $menuItems;

            $menu_items = $this->get_menu_tree($menuItems);

            if (count($menu_items) > 0) {
                $amenu->items = $menu_items;
            }

            $menu_data[] = $amenu;
        }

        return apply_filters('brizy_menu_data', $menu_data);
    }

    /**
     * @param $items
     * @param int $parent
     *
     * @return array
     */
    private function get_menu_tree($items, $parent = 0)
    {
        $result_items = array();

        foreach ($items as $item) {
            if ((string)$item->menu_item_parent !== (string)$parent) {
                continue;
            }

            $menu_uid = get_post_meta($item->ID, 'brizy_post_uid', true);

            if (!$menu_uid) {
                $menu_uid = md5($item->ID . time());
                $update = update_post_meta($item->ID, 'brizy_post_uid', $menu_uid);

                if (!$update) {
                    $menu_uid = $item->ID;
                }
            }

            $megaMenuItems = $this->getMegaMenuItems();

            $menu_data = get_post_meta($item->ID, 'brizy_data', true);

            $item_value = array(
                'id' => $menu_uid,
                'title' => $item->title,
                'url' => $item->url,
                'megaMenuItems' => $megaMenuItems,
                'description' => $item->post_content,
                'position' => $item->menu_order,
                'attrTitle' => $item->post_excerpt,
                'current' => count(
                        array_intersect(
                            [
                                'current-menu-parent',
                                'current-menu-item',
                            ],
                            $item->classes
                        )
                    ) > 0,
                'target' => get_post_meta($item->ID, '_menu_item_target', true),
                'classes' => array_values(array_filter($item->classes)),
                'xfn' => get_post_meta($item->ID, '_menu_item_xfn', true),
            );

            $an_item = (object)array(
                'type' => 'MenuItem',
            );

            $an_item->value = (object)array_merge(
                $item_value,
                get_object_vars(is_object($menu_data) ? $menu_data : (object)array())
            );

            $child_items = $this->get_menu_tree($items, $item->ID);

            $an_item->value->items = array();

            if (count($child_items) > 0) {
                $an_item->value->items = $child_items;
            }

            $result_items[] = $an_item;
        }

        return $result_items;
    }

    /**
     * @return array
     */
    private function getMegaMenuItems()
    {

        return array(
            (object)(array(
                'type' => "SectionMegaMenu",
                'value' => (object)array('items' => array()),
            )),
        );
    }

    /**
     * @param Brizy_Editor_Accounts_ServiceAccountManager $manager
     * @param array $config
     *
     * @return array
     */
    private function addRecaptchaAccounts(Brizy_Editor_Accounts_ServiceAccountManager $manager, array $config, $context)
    {
        $accounts = $manager->getAccountsByGroup(Brizy_Editor_Accounts_AbstractAccount::RECAPTCHA_GROUP);

        if (isset($accounts[0]) && $accounts[0] instanceof Brizy_Editor_Accounts_RecaptchaAccount) {
            $config['applications']['form']['recaptcha']['siteKey'] = $accounts[0]->getSiteKey();
        }

        return $config;
    }

    /**
     * @param Brizy_Editor_Accounts_ServiceAccountManager $manager
     * @param array $config
     *
     * @return array
     */
    private function addSocialAccounts(Brizy_Editor_Accounts_ServiceAccountManager $manager, array $config, $context)
    {
        $accounts = $manager->getAccountsByGroup(Brizy_Editor_Accounts_AbstractAccount::SOCIAL_GROUP);

        foreach ($accounts as $account) {
            if (isset($account) && $account instanceof Brizy_Editor_Accounts_SocialAccount) {
                $config['applications'][$account->getGroup()][] = $account->convertToOptionValue();
            }
        }

        return $config;
    }


    private function fileUploadMaxSize()
    {
        static $max_size = -1;

        if ($max_size < 0) {
            // Start with post_max_size.
            $post_max_size = $this->parseSize(ini_get('post_max_size'));
            if ($post_max_size > 0) {
                $max_size = number_format($post_max_size / 1048576, 2, '.', '');
            }

            // If upload_max_size is less, then reduce. Except if upload_max_size is
            // zero, which indicates no limit.
            $upload_max = $this->parseSize(ini_get('upload_max_filesize'));
            if ($upload_max > 0 && $upload_max < $max_size) {
                $max_size = number_format($upload_max / 1048576, 2, '.', '');
            }
        }

        return $max_size;
    }

    private function parseSize($size)
    {
        $unit = preg_replace('/[^bkmgtpezy]/i', '', $size); // Remove the non-unit characters from the size.
        $size = preg_replace('/[^0-9\.]/', '', $size); // Remove the non-numeric characters from the size.
        if ($unit) {
            // Find the position of the unit in the ordered string which is the power of magnitude to multiply a kilobyte by.
            return round($size * pow(1024, stripos('bkmgtpezy', $unit[0])));
        } else {
            return round($size);
        }
    }


    private function getOneArchiveLink($args = '')
    {
        global $wpdb, $wp_locale;

        $defaults = array(
            'type' => 'monthly',
            'limit' => '',
            'order' => 'DESC',
            'post_type' => 'post',
            'year' => get_query_var('year'),
            'monthnum' => get_query_var('monthnum'),
            'day' => get_query_var('day'),
            'w' => get_query_var('w'),
        );

        $r = wp_parse_args($args, $defaults);

        $post_type_object = get_post_type_object($r['post_type']);
        if (!is_post_type_viewable($post_type_object)) {
            return;
        }
        $r['post_type'] = $post_type_object->name;

        if ('' == $r['type']) {
            $r['type'] = 'monthly';
        }

        if (!empty($r['limit'])) {
            $r['limit'] = absint($r['limit']);
            $r['limit'] = ' LIMIT ' . $r['limit'];
        }

        $order = strtoupper($r['order']);
        if ($order !== 'ASC') {
            $order = 'DESC';
        }

        // this is what will separate dates on weekly archive links
        $archive_week_separator = '&#8211;';

        $sql_where = $wpdb->prepare("WHERE post_type = %s AND post_status = 'publish'", $r['post_type']);

        /**
         * Filters the SQL WHERE clause for retrieving archives.
         *
         * @param string $sql_where Portion of SQL query containing the WHERE clause.
         * @param array $r An array of default arguments.
         *
         * @since 2.2.0
         *
         */
        $where = apply_filters('getarchives_where', $sql_where, $r);

        /**
         * Filters the SQL JOIN clause for retrieving archives.
         *
         * @param string $sql_join Portion of SQL query containing JOIN clause.
         * @param array $r An array of default arguments.
         *
         * @since 2.2.0
         *
         */
        $join = apply_filters('getarchives_join', '', $r);

        $output = '';

        $last_changed = wp_cache_get_last_changed('posts');

        $limit = $r['limit'];

        if ('monthly' == $r['type']) {
            $query = "SELECT YEAR(post_date) AS `year`, MONTH(post_date) AS `month`, count(ID) as posts FROM $wpdb->posts $join $where GROUP BY YEAR(post_date), MONTH(post_date) ORDER BY post_date $order $limit";
            $key = md5($query);
            $key = "wp_get_archives:$key:$last_changed";
            if (!$results = wp_cache_get($key, 'posts')) {
                $results = $wpdb->get_results($query);
                wp_cache_set($key, $results, 'posts');
            }
            if ($results) {
                foreach ((array)$results as $result) {
                    $url = get_month_link($result->year, $result->month);
                    if ('post' !== $r['post_type']) {
                        $url = add_query_arg('post_type', $r['post_type'], $url);
                    }

                    return $url;
                }
            }
        }
    }

    /**
     * @return string
     * @throws Exception
     */
    private function getTexts()
    {
        if (BRIZY_DEVELOPMENT) {
            $brizy_public_editor_build_texts = '\Brizy_Public_EditorBuild_Dev_Texts';
        } else {
            $version = '';
            foreach (explode('-', BRIZY_EDITOR_VERSION) as $tmp) {
                $version .= ucfirst($tmp);
            }
            $brizy_public_editor_build_texts = '\Brizy_Public_EditorBuild_' . $version . '_Texts';
        }

        if (!class_exists($brizy_public_editor_build_texts)) {
            if (BRIZY_DEVELOPMENT) {
                throw new \Exception('You must build the editor first.');
            } else {
                throw new \Exception('Unable to find class ' . $brizy_public_editor_build_texts);
            }
        }

        return (object)$brizy_public_editor_build_texts::get_editor_texts();
    }

    private function addTemplateFields($config, $is_template, $wp_post_id, $context)
    {

        $template_rules = [];
        if ($is_template) {
            $rule_manager = new Brizy_Admin_Rules_Manager();
            $template_rules = $rule_manager->getRules($wp_post_id);
            $config['template_type'] = $this->getTemplateType($template_rules);
        }

        $config['wp']['ruleMatches'] = $this->getTemplateRuleMatches($is_template, $wp_post_id, $template_rules);

        return $config;
    }

    /**
     * @param $isTemplate
     * @param $wpPostId
     * @param $templateRules
     *
     * @return array
     */
    private function getTemplateRuleMatches($isTemplate, $wpPostId, $templateRules)
    {

        $ruleMatches = array();

        if ($isTemplate) {

            foreach ($templateRules as $rule) {
                /**
                 * @var Brizy_Admin_Rule $rule ;
                 */
                $ruleMatches[] = array(
                    'type' => $rule->getType(),
                    'group' => $rule->getAppliedFor(),
                    'entityType' => $rule->getEntityType(),
                    'values' => $rule->getEntityValues(),
                );
            }
            $ruleMatches[] = array(
                'type' => Brizy_Admin_Rule::TYPE_INCLUDE,
                'group' => Brizy_Admin_Rule::BRIZY_TEMPLATE,
                'entityType' => $this->post->getWpPost()->post_type,
                'values' => array($wpPostId),
            );
        } else {
            $ruleMatches[] = array(
                'type' => Brizy_Admin_Rule::TYPE_INCLUDE,
                'group' => Brizy_Admin_Rule::POSTS,
                'entityType' => $this->post->getWpPost()->post_type,
                'values' => array($wpPostId),
            );
        }

        return $ruleMatches;
    }


    /**
     *
     * @param $template_rules
     */
    private function getTemplateType($template_rules)
    {
        foreach ($template_rules as $rule) {

            if ($rule->getType() != Brizy_Admin_Rule::TYPE_INCLUDE) {
                continue;
            }

            // single mode
            if ($rule->getAppliedFor() == Brizy_Admin_Rule::POSTS) {
                if ($rule->getEntityType() == 'product') {
                    return 'product';
                } else {
                    return 'single';
                }
            }


            // single mode
            if ($rule->getAppliedFor() == Brizy_Admin_Rule::TEMPLATE) {
                if (in_array($rule->getEntityType(), ['404', 'front_page'])) {
                    return 'single';
                }

                if (in_array($rule->getEntityType(), ['search', 'author', 'home_page'])) {
                    return 'archive';
                }
            }

            // archive mode
            if ($rule->getAppliedFor() == Brizy_Admin_Rule::TAXONOMY) {
                if (in_array($rule->getEntityType(), ['product_cat', 'product_tag'])) {
                    return 'product_archive';
                }
                if (in_array($rule->getEntityType(), ['category', 'post_tag',])) {
                    return 'archive';
                }
            }

            // product archive mode
            if (in_array($rule->getAppliedFor(), [
                Brizy_Admin_Rule::ARCHIVE,
                Brizy_Admin_Rule::DATE_ARCHIVE,
                Brizy_Admin_Rule::DAY_ARCHIVE,
                Brizy_Admin_Rule::MONTH_ARCHIVE,
                Brizy_Admin_Rule::YEAR_ARCHIVE,
                Brizy_Admin_Rule::TAXONOMY,
                Brizy_Admin_Rule::WOO_SHOP_PAGE,
            ])) {
                if ($rule->getAppliedFor() == Brizy_Admin_Rule::WOO_SHOP_PAGE && in_array($rule->getEntityType(), [
                        'product',
                        'shop_page',
                    ])) {
                    return 'product_archive';
                } else {
                    return 'archive';
                }
            }
        }

        return '';
    }


    private function isSearchTemplate($template_rules)
    {
        foreach ($template_rules as $rule) {

            if ($rule->getType() != Brizy_Admin_Rule::TYPE_INCLUDE) {
                continue;
            }


            // single mode
            if ($rule->getAppliedFor() == Brizy_Admin_Rule::TEMPLATE) {

                if ($rule->getEntityType() == 'search') {
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * @return array
     */
    public function getProjectStatus()
    {
        $projectLockedBy = Brizy_Editor::get()->checkIfProjectIsLocked();
        $userData = WP_User::get_data_by('id', $projectLockedBy);
        unset($userData->user_pass);
        unset($userData->user_registered);
        unset($userData->user_status);
        unset($userData->user_activation_key);

        return [
            'locked' => $projectLockedBy !== false,
            'lockedBy' => $userData,
        ];
    }

    /**
     * @return array
     */
    public function getApiActions($config = [], $context = null)
    {

        $pref = Brizy_Editor::prefix();

        $actions = array(
            'hash' => wp_create_nonce(Brizy_Editor_API::nonce),
            'url' => set_url_scheme(admin_url('admin-ajax.php')),
            'heartBeat' => $pref . Brizy_Editor_API::AJAX_HEARTBEAT,
            'takeOver' => $pref . Brizy_Editor_API::AJAX_TAKE_OVER,
            'lockProject' => $pref . Brizy_Editor_API::AJAX_LOCK_PROJECT,
            'removeLock' => $pref . Brizy_Editor_API::AJAX_REMOVE_LOCK,
            'getPage' => $pref . Brizy_Editor_API::AJAX_GET,
            'getPostInfo' => $pref . Brizy_Editor_API::AJAX_GET_POST_INFO,
            'updatePage' => $pref . Brizy_Editor_API::AJAX_UPDATE,
            'getProject' => $pref . Brizy_Editor_API::AJAX_GET_PROJECT,
            'setProject' => $pref . Brizy_Editor_API::AJAX_SET_PROJECT,
            'setProjectMeta' => $pref . Brizy_Editor_API::AJAX_UPDATE_EDITOR_META_DATA,
            'getGlobalBlockList' => $pref . Brizy_Admin_Blocks_Api::GET_GLOBAL_BLOCKS_ACTION,
            'createGlobalBlock' => $pref . Brizy_Admin_Blocks_Api::CREATE_GLOBAL_BLOCK_ACTION,
            'updateGlobalBlock' => $pref . Brizy_Admin_Blocks_Api::UPDATE_GLOBAL_BLOCK_ACTION,
            'updateGlobalBlocks' => $pref . Brizy_Admin_Blocks_Api::UPDATE_GLOBAL_BLOCKS_ACTION,
            'deleteGlobalBlock' => $pref . Brizy_Admin_Blocks_Api::DELETE_GLOBAL_BLOCK_ACTION,
            'getRuleGroupList' => $pref . Brizy_Admin_Rules_Api::RULE_GROUP_LIST,
            'getLayoutByUid' => $pref . Brizy_Admin_Layouts_Api::GET_LAYOUT_BY_UID_ACTION,
            'getLayoutList' => $pref . Brizy_Admin_Layouts_Api::GET_LAYOUTS_ACTION,
            'createLayout' => $pref . Brizy_Admin_Layouts_Api::CREATE_LAYOUT_ACTION,
            'updateLayout' => $pref . Brizy_Admin_Layouts_Api::UPDATE_LAYOUT_ACTION,
            'deleteLayout' => $pref . Brizy_Admin_Layouts_Api::DELETE_LAYOUT_ACTION,
            'cloudSignIn' => $pref . Brizy_Admin_Cloud_Api::AJAX_SIGNIN_ACTION,
            'cloudSignUp' => $pref . Brizy_Admin_Cloud_Api::AJAX_SIGNUP_ACTION,
            'cloudSignOut' => $pref . Brizy_Admin_Cloud_Api::AJAX_SIGNOUT_ACTION,
            'cloudSyncAllowed' => $pref . Brizy_Admin_Cloud_Api::AJAX_SYNC_ALLOWED,
            'cloudResetPassword' => $pref . Brizy_Admin_Cloud_Api::AJAX_RESET_PASSWORD_ACTION,
            'cloudSync' => $pref . Brizy_Admin_Cloud_Api::AJAX_TRIGGER_SYNC_ACTION,
            'createRule' => $pref . Brizy_Admin_Rules_Api::CREATE_RULE_ACTION,
            'createRules' => $pref . Brizy_Admin_Rules_Api::CREATE_RULES_ACTION,
            'updateRules' => $pref . Brizy_Admin_Rules_Api::UPDATE_RULES_ACTION,
            'deleteRule' => $pref . Brizy_Admin_Rules_Api::DELETE_RULE_ACTION,
            'getRuleList' => $pref . Brizy_Admin_Rules_Api::LIST_RULE_ACTION,
            'updateBlockPositions' => $pref . Brizy_Admin_Blocks_Api::UPDATE_POSITIONS_ACTION,
            'getSavedBlockByUid' => $pref . Brizy_Admin_Blocks_Api::GET_SAVED_BLOCK_ACTION,
            'getSavedBlockList' => $pref . Brizy_Admin_Blocks_Api::GET_SAVED_BLOCKS_ACTION,
            'createSavedBlock' => $pref . Brizy_Admin_Blocks_Api::CREATE_SAVED_BLOCK_ACTION,
            'updateSavedBlock' => $pref . Brizy_Admin_Blocks_Api::UPDATE_SAVED_BLOCK_ACTION,
            'deleteSavedBlock' => $pref . Brizy_Admin_Blocks_Api::DELETE_SAVED_BLOCK_ACTION,
            'downloadBlocks' => $pref . Brizy_Admin_Blocks_Api::DOWNLOAD_BLOCKS,
            'uploadBlocks' => $pref . Brizy_Admin_Blocks_Api::UPLOAD_BLOCKS,
            'downloadLayouts' => $pref . Brizy_Admin_Layouts_Api::DOWNLOAD_LAYOUTS,
            'uploadLayouts' => $pref . Brizy_Admin_Layouts_Api::UPLOAD_LAYOUTS,
            'media' => $pref . Brizy_Editor_API::AJAX_MEDIA,
            'getMediaUid' => $pref . Brizy_Editor_API::AJAX_MEDIA_METAKEY,
            'getAttachmentUid' => $pref . Brizy_Editor_API::AJAX_CREATE_ATTACHMENT_UID,
            'getServerTimeStamp' => $pref . Brizy_Editor_API::AJAX_TIMESTAMP,
            'createBlockScreenshot' => $pref . Brizy_Editor_BlockScreenshotApi::AJAX_CREATE_BLOCK_SCREENSHOT,
            'updateBlockScreenshot' => $pref . Brizy_Editor_BlockScreenshotApi::AJAX_UPDATE_BLOCK_SCREENSHOT,
            'getSidebars' => $pref . Brizy_Editor_API::AJAX_SIDEBARS,
            'shortcodeContent' => $pref . Brizy_Editor_API::AJAX_SHORTCODE_CONTENT,
            'placeholderContent' => $pref . Brizy_Editor_API::AJAX_PLACEHOLDER_CONTENT,
            'placeholdersContent' => $pref . Brizy_Editor_API::AJAX_PLACEHOLDERS_CONTENT,
            'getPostTaxonomies' => $pref . Brizy_Editor_API::AJAX_GET_POST_TAXONOMIES,
            'getMenus' => $pref . Brizy_Editor_API::AJAX_GET_MENU_LIST,
            'getTerms' => $pref . Brizy_Editor_API::AJAX_GET_TERMS,
            'getTermsBy' => $pref . Brizy_Editor_API::AJAX_GET_TERMS_BY,
            'getUsers' => $pref . Brizy_Editor_API::AJAX_GET_USERS,
            'getPostObjects' => $pref . Brizy_Editor_API::AJAX_GET_POST_OBJECTS, // ???
            'searchPosts' => $pref . Brizy_Editor_API::AJAX_SEARCH_POST,
            'setFeaturedImage' => $pref . Brizy_Editor_API::AJAX_SET_FEATURED_IMAGE,
            'setFeaturedImageFocalPoint' => $pref . Brizy_Editor_API::AJAX_SET_IMAGE_FOCAL_PT,
            'removeFeaturedImage' => $pref . Brizy_Editor_API::AJAX_REMOVE_FEATURED_IMAGE,
            'getForm' => $pref . Brizy_Editor_Forms_Api::AJAX_GET_FORM,
            'createForm' => $pref . Brizy_Editor_Forms_Api::AJAX_CREATE_FORM,
            'updateForm' => $pref . Brizy_Editor_Forms_Api::AJAX_UPDATE_FORM,
            'deleteForm' => $pref . Brizy_Editor_Forms_Api::AJAX_DELETE_FORM,
            'getIntegration' => $pref . Brizy_Editor_Forms_Api::AJAX_GET_INTEGRATION,
            'createIntegration' => $pref . Brizy_Editor_Forms_Api::AJAX_CREATE_INTEGRATION,
            'updateIntegration' => $pref . Brizy_Editor_Forms_Api::AJAX_UPDATE_INTEGRATION,
            'deleteIntegration' => $pref . Brizy_Editor_Forms_Api::AJAX_DELETE_INTEGRATION,
            'createFont' => $pref . Brizy_Admin_Fonts_Api::AJAX_CREATE_FONT_ACTION,
            'deleteFont' => $pref . Brizy_Admin_Fonts_Api::AJAX_DELETE_FONT_ACTION,
            'getFonts' => $pref . Brizy_Admin_Fonts_Api::AJAX_GET_FONTS_ACTION,
            'getAccount' => $pref . Brizy_Editor_Accounts_Api::BRIZY_GET_ACCOUNT,
            'getAccounts' => $pref . Brizy_Editor_Accounts_Api::BRIZY_GET_ACCOUNTS,
            'addAccount' => $pref . Brizy_Editor_Accounts_Api::BRIZY_ADD_ACCOUNT,
            'updateAccount' => $pref . Brizy_Editor_Accounts_Api::BRIZY_UPDATE_ACCOUNT,
            'deleteAccount' => $pref . Brizy_Editor_Accounts_Api::BRIZY_DELETE_ACCOUNT,
            'validateRecaptchaAccount' => $pref . Brizy_Editor_Forms_Api::AJAX_VALIDATE_RECAPTCHA_ACCOUNT,
            'rulePostsGroupList' => $pref . Brizy_Admin_Rules_Api::RULE_POSTS_GROUP_LIST,
            'ruleArchiveGroupList' => $pref . Brizy_Admin_Rules_Api::RULE_ARCHIVE_GROUP_LIST,
            'ruleTemplateGroupList' => $pref . Brizy_Admin_Rules_Api::RULE_TEMPLATE_GROUP_LIST,
            'symbolCreate' => $pref . Brizy_Admin_Symbols_Api::CREATE_ACTION,
            'symbolUpdate' => $pref . Brizy_Admin_Symbols_Api::UPDATE_ACTION,
            'symbolDelete' => $pref . Brizy_Admin_Symbols_Api::DELETE_ACTION,
            'symbolList' => $pref . Brizy_Admin_Symbols_Api::LIST_ACTION,
            'getDynamicContentPlaceholders' => $pref . Brizy_Editor_API::AJAX_GET_DYNAMIC_CONTENT,
        );

        return $actions;
    }

    /**
     * @return array
     * @throws Exception
     */
    public function getCloudInfo()
    {
        // the cloud will be always initialized with the exception when the white label is enabled
        // we wil return isSyncAllowed =  false just in case
        if (class_exists('BrizyPro_Admin_WhiteLabel') && BrizyPro_Admin_WhiteLabel::_init()->getEnabled()) {
            return array(
                'isSyncAllowed' => false,
            );
        }

        $response = array(
            'isSyncAllowed' => true,
        );

        if ($this->project->getMetaValue('brizy-cloud-token') !== null) {
            try {
                $cloudClient = Brizy_Admin_Cloud_Client::instance(
                    Brizy_Editor_Project::get(),
                    new WP_Http()
                );
                $versions = $cloudClient->getCloudEditorVersions();
                $response['isSyncAllowed'] = $versions['sync'] == BRIZY_SYNC_VERSION;
            } catch (Exception $e) {
                return ['isSyncAllowed' => false];
            }
        }

        return $response;
    }

    /**
     * Do not use: $userId = get_post_meta( $this->post->getWpPostId(), '_edit_last', true );
     * This meta _edit_last is often deleted by plugins dealing with optimize database
     *
     * @param $context
     *
     * @return bool
     */
    private function isUserAllowedToAddScripts($context)
    {

        if ($context == self::COMPILE_CONTEXT) {

            $userId = $this->post->getLastUserEdited();

            if ($userId === null) {
                return true;
            }

        } else {
            $userId = get_current_user_id();
        }

        $userCan = user_can($userId, 'unfiltered_html');

        return $userCan;
    }

    private function getImgSizes()
    {

        $sizes = [];

        foreach (Brizy_Editor::get_all_image_sizes() as $name => $size) {
            if (isset($size['crop'])) {
                unset($size['crop']);
            }
            $size['name'] = $name;
            $sizes[] = $size;
        }

        return $sizes;
    }

    private function getEditorHelpVideos($sourceUrl)
    {

        $categoryVideos = [
            __('Get Started', 'brizy') => [
                [
                    'title' => __('Builder Overview', 'brizy'),
                    'url' => $sourceUrl . '/1.+GET+STARTED/' . '1.+Builder+Overview.mp4'
                ],
                [
                    'title' => __('How to Build a Page', 'brizy'),
                    'url' => $sourceUrl . '/1.+GET+STARTED/' . '2.+How+to+Build+a+Page.mp4'
                ],
                [
                    'title' => __('Preview Publish Update', 'brizy'),
                    'url' => $sourceUrl . '/1.+GET+STARTED/' . '3.+Preview,+publish+&+update.mp4'
                ],
                [
                    'title' => __('Free vs PRO', 'brizy'),
                    'url' => $sourceUrl . '/1.+GET+STARTED/' . '4.+Fress+vs+PRO.mp4'
                ]
            ],
            __('The Basics', 'brizy') => [
                ['title' => __('Blocks', 'brizy'), 'url' => $sourceUrl . '/2.+THE+BASICS/' . '1.+Blocks.mp4'],
                [
                    'title' => __('Saved Blocks & Layouts', 'brizy'),
                    'url' => $sourceUrl . '/2.+THE+BASICS/' . '2.+Save+Blocks+&+Layouts.mp4'
                ],
                [
                    'title' => __('Premade Layouts', 'brizy'),
                    'url' => $sourceUrl . '/2.+THE+BASICS/' . '3.+Premade+Layouts.mp4'
                ],
                [
                    'title' => __('The Elements', 'brizy'),
                    'url' => $sourceUrl . '/2.+THE+BASICS/' . '4.+The+Elements.mp4'
                ],
                [
                    'title' => __('Reorder Blocks', 'brizy'),
                    'url' => $sourceUrl . '/2.+THE+BASICS/' . '5.+Reorder+Blocks.mp4'
                ],
                [
                    'title' => __('Global Styling', 'brizy'),
                    'url' => $sourceUrl . '/2.+THE+BASICS/' . '6.+Global+Styling.mp4'
                ],
                ['title' => __('Links', 'brizy'), 'url' => $sourceUrl . '/2.+THE+BASICS/' . '7.+Links.mp4'],
                ['title' => __('Fonts', 'brizy'), 'url' => $sourceUrl . '/2.+THE+BASICS/' . '8.+Fonts.mp4'],
                [
                    'title' => __('Paddings & Margins', 'brizy'),
                    'url' => $sourceUrl . '/2.+THE+BASICS/' . '9.+Paddings+&+Margins.mp4'
                ],
                [
                    'title' => __('Responsive Design', 'brizy'),
                    'url' => $sourceUrl . '/2.+THE+BASICS/' . '10.+Responsive+Design.mp4'
                ],
                [
                    'title' => __('Headers & Footers', 'brizy'),
                    'url' => $sourceUrl . '/2.+THE+BASICS/' . '11.+Headers+&+Footers.mp4'
                ],
                [
                    'title' => __('Menus & Navigation', 'brizy'),
                    'url' => $sourceUrl . '/2.+THE+BASICS/' . '12.+Menus+&+Navigation.mp4'
                ],
                [
                    'title' => __('Global Blocks & Conditions', 'brizy'),
                    'url' => $sourceUrl . '/2.+THE+BASICS/' . '13.+Global+Blocks+&+Conditions.mp4'
                ],
                [
                    'title' => __('Effects & Animations', 'brizy'),
                    'url' => $sourceUrl . '/2.+THE+BASICS/' . '14.+Effects+&+Animations.mp4'
                ]
            ],
            __('Dynamic Content', 'brizy') => [
                [
                    'title' => __('Dynamic Elements', 'brizy'),
                    'url' => $sourceUrl . '/3.+DYNAMIC+CONTENT/' . '1.+Dynamic+Elements.mp4'
                ]
            ],
            __('Users & Membership', 'brizy') => [
                [
                    'title' => __('Membership Blocks', 'brizy'),
                    'url' => $sourceUrl . '/4.+USERS+&+MEMBERSHIP+BLOCKS/' . '1.+Membership+Blocks.mp4'
                ]
            ],
            __('Marketing Tools', 'brizy') => [
                [
                    'title' => __('The Popup Builder', 'brizy'),
                    'url' => $sourceUrl . '/5.+MARKETING+TOOLS/' . '1.+The+Popup+Builder.mp4'
                ],
                [
                    'title' => __('Contact Form & Integrations', 'brizy'),
                    'url' => $sourceUrl . '/5.+MARKETING+TOOLS/' . '3.+Contact+Form+&+Integrations.mp4'
                ]
            ],
            __('Cool Features', 'brizy') => [
                [
                    'title' => __('Shortcuts', 'brizy'),
                    'url' => $sourceUrl . '/6.+COOL+FEATURES/' . '1.+Shortcuts.mp4'
                ],
                [
                    'title' => __('Import & Export', 'brizy'),
                    'url' => $sourceUrl . '/6.+COOL+FEATURES/' . '2.+Import+&+Export.mp4'
                ]
            ],
            __('The Elements', 'brizy') => [
                [
                    'title' => __('Rows & Columns', 'brizy'),
                    'url' => $sourceUrl . '/7.+THE+ELEMENTS/' . '1.+Rows+&+Columns.mp4'
                ],
                ['title' => __('Text', 'brizy'), 'url' => $sourceUrl . '/7.+THE+ELEMENTS/' . '2.+Text.mp4'],
                ['title' => __('Button', 'brizy'), 'url' => $sourceUrl . '/7.+THE+ELEMENTS/' . '3.+Button.mp4'],
                ['title' => __('Icon', 'brizy'), 'url' => $sourceUrl . '/7.+THE+ELEMENTS/' . '4.+Icon.mp4'],
                ['title' => __('Image', 'brizy'), 'url' => $sourceUrl . '/7.+THE+ELEMENTS/' . '5.+Image.mp4'],
                ['title' => __('Audio', 'brizy'), 'url' => $sourceUrl . '/7.+THE+ELEMENTS/' . '6.+Audio.mp4'],
                ['title' => __('Video', 'brizy'), 'url' => $sourceUrl . '/7.+THE+ELEMENTS/' . '7.+Video.mp4'],
                ['title' => __('Spacer', 'brizy'), 'url' => $sourceUrl . '/7.+THE+ELEMENTS/' . '8.+Spacer.mp4'],
                ['title' => __('Line', 'brizy'), 'url' => $sourceUrl . '/7.+THE+ELEMENTS/' . '9.+Line.mp4'],
                ['title' => __('Map', 'brizy'), 'url' => $sourceUrl . '/7.+THE+ELEMENTS/' . '10.+Map.mp4'],
                ['title' => __('Embed', 'brizy'), 'url' => $sourceUrl . '/7.+THE+ELEMENTS/' . '11.+Embed.mp4'],
                [
                    'title' => __('Icon Box', 'brizy'),
                    'url' => $sourceUrl . '/7.+THE+ELEMENTS/' . '12.+Icon+Box.mp4'
                ],
                ['title' => __('Counter', 'brizy'), 'url' => $sourceUrl . '/7.+THE+ELEMENTS/' . '13.+Counter.mp4'],
                [
                    'title' => __('Countdown', 'brizy'),
                    'url' => $sourceUrl . '/7.+THE+ELEMENTS/' . '14.+Countdown.mp4'
                ],
                ['title' => __('Tabs', 'brizy'), 'url' => $sourceUrl . '/7.+THE+ELEMENTS/' . '15.+Tabs.mp4'],
                [
                    'title' => __('Progress', 'brizy'),
                    'url' => $sourceUrl . '/7.+THE+ELEMENTS/' . '16.+Progress.mp4'
                ],
                [
                    'title' => __('Accordion', 'brizy'),
                    'url' => $sourceUrl . '/7.+THE+ELEMENTS/' . '17.+Accordion.mp4'
                ],
                ['title' => __('Menu', 'brizy'), 'url' => $sourceUrl . '/7.+THE+ELEMENTS/' . '18.+Menu.mp4'],
                ['title' => __('Gallery', 'brizy'), 'url' => $sourceUrl . '/7.+THE+ELEMENTS/' . '19.+Gallery.mp4'],
                [
                    'title' => __('Carousel', 'brizy'),
                    'url' => $sourceUrl . '/7.+THE+ELEMENTS/' . '20.+Carousel.mp4'
                ],
                ['title' => __('Rating', 'brizy'), 'url' => $sourceUrl . '/7.+THE+ELEMENTS/' . '21.+Rating.mp4'],
                [
                    'title' => __('Playlist', 'brizy'),
                    'url' => $sourceUrl . '/7.+THE+ELEMENTS/' . '22.+Playlist.mp4'
                ],
                ['title' => __('Table', 'brizy'), 'url' => $sourceUrl . '/7.+THE+ELEMENTS/' . '23.+Table.mp4'],
                [
                    'title' => __('Timeline', 'brizy'),
                    'url' => $sourceUrl . '/7.+THE+ELEMENTS/' . '24.+Timeline.mp4'
                ],
                [
                    'title' => __('Switcher', 'brizy'),
                    'url' => $sourceUrl . '/7.+THE+ELEMENTS/' . '25.+Switcher.mp4'
                ],
                ['title' => __('Lottie', 'brizy'), 'url' => $sourceUrl . '/7.+THE+ELEMENTS/' . '26.+Lottie.mp4'],
                [
                    'title' => __('Login/register', 'brizy'),
                    'url' => $sourceUrl . '/7.+THE+ELEMENTS/' . '27.+Login+&+Register.mp4'
                ],
                [
                    'title' => __('Facebook', 'brizy'),
                    'url' => $sourceUrl . '/7.+THE+ELEMENTS/' . '28.+Facebook.mp4'
                ],
                ['title' => __('Twitter', 'brizy'), 'url' => $sourceUrl . '/7.+THE+ELEMENTS/' . '29.+Twitter.mp4'],
                [
                    'title' => __('Comments', 'brizy'),
                    'url' => $sourceUrl . '/7.+THE+ELEMENTS/' . '30.+Comments.mp4'
                ],
                ['title' => __('Alert', 'brizy'), 'url' => $sourceUrl . '/7.+THE+ELEMENTS/' . '31.+Alert.mp4'],
                [
                    'title' => __('Calendly', 'brizy'),
                    'url' => $sourceUrl . '/7.+THE+ELEMENTS/' . '32.+Calendly.mp4'
                ],
                ['title' => __('Search', 'brizy'), 'url' => $sourceUrl . '/7.+THE+ELEMENTS/' . '33.+Search.mp4'],
                [
                    'title' => __('Featured Image', 'brizy'),
                    'url' => $sourceUrl . '/7.+THE+ELEMENTS/' . '34.+Featured+Image.mp4'
                ],
                ['title' => __('Title', 'brizy'), 'url' => $sourceUrl . '/7.+THE+ELEMENTS/' . '35.+Title.mp4'],
                ['title' => __('Excerpt', 'brizy'), 'url' => $sourceUrl . '/7.+THE+ELEMENTS/' . '36.+Excerpt.mp4'],
                ['title' => __('Info', 'brizy'), 'url' => $sourceUrl . '/7.+THE+ELEMENTS/' . '37.+Info.mp4'],
                [
                    'title' => __('Breadcrumbs', 'brizy'),
                    'url' => $sourceUrl . '/7.+THE+ELEMENTS/' . '38.+Breadcrumbs.mp4'
                ],
                ['title' => __('Posts', 'brizy'), 'url' => $sourceUrl . '/7.+THE+ELEMENTS/' . '39.+Posts.mp4'],
                ['title' => __('Sidebar', 'brizy'), 'url' => $sourceUrl . '/7.+THE+ELEMENTS/' . '40.+Sidebar.mp4'],
                [
                    'title' => __('Shortcode', 'brizy'),
                    'url' => $sourceUrl . '/7.+THE+ELEMENTS/' . '41.+Shortcode.mp4'
                ],
                ['title' => __('Archive', 'brizy'), 'url' => $sourceUrl . '/7.+THE+ELEMENTS/' . '42.+Archive.mp4']
            ],
            __('Woocommerce Elements', 'brizy') => [
                [
                    'title' => __('Products', 'brizy'),
                    'url' => $sourceUrl . '/9.+WOOCOMMERCE+ELEMENTS/' . '1.+Products.mp4'
                ],
                ['title' => __('Cart', 'brizy'), 'url' => $sourceUrl . '/9.+WOOCOMMERCE+ELEMENTS/' . '2.+Cart.mp4'],
                [
                    'title' => __('Categories', 'brizy'),
                    'url' => $sourceUrl . '/9.+WOOCOMMERCE+ELEMENTS/' . '3.+Categories.mp4'
                ],
                [
                    'title' => __('Pages', 'brizy'),
                    'url' => $sourceUrl . '/9.+WOOCOMMERCE+ELEMENTS/' . '4.+Pages.mp4'
                ],
                [
                    'title' => __('Content', 'brizy'),
                    'url' => $sourceUrl . '/9.+WOOCOMMERCE+ELEMENTS/' . '5.+Content.mp4'
                ],
                [
                    'title' => __('Price', 'brizy'),
                    'url' => $sourceUrl . '/9.+WOOCOMMERCE+ELEMENTS/' . '6.+Price.mp4'
                ],
                [
                    'title' => __('Gallery', 'brizy'),
                    'url' => $sourceUrl . '/9.+WOOCOMMERCE+ELEMENTS/' . '7.+Gallery.mp4'
                ],
                [
                    'title' => __('Add to cart', 'brizy'),
                    'url' => $sourceUrl . '/9.+WOOCOMMERCE+ELEMENTS/' . '8.+Add+to+Cart.mp4'
                ],
                [
                    'title' => __('Stock', 'brizy'),
                    'url' => $sourceUrl . '/9.+WOOCOMMERCE+ELEMENTS/' . '9.+Stock.mp4'
                ],
                ['title' => __('SKU', 'brizy'), 'url' => $sourceUrl . '/9.+WOOCOMMERCE+ELEMENTS/' . '10.+SKU.mp4'],
                [
                    'title' => __('Meta', 'brizy'),
                    'url' => $sourceUrl . '/9.+WOOCOMMERCE+ELEMENTS/' . '11.+Meta.mp4'
                ],
                [
                    'title' => __('Rating', 'brizy'),
                    'url' => $sourceUrl . '/9.+WOOCOMMERCE+ELEMENTS/' . '12.+Rating.mp4'
                ],
                [
                    'title' => __('Attributes', 'brizy'),
                    'url' => $sourceUrl . '/9.+WOOCOMMERCE+ELEMENTS/' . '13.+Attributes.mp4'
                ],
                [
                    'title' => __('Upsell', 'brizy'),
                    'url' => $sourceUrl . '/9.+WOOCOMMERCE+ELEMENTS/' . '14.+Upsell.mp4'
                ],
                [
                    'title' => __('Reviews', 'brizy'),
                    'url' => $sourceUrl . '/9.+WOOCOMMERCE+ELEMENTS/' . '15.+Reviews.mp4'
                ]
            ]
        ];

        $editorHelpVideos = ['video' => []];

        foreach ($categoryVideos as $title => $videos) {

            foreach ($videos as $index => &$video) {
                $video['id'] = $index;
            }

            $editorHelpVideos['video'][] = [
                'id' => count($editorHelpVideos['video']),
                'category' => $title,
                'items' => $videos
            ];
        }

        $editorHelpVideos['header'] = [
            'src' => $sourceUrl . '/Getting-started-video-thumb.jpg',
            'url' => $sourceUrl . '/1.+GET+STARTED/' . '1.+Builder+Overview.mp4'
        ];

        return $editorHelpVideos;
    }
}