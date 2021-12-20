<?php

class Brizy_Editor_API extends Brizy_Admin_AbstractApi
{

    const nonce = 'brizy-api';
    const AJAX_GET_POST_INFO = '_get_post_info';
    const AJAX_GET = '_editor_get_items';
    const AJAX_UPDATE = '_update_item';
    const AJAX_GET_PROJECT = '_get_project';
    const AJAX_SET_PROJECT = '_set_project';
    const AJAX_LOCK_PROJECT = '_lock_project';
    const AJAX_MEDIA = '_media';
    const AJAX_SIDEBARS = '_sidebars';
    const AJAX_SIDEBAR_CONTENT = '_sidebar_content';
    const AJAX_SHORTCODE_CONTENT = '_shortcode_content';
    const AJAX_PLACEHOLDER_CONTENT = '_placeholder_content';
    const AJAX_PLACEHOLDERS_CONTENT = '_placeholders_content';
    const AJAX_GET_POST_OBJECTS = '_get_posts';
    const AJAX_SEARCH_POST = '_search_posts';
    const AJAX_GET_MENU_LIST = '_get_menu_list';
    const AJAX_REMOVE_LOCK = '_remove_lock';
    const AJAX_HEARTBEAT = '_heartbeat';
    const AJAX_TAKE_OVER = '_take_over';
    const AJAX_JWT_TOKEN = '_multipass_create';
    const AJAX_UPDATE_MENU_DATA = '_update_menu_data';
    const AJAX_UPDATE_EDITOR_META_DATA = '_update_editor_meta_data';
    const AJAX_UPDATE_MENU_ITEM_DATA = '_update_menu_item_data';
    const AJAX_DOWNLOAD_MEDIA = '_download_media';
    const AJAX_MEDIA_METAKEY = '_get_media_key';
    const AJAX_CREATE_ATTACHMENT_UID = '_create_attachment_uid';
    const AJAX_SET_FEATURED_IMAGE = '_set_featured_image';
    const AJAX_SET_IMAGE_FOCAL_PT = '_set_featured_image_focal_point';
    const AJAX_REMOVE_FEATURED_IMAGE = '_remove_featured_image';
    const AJAX_TIMESTAMP = '_timestamp';
    const AJAX_SET_TEMPLATE_TYPE = '_set_template_type';
    const AJAX_GET_USERS = '_get_users';
    const AJAX_GET_TERMS = '_get_terms';
    const AJAX_GET_TERMS_BY = '_get_terms_by';
    const AJAX_GET_POST_TAXONOMIES = '_get_post_taxonomies';

    /**
     * @var Brizy_Editor_Post
     */
    private $post;

    /**
     * @return Brizy_Editor_Post
     */
    public function get_post()
    {
        return $this->post;
    }

    /**
     * Brizy_Editor_API constructor.
     *
     * @param Brizy_Editor_Project $project
     * @param Brizy_Editor_Post $post
     */
    public function __construct($post)
    {

        $this->post = $post;

        parent::__construct();
    }

    protected function initializeApiActions()
    {
        if (!Brizy_Editor_User::is_user_allowed()) {
            return;
        }

        $p = 'wp_ajax_' . Brizy_Editor::prefix();
        add_action($p . self::AJAX_REMOVE_LOCK, array($this, 'removeProjectLock'));
        add_action($p . self::AJAX_HEARTBEAT, array($this, 'heartbeat'));
        add_action($p . self::AJAX_TAKE_OVER, array($this, 'takeOver'));
        add_action($p . self::AJAX_GET, array($this, 'get_item'));
        add_action($p . self::AJAX_GET_POST_INFO, array($this, 'get_post_info'));
        add_action($p . self::AJAX_UPDATE, array($this, 'update_item'));
        add_action($p . self::AJAX_GET_PROJECT, array($this, 'get_project'));
        add_action($p . self::AJAX_SET_PROJECT, array($this, 'set_project'));
        add_action($p . self::AJAX_LOCK_PROJECT, array($this, 'lock_project'));
        add_action($p . self::AJAX_SIDEBARS, array($this, 'get_sidebars'));
        add_action($p . self::AJAX_SHORTCODE_CONTENT, array($this, 'shortcode_content'));
        add_action($p . self::AJAX_PLACEHOLDER_CONTENT, array($this, 'placeholder_content'));
        add_action($p . self::AJAX_PLACEHOLDERS_CONTENT, array($this, 'placeholders_content'));
        add_action($p . self::AJAX_GET_POST_OBJECTS, array($this, 'get_post_objects'));
        add_action($p . self::AJAX_SEARCH_POST, array($this, 'search_post'));
        add_action($p . self::AJAX_GET_MENU_LIST, array($this, 'get_menu_list'));
        add_action($p . self::AJAX_GET_TERMS, array($this, 'get_terms'));
        add_action($p . self::AJAX_GET_USERS, array($this, 'get_users'));
        add_action($p . self::AJAX_GET_TERMS_BY, array($this, 'get_terms_by'));
        add_action($p . self::AJAX_DOWNLOAD_MEDIA, array($this, 'download_media'));
        add_action($p . self::AJAX_MEDIA_METAKEY, array($this, 'get_media_key'));
        add_action($p . self::AJAX_CREATE_ATTACHMENT_UID, array($this, 'get_attachment_key'));
        add_action($p . self::AJAX_SET_FEATURED_IMAGE, array($this, 'set_featured_image'));
        add_action($p . self::AJAX_SET_IMAGE_FOCAL_PT, array($this, 'set_featured_image_focal_point'));
        add_action($p . self::AJAX_TIMESTAMP, array($this, 'timestamp'));
        add_action($p . self::AJAX_SET_TEMPLATE_TYPE, array($this, 'setTemplateType'));
        add_action($p . self::AJAX_GET_POST_TAXONOMIES, array($this, 'addPostTaxonomies'));
        add_action($p . 'nopriv_' . Brizy_Editor::prefix(self::AJAX_TIMESTAMP), array($this, 'timestamp'));

    }

    protected function getRequestNonce()
    {
        return $this->param('hash');
    }

    public function addPostTaxonomies() {

        $this->verifyNonce(self::nonce);

        if(empty($postType = $this->param('post_type'))) {
            $this->error(400, 'Bad request');
        }

        $taxonomies =get_object_taxonomies($postType,'objects');
        $post_taxonomies = array_map(function (WP_Taxonomy $taxonomy) {
            return [
                'name' => $taxonomy->name,
                'label' => $taxonomy->label,
                'labels' => $taxonomy->labels,
                'public' => $taxonomy->public,
                'hierarchical' => $taxonomy->hierarchical,
            ];
        }, array_values($taxonomies));

        $this->success($post_taxonomies);
    }

    public function lock_project()
    {
        $this->verifyNonce(self::nonce);

        if (Brizy_Editor::get()->checkIfProjectIsLocked() === false) {
            Brizy_Editor::get()->lockProject();
        }

        $editor = new Brizy_Editor_Editor_Editor(Brizy_Editor_Project::get(), null);
        $this->success($editor->getProjectStatus());
    }

    public function removeProjectLock()
    {
        $this->verifyNonce(self::nonce);

        if (Brizy_Editor::get()->checkIfProjectIsLocked() === false) {
            Brizy_Editor::get()->removeProjectLock();
        }

        $editor = new Brizy_Editor_Editor_Editor(Brizy_Editor_Project::get(), null);
        $this->success($editor->getProjectStatus());
    }

    public function heartbeat()
    {
        $this->verifyNonce(self::nonce);

        if (Brizy_Editor::get()->checkIfProjectIsLocked() === false) {
            Brizy_Editor::get()->lockProject();
        }
        $editor = new Brizy_Editor_Editor_Editor(Brizy_Editor_Project::get(), null);
        $this->success($editor->getProjectStatus());
    }

    public function takeOver()
    {
        $this->verifyNonce(self::nonce);

        Brizy_Editor::get()->lockProject();

        $editor = new Brizy_Editor_Editor_Editor(Brizy_Editor_Project::get(), null);
        $this->success($editor->getProjectStatus());
    }

    public function timestamp()
    {
        $this->success(array('timestamp' => time()));
    }


    public function set_featured_image()
    {
        $this->verifyNonce(self::nonce);

        if (!isset($_REQUEST['attachmentId'])) {
            $this->error(400, 'Bad request');
        }

        if ($this->post && $this->post->uses_editor()) {
            set_post_thumbnail($this->post->getWpPostId(), (int)$_REQUEST['attachmentId']);

            $uid = $this->createMediaKey($this->post->getWpPostId(), (int)$_REQUEST['attachmentId']);

            $this->success(array('uid' => $uid));
        }

        $this->error(400, 'Invalid post');
    }

    public function set_featured_image_focal_point()
    {
        $this->verifyNonce(self::nonce);

        if (!isset($_REQUEST['attachmentId']) || !isset($_REQUEST['pointX']) || !isset($_REQUEST['pointY'])) {
            $this->error(400, 'Bad request');
        }

        if ($this->post && $this->post->uses_editor()) {

            update_post_meta(
                $this->post->getWpPostId(),
                'brizy_attachment_focal_point',
                array(
                    'x' => $_REQUEST['pointX'],
                    'y' => $_REQUEST['pointY'],
                )
            );

            $this->success(array());
        }

        $this->error(400, 'Invalid post');
    }

    public function remove_featured_image()
    {
        $this->verifyNonce(self::nonce);

        if ($this->post && $this->post->uses_editor()) {
            delete_post_thumbnail($this->post->getWpPostId());
            delete_post_meta($this->post->getWpPostId(), 'brizy_attachment_focal_point');
            $this->success(null);
        }

        $this->error(400, 'Invalid post');
    }


//	public function multipass_create() {
//		$this->verifyNonce( self::nonce );
//		try {
//			$client_id = $_REQUEST['client_id'];
//
//			if ( ! $client_id ) {
//				throw new Exception( 'Bad request' );
//			}
//
////			$platform = new Brizy_Editor_API_Platform();
////			if ( $platform->isUserCreatedLocally() ) {
////				$platform->createUser( null, false );
////			}
//
//			$user = Brizy_Editor_User::get();
//
//			if ( ! $user ) {
//				throw new Exception( "Unable to create user" );
//			}
//
//			$email               = $user->getPlatformUserEmail();
//			$secret              = $user->getPlatformUserSignature();
//			$platformCredentials = Brizy_Editor_API_Platform::getCredentials();
//			$urlBuilder          = new Brizy_Editor_UrlBuilder( Brizy_Editor_Project::get() );
//
//			$platform_client_id = $platformCredentials->client_id;
//
//			date_default_timezone_set( "UTC" );
//
//			$date = new \DateTime();
//
//			$user_data = array(
//				"user_id"    => $user->getPlatformUserId(),
//				"created_at" => $date->format( DateTime::ISO8601 ),
//				'client_id'  => $client_id
//			);
//
//			$multipass = new Brizy_Editor_Multipass( $secret );
//
//			$token = $multipass->encode( $user_data );
//
//			$redirect_uri = sprintf( Brizy_Config::getEditorBaseUrls() . Brizy_Config::BRIZY_PLATFORM_MULTIPASS_LOGIN, $platform_client_id, $token, $email );
//
//			wp_redirect( $redirect_uri );
//			exit;
//		} catch ( Exception $exception ) {
//			Brizy_Logger::instance()->exception( $exception );
//			$this->error( 500, "Bad request" );
//			exit;
//		}
//	}


    /**
     * @internal
     **/
    public function get_project()
    {
        try {
            $this->verifyNonce(self::nonce);
            $data = Brizy_Editor_Project::get()->createResponse();
            $this->success($data);
        } catch (Exception $exception) {
            Brizy_Logger::instance()->exception($exception);
            $this->error($exception->getCode(), $exception->getMessage());
        }
    }

    /**
     * @internal
     */
    public function set_project()
    {
        try {
            $this->verifyNonce(self::nonce);

            // update project globas
            $meta = stripslashes($this->param('data'));
            $dataVersion = (int)stripslashes($this->param('dataVersion'));

            if (!$meta) {
                Brizy_Logger::instance()->error('Invalid project meta provided', ['data' => $meta]);
                throw new Exception('', 400);
            }

            if (!$dataVersion) {
                Brizy_Logger::instance()->error('No data version provided', ['data' => $dataVersion]);
                throw new Exception('', 400);
            }

            $project = Brizy_Editor_Project::get();
            $project->setDataAsJson($meta);
            $project->setDataVersion($dataVersion);


            if ((int)$this->param('is_autosave') === 1) {
                $project->save(1);
            } else {
                $project->save();
                $project->savePost();
                Brizy_Editor::get()->lockProject();
                do_action('brizy_global_data_updated');
            }

            $this->success($project->createResponse());
        } catch (Exception $exception) {
            Brizy_Logger::instance()->exception($exception);
            $this->error(400, $exception->getMessage());
            exit;
        }
    }

    /**
     * @internal
     **/
    public function get_item()
    {
        try {
            $this->verifyNonce(self::nonce);

            if (!$this->post) {
                throw new Exception('Invalid post provided');
            }

            $data = $this->post->createResponse();
            $data['is_index'] = true;

            $this->success(array($data));
        } catch (Exception $exception) {
            Brizy_Logger::instance()->exception($exception);
            $this->error(500, $exception->getMessage());
            exit;
        }
    }

    /**
     * @internal
     **/
    public function get_post_info()
    {
        try {
            $this->verifyNonce(self::nonce);

            $postId = (int)$this->param('post_id');
            $defaultFields = ['ID', 'post_title', 'post_content'];
            $post_fields = array_intersect((array)$this->param('fields'), $defaultFields);

            if (count($post_fields) == 0) {
                $post_fields = $defaultFields;
            }

            if (!$postId) {
                $this->error(400, 'Invalid post id');
            }

            $post = get_post($postId, ARRAY_A);

            if (!$post) {
                $this->error(404, 'Invalid post id');
            }

            $data = array_intersect_key($post, array_flip($defaultFields));

            $this->success($data);
        } catch (Exception $exception) {
            Brizy_Logger::instance()->exception($exception);
            $this->error(500, $exception->getMessage());
            exit;
        }
    }

    /**
     * @internal
     **/
    public function update_item()
    {
        try {
            $this->verifyNonce(self::nonce);

            $data = stripslashes($this->param('data'));
            $atemplate = $this->param('template');
            $dataVersion = (int)stripslashes($this->param('dataVersion'));
            $status = stripslashes($this->param('status'));

            if (!in_array($status, ['publish', 'draft', 'pending', 'private', 'future'])) {
                $this->error(400, "Invalid post type");
            }

            if ($atemplate) {
                $this->post->set_template($atemplate);
            }

            if ($data) {
                $this->post->set_editor_data($data);
                $this->post->set_editor_version(BRIZY_EDITOR_VERSION);
                $this->post->set_needs_compile(true);
            }

            $this->post->getWpPost()->post_status = $status;

            if ((int)$this->param('is_autosave') == 1) {
                $this->post->save(1);
            } else {
                $this->post->setDataVersion($dataVersion);
                $this->post->save(0);
                $this->post->savePost(true);
            }

            $this->success($this->post->createResponse());
        } catch (Exception $exception) {
            Brizy_Logger::instance()->exception($exception);
            $this->error(500, $exception->getMessage());
        }
    }

    /*
     * Used for elements like Woocommerce pages.
     */
    public function shortcode_content()
    {
        try {

            $this->verifyNonce(self::nonce);

            if (isset($_REQUEST['shortcode'])) {
                $shortcode = stripslashes($_REQUEST['shortcode']);
            } else {
                throw new Exception('Shortcode string not provided.', 500);
            }

            $shortcode_content = do_shortcode($shortcode);

            $this->success(
                array(
                    'shortcode' => $shortcode_content,
                )
            );

        } catch (Exception $exception) {
            Brizy_Logger::instance()->exception($exception);
            $this->error($exception->getCode(), $exception->getMessage());
        }
    }

    public function placeholder_content()
    {
        try {
            $this->verifyNonce(self::nonce);
            $postId = $this->param('post_id');
            $placeholders = $this->param('placeholders');

            if (!$placeholders) {
                throw new Exception('Placeholder string not provided.', 400);
            }

            global $post, $wp_query;

            $post = $this->getPostSample($postId);

            if ($post instanceof WP_Post) {
                setup_postdata($post);
                $wp_query->is_single = true;

	            if ( function_exists( 'wc_get_product' ) ) {
		            global $product;

		            $product = wc_get_product( $post->ID );
	            }
            }

            $contents = [];
            foreach ($placeholders as $placeholder) {
                $placeholder = stripslashes($placeholder);
                $contents[] = apply_filters('brizy_content', $placeholder, Brizy_Editor_Project::get(), $post);
            }

            $this->success(
                array(
                    'placeholders' => $contents,
                )
            );
        } catch (Exception $exception) {
            Brizy_Logger::instance()->exception($exception);
            $this->error($exception->getCode(), $exception->getMessage());
        }
    }

    public function placeholders_content()
    {
        global $post, $wp_query;
        try {
            $this->verifyNonce(self::nonce);
            $posts = $this->param('p');
            $contents = [];
            foreach ($posts as $postId => $placeholders) {
                $post = $this->getPostSample($postId);
                $contents[$postId] = [];

                if ($post instanceof WP_Post) {
                    setup_postdata($post);
                    $wp_query->is_single = true;
                }
                foreach ($placeholders as $placeholder) {
                    $placeholder = stripslashes($placeholder);
                    $contents[$postId][] = apply_filters('brizy_content', $placeholder, Brizy_Editor_Project::get(), $post);
                }
            }
            $this->success(
                array(
                    'placeholders' => $contents,
                )
            );
        } catch (Exception $exception) {
            Brizy_Logger::instance()->exception($exception);
            $this->error($exception->getCode(), $exception->getMessage());
        }
    }

	private function getPostSample( $templateId ) {
		global $wp_query;

		$wp_post = get_post( $templateId );
		if ( $wp_post->post_type !== Brizy_Admin_Templates::CP_TEMPLATE ) {
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
                    $args = [
                        'post_type' => $rule->getEntityType(),
                        'posts_per_page' => 1,
                    ];

                    $values = $rule->getEntityValues();

                    if (empty($values[0])) {
                        // For All condition
                        $posts = get_posts($args);
                        $post = isset($posts[0]) ? $posts[0] : null;

						if ( $post && !Brizy_Editor_Entity::isBrizyEnabled($post->ID) ) {
							return $post;
						} else {
							return null;
						}
					}

                    $filter = $values[0];

                    if (is_numeric($filter)) {
                        $args['post__in'] = [$filter];
                    } else {
                        // $filter = in|category|12 OR in|genre|48 OR in|category|45 OR author|2
                        $explode = explode('|', $filter);

                        if ($explode[0] === 'in') {
                            $args['tax_query'] = [
                                [
                                    'taxonomy' => $explode[1],
                                    'terms' => $explode[2],
                                ],
                            ];
                        } else {
                            $args['author'] = $explode[1];
                        }
                    }

                    $posts = get_posts($args);

                    $post = isset($posts[0]) ? $posts[0] : null;

                    try {
                        if ($post && !Brizy_Editor_Entity::isBrizyEnabled($post->ID)) {
                            return $post;
                        } else {
                            return null;
                        }
                    } catch (Exception $e) {
                        return $post;
                    }


                case Brizy_Admin_Rule::TAXONOMY :
                    $args = array(
                        'taxonomy' => $rule->getEntityType(),
                        'hide_empty' => true,);

                    if (count($rule->getEntityValues())) {
                        $args['term_taxonomy_id'] = $rule->getEntityValues();
                    }

                    $terms = get_terms($args);
					$term  = array_pop( $terms );

					if ( $term ) {
						$wp_query = new WP_Query(
							[
								'tax_query' => [
									[
										'taxonomy' => $rule->getEntityType(),
										'field'    => 'term_id',
										'terms'    => $term->term_id,
									]
								]
							]
						);

                    $wp_query->is_tax = true;
					}return array_pop($terms);

                case  Brizy_Admin_Rule::ARCHIVE :
                    return null;

                case  Brizy_Admin_Rule::TEMPLATE :

                    switch ($rule->getEntityType()) {
                        case 'author':
                            $authors = get_users();
							$wp_query = new WP_Query( [ 'author_name' => get_userdata( get_current_user_id() )->data->user_nicename ] );
							$wp_query->is_author = true;

                            return array_pop($authors);


                        case '404':
                        $wp_query->is_404 = true;

							return null;case 'search':
                            $wp_query->is_search = true;return null;

                        case 'home_page':
                            $get_option = get_option('page_for_posts');

                            if ($get_option) {
                                return get_post($get_option);
                            }
                            break;
                        case 'front_page':
                            $get_option = get_option('page_on_front');

                            if ($get_option) {
                                return get_post($get_option);
                            }
                            break;
                    }

                    break;
            case Brizy_Admin_Rule::YEAR_ARCHIVE:

					$wp_query = new WP_Query( 'year=' . date( 'Y' ) );
					$wp_query->is_year = true;

					return null;
				case Brizy_Admin_Rule::MONTH_ARCHIVE:

					$wp_query = new WP_Query( 'year=' . date( 'Y' ) . '&monthnum=' . date( 'm' ) );
					$wp_query->is_month = true;

					return null;
				case Brizy_Admin_Rule::DAY_ARCHIVE:

					$wp_query = new WP_Query( 'year=' . date( 'Y' ) . '&monthnum=' . date( 'm' ) . '&day=' . date( 'd' ) );
					$wp_query->is_day = true;

					return null;
			}

        }
    }

    public function get_post_objects()
    {

        global $wp_post_types;
        $this->verifyNonce(self::nonce);

        $searchTerm = $this->param('filterTerm');
        $postType = $this->param('postType') ? $this->param('postType') : null;
        $excludePostType = $this->param('excludePostTypes') ? $this->param('excludePostTypes') : array();

        if (!$postType) {
            $postType = array_keys(
                array_filter(
                    $wp_post_types,
                    function ($type) {
                        return !in_array($type->name, array('brizy_template')) && $type->show_ui;
                    }
                )
            );
        }

        add_filter('posts_where', array($this, 'brizy_post_title_filter'), 10, 2);
        $posts = Brizy_Editor_Post::get_post_list($searchTerm, $postType, $excludePostType, 0, 10000);
        remove_filter('posts_where', array($this, 'brizy_post_title_filter'), 10);

        $this->success(array('filter_term' => $searchTerm, 'posts' => $posts));
    }

    public function get_sidebars()
    {
        global $wp_registered_sidebars;

        $this->verifyNonce(self::nonce);

        $items = array();

        foreach ($wp_registered_sidebars as $sidebar) {
            $item = array(
                'id' => $sidebar['id'],
                'title' => $sidebar['name'],
            );
            $items[] = $item;
        }

        $this->success($items);
    }

    public function brizy_post_title_filter($where, $wp_query = null)
    {

        global $wpdb;


        if ($wp_query instanceof WP_Query && $term = $wp_query->get('post_title_term')) {
            $search_term = $wpdb->esc_like($term);
            $search_term = ' \'%' . $search_term . '%\'';

            $where .= ' AND ' . $wpdb->posts . '.post_title LIKE ' . $search_term;
        }

        return $where;
    }

    public function get_menu_list()
    {
        $this->success(wp_get_nav_menus(array('hide_empty' => true)), 200);
    }

    /**
     * Used in woocomerce producs, block conditions
     */
    public function get_terms()
    {

        try {
            $this->verifyNonce(self::nonce);

            $taxonomy = $this->param('taxonomy');

            $terms = (array)get_terms(array('taxonomy' => $taxonomy, 'hide_empty' => false));

            $this->success(array_values($terms));

        } catch (Exception $e) {
            Brizy_Logger::instance()->error($e->getMessage(), [$e]);
            $this->error(500, $e->getMessage());
        }
    }

    /**
     * Used in posts filter element
     */
    public function get_terms_by()
    {

        $this->verifyNonce(self::nonce);

        $args = [];

        foreach (['taxonomy', 'search', 'include'] as $field) {
            $value = $this->param($field);
            if (!empty($value)) {
                $args[$field] = $value;
            }
        }

        $terms = get_terms($args);

        if (is_wp_error($terms)) {
            $this->error(200, $terms);
        }


        $out = [];
        foreach ($terms as $term) {
            $out[] = [
                'term_id' => $term->term_id,
                'name' => $term->name,
                'taxonomy' => $term->taxonomy,
                'taxonomy_name' => get_taxonomy($term->taxonomy)->labels->singular_name,
            ];
        }

        $this->success($out);
    }

    /**
     * Used in posts filter element
     */
    public function search_post()
    {
        $this->verifyNonce(self::nonce);
        $args = ['numberposts' => -1];
        $args['post_type'] = array_values(get_post_types(['public' => true]));

        // exclude attachments
        if (($key = array_search('attachment', $args['post_type'])) !== false) {
            unset($args['post_type'][$key]);
        }

        // se post types
        if ($requiredTypes = $this->param('post_type')) {
            if (is_string($requiredTypes)) {
                $args['post_type'] = [$requiredTypes];
            } else {
                $args['post_type'] = $requiredTypes;
            }
        }

        // exclude post types
        if ($excludeTypes = $this->param('exclude_post_type')) {
            if (is_string($excludeTypes)) {
                if (($key = array_search($excludeTypes, $args['post_type'])) !== false) {
                    unset($args['post_type'][$key]);
                }
            } else {
                $args['post_type'] = array_diff($args['post_type'], $excludeTypes);
            }
        }

        // include posts by id
        if ($this->param('include')) {
            $args['post__in'] = $this->param('include');
        } elseif ($this->param('search') /*&& strlen($this->param('search')) >= 3*/) {
            $args['s'] = $this->param('search');
        } else {
            $this->success([]);
        }

        $posts = get_posts($args);

        if (is_wp_error($posts)) {
            $this->error(200, $posts);
        }

        $out = [];
        foreach ($posts as $post) {
            $out[] = [
                'ID' => $post->ID,
                'title' => $post->post_title,
            ];
        }

        $this->success($out);
    }

    public function get_users()
    {
        $this->verifyNonce(self::nonce);

        $args = [];
        $search = $this->param('search');
        $include = $this->param('include');

        $args['fields'] = $this->param('fields') ? $this->param('fields') : ['ID', 'display_name'];

        if ($this->param('roles') && is_array($this->param('roles'))) {
            $args['role__in'] = $this->param('roles');
        }

        if (!empty($search)) {
            $args['search'] = '*' . $search . '*';
            $args['search_columns'] = ['display_name'];
        }

        if (is_array($include) && !empty($include)) {
            $args['include'] = $include;
        }

        $users = get_users($args);

        $users = array_map(
            function ($user) {
                $user->ID = (int)$user->ID;

                return $user;
            },
            $users
        );

        $this->success($users);
    }

    public function download_media()
    {
        try {
            $this->verifyNonce(self::nonce);

            $project      = Brizy_Editor_Project::get();
	        $media_cacher = new Brizy_Editor_CropCacheMedia( $project );

	        $media_cacher->download_original_image( $_REQUEST['media'] );

            $this->success(array(), 200);
        } catch (Exception $e) {
            $this->error(500, $e->getMessage());
        }
    }

    public function get_media_key()
    {
        try {
            session_write_close();
            $this->verifyNonce(self::nonce);
            $apost = (int)$_REQUEST['post_id'];
            $attachment_id = (int)$_REQUEST['attachment_id'];

            if (!$attachment_id || get_post_status($attachment_id) === false) {
                $this->error(400, 'Invalid attachment id');
            }
            $uid = $this->createMediaKey($apost, $attachment_id);

            $this->success(array('uid' => $uid));

        } catch (Exception $e) {
            Brizy_Logger::instance()->error($e->getMessage(), [$e]);

            return;
        }
    }

	/**
	 * @see Brizy_Admin_Migrations_AttachmentUidMigration
	 */
    public function get_attachment_key()
    {
        try {
            session_write_close();

            $this->verifyNonce(self::nonce);
            $attachmentId = isset($_REQUEST['attachment_id']) ? (int)$_REQUEST['attachment_id'] : null;

            if (!$attachmentId || get_post_status($attachmentId) === false) {
                $this->error(400, 'Invalid attachment id');
            }

            $uid = get_post_meta($attachmentId, 'brizy_post_uid', true);

            if (!$uid) {
                $file = get_attached_file($attachmentId);
                $path_parts = pathinfo($file);
                $uid = "wp-" . md5($attachmentId . time()) . '.' . $path_parts['extension'];

	            // this is a bit wrong as the attachment is attached to itself
	            // (we used brizy_post_uid to mark the attachments as attached to the post with uid in this key)
	            // we also migrated the attachment that does not have brizy_attachment_uid meta and
	            // does have only brizy_post_uid meta: see the Brizy_Admin_Migrations_AttachmentUidMigration class
                update_post_meta($attachmentId, 'brizy_post_uid', $uid);

				// we added this here as the correct way to create a brizy_attachment_uid key
                update_post_meta($attachmentId, 'brizy_attachment_uid', $uid);
            }

            $this->success(array('uid' => $uid));

        } catch (Exception $e) {
            Brizy_Logger::instance()->error($e->getMessage(), [$e]);

            return;
        }
    }

    public function setTemplateType()
    {
        try {

            $this->verifyNonce(self::nonce);
            $templateId = $this->param('template_id');
            $templateType = $this->param('template_type');

            if (get_post_type($templateId) != Brizy_Admin_Templates::CP_TEMPLATE) {
                $this->error(400, 'Invalid template');
            }

            $allowedTypes = [
                Brizy_Admin_Templates::TYPE_SINGLE,
                Brizy_Admin_Templates::TYPE_ARCHIVE,
                Brizy_Admin_Templates::TYPE_SINGLE_PRODUCT,
                Brizy_Admin_Templates::TYPE_PRODUCT_ARCHIVE,
            ];

            if (!in_array($templateType, $allowedTypes, true)) {
                $this->error(400, 'Invalid template type');
            }

            update_post_meta($templateId, Brizy_Admin_Templates::TEMPLATE_TYPE_KEY, $templateType);

            $this->success([]);

        } catch (Exception $e) {
            Brizy_Logger::instance()->error($e->getMessage(), [$e]);
            $this->error(500, $e->getMessage());

            return;
        }
    }


    private function createMediaKey($postId, $attachmentId)
    {
        $uid = get_post_meta($attachmentId, 'brizy_attachment_uid', true);

        if (!$uid) {
            $file = get_attached_file($attachmentId);
            $path_parts = pathinfo($file);
            $uid = "wp-" . md5($attachmentId . time()) . '.' . $path_parts['extension'];
            update_post_meta($attachmentId, 'brizy_attachment_uid', $uid);
        }

        if ($postId) {
            $post = Brizy_Editor_Post::get($postId);
            $post_ui = $post->getUid();

            $post_uids = get_post_meta($attachmentId, 'brizy_post_uid');

            if (!in_array($post_ui, $post_uids)) {
                add_post_meta($attachmentId, 'brizy_post_uid', $post_ui);
            }
        }

        return $uid;
    }
}
