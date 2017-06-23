<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

class BitBlox_WP_Static_Script extends BitBlox_WP_Static {

	private $footer;

	public function __construct( $id, $url, $deps = array(), $ver = false, $footer = true ) {
		parent::__construct( $id, $url, $deps, $ver );
		$this->footer = $footer;
	}

	public function enqueue( $locale_id = null, array $value = array() ) {
		wp_enqueue_script(
			$this->get_id(),
			$this->get_url(),
			$this->get_deps(),
			$this->get_version(),
			$this->in_footer()
		);

		if ( $locale_id && $value ) {
			wp_localize_script( $this->get_id(), $locale_id, $value );
		}
	}

	public function in_footer() {
		return $this->footer;
	}

	public function get_type() {
		return 'js';
	}
}
