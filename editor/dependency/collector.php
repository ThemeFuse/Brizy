<?php

class Brizy_Editor_Dependency_Collector {

	/**
	 * @var array
	 */
	static $cache = array();

	static public  function _init() {
	}


	public function collect( $entity ) {
		if ( isset(self::$cache[ $entity->getUid() ]) ) {
			return self::$cache[ $entity->getUid() ];
		}
		$dependencies = [];
		if ( method_exists($entity,'getDependencies') && is_array( $entity->getDependencies() ) ) {
			$manager = new Brizy_Admin_Symbols_Manager();

			// Collect all symbol UIDs first for batch query
			$symbolUids = [];
			$globalBlockUids = [];
			foreach ( $entity->getDependencies() as $dependency ) {
				if ( $dependency->getType() === Brizy_Editor_Dependency::TYPE_SYMBOL ) {
					$symbolUids[] = $dependency->getUID();
				}
				if ( $dependency->getType() === Brizy_Editor_Dependency::TYPE_GLOBAL_BLOCK ) {
					$globalBlockUids[] = $dependency->getUID();
				}
			}

			// Batch-fetch all symbols in one query
			if ( ! empty( $symbolUids ) ) {
				$symbols = $manager->getByUIDs( $symbolUids );
				foreach ( $symbols as $symbolPost ) {
					if ( $symbolPost instanceof Brizy_Admin_Symbols_Symbol ) {
						$dependencies[ $symbolPost->getUid() ] = $symbolPost;
					}
				}
			}

			// Process global blocks (each may have nested dependencies)
			if ( ! empty( $globalBlockUids ) ) {
				$blockManager = new Brizy_Admin_Blocks_Manager( Brizy_Admin_Blocks_Main::CP_GLOBAL );
				foreach ( $globalBlockUids as $uid ) {
					$block = $blockManager->getEntity( $uid );
					if ( $block instanceof Brizy_Editor_Block ) {
						$dependencies[ $block->getUid() ] = $block;
						$dependencies = array_merge( $dependencies, $this->collect( $block ) );
					}
				}
			}
		}

		return self::$cache[ $entity->getUid() ] = $dependencies;
	}
}
