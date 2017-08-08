<?php

/**.
 * @param $class_name
 */
function _brizy_autoload( $class_name ) {

	$class_parts = explode( '_', $class_name );
	$last_part   = end( $class_parts );
	$path_parts  = array_slice( $class_parts, 0, count( $class_parts ) - 1 );
	$path        = implode( DIRECTORY_SEPARATOR, $path_parts );
	$abs_path    = dirname( __FILE__ );

	// works only for brizy
	if ( $class_parts[0] != 'Brizy' ) {
		return;
	}

	$matches = array();
	preg_match_all( '/(.[a-z]+|.[A-Z]+|.[A-Z].[a-z]+)/', $last_part, $matches );

	if ( count( $matches[1] ) > 1 ) {
		$file_name = implode( '-', $matches[1] );
	} else {
		$file_name = $matches[1][0];
	}

	$include_path = $abs_path . DIRECTORY_SEPARATOR . '../' . DIRECTORY_SEPARATOR . strtolower( $path . DIRECTORY_SEPARATOR . $file_name . ".php" );

	include_once $include_path;
}

spl_autoload_register( '_brizy_autoload' );