<?php
/**
 * Created by PhpStorm.
 * User: alex
 * Date: 7/31/17
 * Time: 10:29 AM
 */

use PHPUnit\Framework\TestCase;


class Brizy_Editor_API_Auth_UnitTest extends TestCase {

	public function testUrlSettings() {
		$url = 'http://test.com';

		$auth = new Brizy_Editor_API_Auth( $url );

		$this->assertEquals( $auth->auth_url(), $url . '/auth', 'The auth url should be ' . $url . '/auth' );
		$this->assertEquals( $auth->sign_up_url(), $url . '/create', 'The sign up url should be ' . $url . '/create' );
		$this->assertEquals( $auth->refresh_url(), $url . '/refresh', 'The refresh url should be ' . $url . '/refresh' );
	}

	public function test_create_user() {
		$url        = 'http://127.0.0.1';
		$url_create = 'http://127.0.0.1/create';
		$email      = 'email@email.com';
		$password   = 'password';
		$stub       = $this->getMockBuilder( Brizy_Editor_API_Auth::class )
		                   ->setConstructorArgs( array( $url ) )
		                   ->setMethods( [ 'auth_call' ] )
		                   ->getMock();
		$stub->expects( $this->once() )->method( 'auth_call' )
		     ->with( $url_create, $email, $password )
		     ->willReturn( new Brizy_Editor_Http_Response( [] ) );

		$stub->create_user( $email, $password );
	}

	public function test_auth() {
		$url        = 'http://127.0.0.1';
		$url_auth = 'http://127.0.0.1/auth';
		$email      = 'email@email.com';
		$password   = 'password';
		$stub       = $this->getMockBuilder( Brizy_Editor_API_Auth::class )
		                   ->setConstructorArgs( array( $url ) )
		                   ->setMethods( [ 'auth_call' ] )
		                   ->getMock();
		$stub->expects( $this->once() )->method( 'auth_call' )
		     ->with( $url_auth, $email, $password )
		     ->willReturn( new Brizy_Editor_Http_Response( [] ) );

		$stub->auth( $email, $password );
	}
}
