<?php


class Brizy_Admin_Cloud_SyncStateTest extends \Codeception\TestCase\WPTestCase {

	/**
	 * @var \UnitTester
	 */
	protected $tester;

	private function createBlock() {
		$id = wp_insert_post( [ 'post_type' => 'brizy-saved-block', 'post_status' => 'publish', 'post_title' => 'block' ] );
		update_post_meta( $id, Brizy_Editor_Entity::BRIZY_DATA_VERSION_KEY, 1 );

		return $id;
	}

	public function testUploadExceptionIsFinalOnlyForRejections() {
		foreach ( [ 400, 404, 409, 422 ] as $status ) {
			$this->assertTrue( ( new Brizy_Admin_Cloud_UploadException( 'x', $status ) )->isFinal(), "$status is final" );
		}
		foreach ( [ 0, 401, 403, 408, 429, 500, 502, 503 ] as $status ) {
			$this->assertFalse( ( new Brizy_Admin_Cloud_UploadException( 'x', $status ) )->isFinal(), "$status is retried" );
		}
		$this->assertFalse( ( new Brizy_Admin_Cloud_UploadException( 'x', 400, true ) )->isFinal(), 'A rejection caused by stale versions is retried' );
	}

	public function testRejectedUploadIsBlockedUntilTheEntityChanges() {
		$id = $this->createBlock();

		$this->assertFalse( Brizy_Admin_Cloud_SyncState::isBlocked( $id, 'acc' ) );

		Brizy_Admin_Cloud_SyncState::recordFailure( $id, 'acc', new Brizy_Admin_Cloud_UploadException( 'Bad Request', 400 ) );

		$this->assertTrue( Brizy_Admin_Cloud_SyncState::isBlocked( $id, 'acc' ), 'A 4xx is final' );
		$this->assertFalse( Brizy_Admin_Cloud_SyncState::isBlocked( $id, 'other' ), 'The state is kept per cloud account' );

		update_post_meta( $id, Brizy_Editor_Entity::BRIZY_DATA_VERSION_KEY, 2 );

		$this->assertFalse( Brizy_Admin_Cloud_SyncState::isBlocked( $id, 'acc' ), 'A local change makes it eligible again' );
	}

	public function testRejectedUploadIsRetriedAfterAPluginUpdate() {
		$id = $this->createBlock();
		Brizy_Admin_Cloud_SyncState::recordFailure( $id, 'acc', new Brizy_Admin_Cloud_UploadException( 'Bad Request', 400 ) );

		$state                         = get_post_meta( $id, Brizy_Admin_Cloud_SyncState::META_KEY, true );
		$state['acc']['pluginVersion'] = '0.0.1';
		update_post_meta( $id, Brizy_Admin_Cloud_SyncState::META_KEY, $state );

		$this->assertFalse( Brizy_Admin_Cloud_SyncState::isBlocked( $id, 'acc' ) );
	}

	public function testTemporaryFailureBacksOff() {
		$id = $this->createBlock();

		Brizy_Admin_Cloud_SyncState::recordFailure( $id, 'acc', new Brizy_Admin_Cloud_UploadException( 'Bad Gateway', 502 ) );
		$this->assertTrue( Brizy_Admin_Cloud_SyncState::isBlocked( $id, 'acc' ), 'It waits before the retry' );

		$state = get_post_meta( $id, Brizy_Admin_Cloud_SyncState::META_KEY, true );
		$first = $state['acc']['retryAfter'] - time();
		$this->assertFalse( $state['acc']['final'] );
		$this->assertTrue( abs( $first - 600 ) <= 5, 'The first retry is after 10 minutes' );

		Brizy_Admin_Cloud_SyncState::recordFailure( $id, 'acc', new Exception( 'timeout' ) );
		$state = get_post_meta( $id, Brizy_Admin_Cloud_SyncState::META_KEY, true );
		$this->assertTrue( abs( $state['acc']['retryAfter'] - time() - 1200 ) <= 5, 'The delay doubles' );

		$state['acc']['retryAfter'] = time() - 1;
		update_post_meta( $id, Brizy_Admin_Cloud_SyncState::META_KEY, $state );
		$this->assertFalse( Brizy_Admin_Cloud_SyncState::isBlocked( $id, 'acc' ), 'It is retried once the delay passed' );

		for ( $i = 0; $i < 30; $i ++ ) {
			Brizy_Admin_Cloud_SyncState::recordFailure( $id, 'acc', new Exception( 'timeout' ) );
		}
		$state = get_post_meta( $id, Brizy_Admin_Cloud_SyncState::META_KEY, true );
		$this->assertLessThanOrEqual( Brizy_Admin_Cloud_SyncState::RETRY_MAX_DELAY, $state['acc']['retryAfter'] - time(), 'The delay is capped' );
	}

	public function testRejectedScreenshotDoesNotBlockTheEntity() {
		$id = $this->createBlock();

		Brizy_Admin_Cloud_SyncState::recordScreenshotRejected( $id, 'acc' );

		$this->assertTrue( Brizy_Admin_Cloud_SyncState::isScreenshotRejected( $id, 'acc' ) );
		$this->assertFalse( Brizy_Admin_Cloud_SyncState::isBlocked( $id, 'acc' ) );

		Brizy_Admin_Cloud_SyncState::recordFailure( $id, 'acc', new Brizy_Admin_Cloud_UploadException( 'x', 503 ) );
		$this->assertTrue( Brizy_Admin_Cloud_SyncState::isScreenshotRejected( $id, 'acc' ), 'It is kept across retries' );

		Brizy_Admin_Cloud_SyncState::clear( $id, 'acc' );
		$this->assertFalse( Brizy_Admin_Cloud_SyncState::isScreenshotRejected( $id, 'acc' ) );
		$this->assertSame( '', get_post_meta( $id, Brizy_Admin_Cloud_SyncState::META_KEY, true ) );
	}
}
