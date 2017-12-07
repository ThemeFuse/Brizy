<?php
/**
 * Created by PhpStorm.
 * User: alex
 * Date: 7/31/17
 * Time: 10:29 AM
 */

use PHPUnit\Framework\TestCase;

class Brizy_Admin_Editor_UnitTest extends TestCase {

	public function test_singleton() {
		$project = new Brizy_Editor_Project( null );
		$post    = new Brizy_Editor_Post( null, null ); //new Brizy_Editor_Post( (object)array(), 1 );

		$first_instance  = Brizy_Admin_Editor::instance()->initialize($project, $post);
		$second_instance = Brizy_Admin_Editor::instance()->initialize(null,null);

		$this->assertEquals( $first_instance, $second_instance, 'It should return the same instance every time.' );

		$this->assertEquals( $first_instance->get_project(), $second_instance->get_project(), 'It should return the project from initialize' );
		$this->assertEquals( $first_instance->get_post(), $second_instance->get_post(), 'It should return the post from initialize' );
	}


	public function test_post_actions() {


		$project = new Brizy_Editor_Project( (object) array() );
		$post    = new Brizy_Editor_Post( (object) array(), 1 );

		$instance = Brizy_Admin_Editor::instance(  );


		$actions = array(

		);


		foreach ( $actions as $action ) {
			$this->assertActionRegistered( $instance, $action );
		}

	}

	private function assertActionRegistered( $instance, $action, $callable = false ) {
		$this->assertNotFalse( has_action( $action, $callable ), "Action [" . $action . "] was not registred." );
	}
}