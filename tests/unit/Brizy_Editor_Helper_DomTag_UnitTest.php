<?php
/**
 * Created by PhpStorm.
 * User: alex
 * Date: 7/24/17
 * Time: 3:06 PM
 */

use PHPUnit\Framework\TestCase;

class Brizy_Editor_Helper_DomTag_UnitTest extends TestCase {
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
		  <script src="/head_include1.js"></script>	
		  <!--Enqueue End-->

		  <link href="/ignore1.css" rel="stylesheet">
		  <link href="/ignore2.css" rel="stylesheet"/>
		  <script src="/head_ignore1.js"></script>

		  
		  <!--Enqueue Start-->
		  	 <style type="text/css">.include1{}</style>	
		  	 <style>.include2{}</style>	
		  	 <script src="/head_include2.js"></script>
		  	 
		  	 <link rel="prefetch" href="/svg1.svg">
		     <link rel="prefetch" href="/svg2.svg">
		  <!--Enqueue End-->
		  
		  <link rel="prefetch" href="/svg4.svg">
		  <link rel="prefetch" href="/svg5.svg">
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
		$tag      = " <!DOCTYPE html> ";
		$expected = "<!DOCTYPE html>";
		$dt       = new Brizy_Editor_Helper_DomTag( $tag );
		$this->assertNotNull( $dt->get_tag(), 'The get_tag should rentun the content html' );
		$this->assertEquals( $expected, $dt->get_tag(), 'The html content should be trimmed' );
	}

	public function test_get_attr() {
		$tag = '<script src="src" type="application/javascript"></script>';
		$dt  = new Brizy_Editor_Helper_DomTag( $tag );

		$this->assertEquals( 'src', $dt->get_attr( 'src' ), 'Invalid attribute (src) value returned.' );
		$this->assertEquals( 'application/javascript', $dt->get_attr( 'type' ), 'Invalid attribute (type) value returned.' );
	}


	public function test_get_content()
	{
		$tag = '<script src="src" type="application/javascript">THE CONTENT WITH SOME <p>tags</p></script>';
		$dt  = new Brizy_Editor_Helper_DomTag( $tag );
		$this->assertEquals( 'THE CONTENT WITH SOME <p>tags</p>', $dt->get_content(), 'It should return the tag content' );
	}

	public function test_get_links_by_rel()
	{
		$dt  = new Brizy_Editor_Helper_DomTag( self::VALID_TEST_HTML );
		$links = $dt->get_links_by_rel('prefetch');

		$this->assertCount( 2, $links,'It should contain two prefetch links' );

		$srcs = [];

		foreach( $links as $link )
		{
			$srcs[] = $link->get_attr('href');
		}

		$this->assertContains( '/svg1.svg', $srcs, "It should contain svg1.svg." );
		$this->assertContains( '/svg2.svg', $srcs, "It should contain svg1.svg." );

		$this->assertNotContains( '/svg3.svg', $srcs, "It should  not  contain svg3.svg." );
		$this->assertNotContains( '/svg4.svg', $srcs, "It should not contain svg4.svg." );

	}

	public function test_get_attrs()
	{
		$dt  = new Brizy_Editor_Helper_DomTag( '<link href="/ignore1.css" rel="stylesheet">' );

		$attrs = $dt->get_attrs();

		$this->assertCount(2,$attrs,'It should return 2 attributes');
		$this->assertArrayHasKey('href',$attrs,'It should contain the attribute href');
		$this->assertArrayHasKey('rel',$attrs,'It should contain the attribute rel');
	}


}
