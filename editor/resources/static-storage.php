<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

class Brizy_Editor_Resources_StaticStorage {
	private $uploads;
	private $res;

	const DIR = 'static';

	public static function get( Brizy_Editor_Resources_Static $resource ) {
		return new self( $resource );
	}

	protected function __construct( Brizy_Editor_Resources_Static $resource ) {
		$this->uploads = new Brizy_Editor_UploadsDir();
		$this->res     = $resource;
	}

	public function get_resource() {
		return $this->res;
	}

	public function store() {
		return $this->store_resource();
	}

	public static function get_uri() {
		return Brizy_Editor_UploadsDir::get_uri( self::DIR );
	}

	public static function get_path() {
		return Brizy_Editor_UploadsDir::get_path( self::DIR );
	}

	protected function store_resource() {
		if ( ! $this->validate_resource( $this->get_resource() ) ) {
			return $this;
		}

		self::create_base_dir();

		$content = file_get_contents( $this->get_resource()->get_url() );

		if ( ! $content ) {
			throw new Brizy_Editor_Exceptions_Exception();
		}

		if ( ! file_put_contents( $this->resource_path( $this->get_resource() ), $content ) ) {
			throw new Brizy_Editor_Exceptions_Exception();
		}

		$this
			->get_resource()
			->set_version( time() )
			->set_url( $this->resource_url( $this->get_resource() ) );

		return $this;
	}

	protected function validate_resource( Brizy_Editor_Resources_Static $res ) {

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

	public static function resource_url( Brizy_Editor_Resources_Static $res ) {
		return self::get_uri()
		       . '/'
		       . $res->get_id()
		       . '-'
		       . basename( $res->get_url(), '.' . $res->get_type() )
		       . '.'
		       . $res->get_type();
	}

	public static function resource_path( Brizy_Editor_Resources_Static $res ) {
		return self::get_path()
		       . DIRECTORY_SEPARATOR
		       . $res->get_id()
		       . '-'
		       . basename( $res->get_url(), ".{$res->get_type()}" )
		       . '.'
		       . $res->get_type();
	}

	protected static function create_base_dir() {
		static $checked = false;

		if ( ! $checked ) {
			Brizy_Editor_UploadsDir::add_dir( self::DIR );
			$checked = true;
		}
	}
}
