<?php

use BrizyPlaceholders\ContentPlaceholder;

/**
 * The applied rule set decides on which Brizy-rendered pages the banner block renders.
 *
 * Rendering goes through the global blocks placeholder, which Brizy puts at the top and the
 * bottom of every compiled page and template.
 */
class CookieBannerRenderCest {

	/**
	 * @var Brizy_Admin_Blocks_CookieBanner
	 */
	private $banner;

	/**
	 * @var int
	 */
	private $blockId;

	/**
	 * @var int[] fixture ids: post, page, archiveTemplate, singleTemplate, plainPost
	 */
	private $ids = [];

	/**
	 * @param FunctionalTester $I
	 */
	protected function _before( FunctionalTester $I ) {
		wp_cache_flush();
		wp_set_current_user( 1 );

		$I->dontHavePostInDatabase( [ 'post_type' => Brizy_Admin_Blocks_Main::CP_GLOBAL, ] );
		Brizy_Editor_Block::cleanClassCache();
		Brizy_Editor_Post::cleanClassCache();
		$this->setTemplate( null );

		$this->banner  = new Brizy_Admin_Blocks_CookieBanner();
		$this->blockId = $this->haveBannerBlock();

		$this->ids['post']            = $this->haveBrizyPost( 'post', 'Brizy post' );
		$this->ids['page']            = $this->haveBrizyPost( 'page', 'Brizy page' );
		$this->ids['archiveTemplate'] = $this->haveBrizyPost( Brizy_Admin_Templates::CP_TEMPLATE, 'Archive template' );
		$this->ids['singleTemplate']  = $this->haveBrizyPost( Brizy_Admin_Templates::CP_TEMPLATE, 'Single template' );
		$this->ids['plainPost']       = wp_insert_post( [
			'post_type'    => 'post',
			'post_status'  => 'publish',
			'post_title'   => 'Plain post',
			'post_content' => 'Not built with Brizy',
		] );

		$rulesManager = new Brizy_Admin_Rules_Manager();
		$rulesManager->setRules( $this->ids['archiveTemplate'], [
			new Brizy_Admin_Rule( null, Brizy_Admin_Rule::TYPE_INCLUDE, Brizy_Admin_Rule::TAXONOMY, 'category', [] ),
		] );
		$rulesManager->setRules( $this->ids['singleTemplate'], [
			new Brizy_Admin_Rule( null, Brizy_Admin_Rule::TYPE_INCLUDE, Brizy_Admin_Rule::POSTS, 'post', [] ),
		] );
	}

	/**
	 * @param FunctionalTester $I
	 */
	protected function _after( FunctionalTester $I ) {
		$this->setTemplate( null );

		foreach ( array_merge( [ $this->blockId ], array_values( $this->ids ) ) as $id ) {
			wp_delete_post( $id, true );
		}

		$this->ids = [];
	}

	/**
	 * Seeds compiled html the way Brizy_Admin_Blocks_Api::actionCreateGlobalBlock stores it.
	 *
	 * @param Brizy_Editor_Post $entity
	 * @param string $html
	 */
	private function seedCompiledHtml( Brizy_Editor_Post $entity, $html ) {
		$sectionManager = $entity->getCompiledSectionManager();
		$sectionManager->merge( [
			'blocks' => [
				[ 'id' => 'section-' . $entity->getWpPostId(), 'html' => $html, 'assets' => [] ],
			],
		] );
		$entity->setCompiledSections( $sectionManager->asJson() );
		$entity->set_compiler_version( BRIZY_EDITOR_VERSION );
	}

	/**
	 * @return int
	 */
	private function haveBannerBlock() {
		$manager = new Brizy_Admin_Blocks_Manager( Brizy_Admin_Blocks_Main::CP_GLOBAL );
		$block   = $manager->createEntity( $this->banner->getUid(), 'publish' );
		$block->setTitle( 'Cookie Banner' );
		$block->setMeta( '{"type":"overlay","subtype":"cookieBanner","extraFontStyles":[]}' );
		$block->setEditorData( '{"type":"CookieBanner","blockId":"CookieBanner","value":{"_id":"' . $this->banner->getUid() . '","items":[]}}' );
		$block->setPosition( Brizy_Editor_BlockPosition::createFromSerializedData( [ 'align' => 'bottom', 'top' => 0, 'bottom' => 0 ] ) );
		$block->setDependencies( [] );
		$this->seedCompiledHtml( $block, '<div class="cookie-banner-fixture">We use cookies to improve your experience.</div>' );
		$block->save();

		return $block->getWpPostId();
	}

	/**
	 * @param string $postType
	 * @param string $title
	 *
	 * @return int
	 */
	private function haveBrizyPost( $postType, $title ) {
		$id   = wp_insert_post( [
			'post_type'    => $postType,
			'post_status'  => 'publish',
			'post_title'   => $title,
			'post_content' => '<div class="brz-root__container"></div>',
		] );
		$post = Brizy_Editor_Post::get( $id );
		$post->set_uses_editor( true );
		$post->setEditorData( '{"type":"Section","value":{"_id":"section' . $id . '","items":[]}}' );
		$post->setDataVersion( 1 );
		$this->seedCompiledHtml( $post, '<section class="own-content-' . $id . '">' . esc_html( $title ) . '</section>' );
		$post->save();

		return $id;
	}

	/**
	 * Brizy_Admin_Templates::templateFrontEnd() stores the matched template in this property.
	 *
	 * @param Brizy_Editor_Post|null $template
	 */
	private function setTemplate( $template ) {
		$property = new ReflectionProperty( Brizy_Admin_Templates::class, 'template' );
		$property->setAccessible( true );
		$property->setValue( null, $template );
	}

	/**
	 * @param WP_Post|null $wpPost the context entity
	 * @param string $position
	 *
	 * @return string
	 */
	private function renderGlobalBlocks( $wpPost, $position ) {
		$context     = Brizy_Content_ContextFactory::createContext( Brizy_Editor_Project::get(), $wpPost );
		$placeholder = new ContentPlaceholder( 'brizy_dc_global_blocks', '{{ brizy_dc_global_blocks position="' . $position . '" }}', [ 'position' => $position ] );
		$globalBlocks = new Brizy_Content_Placeholders_GlobalBlocks( 'Brizy Global Blocks', 'brizy_dc_global_blocks' );

		return $globalBlocks->getValue( $context, $placeholder );
	}

	/**
	 * Renders the global blocks slot for one Brizy-rendered page type.
	 *
	 * @param string $page post | page | archive | single
	 * @param string $position
	 *
	 * @return string
	 */
	private function render( $page, $position = 'bottom' ) {
		switch ( $page ) {
			case 'post':
				return $this->renderGlobalBlocks( get_post( $this->ids['post'] ), $position );
			case 'page':
				return $this->renderGlobalBlocks( get_post( $this->ids['page'] ), $position );
			case 'archive':
				$this->setTemplate( Brizy_Editor_Post::get( $this->ids['archiveTemplate'] ) );
				try {
					return $this->renderGlobalBlocks( null, $position );
				} finally {
					$this->setTemplate( null );
				}
			case 'single':
				$this->setTemplate( Brizy_Editor_Post::get( $this->ids['singleTemplate'] ) );
				try {
					return $this->renderGlobalBlocks( get_post( $this->ids['plainPost'] ), $position );
				} finally {
					$this->setTemplate( null );
				}
		}

		throw new InvalidArgumentException( "Unknown page {$page}" );
	}

	/**
	 * @return string[]
	 */
	private function pages() {
		return [ 'post', 'page', 'archive', 'single' ];
	}

	/**
	 * @return string
	 */
	private function bannerMarker() {
		return "<!-- GLOBAL BLOCK [{$this->blockId}]-->";
	}

	/**
	 * @return array
	 */
	private function compilationState() {
		global $wpdb;
		wp_cache_flush();

		$ids   = array_merge( [ $this->blockId ], array_values( $this->ids ) );
		$state = [];
		foreach ( $ids as $id ) {
			$state[ $id ] = $wpdb->get_results( $wpdb->prepare(
				"SELECT meta_key, meta_value FROM {$wpdb->postmeta} WHERE post_id = %d AND meta_key IN (%s, %s, %s) ORDER BY meta_key",
				$id,
				Brizy_Editor_Post::BRIZY_POST_COMPILED_SECTIONS,
				Brizy_Editor_Post::BRIZY_POST_COMPILER_VERSION,
				Brizy_Editor_Post::BRIZY_POST_NEEDS_COMPILE_KEY
			), ARRAY_A );
		}

		return $state;
	}

	/**
	 * @param FunctionalTester $I
	 */
	public function testIncludeAllRendersTheBannerOnEveryBrizyPage( FunctionalTester $I ) {
		$I->assertTrue( $this->banner->applyRules( $this->blockId, $this->banner->includeAllRules() ) );

		foreach ( $this->pages() as $page ) {
			$I->assertStringContainsString( $this->bannerMarker(), $this->render( $page ), "The banner should render on the {$page} page" );
		}
	}

	/**
	 * Automated proxy for the bottom placement: the banner renders only in the bottom slot.
	 *
	 * @param FunctionalTester $I
	 */
	public function testIncludeAllRendersTheBannerOnlyInTheBottomSlot( FunctionalTester $I ) {
		$I->assertTrue( $this->banner->applyRules( $this->blockId, $this->banner->includeAllRules() ) );

		foreach ( $this->pages() as $page ) {
			$I->assertStringNotContainsString( $this->bannerMarker(), $this->render( $page, 'top' ), "The banner should not render in the top slot of the {$page} page" );
		}

		foreach ( [ 'post', 'page' ] as $page ) {
			$post    = Brizy_Editor_Post::get( $this->ids[ $page ] );
			$content = apply_filters( 'brizy_content', $post->getCompiledHtml(), Brizy_Editor_Project::get(), $post->getWpPost(), 'body' );
			$banner  = strpos( $content, $this->bannerMarker() );
			$own     = strpos( $content, 'own-content-' . $this->ids[ $page ] );

			$I->assertNotFalse( $banner, "The rendered {$page} should contain the banner" );
			$I->assertNotFalse( $own );
			$I->assertGreaterThan( $own, $banner, "The banner should render after the {$page} content" );
		}
	}

	/**
	 * @param FunctionalTester $I
	 */
	public function testExcludeAllHidesTheBannerOnEveryBrizyPage( FunctionalTester $I ) {
		$I->assertTrue( $this->banner->applyRules( $this->blockId, $this->banner->excludeAllRules() ) );

		foreach ( $this->pages() as $page ) {
			$I->assertStringNotContainsString( $this->bannerMarker(), $this->render( $page, 'bottom' ), "The banner should not render on the {$page} page" );
			$I->assertStringNotContainsString( $this->bannerMarker(), $this->render( $page, 'top' ), "The banner should not render on the {$page} page" );
		}
	}

	/**
	 * @param FunctionalTester $I
	 */
	public function testSwitchTakesEffectOnTheNextRenderWithoutRecompilation( FunctionalTester $I ) {
		$I->assertTrue( $this->banner->applyRules( $this->blockId, $this->banner->includeAllRules() ) );
		$before = $this->compilationState();

		foreach ( $this->pages() as $page ) {
			$I->assertStringContainsString( $this->bannerMarker(), $this->render( $page ) );
		}

		$I->assertTrue( $this->banner->applyRules( $this->blockId, $this->banner->excludeAllRules() ) );
		foreach ( $this->pages() as $page ) {
			$I->assertStringNotContainsString( $this->bannerMarker(), $this->render( $page ), "Exclude-all should hide the banner on the next {$page} render" );
		}

		$I->assertTrue( $this->banner->applyRules( $this->blockId, $this->banner->includeAllRules() ) );
		foreach ( $this->pages() as $page ) {
			$I->assertStringContainsString( $this->bannerMarker(), $this->render( $page ), "Include-all should show the banner on the next {$page} render" );
		}

		$I->assertSame( $before, $this->compilationState(), 'Switching rule sets should not touch compiled content or flag recompilation' );

		foreach ( array_merge( [ $this->blockId ], [ $this->ids['post'], $this->ids['page'] ] ) as $id ) {
			$I->assertSame( BRIZY_EDITOR_VERSION, get_post_meta( $id, Brizy_Editor_Post::BRIZY_POST_COMPILER_VERSION, true ) );
		}
	}
}
