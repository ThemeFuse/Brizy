<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

class Brizy_Editor_Post extends Brizy_Editor_Project {

	private $id;

	/**
	 * @param $id
	 *
	 * @return Brizy_Editor_Post
	 * @throws Brizy_Editor_Exceptions_UnsupportedPostType
	 */
	public static function get( $id ) {
		if ( ! in_array( ( $type = get_post_type( $id ) ), brizy()->supported_post_types() ) ) {
			throw new Brizy_Editor_Exceptions_UnsupportedPostType(
				"Brizy editor doesn't support '$type' post type"
			);
		}

		$project = self::get_storage( $id )->get( 'brizy-project' );

		return new self( $id, $project );
	}

	/**
	 * @param int $id
	 *
	 * @return Brizy_Editor_Post
	 * @throws Brizy_Editor_Exceptions_UnsupportedPostType
	 */
	public static function create( $id = - 1 ) {
		if ( ! in_array( ( $type = get_post_type( $id ) ), brizy()->supported_post_types() ) ) {
			throw new Brizy_Editor_Exceptions_UnsupportedPostType(
				"Brizy editor doesn't support '$type' post type"
			);
		}

		self::get_storage( $id )->set( 'brizy-project', parent::create() );

		return self::get( $id );
	}

	/**
	 * Brizy_Post constructor.
	 *
	 * @param $id
	 * @param Brizy_Editor_Project $project
	 */
	protected function __construct( $id, $project ) {
		$this->id = $id;

		parent::__construct( $project->get_id(), $project->get_page_id() );
	}

	/**
	 * @return mixed
	 */
	public function ID() {
		return $this->id;
	}

	/**
	 * @return array|null|WP_Post
	 */
	public function get_wp_post() {
		return get_post( $this->ID() );
	}

	/**
	 * @return string
	 */
	public function get_title() {
		return get_the_title( $this->ID() );
	}


	/**
	 * @param $data
	 *
	 * @return $this
	 * @throws Brizy_Editor_Exceptions_AccessDenied
	 */
	public function set_title( $data ) {

		if ( ! $this->can_edit() ) {
			throw new Brizy_Editor_Exceptions_AccessDenied();
		}

		wp_update_post( array(
			'ID'         => $this->ID(),
			'post_title' => $data
		) );

		return $this;
	}

	/**
	 * @return Brizy_Editor_Storage_Post
	 */
	public function storage() {
		return self::get_storage( $this->ID() );
	}

	/**
	 * @return bool
	 */
	public function can_edit() {
		return current_user_can( 'edit_pages' );
	}

	/**
	 * @return $this
	 * @throws Brizy_Editor_Exceptions_AccessDenied
	 */
	public function enable_editor() {
		if ( ! $this->can_edit() ) {
			throw new Brizy_Editor_Exceptions_AccessDenied( 'Current user cannot edit page' );
		}

		$this->storage()->set( Brizy_Editor_Constants::USES_BRIZY, 1 );

		return $this;
	}

	/**
	 * @return bool
	 */
	public function uses_editor() {

		try {
			return (bool) $this->storage()->get( Brizy_Editor_Constants::USES_BRIZY );
		} catch ( Exception $exception ) {
			return false;
		}
	}

	/**
	 * @return string
	 */
	public function edit_url() {
		return add_query_arg(
			array( Brizy_Editor_Constants::EDIT_KEY => '' ),
			get_permalink( $this->ID() )
		);
	}

	/**
	 * @return $this
	 * @throws Brizy_Editor_Exceptions_AccessDenied
	 */
	public function disable_editor() {
		if ( ! $this->can_edit() ) {
			throw new Brizy_Editor_Exceptions_AccessDenied( 'Current user cannot edit page' );
		}

		$this->storage()->delete( Brizy_Editor_Constants::USES_BRIZY );

		return $this;
	}

	/**
	 * @return Brizy_Editor_Resources_StaticScript[]
	 */
	public function get_scripts() {
		try {
			return $this->storage()->get( 'scripts' );
		} catch ( Exception $exception ) {
			return array();
		}
	}

	/**
	 * @return Brizy_Editor_Resources_StaticStyle[]
	 */
//	public function get_styles() {
//		try {
//			return $this
//				->storage()
//				->get( 'styles' );
//		} catch ( Exception $exception ) {
//			return array();
//		}
//	}

	/**
	 * @return Brizy_Editor_Resources_StaticStyle[]
	 */
	public function get_styles() {
		try {

			$links = $this->storage()->get( 'head_links' );

			$static_styles = array();

			if ( is_array( $links ) ) {
				foreach ( $links as $link ) {
					if ( isset( $link['rel'] ) && $link['rel'] == 'stylesheet' ) {
						$static_styles[] = new Brizy_Editor_Resources_StaticStyle( basename( $link['href'] ), $link['href'] );
					}
				}
			}

			return $static_styles;

		} catch ( Exception $exception ) {
			return array();
		}
	}

	public function get_links_tags() {
		try {

			$links = $this->storage()->get( 'head_links' );

			$link_tags = array();

			if ( is_array( $links ) ) {
				foreach ( $links as $link ) {
					if ( isset( $link['rel'] ) && $link['rel'] != 'stylesheet' ) {
						$link_tags[] = $link;
					}
				}
			}

			return $link_tags;

		} catch ( Exception $exception ) {
			return array();
		}
	}

	/**
	 * @return array
	 */
	public function get_inline_styles() {
		try {
			return $this
				->storage()
				->get( 'inline-styles' );
		} catch ( Exception $exception ) {
			return array();
		}
	}

	/**
	 * @param Brizy_Editor_Resources_Static[] $list
	 *
	 * @return array
	 */
	public function store_static( array $list ) {
		$new = array();

		foreach ( $list as $item ) {
			try {
				$new[] = Brizy_Editor_Resources_StaticStorage::get( $item )
				                                             ->store()
				                                             ->get_resource();
			} catch ( Exception $exception ) {
				continue;
			}
		}

		return $new;
	}

	//TODO: Remove on production as need to use `get_html_dev` instead from Brizy_Project
	public function get_html() {
		$html = Brizy_Editor_User::get()->get_html_dev( $this );

		return new Brizy_Editor_CompiledHtml( $html['html'] );
	}

	public function update_html() {
		$brizy_editor_page_html = $this->get_html();

		$this->store_head_scripts( $brizy_editor_page_html->get_head_scripts() );
		$this->store_footer_scripts( $brizy_editor_page_html->get_footer_scripts() );
		$this->store_links( $brizy_editor_page_html->get_links_tags() );
		$this->store_inline_styles( $brizy_editor_page_html->get_styles() );

		wp_update_post( array(
			'ID'           => $this->ID(),
			'post_content' => $brizy_editor_page_html->get_body(),
		) );
	}

	/**
	 * @return array
	 */
	public function get_templates() {
		$type = get_post_type( $this->ID() );
		$list = array(
			array(
				'id'    => '',
				'title' => __( 'Default' )
			)
		);

		return apply_filters( "brizy:$type:templates", $list );
	}

	/**
	 * @return string
	 */
	public function get_template() {
		return get_post_meta( $this->ID(), '_wp_page_template', true );
	}

	/**
	 * @param string $template
	 *
	 * @return $this
	 */
	public function set_template( $template ) {
		update_post_meta( $this->ID(), '_wp_page_template', $template );

		return $this;
	}

	/**
	 * @param $list
	 *
	 * @return $this
	 */
	protected function store_scripts( $key, $list, $in_footer ) {

		$new = array();

		foreach ( $list as $item ) {
			$id    = implode( '-', array( $this->ID(), basename( $item ) ) );
			$new[] = new Brizy_Editor_Resources_StaticScript( "brizy-$id", $item, array(), null, $in_footer );
		}

		$this->storage()->set( $key, $this->store_static( $new ) );

		return $this;
	}

	/**
	 * @param $list
	 *
	 * @return $this
	 */
	protected function store_head_scripts( $list ) {

		$this->store_scripts( 'head_scripts', $list, false );

		return $this;
	}

	/**
	 * @param $list
	 *
	 * @return $this
	 */
	protected function store_footer_scripts( $list ) {

		$this->store_scripts( 'footer_scripts', $list, true );

		return $this;
	}

	/**
	 * @param $link_tags
	 *
	 * @return $this
	 */
	protected function store_links( $link_tags ) {
		$new = array();


		foreach ( $link_tags as $link_tag ) {
			$uri   = $link_tag->get_attr( 'href' );
			$id    = implode( '-', array( $this->ID(), basename( $uri ) ) );
			$new[] = new Brizy_Editor_Resources_StaticStyle( "brizy-$id", $uri );
		}

		// remove this when the head_links will be ready.
		$this->storage()->set( 'links', $this->store_static( $new ) );

		$head_links = array();

		foreach ( $link_tags as $i => $link_tag ) {
			$link         = $link_tag->get_attrs();
			$link['href'] = $new[ $i ]->get_url();

			$head_links[] = $link;
		}

		$this->storage()->set( 'head_links', $head_links );

		return $this;
	}

	/**
	 * @param $list
	 *
	 * @return $this
	 */
	protected function store_inline_styles( $list ) {
		$this->storage()->set( 'inline-styles', $list );

		return $this;
	}

	protected static function get_storage( $id ) {
		return Brizy_Editor_Storage_Post::instance( $id );
	}
}
