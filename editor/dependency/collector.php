<?php

class Brizy_Editor_Dependency_Collector {

	/**
	 * @var array
	 */
	static $cache = array();

	public function collect( $entity ) {
		if ( isset(self::$cache[ $entity->getUid() ]) ) {
			return self::$cache[ $entity->getUid() ];
		}
		$dependencies = [];
		if ( method_exists($entity,'getDependencies') && is_array( $entity->getDependencies() ) ) {
			$manager = new Brizy_Admin_Symbols_Manager();
			foreach ( $entity->getDependencies() as $dependency ) {
				if ( $dependency->getType() === Brizy_Editor_Dependency::TYPE_SYMBOL ) {
					$symbolPost = $manager->getByUID( $dependency->getUID() );
					if ( $symbolPost  instanceof Brizy_Admin_Symbols_Symbol) {
						$dependencies[$symbolPost->getUid()] = $symbolPost;
					}
				}
				if ( $dependency->getType() === Brizy_Editor_Dependency::TYPE_GLOBAL_BLOCK ) {
					$manager = new Brizy_Admin_Blocks_Manager( Brizy_Admin_Blocks_Main::CP_GLOBAL );
					$block   = $manager->getBlockByUid( $dependency->getUID() );
					if ( $block instanceof Brizy_Editor_Block) {
						$dependencies[$block->getUid()] = $block;

						$dependencies = array_merge( $dependencies, $this->collect( $block ) );
					}
				}
			}
		}

		return self::$cache[ $entity->getUid() ] = $dependencies;
	}
}