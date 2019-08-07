<?php


class Brizy_Admin_Popups_MainUnitTest extends \Codeception\Test\Unit {
	/**
	 * @var \UnitTester
	 */
	protected $tester;

	public function testPopulateSupportedPosts() {
		$main  = new Brizy_Admin_Popups_Main();
		$posts = $main->populateSupportedPosts( [] );

		$this->assertEquals( [ Brizy_Admin_Popups_Main::CP_POPUP ], $posts, 'It should insert the supported popup post type' );
	}


	public function testInsertPopupsHtml() {

		$popupHtml = '<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <style>INCLUDE THIS CSS CODE</style>
</head>
<body><div>INCLUDE THIS HTML CODE</div></body>
</html>';

		$targetHtml = '<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body class="test-class"></body>
</html>';

		$main = $this->getMockBuilder( Brizy_Admin_Popups_Main::class )
		             ->setMethods( [ 'getMatchingBrizyPopups' ] )
		             ->getMock();

		$popupMock = $this->getMockBuilder( Brizy_Editor_Post::class )
		                  ->disableOriginalConstructor()
		                  ->setMethods( [ 'get_compiled_page' ] )
		                  ->getMock();

		$popupMock->expects( $this->any() )
		          ->method( 'get_compiled_page' )
		          ->willReturn( new Brizy_Editor_CompiledHtml( $popupHtml ) );

		$main->expects( $this->any() )
		     ->method( 'getMatchingBrizyPopups' )
		     ->willReturn( [ $popupMock ] );


		$content = $main->insertPopupsHtml( $targetHtml, null, null, 'head' );

		$compiledHtml = new Brizy_Editor_CompiledHtml( $content );
		$this->assertStringContainsString( 'INCLUDE THIS CSS CODE', $compiledHtml->get_head(), 'It should include styles in head' );
		$this->assertStringNotContainsString( 'INCLUDE THIS HTML CODE', $compiledHtml->get_head(), 'It should not include HTML code in head' );
		$this->assertStringNotContainsString( 'INCLUDE THIS HTML CODE', $compiledHtml->get_body(), 'It should not include HTML code in body' );

		$content = $main->insertPopupsHtml( $targetHtml, null, null, 'body' );

		$compiledHtml = new Brizy_Editor_CompiledHtml( $content );
		$this->assertStringNotContainsString( 'INCLUDE THIS CSS CODE', $compiledHtml->get_head(), 'It should not include styles in head' );
		$this->assertStringNotContainsString( 'INCLUDE THIS HTML CODE', $compiledHtml->get_head(), 'It should not include HTML code in head' );
		$this->assertStringContainsString( 'INCLUDE THIS HTML CODE', $compiledHtml->get_body(), 'It should include HTML code in body' );

		$content = $main->insertPopupsHtml( $targetHtml, null, null, 'document' );

		$compiledHtml = new Brizy_Editor_CompiledHtml( $content );
		$this->assertStringContainsString( 'INCLUDE THIS CSS CODE', $compiledHtml->get_head(), 'It should include styles in head' );
		$this->assertStringNotContainsString( 'INCLUDE THIS CSS CODE', $compiledHtml->get_body(), 'It should not include styles in body' );

		$this->assertStringNotContainsString( 'INCLUDE THIS HTML CODE', $compiledHtml->get_head(), 'It should not include HTML code in head' );
		$this->assertStringContainsString( 'INCLUDE THIS HTML CODE', $compiledHtml->get_body(), 'It should include HTML code in body' );
	}
}