<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

class Brizy_Editor_Resources_StaticStyle extends Brizy_Editor_Resources_Static {
	public function enqueue() {
		wp_enqueue_style(
			$this->get_id(),
			$this->get_url(),
			$this->get_deps(),
			$this->get_version()
		);
	}

	public function get_type() {
		return 'css';
	}
}
