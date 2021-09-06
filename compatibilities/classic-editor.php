<?php
/**
 * https://wordpress.org/plugins/classic-editor/
 */
class Brizy_Compatibilities_ClassicEditor {

	public function __construct() {
		add_filter( 'brizy_html_entity_decode', '__return_false' );
	}
}
