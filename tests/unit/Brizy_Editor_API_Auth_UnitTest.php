<?php


use PHPUnit\Framework\TestCase;


class Brizy_Editor_API_Auth_UnitTest extends TestCase {

	public function testUrlSettings() {
		$url = 'http://test.com';

		$auth = new Brizy_Editor_API_Auth( $url,'client','secrtet' );

		$this->assertEquals( $auth->auth_url(), $url . '/oauth/token', 'The auth url should be ' . $url . '/auth' );
		$this->assertEquals( $auth->refresh_url(), $url . '/oauth/refresh', 'The refresh url should be ' . $url . '/refresh' );
	}
}
