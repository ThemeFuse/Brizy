<?php

include_once "vendor/autoload.php";

/**.
 * @param $class_name
 */
function brizy_autoload( $class_name ) {

	$class_parts = explode( '_', $class_name );
	$last_part   = end( $class_parts );
	$path_parts  = array_slice( $class_parts, 1, count( $class_parts ) - 2 );
	$path        = strtolower( implode( DIRECTORY_SEPARATOR, $path_parts ) );
	$abs_path    = dirname( __FILE__ );

	// works only for brizy
	if ( $class_parts[0] != 'Brizy' ) {
		return;
	}

	$matches = array();
	preg_match_all( '/(.[a-z]+|.[A-Z]+|.[A-Z].[a-z]+)/', $last_part, $matches );

	if ( count( $matches[1] ) > 1 ) {
		$file_name = strtolower( implode( '-', $matches[1] ) );
	} else {
		$file_name = strtolower( $matches[1][0] );
	}

	$include_path = $abs_path . DIRECTORY_SEPARATOR . ( $path ? $path . DIRECTORY_SEPARATOR : "" ) . $file_name;

	if ( BRIZY_DEVELOPMENT && file_exists( $include_path . ".dev.php" ) ) {
		$include_path .= ".dev.php";
	} else {
		$include_path .= ".php";
	}

	include_once $include_path;
}

spl_autoload_register( 'brizy_autoload' );