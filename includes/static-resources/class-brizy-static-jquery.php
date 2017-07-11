<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

abstract class Brizy_Static_Jquery extends Brizy_Static {
	public function __construct() {
		parent::__construct( '' );
	}

	public function enqueue() {
		wp_enqueue_script( 'jquery' );
	}
}
