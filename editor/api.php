<?php

class Brizy_Editor_API extends Brizy_Admin_AbstractApi {

	const nonce = 'brizy-api';
	const AJAX_GET = 'brizy_editor_get_items';
	const AJAX_UPDATE = 'brizy_update_item';
	const AJAX_GET_PROJECT = 'brizy_get_project';
	const AJAX_SET_PROJECT = 'brizy_set_project';
	const AJAX_MEDIA = 'brizy_media';
	const AJAX_SIDEBARS = 'brizy_sidebars';
	const AJAX_SIDEBAR_CONTENT = 'brizy_sidebar_content';
	const AJAX_SHORTCODE_CONTENT = 'brizy_shortcode_content';
	const AJAX_GET_POST_OBJECTS = 'brizy_get_posts';
	const AJAX_GET_MENU_LIST = 'brizy_get_menu_list';
	const AJAX_GET_TERMS = 'brizy_get_terms';
	const AJAX_JWT_TOKEN = 'brizy_multipass_create';

	const AJAX_UPDATE_MENU_DATA = 'brizy_update_menu_data';
	const AJAX_UPDATE_EDITOR_META_DATA = 'brizy_update_editor_meta_data';
	const AJAX_UPDATE_MENU_ITEM_DATA = 'brizy_update_menu_item_data';

	const AJAX_DOWNLOAD_MEDIA = 'brizy_download_media';
	const AJAX_MEDIA_METAKEY = 'brizy_get_media_key';
	const AJAX_CREATE_ATTACHMENT_UID = 'brizy_create_attachment_uid';

	const AJAX_SET_FEATURED_IMAGE = 'brizy_set_featured_image';
	const AJAX_SET_FEATURED_IMAGE_FOCAL_POINT = 'brizy_set_featured_image_focal_point';
	const AJAX_REMOVE_FEATURED_IMAGE = 'brizy_remove_featured_image';
	const AJAX_TIMESTAMP = 'brizy_timestamp';

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

		parent::__construct();
	}

	protected function initializeApiActions() {
		if ( Brizy_Editor::is_user_allowed() ) {
			add_action( 'wp_ajax_' . self::AJAX_GET, array( $this, 'get_item' ) );
			add_action( 'wp_ajax_' . self::AJAX_UPDATE, array( $this, 'update_item' ) );
			add_action( 'wp_ajax_' . self::AJAX_GET_PROJECT, array( $this, 'get_project' ) );
			add_action( 'wp_ajax_' . self::AJAX_SET_PROJECT, array( $this, 'set_project' ) );
			add_action( 'wp_ajax_' . self::AJAX_SIDEBARS, array( $this, 'get_sidebars' ) );
			add_action( 'wp_ajax_' . self::AJAX_SHORTCODE_CONTENT, array( $this, 'shortcode_content' ) );
			add_action( 'wp_ajax_' . self::AJAX_GET_POST_OBJECTS, array( $this, 'get_post_objects' ) );
			add_action( 'wp_ajax_' . self::AJAX_GET_MENU_LIST, array( $this, 'get_menu_list' ) );
			add_action( 'wp_ajax_' . self::AJAX_GET_TERMS, array( $this, 'get_terms' ) );
			add_action( 'wp_ajax_' . self::AJAX_DOWNLOAD_MEDIA, array( $this, 'download_media' ) );
			add_action( 'wp_ajax_' . self::AJAX_MEDIA_METAKEY, array( $this, 'get_media_key' ) );
			add_action( 'wp_ajax_' . self::AJAX_CREATE_ATTACHMENT_UID, array( $this, 'get_attachment_key' ) );
			//add_action( 'wp_ajax_' . self::AJAX_JWT_TOKEN, array( $this, 'multipass_create' ) );
			add_action( 'wp_ajax_' . self::AJAX_SET_FEATURED_IMAGE, array( $this, 'set_featured_image' ) );
			add_action( 'wp_ajax_' . self::AJAX_SET_FEATURED_IMAGE_FOCAL_POINT, array(
				$this,
				'set_featured_image_focal_point'
			) );
			add_action( 'wp_ajax_' . self::AJAX_TIMESTAMP, array( $this, 'timestamp' ) );
			add_action( 'wp_ajax_nopriv_' . self::AJAX_TIMESTAMP, array( $this, 'timestamp' ) );
		}
	}

	protected function getRequestNonce() {
		return self::nonce;
	}

	public function timestamp() {
		$this->success( array( 'timestamp' => time() ) );
	}


	public function set_featured_image() {
		$this->verifyNonce( self::nonce );

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
		$this->verifyNonce( self::nonce );

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
		$this->verifyNonce( self::nonce );

		if ( $this->post && $this->post->uses_editor() ) {
			delete_post_thumbnail( $this->post->get_id() );
			delete_post_meta( $this->post->get_id(), 'brizy_attachment_focal_point' );
			$this->success( null );
		}

		$this->error( 400, 'Invalid post' );
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
	public function get_project() {
		try {
			$this->verifyNonce( self::nonce );
			$data = Brizy_Editor_Project::get()->create_post_data();

			$this->success( $data );
		} catch ( Exception $exception ) {
			Brizy_Logger::instance()->exception( $exception );
			$this->error( $exception->getCode(), $exception->getMessage() );
		}
	}

	/**
	 * @internal
	 */
	public function set_project() {
		try {
			$this->verifyNonce( self::nonce );

			// update project globas
			$meta = stripslashes( $this->param( 'data' ) );

			if ( ! $meta ) {
				Brizy_Logger::instance()->error( 'Invalid project meta provided', [ 'data' => $this->param( 'data' ) ] );
				throw new Exception( '', 400 );
			}

			$project = Brizy_Editor_Project::get();
			$project->setDataAsJson( $meta );

			if ( (int) $this->param( 'is_autosave' ) === 1 ) {
				$project->auto_save_post();
			} else {
				$project->save();
				$project->save_wp_post();

				do_action( 'brizy_global_data_updated' );
			}

			$this->success( $project->create_post_data() );
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
			$this->verifyNonce( self::nonce );
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
			$this->verifyNonce( self::nonce );

			$data      = stripslashes( $this->param( 'data' ) );
			$atemplate = $this->param( 'template' );

			if ( $atemplate ) {
				$this->post->set_template( $atemplate );
			}

			if ( $data ) {
				$this->post->set_editor_data( $data );
				$this->post->set_editor_version( BRIZY_EDITOR_VERSION );
				$this->post->set_needs_compile( true );
			}

			if ( (int) $this->param( 'is_autosave' ) == 1 ) {
				$this->post->save( 1 );
			} else {
				$this->post->save( 0 );
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
			$this->verifyNonce( self::nonce );

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
		$this->verifyNonce( self::nonce );

		$searchTerm      = $this->param( 'filterTerm' );
		$postType        = $this->param( 'postType' ) ? $this->param( 'postType' ) : null;
		$excludePostType = $this->param( 'excludePostTypes' ) ? $this->param( 'excludePostTypes' ) : array();

		if ( ! $postType ) {
			$postType = array_keys( array_filter( $wp_post_types, function ( $type ) {
				return ! in_array( $type->name, array( 'brizy_template' ) ) && $type->show_ui;
			} ) );
		}

		$posts = $this->get_post_list( $searchTerm, $postType, $excludePostType );

		$this->success( array( 'filter_term' => $searchTerm, 'posts' => $posts ) );
	}

	public function get_sidebars() {
		global $wp_registered_sidebars;

		$this->verifyNonce( self::nonce );

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

//	protected function error( $code, $message ) {
//		wp_send_json_error( array( 'code' => $code, 'message' => $message ), $code );
//	}
//
//	protected function success( $data ) {
//		wp_send_json( $data );
//	}
//	protected function static_url() {
//		return Brizy_Editor::get()->get_url( '/includes/editor/static' );
//	}

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


	private function get_post_list( $searchTerm, $postType, $excludePostType = array() ) {

		global $wp_post_types;

		add_filter( 'posts_where', array( $this, 'brizy_post_title_filter' ), 10, 2 );

		$post_query = array(
			'post_type'      => $postType,
			'posts_per_page' => - 1,
			'post_status'    => $postType == 'attachment' ? 'inherit' : array(
				'publish',
				'pending',
				'draft',
				'future',
				'private'
			),
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
				'uid'             => $this->create_uid( $post->ID ),
				'post_type'       => $post->post_type,
				'post_type_label' => $wp_post_types[ $post->post_type ]->label,
				'title'           => apply_filters( 'the_title', $post->post_title ),
				'post_title'      => apply_filters( 'the_title', $post->post_title )
			);
		}

		remove_filter( 'posts_where', 'brizy_post_title_filter', 10 );

		return $result;
	}

	private function create_uid( $postId ) {

		$uid = get_post_meta( $postId, 'brizy_post_uid', true );

		if ( ! $uid ) {
			$uid = md5( $postId . time() );
			update_post_meta( $postId, 'brizy_post_uid', $uid );
		}

		return $uid;
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
		$this->success( wp_get_nav_menus( array( 'hide_empty' => true ) ), 200 );
	}

	/**
	 * Used in woocomerce producs shortcode in editor
	 */
	public function get_terms() {

		try {
			$this->verifyNonce( self::nonce );

			$taxonomy = $this->param( 'taxonomy' );

			$terms = (array) get_terms( array( 'taxonomy' => $taxonomy, 'hide_empty' => false ) );

			$this->success( array_values( $terms ) );

		} catch ( Exception $e ) {
			Brizy_Logger::instance()->error( $e->getMessage(), [ $e ] );
			$this->error( 500, $e->getMessage() );
		}
	}

	public function download_media() {
		try {
			$this->verifyNonce( self::nonce );

			$project = Brizy_Editor_Project::get();
			$apost   = (int) $_REQUEST['post_id'];
			$post    = Brizy_Editor_Post::get( $apost );

			$media_cacher = new Brizy_Editor_CropCacheMedia( $project, $post->get_parent_id() );
			$media_cacher->download_original_image( $_REQUEST['media'] );

			$this->success( array(), 200 );
		} catch ( Exception $e ) {
			$this->error( 500, $e->getMessage() );
		}
	}

	public function get_media_key() {
		try {
			session_write_close();
			$this->verifyNonce( self::nonce );
			$apost         = (int) $_REQUEST['post_id'];
			$attachment_id = (int) $_REQUEST['attachment_id'];

			if ( ! $attachment_id || get_post_status( $attachment_id ) === false ) {
				$this->error( 400, 'Invalid attachment id' );
			}
			$uid = $this->createMediaKey( $apost, $attachment_id );

			$this->success( array( 'uid' => $uid ) );

		} catch ( Exception $e ) {
			Brizy_Logger::instance()->error( $e->getMessage(), [ $e ] );

			return;
		}
	}

	public function get_attachment_key() {
		try {
			session_write_close();

			$this->verifyNonce( self::nonce );
			$attachmentId = (int) $_REQUEST['attachment_id'];

			if ( ! $attachmentId || get_post_status( $attachmentId ) === false ) {
				$this->error( 400, 'Invalid attachment id' );
			}

			$uid = get_post_meta( $attachmentId, 'brizy_post_uid', true );

			if ( ! $uid ) {
				$uid = "wp-" . md5( $attachmentId . time() );
				update_post_meta( $attachmentId, 'brizy_post_uid', $uid );
			}

			$this->success( array( 'uid' => $uid ) );

		} catch ( Exception $e ) {
			Brizy_Logger::instance()->error( $e->getMessage(), [ $e ] );

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
