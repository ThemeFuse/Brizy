<?php

class CookieBannerEnableCreateCest {

	/**
	 * The `data` object of the Default Payload, verbatim from the block kit.
	 */
	const PAYLOAD_DATA = '{"type":"CookieBanner","blockId":"CookieBanner","value":{"_id":"brz-cookie-banner-<siteId>","items":[{"type":"RichText","value":{"_id":"brz-cookie-banner-<siteId>-text","_styles":["richText"],"_version":3,"text":"<p class=\'brz-tp-paragraph\'><span class=\'brz-cp-color7\'>We use cookies to improve your experience.</span></p>","colorHex":"","colorPalette":"color7"}}]}}';

	/**
	 * @var Brizy_Admin_Blocks_CookieBanner
	 */
	private $banner;

	/**
	 * @param FunctionalTester $I
	 */
	protected function _before( FunctionalTester $I ) {
		wp_cache_flush();
		wp_set_current_user( 1 );

		$I->dontHavePostInDatabase( [ 'post_type' => Brizy_Admin_Blocks_Main::CP_GLOBAL, ] );
		Brizy_Editor_Block::cleanClassCache();

		$this->banner = new Brizy_Admin_Blocks_CookieBanner();
	}

	/**
	 * Banner block ids in any status, trash included.
	 *
	 * @return int[]
	 */
	private function bannerIds() {
		global $wpdb;

		return array_map( 'intval', $wpdb->get_col( $wpdb->prepare(
			"SELECT p.ID FROM {$wpdb->posts} p INNER JOIN {$wpdb->postmeta} m ON m.post_id = p.ID AND m.meta_key = 'brizy_post_uid' WHERE m.meta_value = %s AND p.post_type = %s ORDER BY p.ID",
			$this->banner->getUid(),
			Brizy_Admin_Blocks_Main::CP_GLOBAL
		) ) );
	}

	/**
	 * @param FunctionalTester $I
	 *
	 * @return Brizy_Editor_Block
	 */
	private function enableAndLoadTheBlock( FunctionalTester $I ) {
		$I->assertSame( [], $this->bannerIds(), 'No banner block should exist before enable' );
		$I->assertTrue( $this->banner->enable(), 'Enable should report success' );

		$ids = $this->bannerIds();
		$I->assertCount( 1, $ids, 'Enable should create exactly one banner block' );

		wp_cache_flush();
		Brizy_Editor_Block::cleanClassCache();

		return Brizy_Editor_Block::get( $ids[0] );
	}

	/**
	 * @param FunctionalTester $I
	 */
	public function testEnableCreatesExactlyOneBlock( FunctionalTester $I ) {
		$block = $this->enableAndLoadTheBlock( $I );

		$I->assertSame( 'brz-cookie-banner-' . get_current_blog_id(), $block->getUid() );
		$I->assertTrue( $block->isGlobalBlock(), 'The banner should be a global block' );
	}

	/**
	 * @param FunctionalTester $I
	 */
	public function testCreatedBlockHasTheDefaultTitleStatusPositionAndDependencies( FunctionalTester $I ) {
		$block = $this->enableAndLoadTheBlock( $I );
		$id    = $block->getWpPostId();

		$I->assertSame( 'Cookie Banner', get_post_field( 'post_title', $id, 'raw' ) );
		$I->assertSame( 'publish', get_post_status( $id ) );
		$I->assertSame( [ 'align' => 'bottom', 'top' => 0, 'bottom' => 0 ], get_post_meta( $id, Brizy_Editor_Block::BRIZY_POSITION, true ) );
		$I->assertSame( [ 'align' => 'bottom', 'top' => 0, 'bottom' => 0 ], $block->getPosition()->convertToOptionValue() );
		$I->assertSame( [], $block->getDependencies() );
	}

	/**
	 * @param FunctionalTester $I
	 */
	public function testCreatedBlockHasTheDefaultMeta( FunctionalTester $I ) {
		$block = $this->enableAndLoadTheBlock( $I );

		$I->assertSame(
			[ 'type' => 'overlay', 'subtype' => 'cookieBanner', 'extraFontStyles' => [] ],
			json_decode( $block->getMeta(), true )
		);
		$I->assertTrue( strpos( $block->getMeta(), '"extraFontStyles":[]' ) !== false, 'extraFontStyles should be stored as an empty list' );
	}

	/**
	 * @param FunctionalTester $I
	 */
	public function testCreatedBlockHasThePayloadEditorDataWithTheSiteId( FunctionalTester $I ) {
		$block    = $this->enableAndLoadTheBlock( $I );
		$expected = json_decode( str_replace( '<siteId>', (string) get_current_blog_id(), self::PAYLOAD_DATA ), true );

		$I->assertNotNull( $expected );
		$I->assertSame( $expected, json_decode( $block->getEditorData( true ), true ) );
	}

	/**
	 * @param FunctionalTester $I
	 */
	public function testCreatedBlockHasTheIncludeAllRuleSet( FunctionalTester $I ) {
		$block = $this->enableAndLoadTheBlock( $I );
		$rules = ( new Brizy_Admin_Rules_Manager() )->getRules( $block->getWpPostId() );

		$I->assertCount( 1, $rules );
		$I->assertSame( Brizy_Admin_Rule::TYPE_INCLUDE, $rules[0]->getType() );
		$I->assertNull( $rules[0]->getAppliedFor() );
		$I->assertSame( '', $rules[0]->getEntityType() );
		$I->assertSame( [], $rules[0]->getEntityValues() );
	}

	/**
	 * The payload rules are realized only by applying the include-all rule set.
	 *
	 * @param FunctionalTester $I
	 */
	public function testRulesAreWrittenOnceDuringCreation( FunctionalTester $I ) {
		$spy    = new CookieBannerEnableCreateCestRulesManagerSpy();
		$banner = new Brizy_Admin_Blocks_CookieBanner( null, $spy );

		$written = [];
		$counter = function ( $metaId, $objectId, $metaKey ) use ( &$written ) {
			if ( $metaKey === 'brizy-rules' ) {
				$written[] = (int) $objectId;
			}
		};

		add_action( 'added_post_meta', $counter, 10, 3 );
		add_action( 'updated_post_meta', $counter, 10, 3 );
		try {
			$result = $banner->enable();
		} finally {
			remove_action( 'added_post_meta', $counter, 10 );
			remove_action( 'updated_post_meta', $counter, 10 );
		}

		$I->assertTrue( $result );
		$I->assertSame( $this->bannerIds(), $written, 'Exactly one brizy-rules write, on the banner block' );
		$I->assertSame( 1, $spy->calls['setRules'], 'The rules are applied once as a full replacement' );
		$I->assertSame( 0, $spy->calls['addRules'] + $spy->calls['addRule'], 'No rule is added outside the rule set apply' );
	}

	/**
	 * The editor gets the global blocks with getEntities( [ 'post_status' => 'any' ] ).
	 *
	 * @param FunctionalTester $I
	 */
	public function testCreatedBlockIsInTheEditorGlobalBlockList( FunctionalTester $I ) {
		$this->enableAndLoadTheBlock( $I );

		wp_cache_flush();
		Brizy_Editor_Block::cleanClassCache();

		$manager = new Brizy_Admin_Blocks_Manager( Brizy_Admin_Blocks_Main::CP_GLOBAL );
		$uids    = array_map( function ( $block ) {
			return $block->getUid();
		}, $manager->getEntities( [ 'post_status' => 'any', 'order' => 'DESC', 'orderby' => 'ID' ] ) );

		$I->assertContains( $this->banner->getUid(), $uids );
	}
}

class CookieBannerEnableCreateCestRulesManagerSpy extends Brizy_Admin_Rules_Manager {

	public $calls = [ 'setRules' => 0, 'addRules' => 0, 'addRule' => 0 ];

	public function setRules( $postId, $rules ) {
		$this->calls['setRules'] ++;
		parent::setRules( $postId, $rules );
	}

	public function addRules( $postId, $rules ) {
		$this->calls['addRules'] ++;
		parent::addRules( $postId, $rules );
	}

	public function addRule( $postId, $rule ) {
		$this->calls['addRule'] ++;
		parent::addRule( $postId, $rule );
	}
}
