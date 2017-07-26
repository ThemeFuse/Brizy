<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

abstract class Brizy_Editor_Resources_StaticJquery extends Brizy_Editor_Resources_Static {
	public function __construct() {
		parent::__construct( '' );
	}

	public function enqueue() {
		wp_enqueue_script( 'jquery' );
	}
}
