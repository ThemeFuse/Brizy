<?php
/**
 * Created by PhpStorm.
 * User: alex
 * Date: 7/31/17
 * Time: 10:29 AM
 */

use PHPUnit\Framework\TestCase;

class Brizy_Editor_API_UnitTest extends TestCase {

	public function test_singleton() {
		$project = new Brizy_Editor_Project( null );
		$post    = new Brizy_Editor_Post( null, null ); //new Brizy_Editor_Post( (object)array(), 1 );

		$api             = Brizy_Editor_API::instance( $project, $post );
		$second_instance = Brizy_Editor_API::instance( null, null );

		$this->assertEquals( $api, $second_instance, 'It should return the same instance every time.' );

		$this->assertEquals( $api->get_project(), $second_instance->get_project(), 'It should return the project from initialize' );
		$this->assertEquals( $api->get_post(), $second_instance->get_post(), 'It should return the post from initialize' );
	}

	public function test_api_actions() {
		$project = new Brizy_Editor_Project( (object) array() );
		$post    = new Brizy_Editor_Post( (object) array(), 1 );

		$instance = Brizy_Editor_API::instance( $project, $post );
		$instance->initialize();

		$actions = [
			'wp_ajax_' . Brizy_Editor_API::AJAX_PING,
			'wp_ajax_' . Brizy_Editor_API::AJAX_GET,
			'wp_ajax_' . Brizy_Editor_API::AJAX_UPDATE,
			'wp_ajax_' . Brizy_Editor_API::AJAX_GET_GLOBALS,
			'wp_ajax_' . Brizy_Editor_API::AJAX_SET_GLOBALS,
			'wp_ajax_' . Brizy_Editor_API::AJAX_MEDIA,
			'wp_ajax_' . Brizy_Editor_API::AJAX_SIDEBARS,
			//'wp_ajax_' . Brizy_Editor_API::AJAX_BUILD,
			'wp_ajax_' . Brizy_Editor_API::AJAX_SIDEBAR_CONTENT,
			'wp_ajax_' . Brizy_Editor_API::AJAX_SHORTCODE_CONTENT,
			'wp_ajax_' . Brizy_Editor_API::AJAX_SHORTCODE_LIST,
		];


		foreach ( $actions as $action ) {
			$this->assertActionRegistered( $instance, $action );
		}
	}

	private function assertActionRegistered( $instance, $action, $callable = false ) {
		$this->assertNotFalse( has_action( $action, $callable ), "Action [" . $action . "] was not registred." );
	}

}