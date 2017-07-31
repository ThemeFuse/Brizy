<?php
/**
 * Created by PhpStorm.
 * User: alex
 * Date: 7/31/17
 * Time: 10:29 AM
 */

use PHPUnit\Framework\TestCase;

class Brizy_Editor_API_IntegrationTest extends TestCase {

	public function test_api_actions()
	{
		$project = new Brizy_Editor_Project( (object)array() );
		$post = new Brizy_Editor_Post( (object)array(), 1 );

		$instance = Brizy_Editor_API::instance( $project, $post );
		$instance->initialize();

		$this->assertTrue(has_action( 'wp_ajax_' . Brizy_Editor_API::AJAX_PING),'It should register wordpress action: '.'wp_ajax_' . Brizy_Editor_API::AJAX_PING );
		$this->assertTrue(has_action( 'wp_ajax_' . Brizy_Editor_API::AJAX_GET),'It should register wordpress action: '.'wp_ajax_' . Brizy_Editor_API::AJAX_GET );
		$this->assertTrue(has_action( 'wp_ajax_' . Brizy_Editor_API::AJAX_UPDATE),'It should register wordpress action: '.'wp_ajax_' . Brizy_Editor_API::AJAX_UPDATE );
		$this->assertTrue(has_action( 'wp_ajax_' . Brizy_Editor_API::AJAX_GET_GLOBALS),'It should register wordpress action: '.'wp_ajax_' . Brizy_Editor_API::AJAX_GET_GLOBALS );
		$this->assertTrue(has_action( 'wp_ajax_' . Brizy_Editor_API::AJAX_SET_GLOBALS),'It should register wordpress action: '.'wp_ajax_' . Brizy_Editor_API::AJAX_SET_GLOBALS );
		$this->assertTrue(has_action( 'wp_ajax_' . Brizy_Editor_API::AJAX_MEDIA),'It should register wordpress action: '.'wp_ajax_' . Brizy_Editor_API::AJAX_MEDIA );
		$this->assertTrue(has_action( 'wp_ajax_' . Brizy_Editor_API::AJAX_SIDEBARS),'It should register wordpress action: '.'wp_ajax_' . Brizy_Editor_API::AJAX_SIDEBARS );
		$this->assertTrue(has_action( 'wp_ajax_' . Brizy_Editor_API::AJAX_BUILD),'It should register wordpress action: '.'wp_ajax_' . Brizy_Editor_API::AJAX_BUILD );
	}

}