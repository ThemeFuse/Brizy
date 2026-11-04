<?php

/**
 * Regression tests for CVE-2026-112830 (Patchstack #37124):
 * password-protected Brizy content must not be disclosed to anonymous visitors,
 * and frontend request selectors must not let a visitor pick an arbitrary post.
 */
class BrizyPublicMainPasswordProtectedTest extends \Codeception\TestCase\WPTestCase {

	/**
	 * @var \IntegrationTester
	 */
	protected $tester;

	private $protectedId;
	private $publicId;

	protected function _before() {
		wp_cache_flush();
		Brizy_Editor_Post::cleanClassCache();

		// an administrator is needed only to flip the Brizy-enabled flag
		$adminId = self::factory()->user->create( [ 'role' => 'administrator' ] );
		wp_set_current_user( $adminId );

		$this->protectedId = $this->makeBrizyPost( [
			'post_status'   => 'publish',
			'post_password' => 'Brizy-Test-2026!',
		] );
		$this->publicId = $this->makeBrizyPost( [ 'post_status' => 'publish' ] );

		// back to an anonymous visitor for the assertions
		wp_set_current_user( 0 );
		unset( $_GET, $_REQUEST );
		$_GET = $_REQUEST = [];
	}

	private function makeBrizyPost( array $overrides ) {
		$id = self::factory()->post->create( array_merge( [
			'post_type'    => 'post',
			'post_status'  => 'publish',
			'post_content' => '<div class="brz-root__container">x</div>',
		], $overrides ) );

		update_post_meta( $id, Brizy_Editor_Constants::BRIZY_ENABLED, true );
		update_post_meta( $id, Brizy_Editor_Post::BRIZY_POST, [ 'brizy-post' => [ 'brizy-use-brizy' => true ] ] );

		return $id;
	}

	public function testProtectedPostIsNotViewableByAnonymousVisitor() {
		$post = Brizy_Editor_Post::get( $this->protectedId );
		$this->assertFalse(
			Brizy_Public_Main::is_view_page( $post ),
			'is_view_page() must be false for a password-protected post and an anonymous visitor'
		);
	}

	public function testPublicPostStaysViewableByAnonymousVisitor() {
		$post = Brizy_Editor_Post::get( $this->publicId );
		$this->assertTrue(
			Brizy_Public_Main::is_view_page( $post ),
			'is_view_page() must stay true for a normal public Brizy post'
		);
	}

	public function testProtectedPostIsViewableByAllowedEditor() {
		$editorId = self::factory()->user->create( [ 'role' => 'administrator' ] );
		wp_set_current_user( $editorId );

		$post = Brizy_Editor_Post::get( $this->protectedId );
		$this->assertTrue(
			Brizy_Public_Main::is_view_page( $post ),
			'an allowed editor must still be able to preview a protected Brizy post'
		);
	}

	public function testInsertPageContentSuppressesProtectedBodyForAnonymousVisitor() {
		$post    = Brizy_Editor_Post::get( $this->protectedId );
		$main    = Brizy_Public_Main::get( $post );
		$carrier = '<div class="brz-root__container">CARRIER</div>';

		$this->assertSame(
			$carrier,
			$main->insert_page_content( $carrier ),
			'insert_page_content() must return the input unchanged for a protected post (no compiled body)'
		);
	}

	public function testCurrentPostIdIgnoresRequestSelectorsForAnonymousVisitor() {
		$_REQUEST = $_GET = [ 'brizy_post' => $this->protectedId, 'post' => $this->protectedId, 'id' => $this->protectedId ];

		// a non-singular main query (home / blog index): no queried post object
		$GLOBALS['wp_query'] = $GLOBALS['wp_the_query'] = new WP_Query( [ 'post_type' => 'post' ] );

		$this->assertNull(
			Brizy_Editor::get()->currentPostId(),
			'currentPostId() must ignore request selectors on anonymous frontend requests'
		);
	}

	public function testCurrentPostIdHonorsRequestSelectorsForAllowedEditor() {
		$editorId = self::factory()->user->create( [ 'role' => 'administrator' ] );
		wp_set_current_user( $editorId );

		$_REQUEST = $_GET = [ 'post' => $this->protectedId ];
		$GLOBALS['wp_query'] = $GLOBALS['wp_the_query'] = new WP_Query( [ 'post_type' => 'post' ] );

		$this->assertSame(
			$this->protectedId,
			Brizy_Editor::get()->currentPostId(),
			'currentPostId() must still honor request selectors for an allowed editor'
		);
	}
}
