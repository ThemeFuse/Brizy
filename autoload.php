<?php

include_once dirname( __FILE__ ) . "/vendor/autoload.php";

/**.
 * @param $class_name
 */
function brizyAutoload( $class_name ) {

	$class_parts = explode( '_', $class_name );
	$last_part   = end( $class_parts );
	$path_parts  = array_slice( $class_parts, 1, count( $class_parts ) - 2 );

	foreach ( $path_parts as $i => $path_part ) {
		$path_parts[ $i ] = camelCaseToPath( $path_part );
	}

	$path     = strtolower( implode( DIRECTORY_SEPARATOR, $path_parts ) );
	$abs_path = dirname( __FILE__ );

	// works only for brizy
	if ( $class_parts[0] != 'Brizy' ) {
		return;
	}

	$file_name = camelCaseToPath( $last_part );

	$include_path = $abs_path . DIRECTORY_SEPARATOR . ( $path ? $path . DIRECTORY_SEPARATOR : "" ) . $file_name;

	if ( BRIZY_DEVELOPMENT && file_exists( $include_path . ".dev.php" ) ) {
		$include_path .= ".dev.php";
	} else {
		$include_path .= ".php";
	}

	if ( file_exists( $include_path ) ) {
		include_once $include_path;
	}
}

function camelCaseToPath( $apath ) {
	$matches = array();
	preg_match_all( '/(.[a-z0-9]+|.[A-Z0-9]+|.[A-Z0-9].[a-z0-9]+)/', $apath, $matches );
	$path = null;

	if ( isset($matches[1]) && count( $matches[1] ) > 1 ) {
		$path = strtolower( implode( '-', $matches[1] ) );
	} else {
		if(isset($matches[1][0]))
		{
			$path = strtolower( $matches[1][0] );
		}
	}

	return $path;
}

spl_autoload_register( 'brizyAutoload' );