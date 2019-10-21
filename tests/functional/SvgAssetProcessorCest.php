<?php


class SvgAssetProcessorCest {

	private $attachmentUid;
	private $attachmentUrl;

	public function _before( FunctionalTester $I ) {
		wp_cache_flush();

		$attachmentId        = $I->haveAttachmentInDatabase( codecept_data_dir( 'dump.sql' ), null, [] );
		$this->attachmentUid = md5( $attachmentId );
		$this->attachmentUrl = wp_get_attachment_url( $this->attachmentUid );
		$I->havePostmetaInDatabase( $attachmentId, 'brizy_post_uid', $this->attachmentUid );
	}


	public function testSvgUrlReplacement( FunctionalTester $I ) {

		$html = '<!DOCTYPE html>
			<html lang="en">
			<head>
			    <meta charset="UTF-8">
			    <title>Title</title>
			    <style>INCLUDE THIS CSS CODE</style>
			</head>
			<body>
				<img src="http://brizy.local/?brizy_attachment=' . $this->attachmentUid . '" alt="">
			</body>
			</html>';

		$processor = new Brizy_Editor_Asset_SvgAssetProcessor();
		$content   = $processor->process( $html, new Brizy_Content_Context( Brizy_Editor_Project::get(), null, null, null ) );

		$I->assertStringNotContainsString( '?brizy_attachment=', $content, 'It should not contain an url containing brizy_attachment' );
		$I->assertStringContainsString( $this->attachmentUrl, $content, 'It should contain the static url to the file' );
	}


}