<?php
/**
 * Created by PhpStorm.
 * User: alex
 * Date: 2/1/18
 * Time: 4:45 PM
 */

use PHPUnit\Framework\TestCase;

class Brizy_Editor_Http_Client_UnitTest extends TestCase {


	/**
	 * @throws Brizy_Editor_API_Exceptions_Exception
	 */
	public function test_request() {

		$url = 'URL';

		$http = $this->getMockBuilder( 'WP_Http' )
		             ->setMethods( [ 'request' ] )
		             ->getMock();

		$http->expects( $this->once() )
		     ->method( 'request' )
		     ->with( $url, [ 'method' => 'GET' ] )
		     ->willReturn( new WP_Error(500, 'some error message') );


		$client = new Brizy_Editor_Http_Client($http);

		$client->request($url);
	}

}