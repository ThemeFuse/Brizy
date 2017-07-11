<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

class Brizy_Post extends Brizy_Project {
	public static function get( $id ) {
		if ( ! in_array( ( $type = get_post_type( $id ) ), brizy()->supported_post_types() ) ) {
			throw new Brizy_Exception_Unsupported_Post_Type(
				"Brizy editor doesn't support '$type' post type"
			);
		}

		return new self( $id, self::get_storage( $id )->get( 'brizy-project' ) );
	}

	public static function create( $id = - 1 ) {
		if ( ! in_array( ( $type = get_post_type( $id ) ), brizy()->supported_post_types() ) ) {
			throw new Brizy_Exception_Unsupported_Post_Type(
				"Brizy editor doesn't support '$type' post type"
			);
		}

		self::get_storage( $id )->set( 'brizy-project', parent::create() );

		return self::get( $id );
	}

	private $id;

	/**
	 * Brizy_Post constructor.
	 *
	 * @param $id
	 * @param Brizy_Project $project
	 */
	protected function __construct( $id, Brizy_Project $project ) {
		$this->id = $id;

		parent::__construct( $project->get_id(), $project->get_page_id() );
	}

	/**
	 * @return mixed
	 */
	public function ID() {
		return $this->id;
	}

	public function get_wp_post() {
		return get_post( $this->ID() );
	}

	public function get_title() {
		return get_the_title( $this->ID() );
	}

	public function set_title( $data ) {

		if ( ! $this->can_edit() ) {
			throw new Brizy_Exception_Access_Denied();
		}

		wp_update_post( array(
			'ID'         => $this->ID(),
			'post_title' => $data
		) );

		return $this;
	}

	/**
	 * @return Brizy_Post_Storage
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
	 * @throws Brizy_Exception_Access_Denied
	 */
	public function enable_editor() {
		if ( ! $this->can_edit() ) {
			throw new Brizy_Exception_Access_Denied( 'Current user cannot edit page' );
		}

		$this->storage()->set( Brizy_Constants::USES_BRIZY, 1 );

		return $this;
	}

	/**
	 * @return bool
	 */
	public function uses_editor() {

		try {
			return (bool) $this->storage()->get( Brizy_Constants::USES_BRIZY );
		} catch ( Exception $exception ) {
			return false;
		}
	}

	/**
	 * @return string
	 */
	public function edit_url() {
		return add_query_arg(
			array( Brizy_Constants::EDIT_KEY => '' ),
			get_permalink( $this->ID() )
		);
	}

	/**
	 * @return $this
	 * @throws Brizy_Exception_Access_Denied
	 */
	public function disable_editor() {
		if ( ! $this->can_edit() ) {
			throw new Brizy_Exception_Access_Denied( 'Current user cannot edit page' );
		}

		$this->storage()->delete( Brizy_Constants::USES_BRIZY );

		return $this;
	}

	/**
	 * @return Brizy_Static_Script[]
	 */
	public function get_scripts() {
		try {
			return $this->storage()->get( 'scripts' );
		} catch ( Exception $exception ) {
			return array();
		}
	}

	/**
	 * @return Brizy_Static_Style[]
	 */
	public function get_styles() {
		try {
			return $this
				->storage()
				->get( 'styles' );
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
	 * @param Brizy_Static[] $list
	 *
	 * @return array
	 */
	public function store_static( array $list ) {
		$new = array();

		foreach ( $list as $item ) {
			try {
				$new[] = Brizy_Static_Storage::get( $item )
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
		$html = Brizy_User::get()->get_html_dev( $this );

		return new Brizy_Project_Html( $html['html'] );
	}

	public function update_html() {
		$this->store_scripts( $this->get_html()->get_scripts() );
		$this->store_styles( $this->get_html()->get_links() );
		$this->store_inline_styles( $this->get_html()->get_styles() );

		wp_update_post( array(
			'ID'           => $this->ID(),
			'post_content' => $this->get_html()->get_content(),
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
	protected function store_scripts( $list ) {

		$new = array();

		foreach ( $list as $item ) {
			$id    = implode( '-', array( $this->ID(), basename( $item ) ) );
			$new[] = new Brizy_Static_Script( "brizy-$id", $item );
		}

		$this->storage()->set( 'scripts', $this->store_static( $new ) );

		return $this;
	}

	/**
	 * @param $list
	 *
	 * @return $this
	 */
	protected function store_styles( $list ) {
		$new = array();

		foreach ( $list as $item ) {
			$id    = implode( '-', array( $this->ID(), basename( $item ) ) );
			$new[] = new Brizy_Static_Style( "brizy-$id", $item );
		}

		$this->storage()->set( 'styles', $this->store_static( $new ) );

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
		return Brizy_Post_Storage::instance( $id );
	}
}
