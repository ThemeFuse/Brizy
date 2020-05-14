<?php

use \Prophecy\Argument;

class BrizyAdminCloudTest extends \Codeception\TestCase\WPTestCase {

	/**
	 * @var \UnitTester
	 */
	protected $tester;


	protected function _before() {
		wp_cache_flush();
		global $wpdb;
		$wpdb->db_connect();
		set_transient( 'brizy_cloud_editor_versions',
			[
				"sync"   => "import-export-1",
				"editor" => "import-export-1-cloud",
				"free"   => "import-export-1-cloud",
				"pro"    => "import-export-1-cloud"
			], 3600 );

	}

	/**
	 * @return \Prophecy\Prophecy\ObjectProphecy
	 */
	private function getProjectObserver() {
		$projectObserver = $this->prophesize( Brizy_Editor_Project::class );
		$projectObserver->getMetaValue( 'brizy-cloud-token' )->willReturn( 'brizy-cloud-token-hash' );
		$projectObserver->getMetaValue( 'brizy-cloud-container' )->willReturn( 'brizy-cloud-container' );
		$projectObserver->getCloudContainer()->willReturn( 'container' );

		return $projectObserver;
	}

	/**
	 * @return \Prophecy\Prophecy\ObjectProphecy
	 */
	private function getCloudClientObserver() {
		$clientObserver = $this->prophesize( Brizy_Admin_Cloud_Client::class );
		$clientObserver->getBrizyProject()->willReturn( $this->getProjectObserver()->reveal() );

		return $clientObserver;
	}

	/**
	 * @return \Prophecy\Prophecy\ObjectProphecy
	 */
	private function getBlocksManagerObserver() {
		$clientObserver = $this->prophesize( Brizy_Admin_Blocks_Manager::class );

		return $clientObserver;
	}

	/**
	 * @return \Prophecy\Prophecy\ObjectProphecy
	 */
	private function getLayoutManagerObserver() {
		$clientObserver = $this->prophesize( Brizy_Admin_Layouts_Manager::class );

		return $clientObserver;
	}

	/**
	 * @return \Prophecy\Prophecy\ObjectProphecy
	 */
	private function getBlocksBridgeObserver() {
		return $this->prophesize( Brizy_Admin_Cloud_BlockBridge::class );
	}

	/**
	 * @return \Prophecy\Prophecy\ObjectProphecy
	 */
	private function getLayoutBridgeObserver() {
		return $this->prophesize( Brizy_Admin_Cloud_LayoutBridge::class );
	}

	public function testOnGetSavedBlocks() {
		//$blocks, $fields, $manager

		$fields = [ 'uid', 'meta', 'media' ];

		$cloudClient = $this->getCloudClientObserver();
		$fakeBlock   = [ 'uid' => 'uid', 'meta' => 'meta', 'media' => 'media' ];
		$cloudClient->getBlocks( array( 'fields' => $fields ) )
		            ->willReturn( [ (object) $fakeBlock ] )
		            ->shouldBeCalled();

		$cloud = Brizy_Admin_Cloud::_init();
		$cloud->setProject( $this->getProjectObserver()->reveal() );
		$cloud->setCloudClient( $cloudClient->reveal() );
		$bockManager = $this->getBlocksManagerObserver();
		$blocks      = $cloud->onGetSavedBlocks( [], [ 'uid', 'meta', 'media' ], $bockManager->reveal() );

		$this->tester->assertCount( 1, $blocks, 'It should return exactly one block' );
		$this->tester->assertEquals( $fakeBlock, $blocks[0], 'It should return the fake block' );

	}

	public function testOnGetSavedBlockWithALocalBlock() {
		//$blocks, $fields, $manager

		$blockId     = 'uid';
		$cloudClient = $this->getCloudClientObserver();
		$cloudClient->getBlocks( [ 'uid' => $blockId ] )
		            ->shouldNotBeCalled();

		$cloud = Brizy_Admin_Cloud::_init();
		$cloud->setProject( $this->getProjectObserver()->reveal() );
		$cloud->setCloudClient( $cloudClient->reveal() );

		$bockManager = $this->getBlocksManagerObserver();

		$blocks = $cloud->onGetSavedBlock( 'A_DUMMY_VALUE', 'A_DUMMY_UID', $bockManager->reveal() );

	}

	public function testOnGetSavedBlock() {

		$blockId     = 'uid';
		$cloudClient = $this->getCloudClientObserver();

		$blockBridge = $this->getBlocksBridgeObserver();
		$blockBridge->import( $blockId )
		            ->shouldBeCalled();

		$cloud = Brizy_Admin_Cloud::_init();
		$cloud->setProject( $this->getProjectObserver()->reveal() );
		$cloud->setCloudClient( $cloudClient->reveal() );
		$cloud->setBlockBridge( $blockBridge->reveal() );

		$bockManager = $this->getBlocksManagerObserver();

		$cloud->onGetSavedBlock( null, 'uid', $bockManager->reveal() );

	}

	public function testOnDeleteSavedBlock() {

		$blockId     = 'uid';
		$cloudClient = $this->getCloudClientObserver();
		$cloudClient->getBlocks( [ 'uid' => $blockId ] )
		            ->willReturn( [ (object) [ 'id' => $blockId ] ] )
		            ->shouldBeCalled();
		$cloudClient->deleteBlock( $blockId )
		            ->shouldBeCalled();


		$cloud = Brizy_Admin_Cloud::_init();
		$cloud->setProject( $this->getProjectObserver()->reveal() );
		$cloud->setCloudClient( $cloudClient->reveal() );

		$cloud->onDeleteSavedBlock(  'uid' );
	}

	//-----------

	public function testOnGetLayouts() {
		//$entities, $fields, $manager

		$fields = [ 'uid', 'meta', 'media' ];

		$cloudClient = $this->getCloudClientObserver();
		$fakeEntity   = [ 'uid' => 'uid', 'meta' => 'meta', 'media' => 'media' ];
		$cloudClient->getLayouts( array( 'fields' => $fields ) )
		            ->willReturn( [ (object) $fakeEntity ] )
		            ->shouldBeCalled();

		$cloud = Brizy_Admin_Cloud::_init();
		$cloud->setProject( $this->getProjectObserver()->reveal() );
		$cloud->setCloudClient( $cloudClient->reveal() );
		$entityManager = $this->getLayoutManagerObserver();
		$entities      = $cloud->onGetLayouts( [], [ 'uid', 'meta', 'media' ], $entityManager->reveal() );

		$this->tester->assertCount( 1, $entities, 'It should return exactly one layout' );
		$this->tester->assertEquals( $fakeEntity, $entities[0], 'It should return the fake layout' );

	}

	public function testOnGetLayoutWithALocalBlock() {

		$blockId     = 'uid';
		$cloudClient = $this->getCloudClientObserver();
		$cloudClient->getLayouts( [ 'uid' => $blockId ] )
		            ->shouldNotBeCalled();

		$cloud = Brizy_Admin_Cloud::_init();
		$cloud->setProject( $this->getProjectObserver()->reveal() );
		$cloud->setCloudClient( $cloudClient->reveal() );

		$entityManager = $this->getLayoutManagerObserver();

		$cloud->onGetLayout( 'A_DUMMY_VALUE', 'A_DUMMY_UID', $entityManager->reveal() );

	}

	public function testOnGetLayout() {

		$blockId     = 'uid';
		$cloudClient = $this->getCloudClientObserver();

		$entityBridge = $this->getLayoutBridgeObserver();
		$entityBridge->import( $blockId )
		            ->shouldBeCalled();

		$cloud = Brizy_Admin_Cloud::_init();
		$cloud->setProject( $this->getProjectObserver()->reveal() );
		$cloud->setCloudClient( $cloudClient->reveal() );
		$cloud->setLayoutBridge( $entityBridge->reveal() );

		$entityManager = $this->getLayoutManagerObserver();

		$cloud->onGetLayout( null, 'uid', $entityManager->reveal() );

	}

	public function testOnDeleteLayout() {

		$blockId     = 'uid';
		$cloudClient = $this->getCloudClientObserver();
		$cloudClient->getLayouts( [ 'uid' => $blockId ] )
		            ->willReturn( [ (object) [ 'id' => $blockId ] ] )
		            ->shouldBeCalled();
		$cloudClient->deleteLayout( $blockId )
		            ->shouldBeCalled();


		$cloud = Brizy_Admin_Cloud::_init();
		$cloud->setProject( $this->getProjectObserver()->reveal() );
		$cloud->setCloudClient( $cloudClient->reveal() );

		$cloud->onDeleteLayout(  'uid' );
	}



}
