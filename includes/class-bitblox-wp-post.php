<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

class BitBlox_WP_Post extends BitBlox_WP_Project {
	public static function get( $id ) {
		if ( ! in_array( ( $type = get_post_type( $id ) ), bitblox_wp()->supported_post_types() ) ) {
			throw new BitBlox_WP_Exception_Unsupported_Post_Type(
				"Bitblox editor doesn't support '$type' post type"
			);
		}

		return new self( $id, self::get_storage( $id )->get( 'bitblox-project' ) );
	}

	public static function create( $id = - 1 ) {
		if ( ! in_array( ( $type = get_post_type( $id ) ), bitblox_wp()->supported_post_types() ) ) {
			throw new BitBlox_WP_Exception_Unsupported_Post_Type(
				"Bitblox editor doesn't support '$type' post type"
			);
		}

		self::get_storage( $id )->set( 'bitblox-project', parent::create() );

		return self::get( $id );
	}

	private $id;

	/**
	 * BitBlox_WP_Post constructor.
	 *
	 * @param $id
	 * @param BitBlox_WP_Project $project
	 */
	protected function __construct( $id, BitBlox_WP_Project $project ) {
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
			throw new BitBlox_WP_Exception_Access_Denied();
		}

		wp_update_post( array(
			'ID'         => $this->ID(),
			'post_title' => $data
		) );

		return $this;
	}

	/**
	 * @return BitBlox_WP_Post_Storage
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
	 * @throws BitBlox_WP_Exception_Access_Denied
	 */
	public function enable_editor() {
		if ( ! $this->can_edit() ) {
			throw new BitBlox_WP_Exception_Access_Denied( 'Current user cannot edit page' );
		}

		$this->storage()->set( BitBlox_WP_Constants::USES_BITBLOX, 1 );

		return $this;
	}

	/**
	 * @return bool
	 */
	public function uses_editor() {

		try {
			return (bool) $this->storage()->get( BitBlox_WP_Constants::USES_BITBLOX );
		} catch ( Exception $exception ) {
			return false;
		}
	}

	/**
	 * @return string
	 */
	public function edit_url() {
		return add_query_arg(
			array( BitBlox_WP_Constants::EDIT_KEY => '' ),
			get_permalink( $this->ID() )
		);
	}

	/**
	 * @return $this
	 * @throws BitBlox_WP_Exception_Access_Denied
	 */
	public function disable_editor() {
		if ( ! $this->can_edit() ) {
			throw new BitBlox_WP_Exception_Access_Denied( 'Current user cannot edit page' );
		}

		$this->storage()->delete( BitBlox_WP_Constants::USES_BITBLOX );

		return $this;
	}

	/**
	 * @return BitBlox_WP_Static_Script[]
	 */
	public function get_scripts() {
		try {
			return $this->storage()->get( 'scripts' );
		} catch ( Exception $exception ) {
			return array();
		}
	}

	/**
	 * @return BitBlox_WP_Static_Style[]
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
	 * @param $list
	 *
	 * @return $this
	 */
	protected function store_scripts( $list ) {

		$new = array();

		foreach ( $list as $item ) {
			$id    = implode( '-', array( $this->ID(), basename( $item ) ) );
			$new[] = new BitBlox_WP_Static_Script( "bitblox-wp-$id", $item );
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
			$new[] = new BitBlox_WP_Static_Style( "bitblox-wp-$id", $item );
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

	public function update_html() {
		$this->store_scripts( $this->get_published_html()->get_scripts() );
		$this->store_styles( $this->get_published_html()->get_links() );
		$this->store_inline_styles( $this->get_published_html()->get_styles() );

		wp_update_post( array(
			'ID'           => $this->ID(),
			'post_content' => $this->get_published_html()->get_content(),
		) );
	}

	/**
	 * @param BitBlox_WP_Static[] $list
	 *
	 * @return array
	 */
	public function store_static( array $list ) {
		$new = array();

		foreach ( $list as $item ) {
			try {
				$new[] = BitBlox_WP_Static_Storage::get( $item )
				                                  ->store()
				                                  ->get_resource();
			} catch ( Exception $exception ) {
				continue;
			}
		}

		return $new;
	}

	public function get_published_html() {
		$html = BitBlox_WP_User::get()->get_html_dev( $this );

		return new BitBlox_WP_Project_Html( $html['html'] );
	}

	public function get_draft_html() {
		$html = BitBlox_WP_User::get()->get_html_dev( $this );

		return new BitBlox_WP_Project_Html( $html['html'] );
	}

	protected static function get_storage( $id ) {
		return BitBlox_WP_Post_Storage::instance( $id );
	}
}
