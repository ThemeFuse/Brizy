<?php

class Brizy_Editor_API {

	const nonce = 'brizy-api';
	const AJAX_PING = 'brizy_editor_ping';
	const AJAX_GET = 'brizy_editor_get_items';
	const AJAX_UPDATE = 'brizy_update_item';
	const AJAX_GET_GLOBALS = 'brizy_get_globals';
	const AJAX_SET_GLOBALS = 'brizy_set_globals';
	const AJAX_MEDIA = 'Brizy_Editor_Asset_Media';
	const AJAX_SIDEBARS = 'brizy_sidebars';
	const AJAX_BUILD = 'brizy_build';
	const AJAX_SIDEBAR_CONTENT = 'brizy_sidebar_content';
	const AJAX_SHORTCODE_CONTENT = 'brizy_shortcode_content';
	const AJAX_SHORTCODE_LIST = 'brizy_shortcode_list';
	const AJAX_GET_TEMPLATES = 'brizy_get_templates';
	const AJAX_GET_INTERNAL_LINKS = 'brizy_get_internal_links';


	static private $instance;

	/**
	 * @var Brizy_Editor_Project
	 */
	private $project;

	/**
	 * @var Brizy_Editor_Post
	 */
	private $post;

	/**
	 * @return Brizy_Editor_Project
	 */
	public function get_project() {
		return $this->project;
	}

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
	public function __construct( $project, $post ) {

		$this->project = $project;
		$this->post    = $post;

		$this->initialize();
	}

	private function initialize() {

		add_action( 'wp_ajax_' . self::AJAX_PING, array( $this, 'ping' ) );
		add_action( 'wp_ajax_' . self::AJAX_GET, array( $this, 'get_item' ) );
		add_action( 'wp_ajax_' . self::AJAX_UPDATE, array( $this, 'update_item' ) );
		add_action( 'wp_ajax_' . self::AJAX_GET_GLOBALS, array( $this, 'get_globals' ) );
		add_action( 'wp_ajax_' . self::AJAX_SET_GLOBALS, array( $this, 'set_globals' ) );
		add_action( 'wp_ajax_' . self::AJAX_MEDIA, array( $this, 'media' ) );
		add_action( 'wp_ajax_' . self::AJAX_SIDEBARS, array( $this, 'get_sidebars' ) );
		//add_action( 'wp_ajax_' . self::AJAX_BUILD, array( $this, 'build_content' ) );
		add_action( 'wp_ajax_' . self::AJAX_SIDEBAR_CONTENT, array( $this, 'sidebar_content' ) );
		add_action( 'wp_ajax_' . self::AJAX_SHORTCODE_CONTENT, array( $this, 'shortcode_content' ) );
		add_action( 'wp_ajax_' . self::AJAX_SHORTCODE_LIST, array( $this, 'shortcode_list' ) );
		add_action( 'wp_ajax_' . self::AJAX_GET_TEMPLATES, array( $this, 'template_list' ) );
		add_action( 'wp_ajax_' . self::AJAX_GET_INTERNAL_LINKS, array( $this, 'get_internal_links' ) );
	}

	/**
	 * @internal
	 **/
	public function ping() {
		try {
			$this->authorize();
			$this->success( array() );
		} catch ( Exception $exception ) {
			$this->error( $exception->getCode(), $exception->getMessage() );
			exit;
		}
	}

	/**
	 * @internal
	 **/
	public function get_globals() {
		try {
			$this->authorize();

			$data = self::create_post_globals( $this->project, $this->post );

			$this->success( $data );
		} catch ( Exception $exception ) {
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

			$data = $this->param( 'data' );

			$this->project->set_globals( stripslashes( $data['globals'] ) );
			$this->project->save();

			Brizy_Editor_User::get()->update_project( $this->project->get_api_project() );

			$this->success( self::create_post_globals( $this->project, $this->post ) );
		} catch ( Exception $exception ) {
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

			$post_arr = self::create_post_arr( $this->post );

			$post_arr['is_index'] = true; // this is for the case when the page we return is not an index page.. but the editor wants one.

			$this->success( array( $post_arr ) );
		} catch ( Exception $exception ) {
			$this->error( 500, $exception->getMessage() );
			exit;
		}
	}

	/**
	 * @internal
	 **/
	public function update_item() {
		try {
			$content   = $this->param( 'data' );
			$title     = $this->param( 'title' );
			$atemplate = $this->param( 'template' );

			if ( $title ) {
				$this->post->set_title( $title );
			}

			if ( $atemplate ) {
				$this->post->set_template( $atemplate );
			}

			if ( $content ) {
				$this->post->set_data( $content );
			}

			$this->post
				->set_needs_compile( true )
				->save();

			$this->success( self::create_post_arr( $this->post ) );
		} catch ( Exception $exception ) {
			$this->error( $exception->getCode(), $exception->getMessage() );
		}
	}

//	/**
//	 * @internal
//	 */
//	public function build_content() {
//		try {
//
//			$this->post
//				->compile_page()
//				->save();
//
//			$this->success( self::create_post_arr( $this->post ) );
//		} catch ( Exception $exception ) {
//			$this->error( $exception->getCode(), $exception->getMessage() );
//		}
//	}

	public function sidebar_content() {
		try {

			if ( isset( $_REQUEST['sidebarId'] ) ) {
				$sidebar_id = $_REQUEST['sidebarId'];
			} else {
				throw new Exception( 'Invalid sidebar id provided', 500 );
			}

			ob_start();

			dynamic_sidebar( $sidebar_id );

			$sidebar_html = ob_get_clean();

			$this->success( array(
				'sidebarId'      => $sidebar_id,
				'sidebarContent' => $sidebar_html
			) );
		} catch ( Exception $exception ) {
			$this->error( $exception->getCode(), $exception->getMessage() );
		}
	}

	public function shortcode_content() {
		try {

			if ( isset( $_REQUEST['shortcode'] ) ) {
				$shortcode = stripslashes( $_REQUEST['shortcode'] );
			} else {
				throw new Exception( 'Shortcode string not provided.', 500 );
			}
			$shortcode = do_shortcode( $shortcode );

			$this->success( array(
				'shortcode' => $shortcode
			) );
		} catch ( Exception $exception ) {
			$this->error( $exception->getCode(), $exception->getMessage() );
		}
	}

	public function shortcode_list() {
		try {
			global $shortcode_tags;
			$this->success( array_keys( $shortcode_tags ) );
		} catch ( Exception $exception ) {
			$this->error( $exception->getCode(), $exception->getMessage() );
		}
	}

	public function template_list() {
		try {
			$templates = get_page_templates();

			$response = array(
				(object) array( "name" => 'Default', 'value' => 'default' )
			);

			foreach ( $templates as $name => $path ) {
				$response[] = (object) array( "name" => $name, 'value' => $path );
			}

			$this->success( $response );
		} catch ( Exception $exception ) {
			$this->error( $exception->getCode(), $exception->getMessage() );
		}
	}

	public function get_internal_links() {

		$search_term = $this->param( 'filter_term' );

		$links = array();
		$links = array_merge( $links, $this->get_post_link_list( $search_term ) );
		$links = array_merge( $links, $this->get_term_link_list( $search_term ) );

		return wp_send_json( [ 'filter_term' => $search_term, 'links' => $links ], 200 );
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

	/**
	 * @internal
	 **/
	public function media() {
		try {
			$this->authorize();

			$attachment_id = $this->param( 'attachmentId' );

			$brizy_editor_user = Brizy_Editor_User::get();
			$this->success( $brizy_editor_user->get_media_id(
				$this->project,
				$attachment_id
			) );
		} catch ( Exception $exception ) {
			$this->error( $exception->getCode(), $exception->getMessage() );
		}
	}

	protected function param( $name ) {
		if ( isset( $_POST[ $name ] ) ) {
			return $_POST[ $name ];
		}

		throw new Brizy_Editor_Exceptions_NotFound( "Parameter '$name' is missing", 400 );
	}

	protected function error( $code, $message ) {
		wp_send_json_error( array( 'code' => $code, 'message' => $message ), 500 );
	}

	protected function success( $data ) {
		wp_send_json( $data );
	}

	protected function static_url() {
		return brizy()->get_url( '/includes/editor/static' );
	}

	private function authorize() {
		if ( ! wp_verify_nonce( $_POST['hash'], self::nonce ) ) {
			throw new Brizy_Editor_Exceptions_AccessDenied();
		}
	}

	public static function create_post_arr( Brizy_Editor_Post $post ) {

		$p_id      = (int) $post->get_id();
		$the_title = get_the_title( $p_id );

		return array(
			'title'    => $the_title,
			'slug'     => sanitize_title( $the_title ),
			'data'     => $post->get_data(),
			'id'       => $p_id,
			'is_index' => $post->get_api_page()->is_index(),
			'template' => get_page_template_slug( $p_id ),
			'status'   => get_post_status( $p_id ),
			'url'      => get_the_permalink( $p_id )
		);
	}

	/**
	 * @todo: Check where this is used and make this an instance method
	 *
	 * @param Brizy_Editor_Project $project
	 * @param Brizy_Editor_Post $post
	 *
	 * @return array
	 */
	public static function create_post_globals( $project, $post ) {
		$wp_post = $post->get_wp_post();

		return array(
			'id'        => $project->get_id(),
			'name'      => $wp_post->post_name,
			'globals'   => $project->get_globals(),
			'createdAt' => $wp_post->post_date,
			'updatedAt' => $wp_post->post_date,
			'user'      => array(
				'email' => null,
				'id'    => null,
			),
		);
	}

	/**
	 * Return an array of terms
	 *
	 * Ex: ['label'=>'Term name',
	 *      'url'=>'term url',
	 *      'taxonomy'=>'taxonomy name']
	 *
	 * @return array
	 */
	private function get_term_link_list( $search_term ) {

		$links = array();

		$args = array();

		if($search_term) {
			$args['name__like'] = $search_term;
		}

		$terms = get_terms($args);

		foreach ( $terms as $term ) {
			$links[] = (object) array(
				'label'    => $term->name,
				'url'      => get_term_link( $term ),
				'taxonomy' => $term->taxonomy
			);
		}

		return $links;
	}

	/**
	 * @param $search_term
	 *
	 * @return array
	 */
	private function get_post_link_list( $search_term ) {

		add_filter( 'posts_where', array( $this, 'brizy_post_title_filter' ), 10, 2 );

		$post_query = array(
			'post_type'      => 'any',
			'posts_per_page' => - 1,
			'post_status'    => 'publish',
			'orderby'        => 'post_title',
			'order'          => 'ASC'
		);

		if ( $search_term ) {
			$post_query['post_title_term'] = $search_term;
		}

		$posts = new WP_Query( $post_query );

		$links = array();

		foreach ( $posts->posts as $post ) {
			$permalink = null;
			switch ( $post->post_type ) {
				case 'revision':
				case 'nav_menu_item':
					continue;
				case 'page':
					$permalink = get_page_link( $post->ID );
					break;
				case 'post':
					$permalink = get_permalink( $post->ID );
					break;
				case 'attachment':
					$permalink = get_attachment_link( $post->ID );
					break;
				default:
					$permalink = get_post_permalink( $post->ID );
					break;
			}

			$label = get_the_title( $post );

			$links[] = (object) array( 'label' => $label, 'url' => $permalink, 'post_type' => $post->post_type );
		}

		remove_filter( 'posts_where', 'brizy_post_title_filter', 10, 2 );

		return $links;
	}

	public function brizy_post_title_filter( $where, &$wp_query ) {

		global $wpdb;

		if ( $term = $wp_query->get( 'post_title_term' ) ) {
			$search_term = $wpdb->esc_like( $term );
			$search_term = ' \'%' . $search_term . '%\'';

			$where .= ' AND ' . $wpdb->posts . '.post_title LIKE ' . $search_term;
		}

		return $where;
	}
}