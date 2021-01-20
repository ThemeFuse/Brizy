<?php

class Brizy_Admin_Cloud {

	/**
	 * @var self
	 */
	static $instance;

	/**
	 * @var Brizy_Editor_Project
	 */
	private $project;

	/**
	 * @var Brizy_Admin_Cloud_Client
	 */
	private $cloudClient;

	/**
	 * @var Brizy_Admin_Cloud_BlockBridge
	 */
	private $blockBridge;

	/**
	 * @var Brizy_Admin_Cloud_LayoutBridge
	 */
	private $layoutBridge;

	/**
	 * @param Brizy_Editor_Project|null $project
	 * @param Brizy_Admin_Cloud_Client|null $cloudClient
	 *
	 * @return Brizy_Admin_Cloud
	 * @throws Exception
	 */
	public static function _init( Brizy_Editor_Project $project = null, Brizy_Admin_Cloud_Client $cloudClient = null ) {

		if ( ! $project ) {
			$project = Brizy_Editor_Project::get();
		}

		if ( ! $cloudClient ) {
			$cloudClient = Brizy_Admin_Cloud_Client::instance( $project, new WP_Http() );
		}

		if ( ! wp_doing_ajax() && Brizy_Editor_Project::get()->getCloudToken() ) {
			// do not run cron actions on ajax request
			Brizy_Admin_Cloud_Cron::_init();
		}

		return self::$instance ? self::$instance : ( self::$instance = new self( $project, $cloudClient ) );
	}

	/**
	 * Brizy_Admin_Cloud constructor.
	 *
	 * @param Brizy_Editor_Project $project
	 * @param Brizy_Admin_Cloud_Client $client
	 */
	private function __construct( Brizy_Editor_Project $project, Brizy_Admin_Cloud_Client $client ) {

		$this->setProject( $project );
		$this->setCloudClient( $client );

		$this->blockBridge  = new Brizy_Admin_Cloud_BlockBridge( $client );
		$this->layoutBridge = new Brizy_Admin_Cloud_LayoutBridge( $client );

		add_action( 'wp_loaded', array( $this, 'initializeActions' ) );
	}

	/**
	 * @param Brizy_Editor_Project $project
	 *
	 * @return Brizy_Admin_Cloud
	 */
	public function setProject( Brizy_Editor_Project $project ) {
		$this->project = $project;

		return $this;
	}

	/**
	 * @param Brizy_Admin_Cloud_Client $cloudClient
	 *
	 * @return Brizy_Admin_Cloud
	 */
	public function setCloudClient( Brizy_Admin_Cloud_Client $cloudClient ) {
		$this->cloudClient = $cloudClient;

		return $this;
	}

	/**
	 * @param Brizy_Admin_Cloud_BlockBridge $blockBridge
	 *
	 * @return Brizy_Admin_Cloud
	 */
	public function setBlockBridge( Brizy_Admin_Cloud_BlockBridge $blockBridge ){
		$this->blockBridge = $blockBridge;

		return $this;
	}

	/**
	 * @param Brizy_Admin_Cloud_LayoutBridge $layoutBridge
	 *
	 * @return Brizy_Admin_Cloud
	 */
	public function setLayoutBridge( Brizy_Admin_Cloud_LayoutBridge $layoutBridge ) {
		$this->layoutBridge = $layoutBridge;

		return $this;
	}

	public function initializeActions() {
		try {
			if ( wp_doing_ajax() && $this->project->getCloudToken() && $this->project->getCloudContainer() ) {
				$versions = $this->cloudClient->getCloudEditorVersions();
				if ( $versions['sync'] == BRIZY_SYNC_VERSION ) {
					self::registerCloudFilters();
				}
			}

			Brizy_Admin_Cloud_Api::_init( $this->project );
		} catch(\Exception $e) {
			Brizy_Logger::instance()->exception( $e );
		}
	}

	static public function registerCloudFilters() {
		add_filter( 'brizy_get_saved_block', [ self::$instance, 'onGetSavedBlock' ], 10, 3 );
		add_filter( 'brizy_get_saved_blocks', [ self::$instance, 'onGetSavedBlocks' ], 10, 3 );
		add_action( 'brizy_saved_block_delete', [ self::$instance, 'onDeleteSavedBlock' ] );

		add_filter( 'brizy_get_layout', [ self::$instance, 'onGetLayout' ], 10, 3 );
		add_filter( 'brizy_get_layouts', [ self::$instance, 'onGetLayouts' ], 10, 3 );
		add_action( 'brizy_layout_delete', [ self::$instance, 'onDeleteLayout' ] );
	}

	static public function unRegisterCloudFilters() {
		remove_filter( 'brizy_get_saved_block', [ self::$instance, 'onGetSavedBlock' ] );
		remove_filter( 'brizy_get_saved_blocks', [ self::$instance, 'onGetSavedBlocks' ] );
		remove_action( 'brizy_saved_block_delete', [ self::$instance, 'onDeleteSavedBlock' ] );

		remove_filter( 'brizy_get_layout', [ self::$instance, 'onGetLayout' ] );
		remove_filter( 'brizy_get_layouts', [ self::$instance, 'onGetLayouts' ] );
		remove_action( 'brizy_layout_delete', [ self::$instance, 'onDeleteLayout' ] );
	}

	/**
	 * @param Brizy_Editor_Entity[] $blocks
	 * @param string[] $fields
	 * @param Brizy_Admin_Blocks_Manager $manager
	 */
	public function onGetSavedBlocks( $blocks, $fields, $manager ) {

		if ( ! is_array( $blocks ) ) {
			$blocks = [];
		}

		try {
			$cloudBlocks = $this->cloudClient->getBlocks( array( 'fields' => $fields ) );

			// remove all local block that came from cloud and are deleted from cloud
			foreach ( $blocks as $i => $block ) {
				$existingBlock = false;
				foreach ( (array) $cloudBlocks as $cblock ) {
					if ( $cblock->uid == $block['uid'] ) {
						$existingBlock = true;
						break;
					}
				}

				if ( ! $existingBlock &&
				     ( $localBlock = $manager->getEntity( $block['uid'] ) ) &&
				     $localBlock->isSynchronized( $this->cloudClient->getBrizyProject()->getCloudAccountId() ) ) {
					// delete this block as this block does not exist anymore in cloud
					$manager->trashEntity( $localBlock );

					unset( $blocks[ $i ] );
				}
			}

			$blocks = array_values( $blocks );

			// remove cloud blocks that are already saved localy
			foreach ( (array) $cloudBlocks as $cblock ) {
				$existingBlock = false;
				foreach ( $blocks as $block ) {
					if ( $cblock->uid == $block['uid'] ) {
						$existingBlock = true;
						break;
					}
				}

				if ( ! $existingBlock ) {

					if ( in_array( 'synchronized', $fields ) ) {
						$localBlock = $manager->getEntity( $cblock->uid );
						if ( $localBlock ) {
							$cblock->synchronized = $localBlock->isSynchronized( $this->cloudClient->getBrizyProject()->getCloudAccountId() );
						} else {
							$cblock->synchronized = false;
						}
					}

					if ( in_array( 'isCloudEntity', $fields ) ) {
						$cblock->isCloudEntity = true;
					}

					if ( in_array( 'synchronizable', $fields ) ) {
						$cblock->synchronizable = true;
					}

					$blocks[] = (array) $cblock;
				}
			}

		} catch ( Exception $e ) {
			// do nothing...
		}

		return $blocks;
	}

	/**
	 * @param Brizy_Editor_Entity $block
	 * @param string $uid
	 * @param Brizy_Admin_Blocks_Manager $manager
	 *
	 * @throws Exception
	 */
	public function onGetSavedBlock( $block, $uid, $manager ) {
		try {
			if ( ! $block ) {
				$this->blockBridge->import( $uid );
				$block = $manager->getEntity( $uid );
			}
		} catch ( Exception $e ) {

		}

		return $block;
	}

	/**
	 * @param $blockUid
	 */
	public function onDeleteSavedBlock( $blockUid ) {
		try {
			$blocks = $this->cloudClient->getBlocks( [ 'uid' => $blockUid ] );

			if ( isset( $blocks[0] ) ) {
				$block = (array) $blocks[0];
				$this->cloudClient->deleteBlock( $block['id'] );
			}

		} catch ( Exception $e ) {

		}
	}

	/**
	 * @param Brizy_Editor_Entity[] $layouts
	 * @param string[] $fields
	 * @param Brizy_Admin_Layouts_Manager $manager
	 */
	public function onGetLayouts( $layouts, $fields, $manager ) {

		if ( ! is_array( $layouts ) ) {
			$layouts = [];
		}

		try {
			$cloudLayouts = $this->cloudClient->getLayouts( array( 'fields' => $fields ) );

			// remove all local block that came from cloud and are deleted from cloud
			foreach ( $layouts as $i => $block ) {
				$existingBlock = false;
				foreach ( (array) $cloudLayouts as $cblock ) {
					if ( $cblock->uid == $block['uid'] ) {
						$existingBlock = true;
						break;
					}
				}

				if ( ! $existingBlock &&
				     ( $localLayout = $manager->getEntity( $block['uid'] ) ) &&
				     $localLayout->isSynchronized( $this->cloudClient->getBrizyProject()->getCloudAccountId() ) ) {
					// delete this block as this block does not exist anymore in cloud
					$manager->deleteEntity( $localLayout );

					unset( $layouts[ $i ] );
				}
			}

			$layouts = array_values( $layouts );

			foreach ( (array) $cloudLayouts as $aLayout ) {
				$existingLayout = false;
				foreach ( $layouts as $block ) {
					if ( $aLayout->uid == $block['uid'] ) {
						$existingLayout = true;
						break;
					}
				}

				if ( ! $existingLayout ) {

					$localLayout = $manager->getEntity( $aLayout->uid );

					if ( in_array( 'synchronized', $fields ) ) {
						if ( $localLayout ) {
							$aLayout->synchronized = $localLayout->isSynchronized( $this->cloudClient->getBrizyProject()->getCloudAccountId() );
						} else {
							$aLayout->synchronized = false;
						}
					}

					if ( in_array( 'isCloudEntity', $fields ) ) {
						$aLayout->isCloudEntity = true;
					}

					if ( in_array( 'synchronizable', $fields ) ) {
						$aLayout->synchronizable = true;
					}

					$layouts[] = (array) $aLayout;
				}
			}

		} catch ( Exception $e ) {
			// do nothing...
		}

		return $layouts;
	}


	/**
	 * @param Brizy_Editor_Entity $block
	 * @param string $uid
	 * @param Brizy_Admin_Layouts_Manager $manager
	 *
	 * @throws Exception
	 */
	public function onGetLayout( $block, $uid, $manager ) {
		try {
			if ( ! $block ) {
				$this->layoutBridge->import( $uid );
				$block = $manager->getEntity( $uid );
			}
		} catch ( Exception $e ) {

		}

		return $block;
	}

	/**
	 * @param $blockUid
	 */
	public function onDeleteLayout( $blockUid ) {
		try {
			$blocks = $this->cloudClient->getLayouts( [ 'uid' => $blockUid ] );

			if ( isset( $blocks[0] ) ) {
				$block = (array) $blocks[0];
				$this->cloudClient->deleteLayout( $block['id'] );
			}

		} catch ( Exception $e ) {

		}
	}


}
