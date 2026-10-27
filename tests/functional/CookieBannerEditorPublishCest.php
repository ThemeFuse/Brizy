<?php

/**
 * The cookie banner reaches visitors only through an editor publish: enable keeps it a draft that the editor
 * gets, disable keeps it out of the editor, and a publish can not bring a disabled banner back.
 */
class CookieBannerEditorPublishCest {

	const OTHER_BLOCK_UID = 'editorPublishOtherUid';

	/**
	 * @var mixed
	 */
	private $storageBackup;

	/**
	 * @var Brizy_Admin_Blocks_CookieBanner
	 */
	private $banner;

	public function _before( FunctionalTester $I ) {
		wp_cache_flush();
		wp_set_current_user( 1 );
		$this->storageBackup = get_option( Brizy_Editor_Storage_Common::KEY, array() );

		$I->dontHavePostInDatabase( [ 'post_type' => Brizy_Admin_Blocks_Main::CP_GLOBAL ] );
		Brizy_Editor_Block::cleanClassCache();

		$this->banner = new Brizy_Admin_Blocks_CookieBanner();
	}

	public function _after( FunctionalTester $I ) {
		update_option( Brizy_Editor_Storage_Common::KEY, $this->storageBackup );
		wp_set_current_user( 0 );
		wp_cache_flush();
	}

	/**
	 * @param string $uid
	 *
	 * @return string|false
	 */
	private function blockStatus( $uid ) {
		global $wpdb;

		wp_cache_flush();
		$id = $wpdb->get_var( $wpdb->prepare(
			"SELECT p.ID FROM {$wpdb->posts} p INNER JOIN {$wpdb->postmeta} m ON m.post_id = p.ID AND m.meta_key = 'brizy_post_uid' WHERE m.meta_value = %s AND p.post_type = %s",
			$uid,
			Brizy_Admin_Blocks_Main::CP_GLOBAL
		) );

		return get_post_status( (int) $id );
	}

	/**
	 * The uids of the global blocks the editor config hands to the editor.
	 *
	 * @return string[]
	 */
	private function editorConfigUids() {
		wp_cache_flush();
		Brizy_Editor_Block::cleanClassCache();

		$config = Brizy_Admin_Blocks_Main::_init()->addPageGlobalBlocks( [], Brizy_Editor_Editor_Editor::EDITOR_CONTEXT );

		return array_column( isset( $config['globalBlocks'] ) ? $config['globalBlocks'] : [], 'uid' );
	}

	private function haveOtherGlobalBlock() {
		$manager = new Brizy_Admin_Blocks_Manager( Brizy_Admin_Blocks_Main::CP_GLOBAL );
		$block   = $manager->createEntity( self::OTHER_BLOCK_UID, 'draft' );
		$block->set_editor_data( json_encode( [ 'type' => 'Section', 'value' => [ 'items' => [] ] ] ) );
		$block->save();
	}

	/**
	 * Sends a global block update the way the editor does on publish and returns the decoded JSON response.
	 *
	 * @param string $action actionUpdateGlobalBlocks or actionUpdateGlobalBlock
	 * @param array $params the request params besides the nonce and the editor version
	 *
	 * @return array|null
	 */
	private function sendEditorUpdate( $action, array $params ) {
		$request  = $_REQUEST;
		$_REQUEST = array_merge( [ 'hash' => wp_create_nonce( Brizy_Admin_Blocks_Api::nonce ), 'version' => BRIZY_EDITOR_VERSION ], $params );

		// wp_send_json() ends the request through wp_die(): stop it with an exception instead
		$stop = function () {
			return function () {
				throw new CookieBannerEditorPublishCestAjaxStop();
			};
		};
		add_filter( 'wp_doing_ajax', '__return_true' );
		add_filter( 'wp_die_ajax_handler', $stop );
		ob_start();

		try {
			Brizy_Admin_Blocks_Api::_init()->$action();
		} catch ( CookieBannerEditorPublishCestAjaxStop $e ) {
		} finally {
			$output = ob_get_clean();
			remove_filter( 'wp_doing_ajax', '__return_true' );
			remove_filter( 'wp_die_ajax_handler', $stop );
			$_REQUEST = $request;
		}

		$response = json_decode( $output, true );

		return is_array( $response ) ? $response : [ 'output' => $output ];
	}

	public function enableKeepsTheBannerADraftTheEditorGets( FunctionalTester $I ) {
		$I->wantToTest( 'Enable hides the banner from visitors and hands it to the editor' );

		$I->assertTrue( $this->banner->enable() );

		$I->assertSame( 'draft', $this->blockStatus( Brizy_Admin_Blocks_CookieBanner::getUid() ), 'The banner should wait for the next editor publish' );
		$I->assertContains( Brizy_Admin_Blocks_CookieBanner::getUid(), $this->editorConfigUids(), 'The editor should get the enabled banner' );
	}

	public function disableKeepsTheBannerOutOfTheEditor( FunctionalTester $I ) {
		$I->wantToTest( 'Disable hides the banner and leaves only it out of the editor config' );

		$this->haveOtherGlobalBlock();
		$I->assertTrue( $this->banner->enable() );
		$I->assertTrue( $this->banner->disable() );

		$uids = $this->editorConfigUids();
		$I->assertSame( 'draft', $this->blockStatus( Brizy_Admin_Blocks_CookieBanner::getUid() ), 'The banner should be hidden from visitors' );
		$I->assertNotContains( Brizy_Admin_Blocks_CookieBanner::getUid(), $uids, 'The editor should not get a disabled banner' );
		$I->assertContains( self::OTHER_BLOCK_UID, $uids, 'The other global blocks should still reach the editor' );
	}

	/**
	 * [ the update action, the banner is enabled, the block is the banner, the status sent by the editor, the status written ]
	 *
	 * @return array
	 */
	protected function editorPublishes() {
		return [
			[ 'action' => 'actionUpdateGlobalBlocks', 'enabled' => true, 'isBanner' => true, 'sent' => 'publish', 'written' => 'publish' ],
			[ 'action' => 'actionUpdateGlobalBlocks', 'enabled' => true, 'isBanner' => false, 'sent' => 'publish', 'written' => 'publish' ],
			[ 'action' => 'actionUpdateGlobalBlocks', 'enabled' => false, 'isBanner' => true, 'sent' => 'publish', 'written' => 'draft' ],
			[ 'action' => 'actionUpdateGlobalBlocks', 'enabled' => false, 'isBanner' => true, 'sent' => 'draft', 'written' => 'draft' ],
			[ 'action' => 'actionUpdateGlobalBlocks', 'enabled' => false, 'isBanner' => false, 'sent' => 'publish', 'written' => 'publish' ],
			[ 'action' => 'actionUpdateGlobalBlock', 'enabled' => true, 'isBanner' => true, 'sent' => 'publish', 'written' => 'publish' ],
			[ 'action' => 'actionUpdateGlobalBlock', 'enabled' => false, 'isBanner' => true, 'sent' => 'publish', 'written' => 'draft' ],
			[ 'action' => 'actionUpdateGlobalBlock', 'enabled' => false, 'isBanner' => false, 'sent' => 'publish', 'written' => 'publish' ],
		];
	}

	/**
	 * @dataProvider editorPublishes
	 */
	public function editorPublishWritesTheAllowedStatus( FunctionalTester $I, \Codeception\Example $example ) {
		$uid = $example['isBanner'] ? Brizy_Admin_Blocks_CookieBanner::getUid() : self::OTHER_BLOCK_UID;
		$I->wantToTest( sprintf( '%s sent as %s with the banner %s writes %s for %s', $example['action'], $example['sent'], $example['enabled'] ? 'on' : 'off', $example['written'], $uid ) );

		$this->haveOtherGlobalBlock();
		$I->assertTrue( $this->banner->enable() );
		if ( ! $example['enabled'] ) {
			$I->assertTrue( $this->banner->disable() );
		}

		// the multi-block action takes one entry per block, the single one plain values
		$params = $example['action'] === 'actionUpdateGlobalBlocks'
			? [ 'uid' => [ $uid ], 'status' => [ $example['sent'] ], 'position' => [ '' ], 'rules' => [ '' ], 'dependencies' => [ [] ], 'is_autosave' => 0 ]
			: [ 'uid' => $uid, 'status' => $example['sent'] ];

		$response = $this->sendEditorUpdate( $example['action'], $params );

		$I->assertTrue( isset( $response['success'] ) && $response['success'], 'The update should succeed: ' . json_encode( $response ) );
		$I->assertSame( $example['written'], $this->blockStatus( $uid ) );
	}
}

/**
 * An Error, not an Exception: the API actions catch every Exception and would answer a second time.
 */
class CookieBannerEditorPublishCestAjaxStop extends Error {
}
