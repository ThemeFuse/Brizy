<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

abstract class BitBlox_WP_Static_Jquery extends BitBlox_WP_Static {
	public function __construct() {
		parent::__construct( '' );
	}

	public function enqueue() {
		wp_enqueue_script( 'jquery' );
	}
}
