<?php

class Brizy_Editor_API {

	const nonce = 'brizy-api';
	const AJAX_GET = 'brizy_editor_get_items';
	const AJAX_UPDATE = 'brizy_update_item';
	const AJAX_GET_GLOBALS = 'brizy_get_gb';
	const AJAX_SET_GLOBALS = 'brizy_set_gb';
	const AJAX_MEDIA = 'brizy_media';
	const AJAX_SIDEBARS = 'brizy_sidebars';
	const AJAX_SIDEBAR_CONTENT = 'brizy_sidebar_content';
	const AJAX_SHORTCODE_CONTENT = 'brizy_shortcode_content';
	const AJAX_GET_POST_OBJECTS = 'brizy_get_posts';
	const AJAX_GET_MENU_LIST = 'brizy_get_menu_list';
	const AJAX_GET_TERMS = 'brizy_get_terms';
	const AJAX_JWT_TOKEN = 'brizy_multipass_create';

	const AJAX_UPDATE_MENU_DATA = 'brizy_update_menu_data';
	const AJAX_UPDATE_MENU_ITEM_DATA = 'brizy_update_menu_item_data';

	const AJAX_DOWNLOAD_MEDIA = 'brizy_download_media';
	const AJAX_MEDIA_METAKEY = 'brizy_get_media_key';

	const AJAX_SET_FEATURED_IMAGE = 'brizy_set_featured_image';
	const AJAX_SET_FEATURED_IMAGE_FOCAL_POINT = 'brizy_set_featured_image_focal_point';
	const AJAX_REMOVE_FEATURED_IMAGE = 'brizy_remove_featured_image';

	/**
	 * @var Brizy_Editor_Post
	 */
	private $post;

	/**
	 * @return Brizy_Editor_Post
	 */
	public function get_post() {
		return $this->post;
	}

	/**
	 * Brizy_Editor_API constructor.
	 *
	 * @param Brizy_Editor_Project $project
	 * @param Brizy_Editor_Post $post
	 */
	public function __construct( $post ) {

		$this->post = $post;

		$this->initialize();
	}

	private function initialize() {

		if ( Brizy_Editor::is_user_allowed() ) {
			add_action( 'wp_ajax_' . self::AJAX_GET, array( $this, 'get_item' ) );
			add_action( 'wp_ajax_' . self::AJAX_UPDATE, array( $this, 'update_item' ) );
			add_action( 'wp_ajax_' . self::AJAX_GET_GLOBALS, array( $this, 'get_globals' ) );
			add_action( 'wp_ajax_' . self::AJAX_SET_GLOBALS, array( $this, 'set_globals' ) );
			add_action( 'wp_ajax_' . self::AJAX_SIDEBARS, array( $this, 'get_sidebars' ) );
			add_action( 'wp_ajax_' . self::AJAX_SHORTCODE_CONTENT, array( $this, 'shortcode_content' ) );
			add_action( 'wp_ajax_' . self::AJAX_GET_POST_OBJECTS, array( $this, 'get_post_objects' ) );
			add_action( 'wp_ajax_' . self::AJAX_GET_MENU_LIST, array( $this, 'get_menu_list' ) );
			add_action( 'wp_ajax_' . self::AJAX_GET_TERMS, array( $this, 'get_terms' ) );
			add_action( 'wp_ajax_' . self::AJAX_DOWNLOAD_MEDIA, array( $this, 'download_media' ) );
			add_action( 'wp_ajax_' . self::AJAX_MEDIA_METAKEY, array( $this, 'get_media_key' ) );
			add_action( 'wp_ajax_' . self::AJAX_JWT_TOKEN, array( $this, 'multipass_create' ) );
			add_action( 'wp_ajax_' . self::AJAX_SET_FEATURED_IMAGE, array( $this, 'set_featured_image' ) );
			add_action( 'wp_ajax_' . self::AJAX_SET_FEATURED_IMAGE_FOCAL_POINT, array(
				$this,
				'set_featured_image_focal_point'
			) );
			add_action( 'wp_ajax_' . self::AJAX_REMOVE_FEATURED_IMAGE, array( $this, 'remove_featured_image' ) );

		}

	}

	public function set_featured_image() {
		$this->authorize();

		if ( ! isset( $_REQUEST['attachmentId'] ) ) {
			$this->error( 400, 'Bad request' );
		}

		if ( $this->post && $this->post->uses_editor() ) {
			set_post_thumbnail( $this->post->get_id(), (int) $_REQUEST['attachmentId'] );

			$uid = $this->createMediaKey( $this->post->get_id(), (int) $_REQUEST['attachmentId'] );

			$this->success( array( 'uid' => $uid ) );
		}

		$this->error( 400, 'Invalid post' );
	}

	public function set_featured_image_focal_point() {
		if ( ! isset( $_REQUEST['attachmentId'] ) || ! isset( $_REQUEST['pointX'] ) || ! isset( $_REQUEST['pointY'] ) ) {
			$this->error( 400, 'Bad request' );
		}

		if ( $this->post && $this->post->uses_editor() ) {

			update_post_meta( $this->post->get_id(), 'brizy_attachment_focal_point', array(
				'x' => $_REQUEST['pointX'],
				'y' => $_REQUEST['pointY']
			) );

			$this->success( array() );
		}

		$this->error( 400, 'Invalid post' );
	}

	public function remove_featured_image() {
		$this->authorize();

		if ( $this->post && $this->post->uses_editor() ) {
			delete_post_thumbnail( $this->post->get_id() );
			delete_post_meta( $this->post->get_id(), 'brizy_attachment_focal_point' );
			$this->success( null );
		}

		$this->error( 400, 'Invalid post' );
	}


	public function multipass_create() {

		try {
			$client_id = $_REQUEST['client_id'];

			if ( ! $client_id ) {
				throw new Exception( 'Bad request' );
			}

//			$platform = new Brizy_Editor_API_Platform();
//			if ( $platform->isUserCreatedLocally() ) {
//				$platform->createUser( null, false );
//			}

			$user = Brizy_Editor_User::get();

			if ( ! $user ) {
				throw new Exception( "Unable to create user" );
			}

			$email               = $user->getPlatformUserEmail();
			$secret              = $user->getPlatformUserSignature();
			$platformCredentials = Brizy_Editor_API_Platform::getCredentials();
			$urlBuilder          = new Brizy_Editor_UrlBuilder( Brizy_Editor_Project::get() );

			$platform_client_id = $platformCredentials->client_id;

			date_default_timezone_set( "UTC" );

			$date = new \DateTime();

			$user_data = array(
				"user_id"    => $user->getPlatformUserId(),
				"created_at" => $date->format( DateTime::ISO8601 ),
				'client_id'  => $client_id
			);

			$multipass = new Brizy_Editor_Multipass( $secret );

			$token = $multipass->encode( $user_data );

			$redirect_uri = sprintf( Brizy_Config::getEditorBaseUrls() . Brizy_Config::BRIZY_PLATFORM_MULTIPASS_LOGIN, $platform_client_id, $token, $email );

			wp_redirect( $redirect_uri );
			exit;
		} catch ( Exception $exception ) {
			Brizy_Logger::instance()->exception( $exception );
			$this->error( 500, "Bad request" );
			exit;
		}
	}


	/**
	 * @internal
	 **/
	public function get_globals() {
		try {
			$this->authorize();
			$data = $this->create_post_globals();

			$this->success( $data );
		} catch ( Exception $exception ) {
			Brizy_Logger::instance()->exception( $exception );
			$this->error( $exception->getCode(), $exception->getMessage() );
			exit;
		}
	}

	/**
	 * @internal
	 */
	public function set_globals() {
		try {
			$this->authorize();

			// update project globas
			$data = stripslashes( $this->param( 'gb' ) );

			$project = Brizy_Editor_Project::get();
			//$post_id = (int) $this->param( 'post' );
			$project->setGlobalsAsJson( $data );

			if ( (int) $this->param( 'is_autosave' ) ) {
				$project->auto_save_post();
			} else {
				$project->save();
				$project->save_wp_post();

				Brizy_Editor_Post::clear_compiled_cache();

				do_action( 'brizy_global_data_updated' );
			}


			$this->success( $this->create_post_globals() );
		} catch ( Exception $exception ) {
			Brizy_Logger::instance()->exception( $exception );
			$this->error( $exception->getCode(), $exception->getMessage() );
			exit;
		}
	}

	/**
	 * @internal
	 **/
	public function get_item() {
		try {
			$this->authorize();
			$post_arr             = self::create_post_arr( $this->post );
			$post_arr['is_index'] = true; // this is for the case when the page we return is not an index page.. but the editor wants one.
			$this->success( array( $post_arr ) );
		} catch ( Exception $exception ) {
			Brizy_Logger::instance()->exception( $exception );
			$this->error( 500, $exception->getMessage() );
			exit;
		}
	}

	/**
	 * @internal
	 **/
	public function update_item() {
		try {
			$data      = stripslashes( $this->param( 'data' ) );
			$atemplate = $this->param( 'template' );

			if ( $atemplate ) {
				$this->post->set_template( $atemplate );
			}

			if ( $data ) {
				$this->post->set_editor_data( $data );
				$this->post->set_editor_version( BRIZY_EDITOR_VERSION );
			}

			if ( (int) $this->param( 'is_autosave' ) ) {
				$this->post->auto_save_post();
			} else {
				$this->post->compile_page();
				$this->post->save();
				$this->post->save_wp_post();
			}

			$this->success( self::create_post_arr( $this->post ) );
		} catch ( Exception $exception ) {
			Brizy_Logger::instance()->exception( $exception );
			$this->error( 500, $exception->getMessage() );
		}
	}


	public function shortcode_content() {
		try {

			if ( isset( $_REQUEST['shortcode'] ) ) {
				$shortcode = stripslashes( $_REQUEST['shortcode'] );
			} else {
				throw new Exception( 'Shortcode string not provided.', 500 );
			}
			$shortcode_content = do_shortcode( $shortcode );

			$this->success( array(
				'shortcode' => $shortcode_content
			) );
		} catch ( Exception $exception ) {
			Brizy_Logger::instance()->exception( $exception );
			$this->error( $exception->getCode(), $exception->getMessage() );
		}
	}

	public function get_post_objects() {

		global $wp_post_types;

		$searchTerm      = $this->param( 'filterTerm' );
		$postType        = $this->param( 'postType' ) ? $this->param( 'postType' ) : null;
		$excludePostType = $this->param( 'excludePostTypes' ) ? $this->param( 'excludePostTypes' ) : array();

		if ( ! $postType ) {
			$postType = array_keys( array_filter( $wp_post_types, function ( $type ) {
				return ! in_array( $type->name, array( 'brizy_template' ) ) && $type->show_ui;
			} ) );
		}


		$posts = $this->get_post_list( $searchTerm, $postType, $excludePostType );

		wp_send_json( array( 'filter_term' => $searchTerm, 'posts' => $posts ), 200 );
	}


	public function get_sidebars() {
		global $wp_registered_sidebars;

		$items = array();

		foreach ( $wp_registered_sidebars as $sidebar ) {
			$item    = array(
				'id'    => $sidebar['id'],
				'title' => $sidebar['name'],
			);
			$items[] = $item;
		}

		$this->success( $items );
	}

	protected function param( $name ) {
		if ( isset( $_REQUEST[ $name ] ) ) {
			return $_REQUEST[ $name ];
		}

		return null;
	}

	protected function error( $code, $message ) {
		wp_send_json_error( array( 'code' => $code, 'message' => $message ), $code );
	}

	protected function success( $data ) {
		wp_send_json( $data );
	}

	protected function static_url() {
		return Brizy_Editor::get()->get_url( '/includes/editor/static' );
	}

	private function authorize() {
		if ( ! wp_verify_nonce( $_REQUEST['hash'], self::nonce ) ) {
			wp_send_json_error( array( 'code' => 400, 'message' => 'Bad request' ), 400 );
		}
	}

	public static function create_post_arr( Brizy_Editor_Post $post ) {

		$p_id      = (int) $post->get_id();
		$the_title = get_the_title( $p_id );

		$global = array(
			'title'    => $the_title,
			'slug'     => sanitize_title( $the_title ),
			'data'     => $post->get_editor_data(),
			'id'       => $p_id,
			'is_index' => false,
			'template' => get_page_template_slug( $p_id ),
			'status'   => get_post_status( $p_id ),
			'url'      => get_the_permalink( $p_id )
		);

		return $global;
	}

	/**
	 * @return array
	 * @throws Brizy_Editor_Exceptions_NotFound
	 */
	public function create_post_globals() {
		$project = Brizy_Editor_Project::get();
		$globals = array(
			'id' => $project->getId(),
			'gb' => $project->getGlobalsAsJson(),
		);

		return $globals;
	}

	public function get_post_list( $searchTerm, $postType, $excludePostType = array() ) {

		global $wp_post_types;

		add_filter( 'posts_where', array( $this, 'brizy_post_title_filter' ), 10, 2 );

		$post_query = array(
			'post_type'      => $postType,
			'posts_per_page' => - 1,
			'post_status'    => $postType == 'attachment' ? 'inherit' : array('publish', 'pending', 'draft', 'future', 'private'),
			'orderby'        => 'post_title',
			'order'          => 'ASC'
		);

		if ( $searchTerm ) {
			$post_query['post_title_term'] = $searchTerm;
		}

		$posts = new WP_Query( $post_query );

		$result = array();

		foreach ( $posts->posts as $post ) {

			if ( in_array( $post->post_type, $excludePostType ) ) {
				continue;
			}

			$result[] = (object) array(
				'ID'              => $post->ID,
				'post_type'       => $post->post_type,
				'post_type_label' => $wp_post_types[ $post->post_type ]->label,
				'title'           => apply_filters( 'the_title', $post->post_title )
			);
		}

		remove_filter( 'posts_where', 'brizy_post_title_filter', 10 );

		return $result;
	}

	public function brizy_post_title_filter( $where, $wp_query = null ) {

		global $wpdb;


		if ( $wp_query instanceof WP_Query && $term = $wp_query->get( 'post_title_term' ) ) {
			$search_term = $wpdb->esc_like( $term );
			$search_term = ' \'%' . $search_term . '%\'';

			$where .= ' AND ' . $wpdb->posts . '.post_title LIKE ' . $search_term;
		}

		return $where;
	}


	public function get_menu_list() {
		wp_send_json( wp_get_nav_menus( array( 'hide_empty' => true ) ), 200 );
	}

	/**
	 * Used in woocomerce producs shortcode in editor
	 */
	public function get_terms() {

		try {
			$taxonomy = $this->param( 'taxonomy' );

			$terms = (array) get_terms( array( 'taxonomy' => $taxonomy, 'hide_empty' => false ) );

			wp_send_json( array_values( $terms ) );
		} catch ( Exception $e ) {
			wp_send_json_error( array(), 500 );
		}
	}

	public function download_media() {
		try {
			$project = Brizy_Editor_Project::get();
			$apost   = (int) $_REQUEST['post_id'];
			$post    = Brizy_Editor_Post::get( $apost );

			$media_cacher = new Brizy_Editor_CropCacheMedia( $project, $post->get_parent_id() );
			$media_cacher->download_original_image( $_REQUEST['media'] );

			wp_send_json( array(), 200 );
		} catch ( Exception $e ) {
			wp_send_json_error( array(), 500 );
		}
	}

	public function get_media_key() {
		try {
			session_write_close();

			$apost         = (int) $_REQUEST['post_id'];
			$attachment_id = (int) $_REQUEST['attachment_id'];

			if ( ! $attachment_id ) {
				$this->error( 400, 'Invalid attachment id' );
			}

			$uid = $this->createMediaKey( $apost, $attachment_id );

			$this->success( array( 'uid' => $uid ) );

		} catch ( Exception $E ) {
			return;
		}
	}


	private function createMediaKey( $postId, $attachmentId ) {
		$uid = get_post_meta( $attachmentId, 'brizy_attachment_uid', true );

		if ( ! $uid ) {
			$uid = "wp-" . md5( $attachmentId . time() );
			update_post_meta( $attachmentId, 'brizy_attachment_uid', $uid );
		}

		if ( $postId ) {
			$post    = Brizy_Editor_Post::get( $postId );
			$post_ui = $post->get_uid();

			$post_uids = get_post_meta( $attachmentId, 'brizy_post_uid' );

			if ( ! in_array( $post_ui, $post_uids ) ) {
				add_post_meta( $attachmentId, 'brizy_post_uid', $post_ui );
			}
		}

		return $uid;
	}
}