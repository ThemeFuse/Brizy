<?php
/**
 * Created by PhpStorm.
 * User: alex
 * Date: 3/22/18
 * Time: 3:07 PM
 */

class Brizy_Admin_View {
	public static function render( $view, array $args = array() ) {
		return Brizy_Editor_View::get(
			implode( DIRECTORY_SEPARATOR, array( dirname( __FILE__ ), 'views', $view ) ),
			$args
		);
	}

}