<?php

use \Prophecy\Argument;

class BrizyAdminCloudMediaBridgeTest extends \Codeception\TestCase\WPTestCase {

	/**
	 * @var \IntegrationTester
	 */
	protected $tester;

	protected function _before() {
		wp_cache_flush();
		$this->tester->dontHavePostInDatabase( [ 'post_type' => 'any' ] );
	}

	
	/**
	 * @return \Prophecy\Prophecy\ObjectProphecy
	 */
	private function getCloudClientObserver() {
		$cloudClientObserver = $this->prophesize( Brizy_Admin_Cloud_Client::class );

		return $cloudClientObserver;
	}

	public function testImport() {

	}

	public function testExport() {
		$file         = codecept_data_dir( 'images/cat.jpeg' );
		$attachmentId = (int) $this->tester->haveAttachmentInDatabase( $file, null, [
			'meta_input' => [
				'brizy_attachment_uid' => $uid = md5( time() )
			],
		] );

		$attachmentPath = get_attached_file( $attachmentId );
		$client         = $this->getCloudClientObserver();
		$client->uploadMedia( $uid, $attachmentPath )->shouldBeCalled();

		$bridge = new Brizy_Admin_Cloud_MediaBridge( $client->reveal() );

		$bridge->export( $uid );
	}

	public function testInvalidMediaExport() {
		$file = codecept_data_dir( 'images/cat.jpeg' );
		$this->tester->haveAttachmentInDatabase( $file, null, [
			'meta_input' => [
				'brizy_attachment_uid' => $uid = md5( time() )
			],
		] );

		$client = $this->getCloudClientObserver();
		$client->uploadMedia( $uid, $file )->shouldNotBeCalled();

		$bridge = new Brizy_Admin_Cloud_MediaBridge( $client->reveal() );

		$this->expectException( Exception::class );

		$bridge->export( md5( 'some-block-uid' ) );
	}
}