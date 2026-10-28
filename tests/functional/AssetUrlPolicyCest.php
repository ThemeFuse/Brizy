<?php

use BrizyMerge\Assets\Asset;

class AssetUrlPolicyCest {

	private function siteHost() {
		return parse_url( home_url(), PHP_URL_HOST );
	}

	public function relativeAndSiteUrlsAreAllowedTest( FunctionalTester $I ) {
		$I->assertTrue( Brizy_Editor_AssetUrlPolicy::isAllowed( '/wp-content/plugins/brizy/public/editor-build/x.js', false ) );
		$I->assertTrue( Brizy_Editor_AssetUrlPolicy::isAllowed( home_url( '/wp-content/x.js' ), false ) );
		$I->assertTrue( Brizy_Editor_AssetUrlPolicy::isAllowed( plugins_url( 'brizy/x.js' ), false ) );
		$I->assertTrue( Brizy_Editor_AssetUrlPolicy::isAllowed( 'https://static.brizy.io/builds/free/x.js', false ) );
	}

	public function externalScriptHostsAreRejectedTest( FunctionalTester $I ) {
		$host = $this->siteHost();

		$I->assertFalse( Brizy_Editor_AssetUrlPolicy::isAllowed( 'https://evil.example/x.js', false ) );
		$I->assertFalse( Brizy_Editor_AssetUrlPolicy::isAllowed( 'https://EVIL.example/x.js', false ) );
		$I->assertFalse( Brizy_Editor_AssetUrlPolicy::isAllowed( '//evil.example/x.js', false ) );
		$I->assertFalse( Brizy_Editor_AssetUrlPolicy::isAllowed( "https://{$host}.evil.example/x.js", false ) );
		$I->assertFalse( Brizy_Editor_AssetUrlPolicy::isAllowed( "https://{$host}@evil.example/x.js", false ) );
		$I->assertFalse( Brizy_Editor_AssetUrlPolicy::isAllowed( 'http:///x.js', false ) );
	}

	public function fontHostsAreAllowedOnlyForStylesTest( FunctionalTester $I ) {
		$I->assertTrue( Brizy_Editor_AssetUrlPolicy::isAllowed( 'https://fonts.bunny.net/css?family=Lato', true ) );
		$I->assertTrue( Brizy_Editor_AssetUrlPolicy::isAllowed( 'https://fonts.googleapis.com/css?family=Lato', true ) );
		$I->assertFalse( Brizy_Editor_AssetUrlPolicy::isAllowed( 'https://fonts.bunny.net/x.js', false ) );
		$I->assertFalse( Brizy_Editor_AssetUrlPolicy::isAllowed( 'https://evil.example/a.css', true ) );
	}

	public function filterAddsHostsTest( FunctionalTester $I ) {
		$filter = function ( $hosts ) {
			$hosts[] = 'CDN.example';

			return $hosts;
		};
		add_filter( 'brizy_allowed_asset_hosts', $filter );

		$I->assertTrue( Brizy_Editor_AssetUrlPolicy::isAllowed( 'https://cdn.example/x.js', false ) );

		remove_filter( 'brizy_allowed_asset_hosts', $filter );

		$I->assertFalse( Brizy_Editor_AssetUrlPolicy::isAllowed( 'https://cdn.example/x.js', false ) );
	}

	/**
	 * Content stored before the save time check must not be enqueued either.
	 *
	 * @param FunctionalTester $I
	 */
	public function enqueueManagerSkipsUntrustedHostsTest( FunctionalTester $I ) {
		$method = new ReflectionMethod( 'Brizy_Public_AssetEnqueueManager', 'getAssetUrl' );
		$method->setAccessible( true );
		$manager = Brizy_Public_AssetEnqueueManager::_init();

		$asset = function ( $url ) {
			return new Asset( 'test', 1, null, $url, Asset::TYPE_FILE );
		};

		$I->assertNull( $method->invoke( $manager, $asset( 'https://evil.example/x.js' ), false ) );
		$I->assertNull( $method->invoke( $manager, $asset( 'https://fonts.bunny.net/x' ), false ) );
		$I->assertEquals( 'https://fonts.bunny.net/x', $method->invoke( $manager, $asset( 'https://fonts.bunny.net/x' ), true ) );
		$I->assertEquals( home_url( '/wp-content/x.js' ), $method->invoke( $manager, $asset( home_url( '/wp-content/x.js' ) ), false ) );
	}
}
