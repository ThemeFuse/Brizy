<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

class BitBlox_WP_Post {

	private $id;

	public static function get( $id ) {
		return new self( $id );
	}

	public function __construct( $id = null ) {
		if ( ! in_array( ( $type = get_post_type( $id ) ), bitblox_wp()->supported_post_types() ) ) {
			throw new BitBlox_WP_Exception_Unsupported_Post_Type(
				"Bitblox editor doesn't support '$type' post type"
			);
		}

		if ( ! $this->can_edit() ) {
			throw new BitBlox_WP_Exception_Access_Denied( 'Current user cannot edit page' );
		}

		$this->set_id( $id );
	}

	public function get_post() {
		return get_post( $this->get_id() );
	}

	public function get_id() {
		return $this->id;
	}

	/**
	 * @return BitBlox_WP_Project
	 * @throws BitBlox_WP_Exception_Not_Found
	 */
	public function get_project() {
		try {
			return $this->storage()->get( 'project' );
		} catch ( BitBlox_WP_Exception_Not_Found $exception ) {
			return $this->set_project( BitBlox_WP_User::get()->get_project() )->get_project();
		}
	}

	public function has_project() {
		try {
			return (bool) $this->storage()->get( 'project' );
		} catch ( BitBlox_WP_Exception_Not_Found $exception ) {
			return false;
		}
	}

	public function set_project( BitBlox_WP_Project $project ) {
		$this->storage()->set( 'project', $project );

		return $this;
	}

	public function can_edit() {
		return true;

		return current_user_can( 'edit_pages' );
	}

	public function edit_url() {
		return add_query_arg(
			array( BitBlox_WP_Constants::EDIT_KEY => '' ),
			get_permalink( $this->get_id() )
		);
	}

	public function uses_editor() {

		try {
			return (bool) $this->storage()->get( BitBlox_WP_Constants::USES_BITBLOX );
		} catch ( Exception $exception ) {
			return false;
		}
	}

	public function set_json( $content ) {
		if ( ! empty( $content ) && json_decode( $content ) === null ) {
			throw new BitBlox_WP_Exception_Invalid_Content();
		}

		if ( ! $this->uses_editor() ) {
			throw new BitBlox_WP_Exception_Not_BitBlox_Page( "The page with id {$this->get_id()} doesn't use BitBlox editor" );
		}

		$this->storage()->set( BitBlox_WP_Constants::CONTENT_META_KEY, base64_encode( $content ) );
		$this->storage()->set( 'rebuild', true );

		return $this;
	}

	public function update_html() {

		if ( ! $this->requires_update() ) {
			return $this;
		}

		$project = $this->get_project();

		$html = BitBlox_WP_User
			::get()
			->update_project( $project, $this->get_title(), $this->get_json() )
			->get_html( $project );

		$dom = new BitBlox_WP_DOM( $html['html'] );
		$this->store_scripts( $dom->get_scripts() );
		$this->store_styles( array_merge( $dom->get_links() ) );
		$this->store_inline_styles( $dom->get_styles() );

		wp_update_post( array(
			'ID'           => $this->get_id(),
			'post_content' => $dom
				->get_body()
				->strip_tags( array( 'script' ) )
				->get_content(),
		) );

		//$this->storage()->delete( 'rebuild' );

		return $this;
	}

	public function get_title() {
		return get_the_title( $this->get_id() );
	}

	public function get_json() {
		try {
			return base64_decode( $this->storage()->get( BitBlox_WP_Constants::CONTENT_META_KEY ) );
		} catch ( Exception $exception ) {
			return json_encode( array( 'container' => array() ) );
		}
	}

	public function enable_editor() {
		$this->storage()->set( BitBlox_WP_Constants::USES_BITBLOX, 1 );

		return $this;
	}

	public function disable_editor() {
		$this->storage()->delete( BitBlox_WP_Constants::USES_BITBLOX );

		return $this;
	}

	public function requires_update() {
		try {
			return (bool) $this->storage()->get( 'rebuild' );
		} catch ( BitBlox_WP_Exception_Not_Found $exception ) {
			return false;
		}
	}

	public function get_globals() {
		return $this->storage()->get( 'globals' );
	}

	public function set_globals( array $data ) {
		$this->storage()->set( 'globals', $data );

		return $this;
	}

	public function storage() {
		return BitBlox_WP_Post_Storage::instance( $this->get_id() );
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

	protected function set_id( $id ) {
		$this->id = $id;
	}

	protected function store_scripts( $list ) {
		$new = array();

		foreach ( $list as $item ) {
			$new[] = new BitBlox_WP_Static_Script( "bitblox-wp-{$this->get_id()}", $item );
		}

		$this->storage()->set( 'scripts', $this->store_static( $new ) );
	}

	protected function store_styles( $list ) {
		$new = array();

		foreach ( $list as $item ) {
			$new[] = new BitBlox_WP_Static_Style( "bitblox-wp-{$this->get_id()}", $item );
		}

		$this->storage()->set( 'styles', $this->store_static( $new ) );
	}

	protected function store_inline_styles( $list ) {
		$this->storage()->set( 'inline-styles', $list );
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
}
