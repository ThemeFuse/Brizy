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
            'ui' => [
                'help' => $this->getEditorHelpVideos(Brizy_Config::EDITOR_HELP_VIDEOS_URL)
            ],
            'server' => array(
                'maxUploadFileSize' => $this->fileUploadMaxSize(),
            ),
            'branding' => array('name' => __bt('brizy', 'Brizy')),
            'prefix' => Brizy_Editor::prefix(),
            'cloud' => $this->getCloudInfo(),
            'editorVersion' => BRIZY_EDITOR_VERSION,
            'imageSizes' => $this->getImgSizes(),
            'moduleGroups' => [],
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
        return apply_filters('brizy_editor_config_texts', array(
	        "#popup-id" => __("#popup-id", "brizy"),
	        "% of page height" => __("% of page height", "brizy"),
	        "%s Selected" => __("%s Selected", "brizy"),
	        "+ 10:00 (Sydney, Melbourne)" => __("+ 10:00 (Sydney, Melbourne)", "brizy"),
	        "+ 10:00 (Sydney, Melbourne, Canberra)" => __("+ 10:00 (Sydney, Melbourne, Canberra)", "brizy"),
	        "+ 10:30 (Lord Howe Island)" => __("+ 10:30 (Lord Howe Island)", "brizy"),
	        "+ 11:00 (Ponape)" => __("+ 11:00 (Ponape)", "brizy"),
	        "+ 12:00 (Auckland)" => __("+ 12:00 (Auckland)", "brizy"),
	        "+ 12:00 (Auckland, Magadan)" => __("+ 12:00 (Auckland, Magadan)", "brizy"),
	        "+ 13:00 (Tongatapu)" => __("+ 13:00 (Tongatapu)", "brizy"),
	        "+ 1:00 (Berlin, Paris)" => __("+ 1:00 (Berlin, Paris)", "brizy"),
	        "+ 1:00 (Berlin, Paris, Morocco, Netherlands)" => __("+ 1:00 (Berlin, Paris, Morocco, Netherlands)", "brizy"),
	        "+ 2:00 (Athens, Istanbul)" => __("+ 2:00 (Athens, Istanbul)", "brizy"),
	        "+ 2:00 (Athens, Istanbul, Romania)" => __("+ 2:00 (Athens, Istanbul, Romania)", "brizy"),
	        "+ 3:00 (Moscow, Baghdad)" => __("+ 3:00 (Moscow, Baghdad)", "brizy"),
	        "+ 3:30 (Iran)" => __("+ 3:30 (Iran)", "brizy"),
	        "+ 4:00 (Dubai, Baku)" => __("+ 4:00 (Dubai, Baku)", "brizy"),
	        "+ 4:30 (Afghanistan, Kabul, Tehran)" => __("+ 4:30 (Afghanistan, Kabul, Tehran)", "brizy"),
	        "+ 5:00 (Yekaterinburg)" => __("+ 5:00 (Yekaterinburg)", "brizy"),
	        "+ 5:00 (Yekaterinburg, Baku, Karachi)" => __("+ 5:00 (Yekaterinburg, Baku, Karachi)", "brizy"),
	        "+ 5:30 (India)" => __("+ 5:30 (India)", "brizy"),
	        "+ 5:45 (Kathmandu, Nepal)" => __("+ 5:45 (Kathmandu, Nepal)", "brizy"),
	        "+ 6:00 (Nur-Sultan)" => __("+ 6:00 (Nur-Sultan)", "brizy"),
	        "+ 6:00 (Nur-Sultan, Kyrgyzstan)" => __("+ 6:00 (Nur-Sultan, Kyrgyzstan)", "brizy"),
	        "+ 6:30 (Yangon)" => __("+ 6:30 (Yangon)", "brizy"),
	        "+ 7:00 (Bangkok, Jakarta)" => __("+ 7:00 (Bangkok, Jakarta)", "brizy"),
	        "+ 7:00 (Bangkok, Jakarta, Vietnam)" => __("+ 7:00 (Bangkok, Jakarta, Vietnam)", "brizy"),
	        "+ 8:00 (Singapore, Beijing)" => __("+ 8:00 (Singapore, Beijing)", "brizy"),
	        "+ 8:00 (Singapore, Beijing, Malaysia)" => __("+ 8:00 (Singapore, Beijing, Malaysia)", "brizy"),
	        "+ 8:30 (Pyongyang)" => __("+ 8:30 (Pyongyang)", "brizy"),
	        "+ 9:00 (Tokyo, Seoul)" => __("+ 9:00 (Tokyo, Seoul)", "brizy"),
	        "+ 9:30 (Darwin, Adelaide)" => __("+ 9:30 (Darwin, Adelaide)", "brizy"),
	        "- 10:00 (Honolulu, Papeete)" => __("- 10:00 (Honolulu, Papeete)", "brizy"),
	        "- 10:00 (Honolulu, Papeete, Hawaii)" => __("- 10:00 (Honolulu, Papeete, Hawaii)", "brizy"),
	        "- 11:00 (Niue)" => __("- 11:00 (Niue)", "brizy"),
	        "- 12:00 (International Date Line West)" => __("- 12:00 (International Date Line West)", "brizy"),
	        "- 1:00 (Cape Verde)" => __("- 1:00 (Cape Verde)", "brizy"),
	        "- 2:00 (Noronha)" => __("- 2:00 (Noronha)", "brizy"),
	        "- 2:30 (Newfoundland Daylight)" => __("- 2:30 (Newfoundland Daylight)", "brizy"),
	        "- 3:00 (Brasilia, Santiago)" => __("- 3:00 (Brasilia, Santiago)", "brizy"),
	        "- 3:00 (Brasilia, Santiago, Argentina)" => __("- 3:00 (Brasilia, Santiago, Argentina)", "brizy"),
	        "- 3:30 (Newfoundland)" => __("- 3:30 (Newfoundland)", "brizy"),
	        "- 4:00 (Halifax, Manaus)" => __("- 4:00 (Halifax, Manaus)", "brizy"),
	        "- 4:00 (Halifax, Manaus, Santiago)" => __("- 4:00 (Halifax, Manaus, Santiago)", "brizy"),
	        "- 4:30 (Caracas)" => __("- 4:30 (Caracas)", "brizy"),
	        "- 5:00 (New York, Miami)" => __("- 5:00 (New York, Miami)", "brizy"),
	        "- 6:00 (Chicago, Dallas)" => __("- 6:00 (Chicago, Dallas)", "brizy"),
	        "- 7:00 (Denver, Phoenix)" => __("- 7:00 (Denver, Phoenix)", "brizy"),
	        "- 8:00 (Los Angeles)" => __("- 8:00 (Los Angeles)", "brizy"),
	        "- 9:00 (Anchorage)" => __("- 9:00 (Anchorage)", "brizy"),
	        "- 9:00 (Anchorage, Alaska)" => __("- 9:00 (Anchorage, Alaska)", "brizy"),
	        "- 9:30 (Marquesas)" => __("- 9:30 (Marquesas)", "brizy"),
	        "..type error message" => __("..type error message", "brizy"),
	        ".my-class" => __(".my-class", "brizy"),
	        "0 Selected" => __("0 Selected", "brizy"),
	        "0-10" => __("0-10", "brizy"),
	        "0-5" => __("0-5", "brizy"),
	        "00:00 (London, Dublin)" => __("00:00 (London, Dublin)", "brizy"),
	        "3D Tilt" => __("3D Tilt", "brizy"),
	        "? (%s)" => __("? (%s)", "brizy"),
	        "ADD FONT VARIATION" => __("ADD FONT VARIATION", "brizy"),
	        "ADD GOOGLE FONT" => __("ADD GOOGLE FONT", "brizy"),
	        "API KEY" => __("API KEY", "brizy"),
	        "API: No Kits getData() found." => __("API: No Kits getData() found.", "brizy"),
	        "API: No Kits getMeta() found." => __("API: No Kits getMeta() found.", "brizy"),
	        "API: No Layouts getData() found." => __("API: No Layouts getData() found.", "brizy"),
	        "API: No Layouts getMeta() found." => __("API: No Layouts getMeta() found.", "brizy"),
	        "API: No Popups getData() found." => __("API: No Popups getData() found.", "brizy"),
	        "API: No Popups getMeta() found." => __("API: No Popups getMeta() found.", "brizy"),
	        "API: No Stories getData() found." => __("API: No Stories getData() found.", "brizy"),
	        "API: No Stories getMeta() found." => __("API: No Stories getMeta() found.", "brizy"),
	        "API: No popupConditions save found." => __("API: No popupConditions save found.", "brizy"),
	        "API: No publish handler found." => __("API: No publish handler found.", "brizy"),
	        "API: No saved blocks or layouts found." => __("API: No saved blocks or layouts found.", "brizy"),
	        "API: No saved popups found." => __("API: No saved popups found.", "brizy"),
	        "API: No savedBlocks create found." => __("API: No savedBlocks create found.", "brizy"),
	        "API: No savedBlocks delete found." => __("API: No savedBlocks delete found.", "brizy"),
	        "API: No savedBlocks filter found." => __("API: No savedBlocks filter found.", "brizy"),
	        "API: No savedBlocks get found." => __("API: No savedBlocks get found.", "brizy"),
	        "API: No savedBlocks getByUid found." => __("API: No savedBlocks getByUid found.", "brizy"),
	        "API: No savedBlocks update found." => __("API: No savedBlocks update found.", "brizy"),
	        "API: No savedBlocks upload found." => __("API: No savedBlocks upload found.", "brizy"),
	        "API: No savedLayout delete found." => __("API: No savedLayout delete found.", "brizy"),
	        "API: No savedLayout import found." => __("API: No savedLayout import found.", "brizy"),
	        "API: No savedLayout update found." => __("API: No savedLayout update found.", "brizy"),
	        "API: No savedLayouts create found." => __("API: No savedLayouts create found.", "brizy"),
	        "API: No savedLayouts filter found." => __("API: No savedLayouts filter found.", "brizy"),
	        "API: No savedLayouts get found." => __("API: No savedLayouts get found.", "brizy"),
	        "API: No savedLayouts getByUid found." => __("API: No savedLayouts getByUid found.", "brizy"),
	        "API: No savedPopup delete found." => __("API: No savedPopup delete found.", "brizy"),
	        "API: No savedPopup update found." => __("API: No savedPopup update found.", "brizy"),
	        "API: No savedPopups create found." => __("API: No savedPopups create found.", "brizy"),
	        "API: No savedPopups filter found." => __("API: No savedPopups filter found.", "brizy"),
	        "API: No savedPopups get found." => __("API: No savedPopups get found.", "brizy"),
	        "API: No savedPopups getByUid found." => __("API: No savedPopups getByUid found.", "brizy"),
	        "API: No savedPopups import found." => __("API: No savedPopups import found.", "brizy"),
	        "APPS" => __("APPS", "brizy"),
	        "Absolute" => __("Absolute", "brizy"),
	        "Access your Library in any WP install by connecting your Account" => __("Access your Library in any WP install by connecting your Account", "brizy"),
	        "Accordion" => __("Accordion", "brizy"),
	        "Accordion Items" => __("Accordion Items", "brizy"),
	        "Accordion Tags" => __("Accordion Tags", "brizy"),
	        "Accounts" => __("Accounts", "brizy"),
	        "Accounts are empty. Please connect a new account and try again." => __("Accounts are empty. Please connect a new account and try again.", "brizy"),
	        "Action" => __("Action", "brizy"),
	        "Activate Tab" => __("Activate Tab", "brizy"),
	        "Active" => __("Active", "brizy"),
	        "Add" => __("Add", "brizy"),
	        "Add Blogs in Shopify" => __("Add Blogs in Shopify", "brizy"),
	        "Add Category Filter" => __("Add Category Filter", "brizy"),
	        "Add Category Filter 2" => __("Add Category Filter 2", "brizy"),
	        "Add Category Filter 3" => __("Add Category Filter 3", "brizy"),
	        "Add Collections in Shopify" => __("Add Collections in Shopify", "brizy"),
	        "Add Elements" => __("Add Elements", "brizy"),
	        "Add Font" => __("Add Font", "brizy"),
	        "Add More" => __("Add More", "brizy"),
	        "Add New" => __("Add New", "brizy"),
	        "Add New Block / Layout" => __("Add New Block / Layout", "brizy"),
	        "Add New Column" => __("Add New Column", "brizy"),
	        "Add New Font" => __("Add New Font", "brizy"),
	        "Add Products in Shopify" => __("Add Products in Shopify", "brizy"),
	        "Add Shopify Elements" => __("Add Shopify Elements", "brizy"),
	        "Add To Bag" => __("Add To Bag", "brizy"),
	        "Add To Cart" => __("Add To Cart", "brizy"),
	        "Add a new block" => __("Add a new block", "brizy"),
	        "Add new" => __("Add new", "brizy"),
	        "Add new display condition" => __("Add new display condition", "brizy"),
	        "Add new font variation" => __("Add new font variation", "brizy"),
	        "Add new option" => __("Add new option", "brizy"),
	        "Add new trigger condition" => __("Add new trigger condition", "brizy"),
	        "Add only one item of this type on the page" => __("Add only one item of this type on the page", "brizy"),
	        "Add to cart" => __("Add to cart", "brizy"),
	        "Add to cart Input" => __("Add to cart Input", "brizy"),
	        "Add your custom ID without the #pound, example: my-id" => __("Add your custom ID without the #pound, example: my-id", "brizy"),
	        "Add your custom block name, example: my-block" => __("Add your custom block name, example: my-block", "brizy"),
	        "Add your custom class without the .dot, example: my-class" => __("Add your custom class without the .dot, example: my-class", "brizy"),
	        "Additional category filters require this selection. Defines which level 2 category for this specific filter. If selected will show the next level of categories as select options. If a Parent Category is selected above make sure to select a child category of that parent." => __("Additional category filters require this selection. Defines which level 2 category for this specific filter. If selected will show the next level of categories as select options. If a Parent Category is selected above make sure to select a child category of that parent.", "brizy"),
	        "Additional image on hover" => __("Additional image on hover", "brizy"),
	        "Additionals" => __("Additionals", "brizy"),
	        "Address" => __("Address", "brizy"),
	        "Address line" => __("Address line", "brizy"),
	        "Advanced" => __("Advanced", "brizy"),
	        "Advanced Contact Form by POWR" => __("Advanced Contact Form by POWR", "brizy"),
	        "After (sec)" => __("After (sec)", "brizy"),
	        "After Inactivity" => __("After Inactivity", "brizy"),
	        "AiText" => __("AiText", "brizy"),
	        "Alert" => __("Alert", "brizy"),
	        "Align" => __("Align", "brizy"),
	        "Align Text" => __("Align Text", "brizy"),
	        "Aligned Left" => __("Aligned Left", "brizy"),
	        "Aligned Right" => __("Aligned Right", "brizy"),
	        "All" => __("All", "brizy"),
	        "All Categories" => __("All Categories", "brizy"),
	        "All blogs" => __("All blogs", "brizy"),
	        "All collections" => __("All collections", "brizy"),
	        "All fields cannot be empty" => __("All fields cannot be empty", "brizy"),
	        "All fields marked with an asterisk ( * ) must be completed." => __("All fields marked with an asterisk ( * ) must be completed.", "brizy"),
	        "All fields marked with an asterisk ( * ) must be mapped." => __("All fields marked with an asterisk ( * ) must be mapped.", "brizy"),
	        "All products" => __("All products", "brizy"),
	        "All users" => __("All users", "brizy"),
	        "Allow Brizy to access your PayPal account via API access" => __("Allow Brizy to access your PayPal account via API access", "brizy"),
	        "Allow us to access your ActiveCampaign account via API access" => __("Allow us to access your ActiveCampaign account via API access", "brizy"),
	        "Allow us to access your Campaign Monitor account via API access" => __("Allow us to access your Campaign Monitor account via API access", "brizy"),
	        "Allow us to access your ConvertKit account via API access" => __("Allow us to access your ConvertKit account via API access", "brizy"),
	        "Allow us to access your Drip account via API access" => __("Allow us to access your Drip account via API access", "brizy"),
	        "Allow us to access your Facebook account via API access" => __("Allow us to access your Facebook account via API access", "brizy"),
	        "Allow us to access your GetResponse account via API access" => __("Allow us to access your GetResponse account via API access", "brizy"),
	        "Allow us to access your HubSpot account via API access" => __("Allow us to access your HubSpot account via API access", "brizy"),
	        "Allow us to access your MailChimp account via API access" => __("Allow us to access your MailChimp account via API access", "brizy"),
	        "Allow us to access your MailerLite account via API access" => __("Allow us to access your MailerLite account via API access", "brizy"),
	        "Allow us to access your Mailjet account via API access" => __("Allow us to access your Mailjet account via API access", "brizy"),
	        "Allow us to access your Sendinblue account via API access" => __("Allow us to access your Sendinblue account via API access", "brizy"),
	        "Allow us to access your Webhook account via API access." => __("Allow us to access your Webhook account via API access.", "brizy"),
	        "Allow us to access your Zapier account via API access" => __("Allow us to access your Zapier account via API access", "brizy"),
	        "Allow us to access your e-goi account via API access" => __("Allow us to access your e-goi account via API access", "brizy"),
	        "Allowed File Types" => __("Allowed File Types", "brizy"),
	        "Alt Title" => __("Alt Title", "brizy"),
	        "Alternate Mobile" => __("Alternate Mobile", "brizy"),
	        "Amount" => __("Amount", "brizy"),
	        "An error happened while trying to display this element" => __("An error happened while trying to display this element", "brizy"),
	        "Animated" => __("Animated", "brizy"),
	        "Any Video" => __("Any Video", "brizy"),
	        "Appearance" => __("Appearance", "brizy"),
	        "Application Key" => __("Application Key", "brizy"),
	        "Appointment Booking" => __("Appointment Booking", "brizy"),
	        "Appointment Booking by Tipo" => __("Appointment Booking by Tipo", "brizy"),
	        "Archive" => __("Archive", "brizy"),
	        "Archives" => __("Archives", "brizy"),
	        "Are you sure you want to delete your account?" => __("Are you sure you want to delete your account?", "brizy"),
	        "Arrangement" => __("Arrangement", "brizy"),
	        "Arriving" => __("Arriving", "brizy"),
	        "Arriving From" => __("Arriving From", "brizy"),
	        "Arrow" => __("Arrow", "brizy"),
	        "Arrow Position" => __("Arrow Position", "brizy"),
	        "Arrows" => __("Arrows", "brizy"),
	        "Arrows Spacing" => __("Arrows Spacing", "brizy"),
	        "Article" => __("Article", "brizy"),
	        "Artwork" => __("Artwork", "brizy"),
	        "Asc" => __("Asc", "brizy"),
	        "Aside" => __("Aside", "brizy"),
	        "Aspect Ratio" => __("Aspect Ratio", "brizy"),
	        "Assets List" => __("Assets List", "brizy"),
	        "Attention" => __("Attention", "brizy"),
	        "Attributes" => __("Attributes", "brizy"),
	        "Audio" => __("Audio", "brizy"),
	        "Authentication" => __("Authentication", "brizy"),
	        "Author" => __("Author", "brizy"),
	        "Authorized" => __("Authorized", "brizy"),
	        "Auto" => __("Auto", "brizy"),
	        "Auto Slide" => __("Auto Slide", "brizy"),
	        "Auto-Draft" => __("Auto-Draft", "brizy"),
	        "AutoPlay" => __("AutoPlay", "brizy"),
	        "Autoplay" => __("Autoplay", "brizy"),
	        "Avatar" => __("Avatar", "brizy"),
	        "BLOCKS" => __("BLOCKS", "brizy"),
	        "Back" => __("Back", "brizy"),
	        "Back In Stock" => __("Back In Stock", "brizy"),
	        "Back in Stock" => __("Back in Stock", "brizy"),
	        "Back to Layouts" => __("Back to Layouts", "brizy"),
	        "Back to Login" => __("Back to Login", "brizy"),
	        "Back to Stories" => __("Back to Stories", "brizy"),
	        "Background" => __("Background", "brizy"),
	        "Badge" => __("Badge", "brizy"),
	        "Badge - Trusted" => __("Badge - Trusted", "brizy"),
	        "Badge Inner" => __("Badge Inner", "brizy"),
	        "Badge Outter" => __("Badge Outter", "brizy"),
	        "Badge Position" => __("Badge Position", "brizy"),
	        "Badge Size" => __("Badge Size", "brizy"),
	        "Badge Type" => __("Badge Type", "brizy"),
	        "Badge will work only if inserted in Product Details component" => __("Badge will work only if inserted in Product Details component", "brizy"),
	        "Badges" => __("Badges", "brizy"),
	        "Badges by Hextom" => __("Badges by Hextom", "brizy"),
	        "Badges by Stamped" => __("Badges by Stamped", "brizy"),
	        "Badges by Trusted" => __("Badges by Trusted", "brizy"),
	        "Bar" => __("Bar", "brizy"),
	        "Based on Reviews" => __("Based on Reviews", "brizy"),
	        "Basic" => __("Basic", "brizy"),
	        "Bcc" => __("Bcc", "brizy"),
	        "Between" => __("Between", "brizy"),
	        "Bg" => __("Bg", "brizy"),
	        "Bg Size" => __("Bg Size", "brizy"),
	        "Bg Star" => __("Bg Star", "brizy"),
	        "Big" => __("Big", "brizy"),
	        "Big Image" => __("Big Image", "brizy"),
	        "Black" => __("Black", "brizy"),
	        "Blending Mode" => __("Blending Mode", "brizy"),
	        "Block" => __("Block", "brizy"),
	        "Block Name" => __("Block Name", "brizy"),
	        "Block conditions are available only in PRO" => __("Block conditions are available only in PRO", "brizy"),
	        "Block is synchronized" => __("Block is synchronized", "brizy"),
	        "Block will be synchronized" => __("Block will be synchronized", "brizy"),
	        "Blocks" => __("Blocks", "brizy"),
	        "Blur" => __("Blur", "brizy"),
	        "Bob" => __("Bob", "brizy"),
	        "Bold" => __("Bold", "brizy"),
	        "Border" => __("Border", "brizy"),
	        "Bottom" => __("Bottom", "brizy"),
	        "Bottom Center" => __("Bottom Center", "brizy"),
	        "Bottom Left" => __("Bottom Left", "brizy"),
	        "Bottom Right" => __("Bottom Right", "brizy"),
	        "Bounce" => __("Bounce", "brizy"),
	        "Bounce In" => __("Bounce In", "brizy"),
	        "Bounce Out" => __("Bounce Out", "brizy"),
	        "Boxed" => __("Boxed", "brizy"),
	        "Branding" => __("Branding", "brizy"),
	        "Breadcrumbs" => __("Breadcrumbs", "brizy"),
	        "Btn Bg" => __("Btn Bg", "brizy"),
	        "Btn Color" => __("Btn Color", "brizy"),
	        "Bub." => __("Bub.", "brizy"),
	        "Bub. Bg" => __("Bub. Bg", "brizy"),
	        "Bubble" => __("Bubble", "brizy"),
	        "Bundles - by Bold" => __("Bundles - by Bold", "brizy"),
	        "Bundles App" => __("Bundles App", "brizy"),
	        "Bundles by Bold" => __("Bundles by Bold", "brizy"),
	        "Business Hour" => __("Business Hour", "brizy"),
	        "Button" => __("Button", "brizy"),
	        "Button Name" => __("Button Name", "brizy"),
	        "Button Size" => __("Button Size", "brizy"),
	        "Button Text" => __("Button Text", "brizy"),
	        "Button Text..." => __("Button Text...", "brizy"),
	        "Button Type" => __("Button Type", "brizy"),
	        "Button name..." => __("Button name...", "brizy"),
	        "Button text" => __("Button text", "brizy"),
	        "Button text..." => __("Button text...", "brizy"),
	        "Button will display if text is entered and a detail page selected." => __("Button will display if text is entered and a detail page selected.", "brizy"),
	        "Buttons" => __("Buttons", "brizy"),
	        "Buy" => __("Buy", "brizy"),
	        "Buy now" => __("Buy now", "brizy"),
	        "Buzz" => __("Buzz", "brizy"),
	        "Buzz Out" => __("Buzz Out", "brizy"),
	        "CATEGORIES" => __("CATEGORIES", "brizy"),
	        "CMS" => __("CMS", "brizy"),
	        "CREATE LIST" => __("CREATE LIST", "brizy"),
	        "CSS Class" => __("CSS Class", "brizy"),
	        "CSS ID" => __("CSS ID", "brizy"),
	        "CSS goes here" => __("CSS goes here", "brizy"),
	        "Calendar View" => __("Calendar View", "brizy"),
	        "Calendly" => __("Calendly", "brizy"),
	        "Cancel" => __("Cancel", "brizy"),
	        "Captions" => __("Captions", "brizy"),
	        "Card frame" => __("Card frame", "brizy"),
	        "Carousel" => __("Carousel", "brizy"),
	        "Carousel Image" => __("Carousel Image", "brizy"),
	        "Cart" => __("Cart", "brizy"),
	        "Cart & Checkout" => __("Cart & Checkout", "brizy"),
	        "Cart Items" => __("Cart Items", "brizy"),
	        "Cart Quantity" => __("Cart Quantity", "brizy"),
	        "Cart Settings" => __("Cart Settings", "brizy"),
	        "Casual" => __("Casual", "brizy"),
	        "Categories" => __("Categories", "brizy"),
	        "Categories Count" => __("Categories Count", "brizy"),
	        "Categories Pagination" => __("Categories Pagination", "brizy"),
	        "Categories Tags" => __("Categories Tags", "brizy"),
	        "Category" => __("Category", "brizy"),
	        "Category Filter" => __("Category Filter", "brizy"),
	        "Cc" => __("Cc", "brizy"),
	        "Center" => __("Center", "brizy"),
	        "Center Center" => __("Center Center", "brizy"),
	        "Center Left" => __("Center Left", "brizy"),
	        "Center Right" => __("Center Right", "brizy"),
	        "Check your email address" => __("Check your email address", "brizy"),
	        "Checkbox" => __("Checkbox", "brizy"),
	        "Checkout" => __("Checkout", "brizy"),
	        "Childcare" => __("Childcare", "brizy"),
	        "Circle" => __("Circle", "brizy"),
	        "Classic" => __("Classic", "brizy"),
	        "Clear" => __("Clear", "brizy"),
	        "Clear Layout" => __("Clear Layout", "brizy"),
	        "Click Outside to Close" => __("Click Outside to Close", "brizy"),
	        "Client" => __("Client", "brizy"),
	        "Close" => __("Close", "brizy"),
	        "Close Drawer Icon" => __("Close Drawer Icon", "brizy"),
	        "Close Popup" => __("Close Popup", "brizy"),
	        "Cloud" => __("Cloud", "brizy"),
	        "Code" => __("Code", "brizy"),
	        "Collaborate" => __("Collaborate", "brizy"),
	        "Collapse" => __("Collapse", "brizy"),
	        "Collapsible" => __("Collapsible", "brizy"),
	        "Collection Rating will work only if inserted in Product Details component" => __("Collection Rating will work only if inserted in Product Details component", "brizy"),
	        "Color" => __("Color", "brizy"),
	        "Color Burn" => __("Color Burn", "brizy"),
	        "Color Dodge" => __("Color Dodge", "brizy"),
	        "Colors" => __("Colors", "brizy"),
	        "Column" => __("Column", "brizy"),
	        "Columns" => __("Columns", "brizy"),
	        "Comment" => __("Comment", "brizy"),
	        "Comment Count" => __("Comment Count", "brizy"),
	        "Comments" => __("Comments", "brizy"),
	        "Conditions" => __("Conditions", "brizy"),
	        "Confident" => __("Confident", "brizy"),
	        "Config : Missing addFile callback" => __("Config : Missing addFile callback", "brizy"),
	        "Connect" => __("Connect", "brizy"),
	        "Connect a new account" => __("Connect a new account", "brizy"),
	        "Contain" => __("Contain", "brizy"),
	        "Content" => __("Content", "brizy"),
	        "Content Gap" => __("Content Gap", "brizy"),
	        "Content Padding" => __("Content Padding", "brizy"),
	        "Context" => __("Context", "brizy"),
	        "Context Type" => __("Context Type", "brizy"),
	        "Continue" => __("Continue", "brizy"),
	        "Controls" => __("Controls", "brizy"),
	        "Cookie" => __("Cookie", "brizy"),
	        "Coordinator" => __("Coordinator", "brizy"),
	        "Coordinator Email" => __("Coordinator Email", "brizy"),
	        "Coordinator Phone" => __("Coordinator Phone", "brizy"),
	        "Copy" => __("Copy", "brizy"),
	        "Corner" => __("Corner", "brizy"),
	        "Cost" => __("Cost", "brizy"),
	        "Could not Create Global Block" => __("Could not Create Global Block", "brizy"),
	        "Could not Create Global Popup" => __("Could not Create Global Popup", "brizy"),
	        "Could not Create Saved Block" => __("Could not Create Saved Block", "brizy"),
	        "Could not Create Saved Popup" => __("Could not Create Saved Popup", "brizy"),
	        "Could not download Saved Layout" => __("Could not download Saved Layout", "brizy"),
	        "Could not download Saved Popup" => __("Could not download Saved Popup", "brizy"),
	        "Could not download Saved block" => __("Could not download Saved block", "brizy"),
	        "Could not find" => __("Could not find", "brizy"),
	        "Could not publish or save page" => __("Could not publish or save page", "brizy"),
	        "Could not save layout" => __("Could not save layout", "brizy"),
	        "Could not switch to draft" => __("Could not switch to draft", "brizy"),
	        "Count" => __("Count", "brizy"),
	        "Countdown" => __("Countdown", "brizy"),
	        "Counter" => __("Counter", "brizy"),
	        "Country Code" => __("Country Code", "brizy"),
	        "Cover" => __("Cover", "brizy"),
	        "Cover Image" => __("Cover Image", "brizy"),
	        "Create" => __("Create", "brizy"),
	        "Create Account & Connect" => __("Create Account & Connect", "brizy"),
	        "Create a menu" => __("Create a menu", "brizy"),
	        "Create a new list" => __("Create a new list", "brizy"),
	        "Create an Account & Connect" => __("Create an Account & Connect", "brizy"),
	        "Create your own" => __("Create your own", "brizy"),
	        "Credit" => __("Credit", "brizy"),
	        "Cross Sell" => __("Cross Sell", "brizy"),
	        "Current Date" => __("Current Date", "brizy"),
	        "Current Page" => __("Current Page", "brizy"),
	        "Current Page URL" => __("Current Page URL", "brizy"),
	        "Current Video Channel" => __("Current Video Channel", "brizy"),
	        "Custom" => __("Custom", "brizy"),
	        "Custom Attributes" => __("Custom Attributes", "brizy"),
	        "Custom CSS" => __("Custom CSS", "brizy"),
	        "Custom Fields" => __("Custom Fields", "brizy"),
	        "Custom Page" => __("Custom Page", "brizy"),
	        "Custom Product" => __("Custom Product", "brizy"),
	        "Custom Text" => __("Custom Text", "brizy"),
	        "Custom Video" => __("Custom Video", "brizy"),
	        "Cut description" => __("Cut description", "brizy"),
	        "DELETE" => __("DELETE", "brizy"),
	        "Dark" => __("Dark", "brizy"),
	        "Darken" => __("Darken", "brizy"),
	        "Darken image background" => __("Darken image background", "brizy"),
	        "Date" => __("Date", "brizy"),
	        "Day" => __("Day", "brizy"),
	        "Days" => __("Days", "brizy"),
	        "De" => __("De", "brizy"),
	        "Default" => __("Default", "brizy"),
	        "Default Roles" => __("Default Roles", "brizy"),
	        "Default font (can’t be deleted)" => __("Default font (can’t be deleted)", "brizy"),
	        "Default system font" => __("Default system font", "brizy"),
	        "Defines which level 1 category to use as a base for the layout." => __("Defines which level 1 category to use as a base for the layout.", "brizy"),
	        "Defines which level 2 category for this specific filter. If selected will show the next level of categories as select options. If a Parent Category is selected above make sure to select a child category of that parent." => __("Defines which level 2 category for this specific filter. If selected will show the next level of categories as select options. If a Parent Category is selected above make sure to select a child category of that parent.", "brizy"),
	        "Delay" => __("Delay", "brizy"),
	        "Delete" => __("Delete", "brizy"),
	        "Desc" => __("Desc", "brizy"),
	        "Description" => __("Description", "brizy"),
	        "Deselected the “Verify the origin of reCAPTCHA solutions” checkbox within your Google account." => __("Deselected the “Verify the origin of reCAPTCHA solutions” checkbox within your Google account.", "brizy"),
	        "Desktop" => __("Desktop", "brizy"),
	        "Desktop Grid Style" => __("Desktop Grid Style", "brizy"),
	        "Desktop view" => __("Desktop view", "brizy"),
	        "Detail Button" => __("Detail Button", "brizy"),
	        "Diamond" => __("Diamond", "brizy"),
	        "Difference" => __("Difference", "brizy"),
	        "Direct" => __("Direct", "brizy"),
	        "Direction" => __("Direction", "brizy"),
	        "Disable on Mobile" => __("Disable on Mobile", "brizy"),
	        "Disable on Tablet" => __("Disable on Tablet", "brizy"),
	        "Disconnect" => __("Disconnect", "brizy"),
	        "Display" => __("Display", "brizy"),
	        "Display Close Button" => __("Display Close Button", "brizy"),
	        "Display Conditions" => __("Display Conditions", "brizy"),
	        "Display Description" => __("Display Description", "brizy"),
	        "Display Mode" => __("Display Mode", "brizy"),
	        "Disqus" => __("Disqus", "brizy"),
	        "Dividers" => __("Dividers", "brizy"),
	        "Don't have items" => __("Don't have items", "brizy"),
	        "Don't have tags" => __("Don't have tags", "brizy"),
	        "Done" => __("Done", "brizy"),
	        "Done, your library has synced" => __("Done, your library has synced", "brizy"),
	        "Dots" => __("Dots", "brizy"),
	        "Down" => __("Down", "brizy"),
	        "Down Left" => __("Down Left", "brizy"),
	        "Down Right" => __("Down Right", "brizy"),
	        "Down Up" => __("Down Up", "brizy"),
	        "Download" => __("Download", "brizy"),
	        "Download this block" => __("Download this block", "brizy"),
	        "Draft" => __("Draft", "brizy"),
	        "Drag to reorder" => __("Drag to reorder", "brizy"),
	        "Drawer Position" => __("Drawer Position", "brizy"),
	        "Duplicate" => __("Duplicate", "brizy"),
	        "Duplicate Account" => __("Duplicate Account", "brizy"),
	        "Duration" => __("Duration", "brizy"),
	        "Dutch" => __("Dutch", "brizy"),
	        "Dynamic Content" => __("Dynamic Content", "brizy"),
	        "EOT File" => __("EOT File", "brizy"),
	        "Edit" => __("Edit", "brizy"),
	        "Editable Text" => __("Editable Text", "brizy"),
	        "Effects" => __("Effects", "brizy"),
	        "Elements" => __("Elements", "brizy"),
	        "Email" => __("Email", "brizy"),
	        "Email Marketing" => __("Email Marketing", "brizy"),
	        "Email Marketing by Klaviyo" => __("Email Marketing by Klaviyo", "brizy"),
	        "Email Marketing by Klavyio" => __("Email Marketing by Klavyio", "brizy"),
	        "Email Notification" => __("Email Notification", "brizy"),
	        "Email To" => __("Email To", "brizy"),
	        "Email confirmation to join the list" => __("Email confirmation to join the list", "brizy"),
	        "Email to recover password cannot be empty" => __("Email to recover password cannot be empty", "brizy"),
	        "Embed" => __("Embed", "brizy"),
	        "Embed Code" => __("Embed Code", "brizy"),
	        "Embed Form Id" => __("Embed Form Id", "brizy"),
	        "Embeded Code" => __("Embeded Code", "brizy"),
	        "Empty message" => __("Empty message", "brizy"),
	        "En" => __("En", "brizy"),
	        "Enable Background Color" => __("Enable Background Color", "brizy"),
	        "Enable Tags" => __("Enable Tags", "brizy"),
	        "Enable on Mobile" => __("Enable on Mobile", "brizy"),
	        "Enable on Tablet" => __("Enable on Tablet", "brizy"),
	        "Enable tags" => __("Enable tags", "brizy"),
	        "Encryption" => __("Encryption", "brizy"),
	        "End" => __("End", "brizy"),
	        "English" => __("English", "brizy"),
	        "Enter Search Keyword" => __("Enter Search Keyword", "brizy"),
	        "Enter address" => __("Enter address", "brizy"),
	        "Enter text here..." => __("Enter text here...", "brizy"),
	        "Enter the allowed file types, separated by a comma (jpg, gif, pdf, etc)." => __("Enter the allowed file types, separated by a comma (jpg, gif, pdf, etc).", "brizy"),
	        "Enter the tags, separated by a comma (art, sport, nature, etc)." => __("Enter the tags, separated by a comma (art, sport, nature, etc).", "brizy"),
	        "Entrance" => __("Entrance", "brizy"),
	        "Error" => __("Error", "brizy"),
	        "Error updating global block" => __("Error updating global block", "brizy"),
	        "Es" => __("Es", "brizy"),
	        "Established a stable internet connection" => __("Established a stable internet connection", "brizy"),
	        "Even Bg" => __("Even Bg", "brizy"),
	        "Event Calendar" => __("Event Calendar", "brizy"),
	        "Event Detail" => __("Event Detail", "brizy"),
	        "Event Featured" => __("Event Featured", "brizy"),
	        "Event Layout" => __("Event Layout", "brizy"),
	        "Event List" => __("Event List", "brizy"),
	        "Event Start Time" => __("Event Start Time", "brizy"),
	        "Events" => __("Events", "brizy"),
	        "Example [gallery id='123' size='medium']" => __("Example [gallery id='123' size='medium']", "brizy"),
	        "Excerpt" => __("Excerpt", "brizy"),
	        "Exclude" => __("Exclude", "brizy"),
	        "Exclude Current" => __("Exclude Current", "brizy"),
	        "Exclude by" => __("Exclude by", "brizy"),
	        "Exclusion" => __("Exclusion", "brizy"),
	        "Export All Blocks" => __("Export All Blocks", "brizy"),
	        "Export All Layouts" => __("Export All Layouts", "brizy"),
	        "Export All Popups" => __("Export All Popups", "brizy"),
	        "Extend" => __("Extend", "brizy"),
	        "External Links" => __("External Links", "brizy"),
	        "Extra Bold" => __("Extra Bold", "brizy"),
	        "Extra Large" => __("Extra Large", "brizy"),
	        "Extra Light" => __("Extra Light", "brizy"),
	        "Extra Small" => __("Extra Small", "brizy"),
	        "FIELDS" => __("FIELDS", "brizy"),
	        "FONT VARIATION" => __("FONT VARIATION", "brizy"),
	        "FORM FIELDS" => __("FORM FIELDS", "brizy"),
	        "Facebook" => __("Facebook", "brizy"),
	        "Facebook Button" => __("Facebook Button", "brizy"),
	        "Facebook Embed" => __("Facebook Embed", "brizy"),
	        "Facebook Group" => __("Facebook Group", "brizy"),
	        "Facebook Page" => __("Facebook Page", "brizy"),
	        "Fade" => __("Fade", "brizy"),
	        "Fail message" => __("Fail message", "brizy"),
	        "Failed to authenticate: invalid token" => __("Failed to authenticate: invalid token", "brizy"),
	        "Failed to fetch api data" => __("Failed to fetch api data", "brizy"),
	        "Failed to get savedLayout" => __("Failed to get savedLayout", "brizy"),
	        "Failed to import saved layouts" => __("Failed to import saved layouts", "brizy"),
	        "Failed to load sources" => __("Failed to load sources", "brizy"),
	        "Failed to reset password" => __("Failed to reset password", "brizy"),
	        "Failed to upload file. Please upload a valid JPG, PNG, SVG or GIF image." => __("Failed to upload file. Please upload a valid JPG, PNG, SVG or GIF image.", "brizy"),
	        "Favorites Buttons" => __("Favorites Buttons", "brizy"),
	        "Featured" => __("Featured", "brizy"),
	        "Featured Image" => __("Featured Image", "brizy"),
	        "Featured View" => __("Featured View", "brizy"),
	        "Feed Tags" => __("Feed Tags", "brizy"),
	        "Feed Type" => __("Feed Type", "brizy"),
	        "Field" => __("Field", "brizy"),
	        "Field Type" => __("Field Type", "brizy"),
	        "Fields" => __("Fields", "brizy"),
	        "Fields are empty" => __("Fields are empty", "brizy"),
	        "Fields are empty. Please add fields and try again." => __("Fields are empty. Please add fields and try again.", "brizy"),
	        "File" => __("File", "brizy"),
	        "File size error message" => __("File size error message", "brizy"),
	        "File type error message" => __("File type error message", "brizy"),
	        "Files" => __("Files", "brizy"),
	        "Fill" => __("Fill", "brizy"),
	        "Fill Empty" => __("Fill Empty", "brizy"),
	        "Filter" => __("Filter", "brizy"),
	        "Filter By" => __("Filter By", "brizy"),
	        "Filter by multiple product IDs" => __("Filter by multiple product IDs", "brizy"),
	        "Filter by multiple review IDs" => __("Filter by multiple review IDs", "brizy"),
	        "Filter by product category" => __("Filter by product category", "brizy"),
	        "Filter by product vendor" => __("Filter by product vendor", "brizy"),
	        "Filter by reviews tags" => __("Filter by reviews tags", "brizy"),
	        "Filters" => __("Filters", "brizy"),
	        "Find Page" => __("Find Page", "brizy"),
	        "Find your AppKey in www.yotpo.com -> Settings -> General Settings" => __("Find your AppKey in www.yotpo.com -> Settings -> General Settings", "brizy"),
	        "First Name" => __("First Name", "brizy"),
	        "Fit" => __("Fit", "brizy"),
	        "Fixed" => __("Fixed", "brizy"),
	        "Flag" => __("Flag", "brizy"),
	        "Flags" => __("Flags", "brizy"),
	        "Flash" => __("Flash", "brizy"),
	        "Flip" => __("Flip", "brizy"),
	        "Folder" => __("Folder", "brizy"),
	        "Follow" => __("Follow", "brizy"),
	        "Followers" => __("Followers", "brizy"),
	        "Font Name is Required" => __("Font Name is Required", "brizy"),
	        "Font Size" => __("Font Size", "brizy"),
	        "Font name" => __("Font name", "brizy"),
	        "Font weight" => __("Font weight", "brizy"),
	        "Fonts" => __("Fonts", "brizy"),
	        "Footer" => __("Footer", "brizy"),
	        "Forgot Password" => __("Forgot Password", "brizy"),
	        "Form" => __("Form", "brizy"),
	        "Form Fields" => __("Form Fields", "brizy"),
	        "Form Widget" => __("Form Widget", "brizy"),
	        "Forms" => __("Forms", "brizy"),
	        "Fr" => __("Fr", "brizy"),
	        "French" => __("French", "brizy"),
	        "Frequently Bought" => __("Frequently Bought", "brizy"),
	        "Friendly" => __("Friendly", "brizy"),
	        "From Email" => __("From Email", "brizy"),
	        "From Name" => __("From Name", "brizy"),
	        "Full" => __("Full", "brizy"),
	        "Full Height" => __("Full Height", "brizy"),
	        "Full Name" => __("Full Name", "brizy"),
	        "Full Screen" => __("Full Screen", "brizy"),
	        "Full name" => __("Full name", "brizy"),
	        "Future" => __("Future", "brizy"),
	        "Gallery" => __("Gallery", "brizy"),
	        "Gallery Tags" => __("Gallery Tags", "brizy"),
	        "Gap" => __("Gap", "brizy"),
	        "Gap Above" => __("Gap Above", "brizy"),
	        "Gap Below" => __("Gap Below", "brizy"),
	        "Gap Size" => __("Gap Size", "brizy"),
	        "German" => __("German", "brizy"),
	        "Get a PRO plan" => __("Get a PRO plan", "brizy"),
	        "Get your tracking page URL in the Tracking pages section of AfterShip application." => __("Get your tracking page URL in the Tracking pages section of AfterShip application.", "brizy"),
	        "Give it a title" => __("Give it a title", "brizy"),
	        "Global Blocks" => __("Global Blocks", "brizy"),
	        "Global Popups" => __("Global Popups", "brizy"),
	        "Go Back" => __("Go Back", "brizy"),
	        "Go to" => __("Go to", "brizy"),
	        "Go to Checkout" => __("Go to Checkout", "brizy"),
	        "Gradient" => __("Gradient", "brizy"),
	        "Grid" => __("Grid", "brizy"),
	        "Group" => __("Group", "brizy"),
	        "Group Detail" => __("Group Detail", "brizy"),
	        "Group Featured" => __("Group Featured", "brizy"),
	        "Group Filter" => __("Group Filter", "brizy"),
	        "Group Layout" => __("Group Layout", "brizy"),
	        "Group List" => __("Group List", "brizy"),
	        "Group Slider" => __("Group Slider", "brizy"),
	        "Grow" => __("Grow", "brizy"),
	        "Grow Rotate" => __("Grow Rotate", "brizy"),
	        "H1" => __("H1", "brizy"),
	        "H2" => __("H2", "brizy"),
	        "H3" => __("H3", "brizy"),
	        "H4" => __("H4", "brizy"),
	        "H5" => __("H5", "brizy"),
	        "H6" => __("H6", "brizy"),
	        "HH:MM" => __("HH:MM", "brizy"),
	        "HTML Tag" => __("HTML Tag", "brizy"),
	        "Handle" => __("Handle", "brizy"),
	        "Hang" => __("Hang", "brizy"),
	        "Head" => __("Head", "brizy"),
	        "Header" => __("Header", "brizy"),
	        "Header & Footer" => __("Header & Footer", "brizy"),
	        "Header Customisation" => __("Header Customisation", "brizy"),
	        "Heading" => __("Heading", "brizy"),
	        "Heading Text" => __("Heading Text", "brizy"),
	        "Heavy" => __("Heavy", "brizy"),
	        "Height" => __("Height", "brizy"),
	        "Help" => __("Help", "brizy"),
	        "Hidden" => __("Hidden", "brizy"),
	        "Hide" => __("Hide", "brizy"),
	        "Hide Aftership Icon" => __("Hide Aftership Icon", "brizy"),
	        "Hide Cover Photo" => __("Hide Cover Photo", "brizy"),
	        "Hide Hidden Elements" => __("Hide Hidden Elements", "brizy"),
	        "Hide Load More Arrow" => __("Hide Load More Arrow", "brizy"),
	        "Hide for logged in users" => __("Hide for logged in users", "brizy"),
	        "Homepage" => __("Homepage", "brizy"),
	        "Horizontal" => __("Horizontal", "brizy"),
	        "Horizontal Align" => __("Horizontal Align", "brizy"),
	        "Horizontal Offset" => __("Horizontal Offset", "brizy"),
	        "Host" => __("Host", "brizy"),
	        "Hour" => __("Hour", "brizy"),
	        "Hours" => __("Hours", "brizy"),
	        "Hover" => __("Hover", "brizy"),
	        "Hover Opacity" => __("Hover Opacity", "brizy"),
	        "Hover Transition" => __("Hover Transition", "brizy"),
	        "Hover Zoom" => __("Hover Zoom", "brizy"),
	        "Hue" => __("Hue", "brizy"),
	        "ID" => __("ID", "brizy"),
	        "Icon" => __("Icon", "brizy"),
	        "Icon Box" => __("Icon Box", "brizy"),
	        "Icon Styles" => __("Icon Styles", "brizy"),
	        "Icons" => __("Icons", "brizy"),
	        "If filtered results is empty, fill widget with other reviews" => __("If filtered results is empty, fill widget with other reviews", "brizy"),
	        "If this is selected and you would like the image to be a fallback when no video is available make sure to select \"Images\"." => __("If this is selected and you would like the image to be a fallback when no video is available make sure to select \"Images\".", "brizy"),
	        "If this is selected and you would like the image to be a fallback when no video is available make sure to select 'Display Image'." => __("If this is selected and you would like the image to be a fallback when no video is available make sure to select 'Display Image'.", "brizy"),
	        "If this is selected and you would like the image to be a fallback when no video is available make sure to select 'Display Images'." => __("If this is selected and you would like the image to be a fallback when no video is available make sure to select 'Display Images'.", "brizy"),
	        "If this is selected the Featured Only option does not apply." => __("If this is selected the Featured Only option does not apply.", "brizy"),
	        "If this is selected the Features option does not apply." => __("If this is selected the Features option does not apply.", "brizy"),
	        "If this is selected the No featured option does not apply." => __("If this is selected the No featured option does not apply.", "brizy"),
	        "If this is selected the Non featured Only option does not apply." => __("If this is selected the Non featured Only option does not apply.", "brizy"),
	        "If you need to have multiple emails you can separate them by commas" => __("If you need to have multiple emails you can separate them by commas", "brizy"),
	        "If you need to increase max upload size please contact your hosting." => __("If you need to increase max upload size please contact your hosting.", "brizy"),
	        "Image" => __("Image", "brizy"),
	        "Image Link Text" => __("Image Link Text", "brizy"),
	        "Image Test" => __("Image Test", "brizy"),
	        "Images" => __("Images", "brizy"),
	        "Import New Block" => __("Import New Block", "brizy"),
	        "Import New Layout" => __("Import New Layout", "brizy"),
	        "Import New Popup" => __("Import New Popup", "brizy"),
	        "Import This Layout" => __("Import This Layout", "brizy"),
	        "Import This Story" => __("Import This Story", "brizy"),
	        "Import failed" => __("Import failed", "brizy"),
	        "In" => __("In", "brizy"),
	        "In Out" => __("In Out", "brizy"),
	        "In out" => __("In out", "brizy"),
	        "Include" => __("Include", "brizy"),
	        "Include Full Post" => __("Include Full Post", "brizy"),
	        "Include Q & A" => __("Include Q & A", "brizy"),
	        "Include Share Button" => __("Include Share Button", "brizy"),
	        "Include by" => __("Include by", "brizy"),
	        "Incorrect" => __("Incorrect", "brizy"),
	        "Incorrect username or password" => __("Incorrect username or password", "brizy"),
	        "Indent" => __("Indent", "brizy"),
	        "Infinite Animation" => __("Infinite Animation", "brizy"),
	        "Infinite Options" => __("Infinite Options", "brizy"),
	        "Infinite Options by ShopPad" => __("Infinite Options by ShopPad", "brizy"),
	        "Info" => __("Info", "brizy"),
	        "Information" => __("Information", "brizy"),
	        "Inherit" => __("Inherit", "brizy"),
	        "Inline" => __("Inline", "brizy"),
	        "Input" => __("Input", "brizy"),
	        "Inputted a valid site key" => __("Inputted a valid site key", "brizy"),
	        "Insert AppKey" => __("Insert AppKey", "brizy"),
	        "Insert IDs..." => __("Insert IDs...", "brizy"),
	        "Insert Text..." => __("Insert Text...", "brizy"),
	        "Insert Title..." => __("Insert Title...", "brizy"),
	        "Insert Type..." => __("Insert Type...", "brizy"),
	        "Insert Types..." => __("Insert Types...", "brizy"),
	        "Insert Vendor..." => __("Insert Vendor...", "brizy"),
	        "Insert only one of each type of upsell on your page!" => __("Insert only one of each type of upsell on your page!", "brizy"),
	        "Inset" => __("Inset", "brizy"),
	        "Inside" => __("Inside", "brizy"),
	        "Internal Links" => __("Internal Links", "brizy"),
	        "Interval" => __("Interval", "brizy"),
	        "Intro" => __("Intro", "brizy"),
	        "Invalid Dynamic Option" => __("Invalid Dynamic Option", "brizy"),
	        "Invalid api data" => __("Invalid api data", "brizy"),
	        "Invalid message" => __("Invalid message", "brizy"),
	        "Invalid uid & fileName" => __("Invalid uid & fileName", "brizy"),
	        "It" => __("It", "brizy"),
	        "It's a sample" => __("It's a sample", "brizy"),
	        "Italian" => __("Italian", "brizy"),
	        "Italic" => __("Italic", "brizy"),
	        "Item" => __("Item", "brizy"),
	        "Items" => __("Items", "brizy"),
	        "JackInTheBox" => __("JackInTheBox", "brizy"),
	        "Jello" => __("Jello", "brizy"),
	        "Justified" => __("Justified", "brizy"),
	        "Keyboard Shortcuts" => __("Keyboard Shortcuts", "brizy"),
	        "Kiwi Size Chart" => __("Kiwi Size Chart", "brizy"),
	        "Kiwi Size Chart & Recommender" => __("Kiwi Size Chart & Recommender", "brizy"),
	        "LIBRARY" => __("LIBRARY", "brizy"),
	        "Label" => __("Label", "brizy"),
	        "Label Bg" => __("Label Bg", "brizy"),
	        "Label Subtitle" => __("Label Subtitle", "brizy"),
	        "Landing Page Link" => __("Landing Page Link", "brizy"),
	        "Language" => __("Language", "brizy"),
	        "Languages" => __("Languages", "brizy"),
	        "Large" => __("Large", "brizy"),
	        "Large Centered" => __("Large Centered", "brizy"),
	        "Last Name" => __("Last Name", "brizy"),
	        "Last Visit Date" => __("Last Visit Date", "brizy"),
	        "Lateral" => __("Lateral", "brizy"),
	        "Layout" => __("Layout", "brizy"),
	        "Layouts" => __("Layouts", "brizy"),
	        "Lazy Load" => __("Lazy Load", "brizy"),
	        "Leadific" => __("Leadific", "brizy"),
	        "Left" => __("Left", "brizy"),
	        "Letter Space" => __("Letter Space", "brizy"),
	        "Level" => __("Level", "brizy"),
	        "Light" => __("Light", "brizy"),
	        "Light Speed In" => __("Light Speed In", "brizy"),
	        "Lighten" => __("Lighten", "brizy"),
	        "Like" => __("Like", "brizy"),
	        "Limit Words" => __("Limit Words", "brizy"),
	        "Limit the max number of words for review body" => __("Limit the max number of words for review body", "brizy"),
	        "Line" => __("Line", "brizy"),
	        "Line Height" => __("Line Height", "brizy"),
	        "Linear" => __("Linear", "brizy"),
	        "Link" => __("Link", "brizy"),
	        "Link Text" => __("Link Text", "brizy"),
	        "Link To Page" => __("Link To Page", "brizy"),
	        "Link to" => __("Link to", "brizy"),
	        "Links" => __("Links", "brizy"),
	        "List" => __("List", "brizy"),
	        "List View" => __("List View", "brizy"),
	        "Lists" => __("Lists", "brizy"),
	        "Lists are empty. Please add a new list and try again." => __("Lists are empty. Please add a new list and try again.", "brizy"),
	        "Load More On Scroll" => __("Load More On Scroll", "brizy"),
	        "Loading..." => __("Loading...", "brizy"),
	        "Location" => __("Location", "brizy"),
	        "Locked" => __("Locked", "brizy"),
	        "Logged" => __("Logged", "brizy"),
	        "Login" => __("Login", "brizy"),
	        "Logout" => __("Logout", "brizy"),
	        "Lookup Options" => __("Lookup Options", "brizy"),
	        "Loop" => __("Loop", "brizy"),
	        "Lost Password" => __("Lost Password", "brizy"),
	        "Lottie" => __("Lottie", "brizy"),
	        "Lottie File" => __("Lottie File", "brizy"),
	        "Lottie Link" => __("Lottie Link", "brizy"),
	        "Luminosity" => __("Luminosity", "brizy"),
	        "Main" => __("Main", "brizy"),
	        "Main product image" => __("Main product image", "brizy"),
	        "Make it Global" => __("Make it Global", "brizy"),
	        "Make it Hamburger" => __("Make it Hamburger", "brizy"),
	        "Make it Nofollow" => __("Make it Nofollow", "brizy"),
	        "Make it a Slider" => __("Make it a Slider", "brizy"),
	        "Manual" => __("Manual", "brizy"),
	        "Map" => __("Map", "brizy"),
	        "Margin" => __("Margin", "brizy"),
	        "Marketing" => __("Marketing", "brizy"),
	        "Marketing by Marsello" => __("Marketing by Marsello", "brizy"),
	        "Marketing by Omnisend" => __("Marketing by Omnisend", "brizy"),
	        "Marketing by Social SnowBall" => __("Marketing by Social SnowBall", "brizy"),
	        "Mask" => __("Mask", "brizy"),
	        "Masonry" => __("Masonry", "brizy"),
	        "Masonry Arrangement" => __("Masonry Arrangement", "brizy"),
	        "Max" => __("Max", "brizy"),
	        "Max Date" => __("Max Date", "brizy"),
	        "Max Time" => __("Max Time", "brizy"),
	        "Max number error message" => __("Max number error message", "brizy"),
	        "Max. File Size" => __("Max. File Size", "brizy"),
	        "Media" => __("Media", "brizy"),
	        "Media Corner" => __("Media Corner", "brizy"),
	        "Media Links" => __("Media Links", "brizy"),
	        "Medium" => __("Medium", "brizy"),
	        "Meeting Day" => __("Meeting Day", "brizy"),
	        "Meeting Time" => __("Meeting Time", "brizy"),
	        "Meeting day" => __("Meeting day", "brizy"),
	        "Meeting times" => __("Meeting times", "brizy"),
	        "Mega Menu" => __("Mega Menu", "brizy"),
	        "Membership" => __("Membership", "brizy"),
	        "Mention" => __("Mention", "brizy"),
	        "Menu" => __("Menu", "brizy"),
	        "Menu Items" => __("Menu Items", "brizy"),
	        "Menu Order" => __("Menu Order", "brizy"),
	        "Menu order" => __("Menu order", "brizy"),
	        "Message" => __("Message", "brizy"),
	        "Message not sent" => __("Message not sent", "brizy"),
	        "Message sent" => __("Message sent", "brizy"),
	        "Messages" => __("Messages", "brizy"),
	        "Meta" => __("Meta", "brizy"),
	        "Meta Data" => __("Meta Data", "brizy"),
	        "Meta Headings" => __("Meta Headings", "brizy"),
	        "Meta Key" => __("Meta Key", "brizy"),
	        "Meta Value" => __("Meta Value", "brizy"),
	        "Metafield" => __("Metafield", "brizy"),
	        "Min" => __("Min", "brizy"),
	        "Min Date" => __("Min Date", "brizy"),
	        "Min Time" => __("Min Time", "brizy"),
	        "Min number error message" => __("Min number error message", "brizy"),
	        "Minimal" => __("Minimal", "brizy"),
	        "Minimum Rating" => __("Minimum Rating", "brizy"),
	        "Ministry Content - Event Calendar - module fields have been updated." => __("Ministry Content - Event Calendar - module fields have been updated.", "brizy"),
	        "Ministry Content - Event Detail - module fields have been updated." => __("Ministry Content - Event Detail - module fields have been updated.", "brizy"),
	        "Ministry Content - Event Featured - module fields have been updated." => __("Ministry Content - Event Featured - module fields have been updated.", "brizy"),
	        "Ministry Content - Event Layout - module fields have been updated." => __("Ministry Content - Event Layout - module fields have been updated.", "brizy"),
	        "Ministry Content - Event List - module fields have been updated." => __("Ministry Content - Event List - module fields have been updated.", "brizy"),
	        "Ministry Content - Form Widget - module fields have been updated." => __("Ministry Content - Form Widget - module fields have been updated.", "brizy"),
	        "Ministry Content - Group Detail - module fields have been updated." => __("Ministry Content - Group Detail - module fields have been updated.", "brizy"),
	        "Ministry Content - Group Featured - module fields have been updated." => __("Ministry Content - Group Featured - module fields have been updated.", "brizy"),
	        "Ministry Content - Group Layout - module fields have been updated." => __("Ministry Content - Group Layout - module fields have been updated.", "brizy"),
	        "Ministry Content - Group List - module fields have been updated." => __("Ministry Content - Group List - module fields have been updated.", "brizy"),
	        "Ministry Content - Group Slider - module fields have been updated." => __("Ministry Content - Group Slider - module fields have been updated.", "brizy"),
	        "Ministry Content - Sermon Detail - module fields have been updated." => __("Ministry Content - Sermon Detail - module fields have been updated.", "brizy"),
	        "Ministry Content - Sermon Featured - module fields have been updated." => __("Ministry Content - Sermon Featured - module fields have been updated.", "brizy"),
	        "Ministry Content - Sermon Layout - module fields have been updated." => __("Ministry Content - Sermon Layout - module fields have been updated.", "brizy"),
	        "Ministry Content - Sermon List - module fields have been updated." => __("Ministry Content - Sermon List - module fields have been updated.", "brizy"),
	        "Minutes" => __("Minutes", "brizy"),
	        "Missing AI handler in api-client" => __("Missing AI handler in api-client", "brizy"),
	        "Missing Auth Token in config" => __("Missing Auth Token in config", "brizy"),
	        "Missing Element" => __("Missing Element", "brizy"),
	        "Missing Menus" => __("Missing Menus", "brizy"),
	        "Missing addMediaGallery key in config.api" => __("Missing addMediaGallery key in config.api", "brizy"),
	        "Missing api handler in config" => __("Missing api handler in config", "brizy"),
	        "Missing create screenshots in api config" => __("Missing create screenshots in api config", "brizy"),
	        "Missing page data in config" => __("Missing page data in config", "brizy"),
	        "Missing project data in config" => __("Missing project data in config", "brizy"),
	        "Missing update screenshots in api config" => __("Missing update screenshots in api config", "brizy"),
	        "Mobile" => __("Mobile", "brizy"),
	        "Mobile Grid Style" => __("Mobile Grid Style", "brizy"),
	        "Mobile view" => __("Mobile view", "brizy"),
	        "Modified" => __("Modified", "brizy"),
	        "Months" => __("Months", "brizy"),
	        "More" => __("More", "brizy"),
	        "More Settings" => __("More Settings", "brizy"),
	        "MouseTrack" => __("MouseTrack", "brizy"),
	        "Move" => __("Move", "brizy"),
	        "Move down" => __("Move down", "brizy"),
	        "Move left" => __("Move left", "brizy"),
	        "Move right" => __("Move right", "brizy"),
	        "Move up" => __("Move up", "brizy"),
	        "Multi-Language" => __("Multi-Language", "brizy"),
	        "Multiple Selection" => __("Multiple Selection", "brizy"),
	        "Multiply" => __("Multiply", "brizy"),
	        "Muted" => __("Muted", "brizy"),
	        "My Account" => __("My Account", "brizy"),
	        "N/A" => __("N/A", "brizy"),
	        "Name" => __("Name", "brizy"),
	        "Name - First on Mobile" => __("Name - First on Mobile", "brizy"),
	        "Native HTML5" => __("Native HTML5", "brizy"),
	        "Nav" => __("Nav", "brizy"),
	        "Navigation" => __("Navigation", "brizy"),
	        "Need help" => __("Need help", "brizy"),
	        "New Style #%s" => __("New Style #%s", "brizy"),
	        "Nl" => __("Nl", "brizy"),
	        "No Repeat" => __("No Repeat", "brizy"),
	        "No blogs yet!" => __("No blogs yet!", "brizy"),
	        "No collections yet!" => __("No collections yet!", "brizy"),
	        "No custom fields found!" => __("No custom fields found!", "brizy"),
	        "No lists were created, please contact our support" => __("No lists were created, please contact our support", "brizy"),
	        "No matches found" => __("No matches found", "brizy"),
	        "No other popup" => __("No other popup", "brizy"),
	        "No product selected" => __("No product selected", "brizy"),
	        "No products yet!" => __("No products yet!", "brizy"),
	        "No results" => __("No results", "brizy"),
	        "Non Featured" => __("Non Featured", "brizy"),
	        "None" => __("None", "brizy"),
	        "Normal" => __("Normal", "brizy"),
	        "Not Required" => __("Not Required", "brizy"),
	        "Not logged" => __("Not logged", "brizy"),
	        "Notes" => __("Notes", "brizy"),
	        "Nothing Found" => __("Nothing Found", "brizy"),
	        "Nothing here yet, make a global block first." => __("Nothing here yet, make a global block first.", "brizy"),
	        "Nothing here yet, make a global popup first." => __("Nothing here yet, make a global popup first.", "brizy"),
	        "Nothing here yet, save a block first." => __("Nothing here yet, save a block first.", "brizy"),
	        "Nothing here yet, save a layout first." => __("Nothing here yet, save a layout first.", "brizy"),
	        "Nothing here yet, save a popup first." => __("Nothing here yet, save a popup first.", "brizy"),
	        "Nothing here, please refine your search." => __("Nothing here, please refine your search.", "brizy"),
	        "Notification" => __("Notification", "brizy"),
	        "Notifications" => __("Notifications", "brizy"),
	        "Notifications by OnVoard" => __("Notifications by OnVoard", "brizy"),
	        "Notifications by PushOwl" => __("Notifications by PushOwl", "brizy"),
	        "Notifications by ReferralCandy" => __("Notifications by ReferralCandy", "brizy"),
	        "Nr." => __("Nr.", "brizy"),
	        "Number" => __("Number", "brizy"),
	        "Number of" => __("Number of", "brizy"),
	        "Number of Reviews" => __("Number of Reviews", "brizy"),
	        "Number of items in stock" => __("Number of items in stock", "brizy"),
	        "Number of months" => __("Number of months", "brizy"),
	        "Number of posts" => __("Number of posts", "brizy"),
	        "Odd Bg" => __("Odd Bg", "brizy"),
	        "Offset" => __("Offset", "brizy"),
	        "On Click" => __("On Click", "brizy"),
	        "On Hover" => __("On Hover", "brizy"),
	        "On Page Exit Intent" => __("On Page Exit Intent", "brizy"),
	        "On Page Load" => __("On Page Load", "brizy"),
	        "On Scroll" => __("On Scroll", "brizy"),
	        "Only select if 'Display Video' is not selected." => __("Only select if 'Display Video' is not selected.", "brizy"),
	        "Open In New Tab" => __("Open In New Tab", "brizy"),
	        "Open in Lightbox" => __("Open in Lightbox", "brizy"),
	        "Operating System" => __("Operating System", "brizy"),
	        "Opposite" => __("Opposite", "brizy"),
	        "Options" => __("Options", "brizy"),
	        "Options by Hulk" => __("Options by Hulk", "brizy"),
	        "Order" => __("Order", "brizy"),
	        "Order By" => __("Order By", "brizy"),
	        "Order Tracking" => __("Order Tracking", "brizy"),
	        "Order Tracking by Automizely" => __("Order Tracking by Automizely", "brizy"),
	        "Organic" => __("Organic", "brizy"),
	        "Orientation" => __("Orientation", "brizy"),
	        "Other" => __("Other", "brizy"),
	        "Other specific popup" => __("Other specific popup", "brizy"),
	        "Others" => __("Others", "brizy"),
	        "Out" => __("Out", "brizy"),
	        "Out In" => __("Out In", "brizy"),
	        "Outline" => __("Outline", "brizy"),
	        "Outset" => __("Outset", "brizy"),
	        "Outside" => __("Outside", "brizy"),
	        "Overlay" => __("Overlay", "brizy"),
	        "Overlay " => __("Overlay ", "brizy"),
	        "P" => __("P", "brizy"),
	        "POWR Form Embed code" => __("POWR Form Embed code", "brizy"),
	        "Padding" => __("Padding", "brizy"),
	        "Page" => __("Page", "brizy"),
	        "Page Template" => __("Page Template", "brizy"),
	        "Page Title" => __("Page Title", "brizy"),
	        "Page URL" => __("Page URL", "brizy"),
	        "Page title" => __("Page title", "brizy"),
	        "Pages" => __("Pages", "brizy"),
	        "Pagination" => __("Pagination", "brizy"),
	        "Paragraph" => __("Paragraph", "brizy"),
	        "Parallax" => __("Parallax", "brizy"),
	        "Parcel Panel Order Tracking" => __("Parcel Panel Order Tracking", "brizy"),
	        "Parent" => __("Parent", "brizy"),
	        "Parent Category" => __("Parent Category", "brizy"),
	        "Passage" => __("Passage", "brizy"),
	        "Passages" => __("Passages", "brizy"),
	        "Password" => __("Password", "brizy"),
	        "Password and confirm password is not the same" => __("Password and confirm password is not the same", "brizy"),
	        "Paste" => __("Paste", "brizy"),
	        "Paste Style" => __("Paste Style", "brizy"),
	        "Paste Styles" => __("Paste Styles", "brizy"),
	        "Paste your HTML code here..." => __("Paste your HTML code here...", "brizy"),
	        "Pending" => __("Pending", "brizy"),
	        "Percent" => __("Percent", "brizy"),
	        "Percentage" => __("Percentage", "brizy"),
	        "Personalizer by Zepto" => __("Personalizer by Zepto", "brizy"),
	        "Phone Number" => __("Phone Number", "brizy"),
	        "Pinterest" => __("Pinterest", "brizy"),
	        "Pl" => __("Pl", "brizy"),
	        "Placeholder" => __("Placeholder", "brizy"),
	        "Plain" => __("Plain", "brizy"),
	        "Play" => __("Play", "brizy"),
	        "Play Counts" => __("Play Counts", "brizy"),
	        "Playback" => __("Playback", "brizy"),
	        "Player" => __("Player", "brizy"),
	        "Playlist" => __("Playlist", "brizy"),
	        "Playlist Items" => __("Playlist Items", "brizy"),
	        "Pop" => __("Pop", "brizy"),
	        "Popularity" => __("Popularity", "brizy"),
	        "Popup" => __("Popup", "brizy"),
	        "Popup Close Icon" => __("Popup Close Icon", "brizy"),
	        "Popups" => __("Popups", "brizy"),
	        "Port" => __("Port", "brizy"),
	        "Position" => __("Position", "brizy"),
	        "Post" => __("Post", "brizy"),
	        "Post Content" => __("Post Content", "brizy"),
	        "Post Excerpt" => __("Post Excerpt", "brizy"),
	        "Post Info" => __("Post Info", "brizy"),
	        "Post Navigation" => __("Post Navigation", "brizy"),
	        "Post Subscription Text" => __("Post Subscription Text", "brizy"),
	        "Post Title" => __("Post Title", "brizy"),
	        "Post Type" => __("Post Type", "brizy"),
	        "Post info" => __("Post info", "brizy"),
	        "Post-display Button" => __("Post-display Button", "brizy"),
	        "Posts" => __("Posts", "brizy"),
	        "Posts Pagination" => __("Posts Pagination", "brizy"),
	        "Posts Tags" => __("Posts Tags", "brizy"),
	        "Pre-display" => __("Pre-display", "brizy"),
	        "PreProduct" => __("PreProduct", "brizy"),
	        "Preacher" => __("Preacher", "brizy"),
	        "Prefix" => __("Prefix", "brizy"),
	        "Press the button above to add blocks" => __("Press the button above to add blocks", "brizy"),
	        "Press the button above to add popup" => __("Press the button above to add popup", "brizy"),
	        "Press the button to add blocks" => __("Press the button to add blocks", "brizy"),
	        "Preview" => __("Preview", "brizy"),
	        "Preview (ctrl+shift+P)" => __("Preview (ctrl+shift+P)", "brizy"),
	        "Preview Page" => __("Preview Page", "brizy"),
	        "Preview additional Images" => __("Preview additional Images", "brizy"),
	        "Previous Page" => __("Previous Page", "brizy"),
	        "Price" => __("Price", "brizy"),
	        "Privacy Mode" => __("Privacy Mode", "brizy"),
	        "Private" => __("Private", "brizy"),
	        "Product" => __("Product", "brizy"),
	        "Product Attributes" => __("Product Attributes", "brizy"),
	        "Product Breadcrumbs" => __("Product Breadcrumbs", "brizy"),
	        "Product Content" => __("Product Content", "brizy"),
	        "Product Excerpt" => __("Product Excerpt", "brizy"),
	        "Product Gallery" => __("Product Gallery", "brizy"),
	        "Product ID" => __("Product ID", "brizy"),
	        "Product ID or SKU" => __("Product ID or SKU", "brizy"),
	        "Product IDs" => __("Product IDs", "brizy"),
	        "Product Meta" => __("Product Meta", "brizy"),
	        "Product Options" => __("Product Options", "brizy"),
	        "Product Options by Bold" => __("Product Options by Bold", "brizy"),
	        "Product Options by Hulk" => __("Product Options by Hulk", "brizy"),
	        "Product Price" => __("Product Price", "brizy"),
	        "Product Rating" => __("Product Rating", "brizy"),
	        "Product Review" => __("Product Review", "brizy"),
	        "Product SKU" => __("Product SKU", "brizy"),
	        "Product Source" => __("Product Source", "brizy"),
	        "Product Stock" => __("Product Stock", "brizy"),
	        "Product Thumbnail" => __("Product Thumbnail", "brizy"),
	        "Product Title" => __("Product Title", "brizy"),
	        "Product Type" => __("Product Type", "brizy"),
	        "Product Vendor" => __("Product Vendor", "brizy"),
	        "Products" => __("Products", "brizy"),
	        "Products Count" => __("Products Count", "brizy"),
	        "Products Pagination" => __("Products Pagination", "brizy"),
	        "Products Tags" => __("Products Tags", "brizy"),
	        "Professional" => __("Professional", "brizy"),
	        "Progress" => __("Progress", "brizy"),
	        "Protected Form" => __("Protected Form", "brizy"),
	        "Protected Page" => __("Protected Page", "brizy"),
	        "Pt" => __("Pt", "brizy"),
	        "Publish" => __("Publish", "brizy"),
	        "Publish Page" => __("Publish Page", "brizy"),
	        "Pulse" => __("Pulse", "brizy"),
	        "Pulse Grow" => __("Pulse Grow", "brizy"),
	        "Pulse Shrink" => __("Pulse Shrink", "brizy"),
	        "Push" => __("Push", "brizy"),
	        "Quantity" => __("Quantity", "brizy"),
	        "Query" => __("Query", "brizy"),
	        "Query Source" => __("Query Source", "brizy"),
	        "Radial" => __("Radial", "brizy"),
	        "Radio" => __("Radio", "brizy"),
	        "Random" => __("Random", "brizy"),
	        "Randomize the reviews results" => __("Randomize the reviews results", "brizy"),
	        "Rating" => __("Rating", "brizy"),
	        "Rating scale" => __("Rating scale", "brizy"),
	        "Ratio" => __("Ratio", "brizy"),
	        "ReCAPTCHA" => __("ReCAPTCHA", "brizy"),
	        "Recent Events" => __("Recent Events", "brizy"),
	        "Recent Groups" => __("Recent Groups", "brizy"),
	        "Recent Sermons" => __("Recent Sermons", "brizy"),
	        "Recommend" => __("Recommend", "brizy"),
	        "Redirect" => __("Redirect", "brizy"),
	        "Redirect After Login" => __("Redirect After Login", "brizy"),
	        "Redirect After Logout" => __("Redirect After Logout", "brizy"),
	        "Redo" => __("Redo", "brizy"),
	        "Redo (ctrl+shift+Z)" => __("Redo (ctrl+shift+Z)", "brizy"),
	        "Referral" => __("Referral", "brizy"),
	        "Refresh" => __("Refresh", "brizy"),
	        "Regex" => __("Regex", "brizy"),
	        "Register" => __("Register", "brizy"),
	        "Register Info" => __("Register Info", "brizy"),
	        "Registration" => __("Registration", "brizy"),
	        "Related Products" => __("Related Products", "brizy"),
	        "Related Products Pagination" => __("Related Products Pagination", "brizy"),
	        "Related Products Tags" => __("Related Products Tags", "brizy"),
	        "Remember me" => __("Remember me", "brizy"),
	        "Remote IP" => __("Remote IP", "brizy"),
	        "Remove" => __("Remove", "brizy"),
	        "Renderer" => __("Renderer", "brizy"),
	        "Reorder Blocks" => __("Reorder Blocks", "brizy"),
	        "Repeat" => __("Repeat", "brizy"),
	        "Repeat-X" => __("Repeat-X", "brizy"),
	        "Repeat-Y" => __("Repeat-Y", "brizy"),
	        "Replace global styling" => __("Replace global styling", "brizy"),
	        "Replay Animation" => __("Replay Animation", "brizy"),
	        "Reply" => __("Reply", "brizy"),
	        "Reply-To" => __("Reply-To", "brizy"),
	        "Required" => __("Required", "brizy"),
	        "Reset Password" => __("Reset Password", "brizy"),
	        "Resource Link" => __("Resource Link", "brizy"),
	        "Resource link" => __("Resource link", "brizy"),
	        "Responsive Zoom Out / In" => __("Responsive Zoom Out / In", "brizy"),
	        "Reverse" => __("Reverse", "brizy"),
	        "Reverse Columns" => __("Reverse Columns", "brizy"),
	        "Review" => __("Review", "brizy"),
	        "Review IDs" => __("Review IDs", "brizy"),
	        "Review Logic" => __("Review Logic", "brizy"),
	        "Review Type" => __("Review Type", "brizy"),
	        "Review by AliExpress" => __("Review by AliExpress", "brizy"),
	        "Review by Growave" => __("Review by Growave", "brizy"),
	        "Review by Judge" => __("Review by Judge", "brizy"),
	        "Review by Loox" => __("Review by Loox", "brizy"),
	        "Review by Okendo" => __("Review by Okendo", "brizy"),
	        "Review by Opinew" => __("Review by Opinew", "brizy"),
	        "Review by Rivyo" => __("Review by Rivyo", "brizy"),
	        "Review by Vitals" => __("Review by Vitals", "brizy"),
	        "Reviews" => __("Reviews", "brizy"),
	        "Reviews Limit" => __("Reviews Limit", "brizy"),
	        "Reviews Type" => __("Reviews Type", "brizy"),
	        "Reviews by Ali" => __("Reviews by Ali", "brizy"),
	        "Reviews by Areview" => __("Reviews by Areview", "brizy"),
	        "Reviews by Fera" => __("Reviews by Fera", "brizy"),
	        "Reviews by Growave" => __("Reviews by Growave", "brizy"),
	        "Reviews by Lai" => __("Reviews by Lai", "brizy"),
	        "Reviews by Stamped" => __("Reviews by Stamped", "brizy"),
	        "Reviews by Vitals" => __("Reviews by Vitals", "brizy"),
	        "Reviews with Photo" => __("Reviews with Photo", "brizy"),
	        "Ribbon" => __("Ribbon", "brizy"),
	        "Right" => __("Right", "brizy"),
	        "Roles" => __("Roles", "brizy"),
	        "Roll In" => __("Roll In", "brizy"),
	        "Room" => __("Room", "brizy"),
	        "Rotate" => __("Rotate", "brizy"),
	        "Rotation" => __("Rotation", "brizy"),
	        "Round" => __("Round", "brizy"),
	        "Row" => __("Row", "brizy"),
	        "Rows" => __("Rows", "brizy"),
	        "Rubber Band" => __("Rubber Band", "brizy"),
	        "Russian" => __("Russian", "brizy"),
	        "SELECT ACCOUNT" => __("SELECT ACCOUNT", "brizy"),
	        "SELECT FOR WHAT THE TEMPLATE IS USED" => __("SELECT FOR WHAT THE TEMPLATE IS USED", "brizy"),
	        "SELECT LIST" => __("SELECT LIST", "brizy"),
	        "SKU" => __("SKU", "brizy"),
	        "SMS Marketing" => __("SMS Marketing", "brizy"),
	        "SMS Marketing by Yotpo" => __("SMS Marketing by Yotpo", "brizy"),
	        "SMSBump's embed code" => __("SMSBump's embed code", "brizy"),
	        "SSL" => __("SSL", "brizy"),
	        "START BUILDING YOUR PAGE" => __("START BUILDING YOUR PAGE", "brizy"),
	        "START BUILDING YOUR POPUP" => __("START BUILDING YOUR POPUP", "brizy"),
	        "STYLES" => __("STYLES", "brizy"),
	        "SWITCH TO DESKTOP" => __("SWITCH TO DESKTOP", "brizy"),
	        "Sale" => __("Sale", "brizy"),
	        "Same Page" => __("Same Page", "brizy"),
	        "Saturation" => __("Saturation", "brizy"),
	        "Save" => __("Save", "brizy"),
	        "Save & Publish" => __("Save & Publish", "brizy"),
	        "Save Draft" => __("Save Draft", "brizy"),
	        "Save Layout" => __("Save Layout", "brizy"),
	        "Saved" => __("Saved", "brizy"),
	        "Saved Library is syncing to your Account" => __("Saved Library is syncing to your Account", "brizy"),
	        "Saved Popups" => __("Saved Popups", "brizy"),
	        "Saving" => __("Saving", "brizy"),
	        "Scale" => __("Scale", "brizy"),
	        "Screen" => __("Screen", "brizy"),
	        "Scroll" => __("Scroll", "brizy"),
	        "Scroll Page Behind" => __("Scroll Page Behind", "brizy"),
	        "Seal Type" => __("Seal Type", "brizy"),
	        "Seals" => __("Seals", "brizy"),
	        "Search" => __("Search", "brizy"),
	        "Search Filter" => __("Search Filter", "brizy"),
	        "Search element" => __("Search element", "brizy"),
	        "Seconds" => __("Seconds", "brizy"),
	        "Section" => __("Section", "brizy"),
	        "Select" => __("Select", "brizy"),
	        "Select Parent Element" => __("Select Parent Element", "brizy"),
	        "Select Product" => __("Select Product", "brizy"),
	        "Select Seal" => __("Select Seal", "brizy"),
	        "Select a Menu" => __("Select a Menu", "brizy"),
	        "Select a menu from the element options" => __("Select a menu from the element options", "brizy"),
	        "Select a recent event as an example to style/setup. Since this is the events detail landing page this event will be replaced with the linked event." => __("Select a recent event as an example to style/setup. Since this is the events detail landing page this event will be replaced with the linked event.", "brizy"),
	        "Select a recent event. Use only if you are not using \"Event Slug\" below and \"Show Latest\" is set to \"Off\"." => __("Select a recent event. Use only if you are not using \"Event Slug\" below and \"Show Latest\" is set to \"Off\".", "brizy"),
	        "Select a recent group. Use only if you are not using 'Group Slug' below and 'Show Latest' is set to 'Off'." => __("Select a recent group. Use only if you are not using 'Group Slug' below and 'Show Latest' is set to 'Off'.", "brizy"),
	        "Select a recent sermon as an example to style/setup. Since this is the sermon detail landing page this sermon will be replaced with the linked sermon." => __("Select a recent sermon as an example to style/setup. Since this is the sermon detail landing page this sermon will be replaced with the linked sermon.", "brizy"),
	        "Select a recent sermon. Use only if you are not using 'Sermon Slug' below and 'Show Latest' is set to 'Off'." => __("Select a recent sermon. Use only if you are not using 'Sermon Slug' below and 'Show Latest' is set to 'Off'.", "brizy"),
	        "Select an element on the page to display more settings" => __("Select an element on the page to display more settings", "brizy"),
	        "Select tags" => __("Select tags", "brizy"),
	        "Select..." => __("Select...", "brizy"),
	        "Semi Bold" => __("Semi Bold", "brizy"),
	        "Separator" => __("Separator", "brizy"),
	        "Series" => __("Series", "brizy"),
	        "Series Filter" => __("Series Filter", "brizy"),
	        "Sermon Detail" => __("Sermon Detail", "brizy"),
	        "Sermon Featured" => __("Sermon Featured", "brizy"),
	        "Sermon Layout" => __("Sermon Layout", "brizy"),
	        "Sermon List" => __("Sermon List", "brizy"),
	        "Sermon Slug..." => __("Sermon Slug...", "brizy"),
	        "Sessions" => __("Sessions", "brizy"),
	        "Set as Homepage" => __("Set as Homepage", "brizy"),
	        "Set your custom attribute for wrapper element. Each attribute in a separate line. Separate attribute key from the value using : character." => __("Set your custom attribute for wrapper element. Each attribute in a separate line. Separate attribute key from the value using : character.", "brizy"),
	        "Settings" => __("Settings", "brizy"),
	        "Shadow" => __("Shadow", "brizy"),
	        "Shake" => __("Shake", "brizy"),
	        "Shape" => __("Shape", "brizy"),
	        "Share" => __("Share", "brizy"),
	        "Share Buttons" => __("Share Buttons", "brizy"),
	        "Shop Cart" => __("Shop Cart", "brizy"),
	        "Shop Categories" => __("Shop Categories", "brizy"),
	        "Shop Pages" => __("Shop Pages", "brizy"),
	        "Shop Products" => __("Shop Products", "brizy"),
	        "Shopping Bag" => __("Shopping Bag", "brizy"),
	        "Short Code" => __("Short Code", "brizy"),
	        "Shortcode" => __("Shortcode", "brizy"),
	        "Shortcuts" => __("Shortcuts", "brizy"),
	        "Shorten" => __("Shorten", "brizy"),
	        "Shortname" => __("Shortname", "brizy"),
	        "Show" => __("Show", "brizy"),
	        "Show After X" => __("Show After X", "brizy"),
	        "Show Button Counter" => __("Show Button Counter", "brizy"),
	        "Show Friend's Faces" => __("Show Friend's Faces", "brizy"),
	        "Show Heading" => __("Show Heading", "brizy"),
	        "Show Hidden Elements" => __("Show Hidden Elements", "brizy"),
	        "Show If Language" => __("Show If Language", "brizy"),
	        "Show Latest" => __("Show Latest", "brizy"),
	        "Show Meta Data" => __("Show Meta Data", "brizy"),
	        "Show Navigation" => __("Show Navigation", "brizy"),
	        "Show Original image" => __("Show Original image", "brizy"),
	        "Show Product Image" => __("Show Product Image", "brizy"),
	        "Show QTY" => __("Show QTY", "brizy"),
	        "Show Social Context" => __("Show Social Context", "brizy"),
	        "Show Total Reviews" => __("Show Total Reviews", "brizy"),
	        "Show Total Reviews Count And Average Ratings" => __("Show Total Reviews Count And Average Ratings", "brizy"),
	        "Show message" => __("Show message", "brizy"),
	        "Show on Desktop" => __("Show on Desktop", "brizy"),
	        "Show on devices" => __("Show on devices", "brizy"),
	        "Show only reviews above the selected minimum rating" => __("Show only reviews above the selected minimum rating", "brizy"),
	        "Show to" => __("Show to", "brizy"),
	        "Showcase" => __("Showcase", "brizy"),
	        "Shrink" => __("Shrink", "brizy"),
	        "Sidebar" => __("Sidebar", "brizy"),
	        "Sign Up" => __("Sign Up", "brizy"),
	        "Sign in link" => __("Sign in link", "brizy"),
	        "Simplify" => __("Simplify", "brizy"),
	        "Size" => __("Size", "brizy"),
	        "Skew" => __("Skew", "brizy"),
	        "Skew Backward" => __("Skew Backward", "brizy"),
	        "Skew Forward" => __("Skew Forward", "brizy"),
	        "Skin" => __("Skin", "brizy"),
	        "Skin 1" => __("Skin 1", "brizy"),
	        "Skin 2" => __("Skin 2", "brizy"),
	        "Skin 3" => __("Skin 3", "brizy"),
	        "Skin 4" => __("Skin 4", "brizy"),
	        "Skip" => __("Skip", "brizy"),
	        "Slide" => __("Slide", "brizy"),
	        "Slide Size" => __("Slide Size", "brizy"),
	        "Slider" => __("Slider", "brizy"),
	        "Slides" => __("Slides", "brizy"),
	        "Slug" => __("Slug", "brizy"),
	        "Slug of event (my-event-name). Use only if you are not selecting from the \"Recent Events\" above and \"Show Latest\" is set to \"Off\"." => __("Slug of event (my-event-name). Use only if you are not selecting from the \"Recent Events\" above and \"Show Latest\" is set to \"Off\".", "brizy"),
	        "Slug of group. Use only if you are not selecting from the 'Recent Groups' above and 'Show Latest' is set to 'Off'." => __("Slug of group. Use only if you are not selecting from the 'Recent Groups' above and 'Show Latest' is set to 'Off'.", "brizy"),
	        "Slug of sermon (my-sermon-name). Use only if you are not selecting from the 'Recent Sermons' above and 'Show Latest' is set to 'Off'." => __("Slug of sermon (my-sermon-name). Use only if you are not selecting from the 'Recent Sermons' above and 'Show Latest' is set to 'Off'.", "brizy"),
	        "Slug..." => __("Slug...", "brizy"),
	        "Small" => __("Small", "brizy"),
	        "Snowball" => __("Snowball", "brizy"),
	        "Social Networks" => __("Social Networks", "brizy"),
	        "Solid" => __("Solid", "brizy"),
	        "Some integrations are available only in PRO" => __("Some integrations are available only in PRO", "brizy"),
	        "Something went wrong" => __("Something went wrong", "brizy"),
	        "Something went wrong on getting blockResolve data" => __("Something went wrong on getting blockResolve data", "brizy"),
	        "Something went wrong on getting blocks." => __("Something went wrong on getting blocks.", "brizy"),
	        "Something went wrong on getting layouts." => __("Something went wrong on getting layouts.", "brizy"),
	        "Something went wrong on getting meta" => __("Something went wrong on getting meta", "brizy"),
	        "Something went wrong on getting popups." => __("Something went wrong on getting popups.", "brizy"),
	        "Something went wrong on publish" => __("Something went wrong on publish", "brizy"),
	        "Something went wrong, please try again" => __("Something went wrong, please try again", "brizy"),
	        "Sort alphabetically" => __("Sort alphabetically", "brizy"),
	        "Sorting Options" => __("Sorting Options", "brizy"),
	        "SoundCloud" => __("SoundCloud", "brizy"),
	        "SoundCloud Link" => __("SoundCloud Link", "brizy"),
	        "Source" => __("Source", "brizy"),
	        "Space" => __("Space", "brizy"),
	        "Spacer" => __("Spacer", "brizy"),
	        "Spacing" => __("Spacing", "brizy"),
	        "Spanish" => __("Spanish", "brizy"),
	        "Speaker Filter" => __("Speaker Filter", "brizy"),
	        "Special Offers" => __("Special Offers", "brizy"),
	        "Specific Category" => __("Specific Category", "brizy"),
	        "Specific Product" => __("Specific Product", "brizy"),
	        "Specific User" => __("Specific User", "brizy"),
	        "Specify a start time (in seconds)" => __("Specify a start time (in seconds)", "brizy"),
	        "Specify an alternate text for the image, if it cannot be displayed." => __("Specify an alternate text for the image, if it cannot be displayed.", "brizy"),
	        "Specify an end time (in seconds)" => __("Specify an end time (in seconds)", "brizy"),
	        "Speed" => __("Speed", "brizy"),
	        "Square" => __("Square", "brizy"),
	        "Stamped Reviews" => __("Stamped Reviews", "brizy"),
	        "Star" => __("Star", "brizy"),
	        "Stars" => __("Stars", "brizy"),
	        "Stars Bg" => __("Stars Bg", "brizy"),
	        "Start" => __("Start", "brizy"),
	        "Static" => __("Static", "brizy"),
	        "Status" => __("Status", "brizy"),
	        "Sticky" => __("Sticky", "brizy"),
	        "Stock" => __("Stock", "brizy"),
	        "Stock Availability labels" => __("Stock Availability labels", "brizy"),
	        "Stop Time" => __("Stop Time", "brizy"),
	        "Stories" => __("Stories", "brizy"),
	        "Story" => __("Story", "brizy"),
	        "Strike" => __("Strike", "brizy"),
	        "Stroke" => __("Stroke", "brizy"),
	        "Style" => __("Style", "brizy"),
	        "Styles" => __("Styles", "brizy"),
	        "Styling" => __("Styling", "brizy"),
	        "Sub Title" => __("Sub Title", "brizy"),
	        "Subject" => __("Subject", "brizy"),
	        "Submit Form" => __("Submit Form", "brizy"),
	        "Subscribe to Calendar" => __("Subscribe to Calendar", "brizy"),
	        "Subscribers are automatically synced to your" => __("Subscribers are automatically synced to your", "brizy"),
	        "Subscribers will automatically be synced to your Cloud list." => __("Subscribers will automatically be synced to your Cloud list.", "brizy"),
	        "Subscribers will automatically be synced to your WordPress list." => __("Subscribers will automatically be synced to your WordPress list.", "brizy"),
	        "Subscribtion by Paywhirl" => __("Subscribtion by Paywhirl", "brizy"),
	        "Subscription by Appstle" => __("Subscription by Appstle", "brizy"),
	        "Subscription by Bold" => __("Subscription by Bold", "brizy"),
	        "Subscription by Paywhirl" => __("Subscription by Paywhirl", "brizy"),
	        "Subscription by Seal" => __("Subscription by Seal", "brizy"),
	        "Subscriptions by Recharge" => __("Subscriptions by Recharge", "brizy"),
	        "Subtitle" => __("Subtitle", "brizy"),
	        "Subtotal" => __("Subtotal", "brizy"),
	        "Success" => __("Success", "brizy"),
	        "Suffix" => __("Suffix", "brizy"),
	        "Suggested Videos" => __("Suggested Videos", "brizy"),
	        "Surcharge" => __("Surcharge", "brizy"),
	        "Swing" => __("Swing", "brizy"),
	        "Switch to Draft" => __("Switch to Draft", "brizy"),
	        "Switch to desktop to add blocks" => __("Switch to desktop to add blocks", "brizy"),
	        "Switch to desktop to add popup" => __("Switch to desktop to add popup", "brizy"),
	        "Switcher" => __("Switcher", "brizy"),
	        "Sync Now" => __("Sync Now", "brizy"),
	        "Sync your Library into the cloud by connecting your account" => __("Sync your Library into the cloud by connecting your account", "brizy"),
	        "TAG" => __("TAG", "brizy"),
	        "TIME" => __("TIME", "brizy"),
	        "TLS" => __("TLS", "brizy"),
	        "TTF File" => __("TTF File", "brizy"),
	        "Tab" => __("Tab", "brizy"),
	        "Table" => __("Table", "brizy"),
	        "Table Head" => __("Table Head", "brizy"),
	        "Table Sidebar" => __("Table Sidebar", "brizy"),
	        "Tablet" => __("Tablet", "brizy"),
	        "Tablet view" => __("Tablet view", "brizy"),
	        "Tabs" => __("Tabs", "brizy"),
	        "Tada" => __("Tada", "brizy"),
	        "Tags" => __("Tags", "brizy"),
	        "Tail" => __("Tail", "brizy"),
	        "Take over" => __("Take over", "brizy"),
	        "Take over failed please refresh the page" => __("Take over failed please refresh the page", "brizy"),
	        "Target URL" => __("Target URL", "brizy"),
	        "Tel" => __("Tel", "brizy"),
	        "Tell AI what to write..." => __("Tell AI what to write...", "brizy"),
	        "Text" => __("Text", "brizy"),
	        "Text Field" => __("Text Field", "brizy"),
	        "Text Shadow" => __("Text Shadow", "brizy"),
	        "The button's state after visitors have subscribed" => __("The button's state after visitors have subscribed", "brizy"),
	        "The button's state before visitors have subscribed" => __("The button's state before visitors have subscribed", "brizy"),
	        "The calendar view default is the third position. If you change the order make sure the other view positions are updated to be unique." => __("The calendar view default is the third position. If you change the order make sure the other view positions are updated to be unique.", "brizy"),
	        "The element you have selected doesn't have more settings" => __("The element you have selected doesn't have more settings", "brizy"),
	        "The email address format is not valid" => __("The email address format is not valid", "brizy"),
	        "The featured view default is the first position. If you change the order make sure the other view positions are updated to be unique." => __("The featured view default is the first position. If you change the order make sure the other view positions are updated to be unique.", "brizy"),
	        "The integration is not responding, please try again or verify the account credentials" => __("The integration is not responding, please try again or verify the account credentials", "brizy"),
	        "The list view default is the second position. If you change the order make sure the other view positions are updated to be unique." => __("The list view default is the second position. If you change the order make sure the other view positions are updated to be unique.", "brizy"),
	        "Theme" => __("Theme", "brizy"),
	        "There are no choices" => __("There are no choices", "brizy"),
	        "Thin" => __("Thin", "brizy"),
	        "This element should stay inside a Product Details Component" => __("This element should stay inside a Product Details Component", "brizy"),
	        "This is .mp4 URL." => __("This is .mp4 URL.", "brizy"),
	        "This is Lottie .json URL. Get more from LottieFiles.com." => __("This is Lottie .json URL. Get more from LottieFiles.com.", "brizy"),
	        "This option automatically shows the latest event and overrides the 'Recent Events' and 'Event Slug' options." => __("This option automatically shows the latest event and overrides the 'Recent Events' and 'Event Slug' options.", "brizy"),
	        "This option automatically shows the latest group and overrides the 'Recent Groups' and 'Group Slug' options." => __("This option automatically shows the latest group and overrides the 'Recent Groups' and 'Group Slug' options.", "brizy"),
	        "This option automatically shows the latest sermon and overrides the 'Recent Sermons' and 'Sermon Slug' options." => __("This option automatically shows the latest sermon and overrides the 'Recent Sermons' and 'Sermon Slug' options.", "brizy"),
	        "This option only applies to 'Show Latest' and if this is selected the 'Featured' option does not apply." => __("This option only applies to 'Show Latest' and if this is selected the 'Featured' option does not apply.", "brizy"),
	        "This option only applies to 'Show Latest' and if this is selected the 'No featured' option does not apply." => __("This option only applies to 'Show Latest' and if this is selected the 'No featured' option does not apply.", "brizy"),
	        "This option only applies to 'Show Latest' and if this is selected the 'Non featured' option does not apply." => __("This option only applies to 'Show Latest' and if this is selected the 'Non featured' option does not apply.", "brizy"),
	        "This option only applies to 'Show Latest'." => __("This option only applies to 'Show Latest'.", "brizy"),
	        "This page needs a refresh. You’ve probably updated this page (or another page) in a different tab or browser." => __("This page needs a refresh. You’ve probably updated this page (or another page) in a different tab or browser.", "brizy"),
	        "This should be a comma separate list of category slugs without spaces eg. if you wanted to use the categories \"Category Example 1\" and \"Category Example 2\" the list would be \"category-example-1,category-example-2\". This option removes the parent filter options." => __("This should be a comma separate list of category slugs without spaces eg. if you wanted to use the categories \"Category Example 1\" and \"Category Example 2\" the list would be \"category-example-1,category-example-2\". This option removes the parent filter options.", "brizy"),
	        "This should be a comma separate list of category slugs without spaces eg. if you wanted to use the categories 'Category Example 1' and 'Category Example 2' the list would be 'category-example-1,category-example-2'. This option removes the parent filter options." => __("This should be a comma separate list of category slugs without spaces eg. if you wanted to use the categories 'Category Example 1' and 'Category Example 2' the list would be 'category-example-1,category-example-2'. This option removes the parent filter options.", "brizy"),
	        "Thumbnail" => __("Thumbnail", "brizy"),
	        "Thumbs" => __("Thumbs", "brizy"),
	        "Time" => __("Time", "brizy"),
	        "Time From" => __("Time From", "brizy"),
	        "Time Zone" => __("Time Zone", "brizy"),
	        "Timeline" => __("Timeline", "brizy"),
	        "Timeline Items" => __("Timeline Items", "brizy"),
	        "Timeline Labels" => __("Timeline Labels", "brizy"),
	        "Timer" => __("Timer", "brizy"),
	        "Times" => __("Times", "brizy"),
	        "Tip: This name will be displayed in the font library" => __("Tip: This name will be displayed in the font library", "brizy"),
	        "Tip: Use these shortcodes to populate your template" => __("Tip: Use these shortcodes to populate your template", "brizy"),
	        "Tip: You can browse the Google font library" => __("Tip: You can browse the Google font library", "brizy"),
	        "Tip: You can browse the Google font library here" => __("Tip: You can browse the Google font library here", "brizy"),
	        "Title" => __("Title", "brizy"),
	        "Title Padding" => __("Title Padding", "brizy"),
	        "Titles" => __("Titles", "brizy"),
	        "To Dashboard" => __("To Dashboard", "brizy"),
	        "To element" => __("To element", "brizy"),
	        "Toggle Menu" => __("Toggle Menu", "brizy"),
	        "Tone" => __("Tone", "brizy"),
	        "Top" => __("Top", "brizy"),
	        "Top Center" => __("Top Center", "brizy"),
	        "Top Left" => __("Top Left", "brizy"),
	        "Top Right" => __("Top Right", "brizy"),
	        "Total" => __("Total", "brizy"),
	        "Tracking Page URL" => __("Tracking Page URL", "brizy"),
	        "Tracking by Omega" => __("Tracking by Omega", "brizy"),
	        "Translation" => __("Translation", "brizy"),
	        "Transparency" => __("Transparency", "brizy"),
	        "Trash" => __("Trash", "brizy"),
	        "Trigger Popup Only Once" => __("Trigger Popup Only Once", "brizy"),
	        "Triggers" => __("Triggers", "brizy"),
	        "Trust Me Badges" => __("Trust Me Badges", "brizy"),
	        "Trust Product Rating" => __("Trust Product Rating", "brizy"),
	        "Trust Product Review" => __("Trust Product Review", "brizy"),
	        "Trust Product Seals" => __("Trust Product Seals", "brizy"),
	        "Trust Seals" => __("Trust Seals", "brizy"),
	        "Trusted's embed code" => __("Trusted's embed code", "brizy"),
	        "Try Again" => __("Try Again", "brizy"),
	        "Tweet" => __("Tweet", "brizy"),
	        "Twitter" => __("Twitter", "brizy"),
	        "Two Heroes" => __("Two Heroes", "brizy"),
	        "Type" => __("Type", "brizy"),
	        "Type name" => __("Type name", "brizy"),
	        "Type to Search ..." => __("Type to Search ...", "brizy"),
	        "Type to search" => __("Type to search", "brizy"),
	        "Typography" => __("Typography", "brizy"),
	        "UPLOAD" => __("UPLOAD", "brizy"),
	        "UPLOAD FONT" => __("UPLOAD FONT", "brizy"),
	        "URL" => __("URL", "brizy"),
	        "URL of event detail page. If used a link to the heading and an image will be added to take the user to the event detail page. Requires the \"Event Detail\" widget to be placed on a page and that page url/slug placed in this field ." => __("URL of event detail page. If used a link to the heading and an image will be added to take the user to the event detail page. Requires the \"Event Detail\" widget to be placed on a page and that page url/slug placed in this field .", "brizy"),
	        "URL of event detail page. If used a link to the heading and an image will be added to take the user to the event detail page. Requires the \"Event Detail\" widget to be placed on a page and that page url/slug placed in this field." => __("URL of event detail page. If used a link to the heading and an image will be added to take the user to the event detail page. Requires the \"Event Detail\" widget to be placed on a page and that page url/slug placed in this field.", "brizy"),
	        "URL of event detail page. If used will add a link to the calendar titles to take the user to the event detail page. Requires the 'Event Detail' widget to be placed on a page and that page url/slug placed in this field." => __("URL of event detail page. If used will add a link to the calendar titles to take the user to the event detail page. Requires the 'Event Detail' widget to be placed on a page and that page url/slug placed in this field.", "brizy"),
	        "URL of group detail page. If used will add a link to the heading to take the user to the group detail page. Requires the \"Group Detail\" widget to be placed on a page and that page url/slug placed in this field." => __("URL of group detail page. If used will add a link to the heading to take the user to the group detail page. Requires the \"Group Detail\" widget to be placed on a page and that page url/slug placed in this field.", "brizy"),
	        "URL of group detail page. If used will add a link to the heading to take the user to the group detail page. Requires the 'Group Detail' widget to be placed on a page and that page url/slug placed in this field ." => __("URL of group detail page. If used will add a link to the heading to take the user to the group detail page. Requires the 'Group Detail' widget to be placed on a page and that page url/slug placed in this field .", "brizy"),
	        "URL of sermon detail page. If used will add a link to the heading to take the user to the sermon detail page. Requires the \"Sermon Detail\" widget to be placed on a page and that page url/slug placed in this field." => __("URL of sermon detail page. If used will add a link to the heading to take the user to the sermon detail page. Requires the \"Sermon Detail\" widget to be placed on a page and that page url/slug placed in this field.", "brizy"),
	        "URL of sermon detail page. If used will add a link to the heading to take the user to the sermon detail page. Requires the 'Sermon Detail' widget to be placed on a page and that page url/slug placed in this field ." => __("URL of sermon detail page. If used will add a link to the heading to take the user to the sermon detail page. Requires the 'Sermon Detail' widget to be placed on a page and that page url/slug placed in this field .", "brizy"),
	        "USE CUSTOM TEMPLATE" => __("USE CUSTOM TEMPLATE", "brizy"),
	        "Unable to fetch blocks by filter" => __("Unable to fetch blocks by filter", "brizy"),
	        "Unable to fetch layouts by filter" => __("Unable to fetch layouts by filter", "brizy"),
	        "Unable to fetch popups by filter" => __("Unable to fetch popups by filter", "brizy"),
	        "Unable to insert block. Please try again or contact support" => __("Unable to insert block. Please try again or contact support", "brizy"),
	        "Unable to insert layout. Please try again or contact support" => __("Unable to insert layout. Please try again or contact support", "brizy"),
	        "Unable to insert popup. Please try again or contact support" => __("Unable to insert popup. Please try again or contact support", "brizy"),
	        "Underline" => __("Underline", "brizy"),
	        "Undo" => __("Undo", "brizy"),
	        "Undo (ctrl+Z)" => __("Undo (ctrl+Z)", "brizy"),
	        "Unlimited Bundles" => __("Unlimited Bundles", "brizy"),
	        "Unlocked" => __("Unlocked", "brizy"),
	        "Unsuccessful sync" => __("Unsuccessful sync", "brizy"),
	        "Untitled" => __("Untitled", "brizy"),
	        "Up" => __("Up", "brizy"),
	        "Up Down" => __("Up Down", "brizy"),
	        "Up Left" => __("Up Left", "brizy"),
	        "Up Right" => __("Up Right", "brizy"),
	        "Update" => __("Update", "brizy"),
	        "Upgrade to PRO to use this" => __("Upgrade to PRO to use this", "brizy"),
	        "Upgrade to PRO to use this block" => __("Upgrade to PRO to use this block", "brizy"),
	        "Upgrade to PRO to use this element" => __("Upgrade to PRO to use this element", "brizy"),
	        "Upgrade to PRO to use this integration" => __("Upgrade to PRO to use this integration", "brizy"),
	        "Upgrade to PRO to use this layout" => __("Upgrade to PRO to use this layout", "brizy"),
	        "Upgrade to PRO to use this story" => __("Upgrade to PRO to use this story", "brizy"),
	        "Upgrade to PRO, to use this option" => __("Upgrade to PRO, to use this option", "brizy"),
	        "Upload" => __("Upload", "brizy"),
	        "Upload Fields" => __("Upload Fields", "brizy"),
	        "Upload Fields by UploadKit" => __("Upload Fields by UploadKit", "brizy"),
	        "Upload only [ .png or .svg ]" => __("Upload only [ .png or .svg ]", "brizy"),
	        "Uppercase" => __("Uppercase", "brizy"),
	        "Upsell" => __("Upsell", "brizy"),
	        "Upsell Pagination" => __("Upsell Pagination", "brizy"),
	        "Upsell Tags" => __("Upsell Tags", "brizy"),
	        "Upsell Type" => __("Upsell Type", "brizy"),
	        "Upsell by FastSimon" => __("Upsell by FastSimon", "brizy"),
	        "Upsell by LimeSpot" => __("Upsell by LimeSpot", "brizy"),
	        "Upsell by Wiser" => __("Upsell by Wiser", "brizy"),
	        "Upsell by Zoorix" => __("Upsell by Zoorix", "brizy"),
	        "Upsells" => __("Upsells", "brizy"),
	        "Upsells by LimeSpot" => __("Upsells by LimeSpot", "brizy"),
	        "Use Small Header" => __("Use Small Header", "brizy"),
	        "Use only one widget per page like Widget, HomePage Review, Showcase Review" => __("Use only one widget per page like Widget, HomePage Review, Showcase Review", "brizy"),
	        "Use the regular video links generated by YouTube. The 'feature=share' parameter is not a valid or recognized parameter by the YouTube platform." => __("Use the regular video links generated by YouTube. The 'feature=share' parameter is not a valid or recognized parameter by the YouTube platform.", "brizy"),
	        "User" => __("User", "brizy"),
	        "User Agent" => __("User Agent", "brizy"),
	        "Username" => __("Username", "brizy"),
	        "Users" => __("Users", "brizy"),
	        "VK" => __("VK", "brizy"),
	        "Value" => __("Value", "brizy"),
	        "Value Bg" => __("Value Bg", "brizy"),
	        "Values" => __("Values", "brizy"),
	        "Variant" => __("Variant", "brizy"),
	        "Variations" => __("Variations", "brizy"),
	        "Vendor" => __("Vendor", "brizy"),
	        "Verification process failed, please make sure you have done the following three things and try again in a few minutes." => __("Verification process failed, please make sure you have done the following three things and try again in a few minutes.", "brizy"),
	        "Verified" => __("Verified", "brizy"),
	        "Vertical" => __("Vertical", "brizy"),
	        "Vertical Align" => __("Vertical Align", "brizy"),
	        "Vertical Offset" => __("Vertical Offset", "brizy"),
	        "Video" => __("Video", "brizy"),
	        "Video Embed Code" => __("Video Embed Code", "brizy"),
	        "Video Shopping" => __("Video Shopping", "brizy"),
	        "Video type" => __("Video type", "brizy"),
	        "View Favorites" => __("View Favorites", "brizy"),
	        "View as" => __("View as", "brizy"),
	        "Vimeo" => __("Vimeo", "brizy"),
	        "Visible Month" => __("Visible Month", "brizy"),
	        "Volume" => __("Volume", "brizy"),
	        "WHAT WILL TRIGGER THE POPUP TO OPEN" => __("WHAT WILL TRIGGER THE POPUP TO OPEN", "brizy"),
	        "WHERE DO YOU WANT TO DISPLAY IT?" => __("WHERE DO YOU WANT TO DISPLAY IT?", "brizy"),
	        "WHICH BLOG WILL USE THIS TEMPLATE ?" => __("WHICH BLOG WILL USE THIS TEMPLATE ?", "brizy"),
	        "WHICH COLLECTIONS WILL USE THIS TEMPLATE ?" => __("WHICH COLLECTIONS WILL USE THIS TEMPLATE ?", "brizy"),
	        "WHICH PRODUCTS WILL USE THIS TEMPLATE ?" => __("WHICH PRODUCTS WILL USE THIS TEMPLATE ?", "brizy"),
	        "WOFF File" => __("WOFF File", "brizy"),
	        "WOFF2 File" => __("WOFF2 File", "brizy"),
	        "Website" => __("Website", "brizy"),
	        "Weight" => __("Weight", "brizy"),
	        "When Finished" => __("When Finished", "brizy"),
	        "Wholesale Price" => __("Wholesale Price", "brizy"),
	        "Wholesale Prices" => __("Wholesale Prices", "brizy"),
	        "WideBundle" => __("WideBundle", "brizy"),
	        "Widget" => __("Widget", "brizy"),
	        "Widget List" => __("Widget List", "brizy"),
	        "Widget Type" => __("Widget Type", "brizy"),
	        "Widgets" => __("Widgets", "brizy"),
	        "Widgets by AliExpress" => __("Widgets by AliExpress", "brizy"),
	        "Widgets by PickyStory" => __("Widgets by PickyStory", "brizy"),
	        "Width" => __("Width", "brizy"),
	        "Width Type" => __("Width Type", "brizy"),
	        "Wish List by Hero" => __("Wish List by Hero", "brizy"),
	        "WishList by Swym" => __("WishList by Swym", "brizy"),
	        "Wishlist by Growave" => __("Wishlist by Growave", "brizy"),
	        "Wishlist by Hero" => __("Wishlist by Hero", "brizy"),
	        "Wobble" => __("Wobble", "brizy"),
	        "WooCommerce Cart" => __("WooCommerce Cart", "brizy"),
	        "WooCommerce Product" => __("WooCommerce Product", "brizy"),
	        "WordPress" => __("WordPress", "brizy"),
	        "Works only in the product page" => __("Works only in the product page", "brizy"),
	        "Works with PRO Plan" => __("Works with PRO Plan", "brizy"),
	        "X" => __("X", "brizy"),
	        "Y" => __("Y", "brizy"),
	        "YOUR BLOG POST IS READY TO BE PUBLISHED" => __("YOUR BLOG POST IS READY TO BE PUBLISHED", "brizy"),
	        "YOUR PAGE IS READY TO BE PUBLISHED" => __("YOUR PAGE IS READY TO BE PUBLISHED", "brizy"),
	        "YOUR PAGE IS READY TO PUBLISH!" => __("YOUR PAGE IS READY TO PUBLISH!", "brizy"),
	        "YYYY-MM-DD" => __("YYYY-MM-DD", "brizy"),
	        "YotPo Product Review" => __("YotPo Product Review", "brizy"),
	        "You can" => __("You can", "brizy"),
	        "You can add only 1 element on page" => __("You can add only 1 element on page", "brizy"),
	        "You can use the following selectors to create targeted CSS." => __("You can use the following selectors to create targeted CSS.", "brizy"),
	        "You can use these shortcodes in your email:" => __("You can use these shortcodes in your email:", "brizy"),
	        "You can't add it again" => __("You can't add it again", "brizy"),
	        "You can’t make changes" => __("You can’t make changes", "brizy"),
	        "You have successfully connect the form with" => __("You have successfully connect the form with", "brizy"),
	        "You must be have one font added" => __("You must be have one font added", "brizy"),
	        "You must have one selected item" => __("You must have one selected item", "brizy"),
	        "You must specify a title" => __("You must specify a title", "brizy"),
	        "YouTube" => __("YouTube", "brizy"),
	        "Your Plugin version is incompatible with Account version, please update plugin" => __("Your Plugin version is incompatible with Account version, please update plugin", "brizy"),
	        "Your block was saved without screenshot, browser is not compatible" => __("Your block was saved without screenshot, browser is not compatible", "brizy"),
	        "Your link is not correct" => __("Your link is not correct", "brizy"),
	        "Youtube" => __("Youtube", "brizy"),
	        "Z-index" => __("Z-index", "brizy"),
	        "Zoom" => __("Zoom", "brizy"),
	        "art, nature, etc." => __("art, nature, etc.", "brizy"),
	        "clicks" => __("clicks", "brizy"),
	        "component" => __("component", "brizy"),
	        "contains" => __("contains", "brizy"),
	        "could not find #brz-ed-root" => __("could not find #brz-ed-root", "brizy"),
	        "days" => __("days", "brizy"),
	        "does not contain" => __("does not contain", "brizy"),
	        "does not match" => __("does not match", "brizy"),
	        "during the session" => __("during the session", "brizy"),
	        "element" => __("element", "brizy"),
	        "equals" => __("equals", "brizy"),
	        "exclude" => __("exclude", "brizy"),
	        "here" => __("here", "brizy"),
	        "hours" => __("hours", "brizy"),
	        "https://" => __("https://", "brizy"),
	        "in your WordPress admin" => __("in your WordPress admin", "brizy"),
	        "include" => __("include", "brizy"),
	        "is" => __("is", "brizy"),
	        "is after" => __("is after", "brizy"),
	        "is already editing project" => __("is already editing project", "brizy"),
	        "is before" => __("is before", "brizy"),
	        "is currently working on this page. Do you want to take over" => __("is currently working on this page. Do you want to take over", "brizy"),
	        "is fewer than" => __("is fewer than", "brizy"),
	        "is greater than" => __("is greater than", "brizy"),
	        "is less than" => __("is less than", "brizy"),
	        "is more than" => __("is more than", "brizy"),
	        "is not" => __("is not", "brizy"),
	        "layout" => __("layout", "brizy"),
	        "layouts" => __("layouts", "brizy"),
	        "matches" => __("matches", "brizy"),
	        "none" => __("none", "brizy"),
	        "on the same page" => __("on the same page", "brizy"),
	        "open an issue" => __("open an issue", "brizy"),
	        "or" => __("or", "brizy"),
	        "param" => __("param", "brizy"),
	        "reCAPTCHA" => __("reCAPTCHA", "brizy"),
	        "remove this element" => __("remove this element", "brizy"),
	        "required" => __("required", "brizy"),
	        "stories" => __("stories", "brizy"),
	        "story" => __("story", "brizy"),
	        "the first visit" => __("the first visit", "brizy"),
	        "the last visit" => __("the last visit", "brizy"),
	        "this is my tweet" => __("this is my tweet", "brizy"),
	        "username" => __("username", "brizy"),
	        "value" => __("value", "brizy"),
	        "viewed pages" => __("viewed pages", "brizy"),
	        "was not shown" => __("was not shown", "brizy"),
	        "was shown" => __("was shown", "brizy")
        ));
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

        $nextId = 1;

        foreach ($categoryVideos as $title => $videos) {

            foreach ($videos as &$video) {
                $video['id'] = (string)$nextId;
                $nextId++;
            }

            $editorHelpVideos['video'][] = [
                'id' => (string)count($editorHelpVideos['video']).'c', // we make the id different from the id of the videos. It is an issue in the react component
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