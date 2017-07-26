<?php

use PHPUnit\Framework\TestCase;

/**
 * Class ASimpleTest
 */
class Brizy_Editor_ProjectHtmlTest extends TestCase {

	const VALID_TEST_HTML = '<!DOCTYPE html>
		<html lang="en">
		<head>
		  <meta charset="utf-8">
		  <title>{{ meta.title }}</title>
		  
		  <meta name="description" content="{{ meta.description }}" data-required="1">
		  <meta name="viewport" content="width=device-width,initial-scale=1">
		  
		  <!--Enqueue Start-->
		  <link href="/include1.css" rel="stylesheet">
		  <link href="/include2.css" rel="stylesheet"/>
		  <link rel="prefetch" href="/svg1.svg">
		  <link rel="prefetch" href="/svg2.svg">
		  <script src="/head_include1.js"></script>	
		  <!--Enqueue End-->

		  <link href="/ignore1.css" rel="stylesheet">
		  <link href="/ignore2.css" rel="stylesheet"/>
		  <script src="/head_ignore1.js"></script>

		  
		  <!--Enqueue Start-->
		  	 <style type="text/css">.include1{}</style>	
		  	 <style>.include2{}</style>	
		  	 <script src="/head_include2.js"></script>
		  <!--Enqueue End-->
		  
		  <link rel="prefetch" href="/svg1.svg">
		  <link rel="prefetch" href="/svg2.svg">
		  <script src="/head_ignore2.js"></script>
		    
		  <style type="text/css">.ignore1{}</style>	
		  <style>.ignore2{}</style>	
		</head>
		
		<body class="bbm bbm-tp">
		
		 	<!--Enqueue Start-->
		  		<script src="/footer_include1.js"></script>	
		  	<!--Enqueue End-->
		
			<script src="/footer_ignore1.js"></script><script src="/footer_ignore3.js"></script>
			
			{{ blocks.body | raw }}
			
			<script>var __SHORTCODES_CONFIG__ = {}</script>
			
			<style>.ignore3{}</style>	
			<style type="text/css">.ignore4{}</style>
			
			
			
		  <!--Enqueue Start-->
		  	<style type="text/css">.include3{}</style>	
		  	<script src="/footer_include2.js"></script>	
		  <!--Enqueue End-->
			
		</body>
		</html>';


	public function test_constructor() {
		try {
			$this->addToAssertionCount( 1 ); // make the phpunit happy
			$ph = new Brizy_Editor_CompiledHtml( self::VALID_TEST_HTML );

			return $ph;
		} catch ( Exception $e ) // The exception thrown by WebAssert::elementExists
		{
			$this->fail( 'Failed to initialize the Brizy_Editor_ProjectHtml class.' );
		}
	}

	/**
	 * @depends test_constructor
	 *
	 * @param Brizy_Editor_CompiledHtml $ph
	 */
	public function test_get_links( Brizy_Editor_CompiledHtml $ph ) {
		$links = $ph->get_links_tags();

		$srcs = [];

		foreach( $links as $link )
		{
			$srcs[] = $link->get_attr('href');
		}

		$error_should_contain = 'The <get_links> method should contain the links from enqueue regions only';
		$this->assertContains( '/include1.css', $srcs, $error_should_contain );
		$this->assertContains( '/include2.css', $srcs, $error_should_contain );

		$this->assertContains( '/svg1.svg', $srcs, $error_should_contain );
		$this->assertContains( '/svg2.svg', $srcs, $error_should_contain );


		$error_should_not_contain = 'The <get_links> method should ignore the links outside enqueue regions';
		$this->assertNotContains( '/ignore1.css', $srcs, $error_should_not_contain );
		$this->assertNotContains( '/ignore2.css', $srcs, $error_should_not_contain );

	}


	/**
	 * @depends test_constructor
	 *
	 * @param Brizy_Editor_CompiledHtml $ph
	 */
	public function test_get_head_scripts( Brizy_Editor_CompiledHtml $ph ) {
		$scripts = $ph->get_head_scripts();

		$error_should_contain = 'The <get_scripts> method should contain the head scripts from enqueue regions only';
		$this->assertContains( '/head_include1.js', $scripts, $error_should_contain );
		$this->assertContains( '/head_include2.js', $scripts, $error_should_contain );

		$error_should_not_contain = 'The <get_scripts> method should ignore the head scripts outside enqueue regions';
		$this->assertNotContains( '/head_ignore1.js', $scripts, $error_should_not_contain );
		$this->assertNotContains( '/head_ignore2.js', $scripts, $error_should_not_contain );
	}

	/**
	 * @depends test_constructor
	 *
	 * @param Brizy_Editor_CompiledHtml $ph
	 */
	public function test_get_footer_scripts( Brizy_Editor_CompiledHtml $ph ) {
		$scripts = $ph->get_footer_scripts();

		$error_should_contain = 'The <get_scripts> method should contain the footer scripts from enqueue regions only';
		$this->assertContains( '/footer_include1.js', $scripts, $error_should_contain );
		$this->assertContains( '/footer_include2.js', $scripts, $error_should_contain );

		$error_should_not_contain = 'The <get_scripts> method should ignore the footer scripts outside enqueue regions';
		$this->assertNotContains( '/footer_ignore1.js', $scripts, $error_should_not_contain );
		$this->assertNotContains( '/footer_ignore2.js', $scripts, $error_should_not_contain );
		$this->assertNotContains( '/footer_ignore3.js', $scripts, $error_should_not_contain );
	}


	/**
	 * @depends test_constructor
	 *
	 * @param Brizy_Editor_CompiledHtml $ph
	 */
	public function test_get_styles( Brizy_Editor_CompiledHtml $ph ) {
		$styles = $ph->get_styles();

		$error_should_contain = 'The <get_styles> method should contain the styles from enqueue regions only';
		$this->assertContains( '.include1{}', $styles, $error_should_contain );
		$this->assertContains( '.include2{}', $styles, $error_should_contain );
		$this->assertContains( '.include3{}', $styles, $error_should_contain );

		$error_should_not_contain = 'The <get_styles> method should ignore the styles outside enqueue regions';
		$this->assertNotContains( 'ignore1{}', $styles, $error_should_not_contain );
		$this->assertNotContains( 'ignore2{}', $styles, $error_should_not_contain );
		$this->assertNotContains( 'ignore3{}', $styles, $error_should_not_contain );
		$this->assertNotContains( 'ignore4{}', $styles, $error_should_not_contain );
	}

	/**
	 * @depends test_constructor
	 *
	 * @param Brizy_Editor_CompiledHtml $ph
	 */
	public function test_get_content( Brizy_Editor_CompiledHtml $ph ) {

		$ph->strip_regions();

		$content = $ph->get_content();

		$this->assertNotEmpty( $content, "The <get_content> method should return the html content" );


		$test_ph = new Brizy_Editor_CompiledHtml( $content );

		// test if the scripts are removed
		$scripts = $test_ph->get_head_scripts();

		$error_should_not_contain = 'The <get_content> method should strip all enqueue regions.';
		$this->assertNotContains( '/head_include1.js', $scripts, $error_should_not_contain );
		$this->assertNotContains( '/head_include2.js', $scripts, $error_should_not_contain );

		$scripts = $test_ph->get_footer_scripts();

		$error_should_not_contain = 'The <get_content> method should strip all enqueue regions.';
		$this->assertNotContains( '/footer_include1.js', $scripts, $error_should_not_contain );
		$this->assertNotContains( '/footer_include2.js', $scripts, $error_should_not_contain );

	}
}
