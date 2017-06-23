<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

class BitBlox_WP_Static_Storage {
	private $res;

	public static function get( BitBlox_WP_Static $resource ) {
		return new self( $resource );
	}

	protected function __construct( BitBlox_WP_Static $resource ) {
		$this->res = $resource;
	}

	public function get_resource() {
		return $this->res;
	}

	public function store() {
		return $this->store_resource();
	}

	public function get_uri() {
		return $this->get_uploads_url() . '/' . bitblox_wp()->get_slug();
	}

	public function get_path() {
		return $this->get_uploads_path() . DIRECTORY_SEPARATOR . bitblox_wp()->get_slug();
	}

	private function get_uploads_url() {
		static $uri;

		if ( ! $uri ) {
			$uploads = wp_upload_dir();
			$uri     = $uploads['baseurl'];
		}

		return $uri;
	}

	private function get_uploads_path() {
		static $uri;

		if ( ! $uri ) {
			$uploads = wp_upload_dir();
			$uri     = $uploads['basedir'];
		}

		return $uri;
	}

	protected function store_resource() {
		if ( ! $this->validate_resource( $this->get_resource() ) ) {
			return $this;
		}

		$this->create_base_dir();

		$content = file_get_contents( $this->get_resource()->get_url() );

		if ( ! $content ) {
			throw new BitBlox_WP_Exception();
		}

		if ( ! file_put_contents( $this->resource_path( $this->get_resource() ), $content ) ) {
			throw new BitBlox_WP_Exception();
		}

		$this
			->get_resource()
			->set_version( time() )
			->set_url( $this->resource_url( $this->get_resource() ) );

		return $this;
	}

	protected function validate_resource( BitBlox_WP_Static $res ) {

		preg_match( '/jquery(\.min)\.js$/i', $res->get_url(), $matches );

		if ( ! empty( $matches ) ) {
			return false;
		}

		preg_match( '/.*\.(js|css)$/i', $res->get_url(), $matches );

		if ( empty( $matches ) ) {
			return false;
		}

		return true;
	}

	protected function resource_url( BitBlox_WP_Static $res ) {
		return $this->get_uri()
		       . '/'
		       . $res->get_id()
		       . '-'
		       . basename( $res->get_url(), '.' . $res->get_type() )
		       . '.'
		       . $res->get_type();
	}

	protected function resource_path( BitBlox_WP_Static $res ) {
		return $this->get_path()
		       . DIRECTORY_SEPARATOR
		       . $res->get_id()
		       . '-'
		       . basename( $res->get_url(), ".{$res->get_type()}" )
		       . '.'
		       . $res->get_type();
	}

	protected function create_base_dir() {
		static $checked = false;

		if ( ! $checked ) {
			if ( ! file_exists( $this->get_path() ) && ! mkdir( $this->get_path() ) ) {
				throw new BitBlox_WP_Exception_Access_Denied(
					'Cannot create static directory. Please check permissions'
				);
			}

			$checked = true;
		}

		return $this;
	}
}
