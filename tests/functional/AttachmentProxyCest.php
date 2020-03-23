<?php


class AttachmentProxyCest {

	/**
	 * @param FunctionalTester $I
	 */
	public function _before( FunctionalTester $I ) {
		wp_cache_flush();
		$I->dontHavePostInDatabase( [] );


		$attachmentId = $I->haveAttachmentInDatabase( codecept_data_dir( 'dump.sql' ), null, [] );
		$I->havePostmetaInDatabase($attachmentId,'brizy_post_uid','gffbf00297b0b4e9ee27af32a7b79c333');

		$attachmentId = $I->haveAttachmentInDatabase( codecept_data_dir( 'dump.sql' ), null, [] );
		$I->havePostmetaInDatabase($attachmentId,'brizy_attachment_uid','h2d3678h3489jrt34r34fy7r34r34r34g4');

		$I->loginAs( 'admin', 'admin' );
	}

	/**
	 * @param FunctionalTester $I
	 */
	public function attachmentNotFoundTest( FunctionalTester $I ) {
		$I->sendGET( '/', [ 'brizy_attachment' => '349ry7934hr9fergaer37rt894' ] );
		$I->seeResponseCodeIs( 404 );
	}

	/**
	 * @param FunctionalTester $I
	 */
	public function attachmentByPostUidTest( FunctionalTester $I ) {
		$I->sendGET( '/', [ 'brizy_attachment' => 'gffbf00297b0b4e9ee27af32a7b79c333' ] );
		$I->dontSeeResponseCodeIs(404);
	}

	/**
	 * @param FunctionalTester $I
	 */
	public function attachmentByAttachmentUidTest( FunctionalTester $I ) {
		$I->sendGET( '/', [ 'brizy_attachment' => 'h2d3678h3489jrt34r34fy7r34r34r34g4' ] );
		$I->dontSeeResponseCodeIs(404);
	}
}