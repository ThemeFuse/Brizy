<?php
/**
 * Created by PhpStorm.
 * User: alex
 * Date: 7/26/17
 * Time: 10:42 AM
 */

class Brizy_Editor_Api_Config {
	const AUTH_GATEWAY_URI = 'https://test-de12d4.bitblox.site/api/public/users';
	const GATEWAY_URI = 'http://api.bitblox.xyz';

	public static function sign_up_url() {
		return implode( '/', array( self::AUTH_GATEWAY_URI, 'create' ) );
	}

	public static function auth_url() {
		return implode( '/', array( self::AUTH_GATEWAY_URI, 'auth' ) );
	}

	public static function refresh_url() {
		return implode( '/', array( self::AUTH_GATEWAY_URI, 'refresh' ) );
	}
}