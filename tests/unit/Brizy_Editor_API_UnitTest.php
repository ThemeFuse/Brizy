<?php
/**
 * Created by PhpStorm.
 * User: alex
 * Date: 7/31/17
 * Time: 10:29 AM
 */

use PHPUnit\Framework\TestCase;

class Brizy_Editor_API_UnitTest extends TestCase {


	public function test_api_actions() {
		$project = new Brizy_Editor_Project( (object) array() );
		$post    = new Brizy_Editor_Post( (object) array(), 1 );

		$instance = new Brizy_Editor_API( $project, $post );

		$actions = array(
			'wp_ajax_' . Brizy_Editor_API::AJAX_PING,
			'wp_ajax_' . Brizy_Editor_API::AJAX_GET,
			'wp_ajax_' . Brizy_Editor_API::AJAX_UPDATE,
			'wp_ajax_' . Brizy_Editor_API::AJAX_GET_GLOBALS,
			'wp_ajax_' . Brizy_Editor_API::AJAX_SET_GLOBALS,
			'wp_ajax_' . Brizy_Editor_API::AJAX_MEDIA,
			'wp_ajax_' . Brizy_Editor_API::AJAX_SIDEBARS,
			'wp_ajax_' . Brizy_Editor_API::AJAX_SIDEBAR_CONTENT,
			'wp_ajax_' . Brizy_Editor_API::AJAX_SHORTCODE_CONTENT,
			'wp_ajax_' . Brizy_Editor_API::AJAX_SHORTCODE_LIST,
			'wp_ajax_' . Brizy_Editor_API::AJAX_GET_TEMPLATES,
			'wp_ajax_' . Brizy_Editor_API::AJAX_GET_INTERNAL_LINKS,
			'wp_ajax_' . Brizy_Editor_API::AJAX_GET_WOOCOMERCE_INSTALL_STATUS,
		);


		foreach ( $actions as $action ) {
			$this->assertActionRegistered( $instance, $action );
		}
	}

	private function assertActionRegistered( $instance, $action, $callable = false ) {
		$this->assertNotFalse( has_action( $action, $callable ), "Action [" . $action . "] was not registred." );
	}

}