<?php

/**
 * A page is usually recompiled by an anonymous visitor, so the compile config
 * must contain the global blocks of the page whoever triggers the compilation.
 */
class BlocksMainCompileConfigCest {

	const BLOCK_UID = 'compileConfigHeaderUid';

	/**
	 * @var int
	 */
	private $pageId;

	/**
	 * @var array
	 */
	private $editorConfigFilters;

	public function _before( FunctionalTester $I ) {
		wp_cache_flush();
		wp_set_current_user( 1 ); // saving a block requires an editor
		$I->dontHavePostInDatabase( [ 'post_type' => Brizy_Admin_Blocks_Main::CP_GLOBAL ] );

		$this->pageId = $I->havePostInDatabase( [ 'post_type' => 'page', 'post_status' => 'publish' ] );

		$manager = new Brizy_Admin_Blocks_Manager( Brizy_Admin_Blocks_Main::CP_GLOBAL );
		$block   = $manager->createEntity( self::BLOCK_UID, 'publish' );
		$block->set_editor_data( json_encode( [ 'type' => 'SectionHeader', 'value' => [ 'items' => [] ] ] ) );
		$block->setPosition( new Brizy_Editor_BlockPosition( 0, 0, 'top' ) );
		$block->save();
		( new Brizy_Admin_Rules_Manager() )->saveRules( $block->getWpPostId(), [
			new Brizy_Admin_Rule( null, Brizy_Admin_Rule::TYPE_INCLUDE, '', '', [] ),
		] );

		// keep only the filters of the instance created by the test
		global $wp_filter;
		$this->editorConfigFilters = isset( $wp_filter['brizy_editor_config'] ) ? $wp_filter['brizy_editor_config'] : null;
		remove_all_filters( 'brizy_editor_config' );
	}

	public function _after( FunctionalTester $I ) {
		global $wp_filter;
		$wp_filter['brizy_editor_config'] = $this->editorConfigFilters;
		wp_set_current_user( 0 );
	}

	public function anonymousCompileConfigContainsGlobalBlocks( FunctionalTester $I ) {
		wp_set_current_user( 0 );
		new Brizy_Admin_Blocks_Main();

		$config = apply_filters( 'brizy_editor_config', [ 'wp' => [ 'page' => $this->pageId ] ], Brizy_Editor_Editor_Editor::COMPILE_CONTEXT );

		$blocks = isset( $config['globalBlocks'] ) ? $config['globalBlocks'] : [];
		$I->assertContains( self::BLOCK_UID, array_column( $blocks, 'uid' ),'The compile config should contain the page global blocks for an anonymous user' );
	}

	public function anonymousEditorConfigHasNoGlobalBlocks( FunctionalTester $I ) {
		wp_set_current_user( 0 );
		new Brizy_Admin_Blocks_Main();

		$config = apply_filters( 'brizy_editor_config', [ 'wp' => [ 'page' => $this->pageId ] ], Brizy_Editor_Editor_Editor::EDITOR_CONTEXT );

		$I->assertArrayNotHasKey( 'globalBlocks', $config, 'The editor config should not expose global blocks to an anonymous user' );
	}
}
