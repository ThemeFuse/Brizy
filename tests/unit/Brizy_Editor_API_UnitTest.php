<?php
/**
 * Created by PhpStorm.
 * User: alex
 * Date: 7/31/17
 * Time: 10:29 AM
 */

use PHPUnit\Framework\TestCase;

class Brizy_Editor_API_UnitTest extends TestCase {

	public function test_singleton()
	{
		$project = $this->createMock('Brizy_Editor_Project');
		$post = $this->createMock('Brizy_Editor_Post'); //new Brizy_Editor_Post( (object)array(), 1 );

		$api = Brizy_Editor_API::instance( $project, $post );


		$this->assertSame( $api, Brizy_Editor_API::instance( null, null ), 'It should return the same instance every time.' );

		$this->assertSame( $project, $api->get_project(), 'It should return the project from initialize' );
		$this->assertSame( $post, $api->get_post(), 'It should return the post from initialize' );

	}
}