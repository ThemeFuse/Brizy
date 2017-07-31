<?php
/**
 * Created by PhpStorm.
 * User: alex
 * Date: 8/1/17
 * Time: 11:27 AM
 */

use PHPUnit\Framework\BaseTestListener;
use PHPUnit\Framework\TestSuite;
use PHPUnit\Framework\Test;

class TestListener extends BaseTestListener {

	/**
	 * @param TestSuite $suite
	 */
	public function startTestSuite( TestSuite $suite ) {
		$name = $suite->getName();
		$this->load($name);
	}

	public function load( $name ) {

		$is_integration = strpos((string)$name,'Integration')!==false;

		$mname = 'default';

		if ( $is_integration ) {
			$mname = 'integration';
		}

		$method = "bootstrap_{$mname}_suite";


		if ( ! method_exists( $this, $method ) ) {
			$method = "bootstrap_default_suite";
			echo "\nThere is no bootstrap method for test suite: {$mname}. Using defaults.\n\n";
		}

		$this->$method();
	}

	/**
	 * include the worpdress files
	 */
	private function bootstrap_integration_suite() {

		include_once "../../../wp-load.php";
	}


	/**
	 * For unit tests we need to include only the plugin files
	 */
	private function bootstrap_default_suite() {

		include_once "autoloader.php";
	}

}